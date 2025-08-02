import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Link, 
  Video, 
  Music, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Youtube,
  Facebook,
  Clock,
  User
} from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// Types
interface VideoInfo {
  title: string
  thumbnail: string
  duration?: number
  uploader: string
  platform: string
  formats: VideoFormat[]
}

interface VideoFormat {
  quality: string
  format_id: string
  ext: string
  filesize?: number
  fps?: number
}

interface DownloadRequest {
  url: string
  quality: string
  format_type: 'video' | 'audio'
}

// API functions
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

// Debug: Log the API URL in development
if (import.meta.env.DEV) {
  console.log('🔧 API_BASE_URL:', API_BASE_URL)
  console.log('🔧 Full API endpoints:')
  console.log('  - Info:', `${API_BASE_URL}/api/video/info`)
  console.log('  - Download:', `${API_BASE_URL}/api/video/download`)
}

const getVideoInfo = async (url: string): Promise<VideoInfo> => {
  const apiUrl = `${API_BASE_URL}/api/video/info`
  
  // Debug logging
  console.log('🚀 Making API request to:', apiUrl)
  
  if (!API_BASE_URL) {
    throw new Error('Backend URL not configured. Please check VITE_API_URL environment variable.')
  }
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })
  
  console.log('📡 API Response status:', response.status)
  console.log('📡 API Response URL:', response.url)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: `HTTP ${response.status} ${response.statusText}` }))
    throw new Error(error.detail || 'Failed to get video info')
  }
  
  return response.json()
}

const downloadVideo = async (request: DownloadRequest): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/api/video/download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Download failed')
  }
  
  return response.blob()
}

const VideoDownloader: React.FC = () => {
  const [url, setUrl] = useState('')
  const [selectedQuality, setSelectedQuality] = useState('720p')
  const [selectedFormat, setSelectedFormat] = useState<'video' | 'audio'>('video')
  const [showInfo, setShowInfo] = useState(false)
  const [showQualityDropdown, setShowQualityDropdown] = useState(false)

  // Clear states when URL changes
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    setShowInfo(false)
    setVideoInfo(null)
    setInfoError(null)
    setIsLoadingInfo(false)
  }

  // Manual loading state and data
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [isLoadingInfo, setIsLoadingInfo] = useState(false)
  const [infoError, setInfoError] = useState<Error | null>(null)

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: downloadVideo,
    onSuccess: (blob, variables) => {
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename
      const title = videoInfo?.title || 'video'
      const cleanTitle = title.replace(/[^\w\s-]/g, '').trim().replace(/[-\s]+/g, '-')
      const extension = variables.format_type === 'audio' ? 'mp3' : 'mp4'
      const qualityPrefix = variables.format_type === 'video' ? `_${variables.quality}` : ''
      link.download = `${cleanTitle}${qualityPrefix}.${extension}`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      toast.success(`${variables.format_type === 'video' ? variables.quality : 'Audio'} download started successfully!`, {
        duration: 5000,
      })
    },
    onError: (error: Error) => {
      console.error('Download error:', error)
      const errorMessage = error.message.includes('403') 
        ? 'Video download blocked by platform. Try a different quality or video.'
        : error.message.includes('404')
        ? 'Video not found. Please check the URL and try again.'
        : error.message.includes('quality')
        ? 'Requested quality not available. Try a different quality.'
        : error.message || 'Download failed. Please try again.'
      
      toast.error(errorMessage, {
        duration: 6000,
      })
    },
  })

  const handleGetInfo = async () => {
    if (!url.trim()) {
      toast.error('Please enter a video URL')
      return
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL')
      return
    }

    // Reset previous states
    setShowInfo(false)
    setVideoInfo(null)
    setInfoError(null)
    setIsLoadingInfo(true)

    try {
      const result = await getVideoInfo(url)
      setVideoInfo(result)
      setShowInfo(true)
      setInfoError(null)
      toast.success('Video info loaded successfully!')
    } catch (error) {
      setVideoInfo(null)
      setShowInfo(false)
      setInfoError(error as Error)
      toast.error('Failed to load video info')
    } finally {
      setIsLoadingInfo(false)
    }
  }

  const handleDownload = () => {
    if (!videoInfo) {
      toast.error('Please get video info first')
      return
    }

    downloadMutation.mutate({
      url,
      quality: selectedQuality,
      format_type: selectedFormat,
    })
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return url.includes('youtube.com') || 
             url.includes('youtu.be') || 
             url.includes('tiktok.com') || 
             url.includes('facebook.com') ||
             url.includes('fb.watch')
    } catch {
      return false
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-500" />
      default:
        return <Video className="h-5 w-5 text-purple-500" />
    }
  }

  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Download Your Favorite Videos
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Paste any video URL below and get high-quality downloads in seconds
          </p>
        </motion.div>

        {/* Main Download Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/20 via-purple-500/10 to-blue-500/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-8 mb-8 shadow-2xl shadow-purple-500/20"
        >
          {/* URL Input */}
          <div className="mb-6">
            <label htmlFor="url" className="block text-white font-medium mb-3">
              Video URL
            </label>
            <div className="relative">
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Paste YouTube, TikTok, or Facebook video URL here..."
                className="w-full bg-gradient-to-r from-slate-800/80 via-purple-900/60 to-slate-800/80 backdrop-blur-2xl border-2 border-purple-400/50 text-white font-medium placeholder-white/80 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-4 focus:ring-purple-400/70 focus:border-purple-300/80 focus:bg-gradient-to-r focus:from-slate-700/90 focus:via-purple-800/70 focus:to-slate-700/90 hover:border-purple-300/60 transition-all duration-300 shadow-xl shadow-purple-500/25"
              />
              <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 h-5 w-5" />
            </div>
          </div>

          {/* Enhanced Format Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-white font-semibold mb-4 text-lg">Choose Format Type</label>
              <div className="grid grid-cols-2 gap-4 p-3 bg-gradient-to-br from-white/20 via-purple-500/10 to-blue-500/10 rounded-3xl backdrop-blur-2xl border-2 border-white/30 shadow-xl">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedFormat('video')}
                  className={`relative overflow-hidden flex items-center justify-center space-x-3 py-5 px-6 rounded-3xl transition-all duration-500 group ${
                    selectedFormat === 'video'
                      ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 text-white shadow-2xl shadow-blue-500/60 border-2 border-blue-400/50'
                      : 'bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/30 text-white/70 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 hover:text-white backdrop-blur-xl'
                  }`}
                >
                  {selectedFormat === 'video' && (
                    <motion.div
                      layoutId="formatSelector"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 rounded-3xl"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <div className="relative flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: selectedFormat === 'video' ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-2xl ${selectedFormat === 'video' ? 'bg-white/30 backdrop-blur-xl' : 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl'}`}
                    >
                      <Video className="h-5 w-5" />
                    </motion.div>
                    <span className="font-semibold text-lg">Video</span>
                  </div>
                  {selectedFormat === 'video' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full"
                    />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedFormat('audio')}
                  className={`relative overflow-hidden flex items-center justify-center space-x-3 py-5 px-6 rounded-3xl transition-all duration-500 group ${
                    selectedFormat === 'audio'
                      ? 'bg-gradient-to-br from-purple-500 via-pink-600 to-purple-700 text-white shadow-2xl shadow-purple-500/60 border-2 border-purple-400/50'
                      : 'bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/30 text-white/70 hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 hover:text-white backdrop-blur-xl'
                  }`}
                >
                  {selectedFormat === 'audio' && (
                    <motion.div
                      layoutId="formatSelector"
                      className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-600 to-purple-700 rounded-3xl"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <div className="relative flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: selectedFormat === 'audio' ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-2xl ${selectedFormat === 'audio' ? 'bg-white/30 backdrop-blur-xl' : 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl'}`}
                    >
                      <Music className="h-5 w-5" />
                    </motion.div>
                    <span className="font-semibold text-lg">Audio</span>
                  </div>
                  {selectedFormat === 'audio' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full"
                    />
                  )}
                </motion.button>
              </div>
            </div>

            {selectedFormat === 'video' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <label className="block text-white font-semibold mb-4 text-lg">Video Quality</label>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQualityDropdown(!showQualityDropdown)}
                    className="w-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-2xl border-2 border-white/40 rounded-3xl p-5 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-white font-bold text-xl">{selectedQuality}</div>
                          <div className="text-white/70 text-sm">High Definition</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-2xl shadow-lg">
                          Selected
                      </div>
                      <motion.div
                          animate={{ rotate: showQualityDropdown ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-white/70"
                        >
                          ▼
                      </motion.div>
                    </div>
                    </div>
                  </motion.button>

                  {/* Quality Dropdown */}
                  <AnimatePresence>
                    {showQualityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-white/20 via-purple-500/10 to-blue-500/10 backdrop-blur-2xl border-2 border-white/30 rounded-3xl shadow-2xl z-50 overflow-hidden"
                      >
                        {['144p', '360p', '480p', '720p', '1080p', '1440p', '2160p'].map((quality) => (
                          <motion.button
                            key={quality}
                            whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedQuality(quality);
                              setShowQualityDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all duration-200 ${
                              selectedQuality === quality 
                                ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border-l-4 border-purple-400' 
                                : 'text-white/80 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                selectedQuality === quality ? 'bg-purple-400' : 'bg-white/30'
                              }`} />
                              <span className="font-semibold">{quality}</span>
                              <span className="text-xs text-white/60">
                                {quality === '144p' ? 'Mobile' : 
                                 quality === '360p' ? 'Standard' :
                                 quality === '480p' ? 'Medium' :
                                 quality === '720p' ? 'HD' :
                                 quality === '1080p' ? 'Full HD' :
                                 quality === '1440p' ? '2K' : '4K Ultra'}
                              </span>
                            </div>
                            {selectedQuality === quality && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                              />
                            )}
                          </motion.button>
                        ))}
                  </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Button - Centered Get Info */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetInfo}
              disabled={isLoadingInfo || !url.trim()}
              className="flex items-center justify-center space-x-3 bg-gradient-to-br from-white/20 via-cyan-500/10 to-white/20 backdrop-blur-2xl border-2 border-white/40 text-white py-4 px-8 rounded-3xl hover:bg-gradient-to-br hover:from-white/30 hover:via-cyan-500/20 hover:to-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-cyan-500/30"
            >
              {isLoadingInfo ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span>{isLoadingInfo ? 'Getting Info...' : 'Get Info'}</span>
            </motion.button>
          </div>

          {/* Error Display */}
          {infoError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center space-x-3 text-red-300 bg-gradient-to-br from-red-500/20 via-red-600/10 to-red-500/20 backdrop-blur-2xl border-2 border-red-400/30 rounded-3xl p-4 shadow-xl"
            >
              <AlertCircle className="h-5 w-5" />
              <span>{infoError?.message || 'An error occurred'}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Video Info Display */}
        <AnimatePresence>
          {showInfo && videoInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -30, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white/20 via-blue-500/10 to-purple-500/10 backdrop-blur-2xl border-2 border-white/30 rounded-3xl p-8 mb-8 overflow-hidden shadow-2xl"
            >
              <div className="flex items-start space-x-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                </div>

                {/* Video Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {getPlatformIcon(videoInfo.platform)}
                    <span className="text-white/60 text-sm font-medium">{videoInfo.platform}</span>
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {videoInfo.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{videoInfo.uploader}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(videoInfo.duration)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>{videoInfo.formats.length} formats available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Formats */}
              {selectedFormat === 'video' && videoInfo.formats.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-white font-medium mb-3">Available Qualities:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {videoInfo.formats.slice(0, 8).map((format) => (
                      <motion.div
                        key={format.format_id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedQuality(format.quality)}
                        className={`cursor-pointer transition-all duration-300 border rounded-lg p-3 text-center ${
                          selectedQuality === format.quality
                            ? 'bg-blue-500/20 border-blue-400 ring-1 ring-blue-400'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className={`font-medium ${
                          selectedQuality === format.quality ? 'text-blue-200' : 'text-white'
                        }`}>
                          {format.quality}
                        </div>
                        <div className="text-white/60 text-xs">{format.ext.toUpperCase()}</div>
                        {format.filesize && (
                          <div className="text-white/40 text-xs">{formatFileSize(format.filesize)}</div>
                        )}
                        {selectedQuality === format.quality && (
                          <div className="text-blue-400 text-xs mt-1">Selected</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-white/60 text-sm">
                      💡 Click on any quality above to select it for download
                    </span>
                  </div>
                </div>
              )}

              {/* Download Button - Show after video info is loaded */}
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={!videoInfo || downloadMutation.isPending}
                  className="flex items-center justify-center space-x-3 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white py-4 px-8 rounded-3xl hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/50 border-2 border-white/20"
                >
                  {downloadMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  <span>
                    {downloadMutation.isPending 
                      ? `Downloading ${selectedFormat === 'video' ? selectedQuality : 'Audio'}...` 
                      : `Download ${selectedFormat === 'video' ? selectedQuality : 'Audio'}`
                    }
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default VideoDownloader