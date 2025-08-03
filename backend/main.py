from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, HttpUrl
import yt_dlp
import os
import tempfile
import asyncio
import time
import glob
from typing import List, Optional, Dict, Any
import re
import json
from urllib.parse import urlparse

app = FastAPI(
    title="FrameFetch API",
    description="Professional video downloading API supporting YouTube, TikTok, and Facebook",
    version="1.0.0"
)

# Configure CORS
import os
from dotenv import load_dotenv

load_dotenv()

# Get environment variable for allowed origins
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Development origins
dev_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Production origins - Add your specific Vercel domain
prod_origins = [
    "https://fetch-vid.vercel.app",  # Your actual Vercel domain
    "https://fetchvid.vercel.app",   # Alternative domain format
]

# Include environment variable domain if set
if FRONTEND_URL and FRONTEND_URL not in dev_origins + prod_origins:
    prod_origins.append(FRONTEND_URL)

# Combine all origins
allowed_origins = dev_origins + prod_origins

print(f"🔧 CORS allowed origins: {allowed_origins}")
print(f"🔧 Environment: {os.getenv('ENVIRONMENT', 'development')}")
print(f"🔧 Frontend URL from env: {FRONTEND_URL}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class VideoURLRequest(BaseModel):
    url: HttpUrl

class VideoInfo(BaseModel):
    title: str
    thumbnail: str
    duration: Optional[int]
    uploader: str
    platform: str
    formats: List[Dict[str, Any]]

class DownloadRequest(BaseModel):
    url: HttpUrl
    quality: str = "720p"
    format_type: str = "video"  # "video" or "audio"

# Supported platforms
SUPPORTED_PLATFORMS = {
    'youtube.com': 'YouTube',
    'youtu.be': 'YouTube',
    'tiktok.com': 'TikTok',
    'facebook.com': 'Facebook',
    'fb.watch': 'Facebook',
    'instagram.com': 'Instagram'
}

def get_platform(url: str) -> str:
    """Detect platform from URL"""
    domain = urlparse(str(url)).netloc.lower()
    domain = domain.replace('www.', '').replace('m.', '')
    
    for platform_domain, platform_name in SUPPORTED_PLATFORMS.items():
        if platform_domain in domain:
            return platform_name
    
    return "Unknown"

def get_ydl_opts(quality: str = "720p", format_type: str = "video") -> dict:
    """Get yt-dlp options based on quality and format type"""
    
    if format_type == "audio":
        return {
            'format': 'bestaudio/best',
            'outtmpl': tempfile.gettempdir() + '/framefetch_%(title)s.%(ext)s',
            'extractaudio': True,
            'audioformat': 'mp3',
            'audioquality': '192',
            'quiet': False,  # Enable logging to debug
            'no_warnings': False,
        }
    
    # Direct and reliable video format selection
    quality_map = {
        "144p": "worst[height<=144][ext=mp4]/worst[height<=240][ext=mp4]/worst",
        "360p": "best[height=360][ext=mp4]/best[height<=360][ext=mp4]/best[height=360]",
        "480p": "best[height=480][ext=mp4]/best[height<=480][ext=mp4]/best[height=480]", 
        "720p": "best[height=720][ext=mp4]/best[height<=720][ext=mp4]/best[height=720]",
        "1080p": "best[height=1080][ext=mp4]/best[height<=1080][ext=mp4]/best[height=1080]",
        "1440p": "best[height=1440][ext=mp4]/best[height<=1440][ext=mp4]/best[height=1440]",
        "2160p": "best[height=2160][ext=mp4]/best[height<=2160][ext=mp4]/best[height=2160]",
        "best": "best[ext=mp4]/best"
    }
    
    format_selector = quality_map.get(quality, "best[height=720][ext=mp4]/best[height<=720]")
    
    print(f"🎯 Quality requested: {quality}")
    print(f"🔧 Format selector: {format_selector}")
    
    return {
        'format': format_selector,
        'outtmpl': tempfile.gettempdir() + '/framefetch_%(title)s_%(height)sp.%(ext)s',  # Include height in filename
        'writesubtitles': False,
        'writeautomaticsub': False,
        'quiet': False,  # Enable logging to debug
        'no_warnings': False,
        'extract_flat': False,
    }

@app.get("/")
async def root():
    return {"message": "FrameFetch API is running!", "version": "1.0.0"}

@app.get("/api/platforms")
async def get_supported_platforms():
    """Get list of supported platforms"""
    return {"platforms": list(SUPPORTED_PLATFORMS.values())}

@app.post("/api/video/info")
async def get_video_info(request: VideoURLRequest):
    """Get video information without downloading"""
    try:
        url = str(request.url)
        platform = get_platform(url)
        
        if platform == "Unknown":
            raise HTTPException(status_code=400, detail="Unsupported platform")
        
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extractflat': False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract available formats
            formats = []
            if 'formats' in info:
                seen_qualities = set()
                for fmt in info['formats']:
                    if fmt.get('height') and fmt.get('vcodec') != 'none':  # Only video formats
                        quality = f"{fmt['height']}p"
                        if quality not in seen_qualities and fmt.get('ext') in ['mp4', 'webm', 'mkv']:
                            format_id = fmt['format_id']
                            
                            # Ensure unique format IDs
                            if format_id == "auto":
                                format_id = f"video-{quality.replace('p', '')}"  # Make it unique
                            
                            formats.append({
                                "quality": quality,
                                "format_id": format_id,
                                "ext": fmt.get('ext', 'mp4'),
                                "filesize": fmt.get('filesize'),
                                "fps": fmt.get('fps'),
                                "vcodec": fmt.get('vcodec'),
                                "acodec": fmt.get('acodec')
                            })
                            seen_qualities.add(quality)
            
            # Add common quality options if not present
            common_qualities = ['144p', '360p', '480p', '720p', '1080p', '1440p', '2160p']
            for quality in common_qualities:
                if quality not in seen_qualities:
                    unique_id = f"auto-{quality.replace('p', '')}"  # e.g., auto-720
                    formats.append({
                        "quality": quality,
                        "format_id": unique_id,  # Guaranteed unique
                        "ext": "mp4",
                        "filesize": None,
                        "fps": None,
                        "vcodec": "auto",
                        "acodec": "auto"
                    })

            
            # Sort formats by quality (highest first)
            def get_quality_value(quality_str):
                try:
                    return int(quality_str.replace('p', ''))
                except:
                    return 0
            
            formats.sort(key=lambda x: get_quality_value(x['quality']), reverse=True)
            
            video_info = VideoInfo(
                title=info.get('title', 'Unknown Title'),
                thumbnail=info.get('thumbnail', ''),
                duration=info.get('duration'),
                uploader=info.get('uploader', 'Unknown'),
                platform=platform,
                formats=formats
            )
            
            return video_info
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract video info: {str(e)}")

def select_best_format(formats, target_quality: str, format_type: str = "video"):
    """Smart format selection based on target quality"""
    print(f"🔍 Selecting format for {target_quality} from {len(formats)} available formats")
    
    if format_type == "audio":
        return 'bestaudio[ext=m4a]/bestaudio'
    
    # Parse target quality
    target_height = int(target_quality.replace('p', ''))
    print(f"🎯 Target height: {target_height}p")
    
    # Filter video formats - only those that are likely to be downloadable
    video_formats = [f for f in formats if (
        f.get('height') and 
        f.get('vcodec') != 'none' and 
        f.get('protocol') in ['https', 'http', None] and  # Avoid fragments
        f.get('ext') in ['mp4', 'webm', 'mkv'] and
        not f.get('format_id', '').startswith('sb')  # Skip storyboard formats
    )]
    
    if not video_formats:
        print("❌ No suitable video formats found, using generic best")
        return f'best[height<={target_height}][ext=mp4]/best[height<={target_height}]/best'
    
    print(f"📹 Found {len(video_formats)} suitable video formats")
    
    # Show available qualities for debugging
    available_heights = sorted(list(set(f.get('height') for f in video_formats if f.get('height'))))
    print(f"📊 Available qualities: {[f'{h}p' for h in available_heights]}")
    
    # Try to find exact match first
    exact_matches = [f for f in video_formats if f.get('height') == target_height]
    if exact_matches:
        # Prefer MP4 with both video and audio, then just video
        complete_formats = [f for f in exact_matches if f.get('acodec') != 'none']
        if complete_formats:
            best_match = max(complete_formats, key=lambda x: (x.get('tbr', 0) or 0))
            format_id = best_match.get('format_id')
            print(f"✅ Exact match found (complete): {format_id} - {best_match.get('height')}p {best_match.get('ext')} (tbr: {best_match.get('tbr')})")
            return format_id
        else:
            # Video-only format, need to combine with audio
            best_video = max(exact_matches, key=lambda x: (x.get('tbr', 0) or 0))
            format_id = best_video.get('format_id')
            print(f"✅ Exact match found (video-only): {format_id} - {best_video.get('height')}p {best_video.get('ext')}")
            return f"{format_id}+bestaudio[ext=m4a]/bestaudio"
    
    # If no exact match, use format string approach for better compatibility
    print(f"🔄 No exact match for {target_height}p, using format string approach...")
    
    # Use format strings that yt-dlp handles well
    format_strings = {
        144: "worst[height<=144][ext=mp4]/worst[height<=240]/worst",
        240: "best[height<=240][ext=mp4]/best[height<=360]/best[height<=240]",
        360: "best[height=360][ext=mp4]/best[height<=360]/best[height<=480]/best[height<=720]",
        480: "best[height=480][ext=mp4]/best[height<=480]/best[height<=720]",
        720: "best[height=720][ext=mp4]/best[height<=720]/best[height<=1080]",
        1080: "best[height=1080][ext=mp4]/best[height<=1080]/best[height<=1440]",
        1440: "best[height=1440][ext=mp4]/best[height<=1440]/best",
        2160: "best[height=2160][ext=mp4]/best[height<=2160]/best"
    }
    
    # Find the best format string for our target
    if target_height in format_strings:
        format_string = format_strings[target_height]
    else:
        # Find closest available quality
        closest = min(available_heights, key=lambda x: abs(x - target_height))
        format_string = format_strings.get(closest, f"best[height<={target_height}]/best")
    
    print(f"📊 Using format string: {format_string}")
    return format_string

@app.post("/api/video/download")
async def download_video(request: DownloadRequest, background_tasks: BackgroundTasks):
    """Download video with specified quality"""
    downloaded_file_path = None
    try:
        url = str(request.url)
        platform = get_platform(url)
        
        if platform == "Unknown":
            raise HTTPException(status_code=400, detail="Unsupported platform")
        
        print(f"🚀 Starting download: {request.quality} {request.format_type} from {platform}")
        
        # First, get all available formats
        info_opts = {
            'quiet': False,
            'no_warnings': False,
        }
        
        with yt_dlp.YoutubeDL(info_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            title = info.get('title', 'video')
            formats = info.get('formats', [])
            
            print(f"📋 Video: {title}")
            print(f"📊 Total formats available: {len(formats)}")
            
            # Select the best format for our target quality
            selected_format_id = select_best_format(formats, request.quality, request.format_type)
            print(f"🎯 Selected format ID: {selected_format_id}")
        
        # Now download with the specific format
        download_opts = {
            'format': selected_format_id,
            'outtmpl': tempfile.gettempdir() + f'/framefetch_{title[:50]}_{request.quality}.%(ext)s',
            'quiet': False,
            'no_warnings': False,
            # Force MP4 output
            'merge_output_format': 'mp4',
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4',
            }]
        }
        
        # Add audio extraction for audio downloads
        if request.format_type == "audio":
            download_opts.update({
                'extractaudio': True,
                'audioformat': 'mp3',
                'audioquality': '192',
            })
            # Remove video post-processor for audio downloads
            download_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        
        # Custom hook to capture the downloaded filename
        def my_hook(d):
            nonlocal downloaded_file_path
            if d['status'] == 'finished':
                downloaded_file_path = d['filename']
                print(f"✅ Download completed: {downloaded_file_path}")
        
        download_opts['progress_hooks'] = [my_hook]
        
        with yt_dlp.YoutubeDL(download_opts) as ydl:
            # Download the video with our selected format
            ydl.download([url])
            
            # Check if we captured the filename from the hook
            if downloaded_file_path and os.path.exists(downloaded_file_path):
                file_path = downloaded_file_path
                print(f"📁 File found via hook: {file_path}")
            else:
                # Fallback: search for the file in temp directory
                temp_dir = tempfile.gettempdir()
                
                # Look for recently created framefetch files (prioritize MP4)
                mp4_pattern = f"framefetch_*{request.quality}.mp4"
                mp4_files = glob.glob(os.path.join(temp_dir, mp4_pattern))
                
                if mp4_files:
                    matching_files = mp4_files
                else:
                    # Fallback to any format
                    pattern = f"framefetch_*{request.quality}.*"
                    matching_files = glob.glob(os.path.join(temp_dir, pattern))
                
                if matching_files:
                    file_path = max(matching_files, key=os.path.getctime)
                    print(f"📁 File found via pattern search: {file_path}")
                else:
                    # Last resort: find any recent framefetch file
                    all_framefetch = glob.glob(os.path.join(temp_dir, "framefetch_*"))
                    recent_files = [f for f in all_framefetch if os.path.getctime(f) > (time.time() - 300)]
                    
                    if recent_files:
                        file_path = max(recent_files, key=os.path.getctime)
                        print(f"📁 File found via recent search: {file_path}")
                    else:
                        file_path = None
            
            if not file_path or not os.path.exists(file_path):
                raise HTTPException(status_code=500, detail="Downloaded file not found. Please try again.")
            
            # Get file info for verification
            filename = os.path.basename(file_path)
            file_size = os.path.getsize(file_path)
            print(f"📦 Final file: {filename} ({file_size} bytes)")
            
            # Remove the framefetch_ prefix for user download
            if filename.startswith('framefetch_'):
                display_filename = filename[11:]  # Remove 'framefetch_' prefix
            else:
                display_filename = filename
            
            # Schedule file cleanup after download
            background_tasks.add_task(cleanup_file, file_path)
            
            return FileResponse(
                file_path,
                media_type='application/octet-stream',
                filename=display_filename
            )
            
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"❌ Download error: {str(e)}")
        # Clean up any leftover files on error
        if downloaded_file_path and os.path.exists(downloaded_file_path):
            try:
                os.remove(downloaded_file_path)
            except:
                pass
        raise HTTPException(status_code=400, detail=f"Download failed: {str(e)}")

async def cleanup_file(file_path: str):
    """Clean up downloaded file after serving"""
    try:
        await asyncio.sleep(60)  # Wait 1 minute before cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception:
        pass  # Ignore cleanup errors

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "FrameFetch API is running"}

@app.post("/api/debug/formats")
async def debug_formats(request: VideoURLRequest):
    """Debug endpoint to see all available formats for a video"""
    try:
        url = str(request.url)
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'listformats': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = info.get('formats', [])
            debug_formats = []
            
            for fmt in formats:
                debug_formats.append({
                    "format_id": fmt.get('format_id'),
                    "ext": fmt.get('ext'),
                    "quality": fmt.get('quality'),
                    "height": fmt.get('height'),
                    "width": fmt.get('width'),
                    "fps": fmt.get('fps'),
                    "vcodec": fmt.get('vcodec'),
                    "acodec": fmt.get('acodec'),
                    "filesize": fmt.get('filesize'),
                    "tbr": fmt.get('tbr'),
                    "protocol": fmt.get('protocol')
                })
            
            return {
                "title": info.get('title'),
                "total_formats": len(debug_formats),
                "formats": debug_formats
            }
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Debug failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)