# 🎬 FrameFetch - Professional Video Downloader

A modern, professional video downloading website supporting YouTube, TikTok, and Facebook. Built with React, TypeScript, and Python FastAPI.

![FrameFetch Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=FrameFetch+Demo)

## ✨ Features

- 🎥 **Multi-Platform Support**: YouTube, TikTok, Facebook
- 🎯 **Quality Selection**: 144p to 4K downloads
- 🎵 **Audio Downloads**: Extract audio in MP3 format
- ⚡ **Lightning Fast**: Quick downloads with modern UI
- 🔒 **Secure & Safe**: No malware, no registration required
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Glassmorphism effects and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/framefetch.git
   cd framefetch
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Start the development servers**
   
   **Option 1: Using npm scripts (recommended)**
   ```bash
   # Terminal 1: Start frontend (port 3000)
   npm run dev
   
   # Terminal 2: Start backend (port 8000)
   npm run backend
   ```

   **Option 2: Manual start**
   ```bash
   # Terminal 1: Start frontend
   npm run dev
   
   # Terminal 2: Start backend
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

1. **Paste Video URL**: Copy any YouTube, TikTok, or Facebook video URL
2. **Select Format**: Choose between Video or Audio download
3. **Choose Quality**: Select from 144p to 4K (for video downloads)
4. **Get Info**: Click "Get Info" to fetch video details
5. **Download**: Click "Download" to start the download

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for API state management
- **Vite** for bundling
- **Lucide React** for icons

### Backend
- **FastAPI** (Python)
- **yt-dlp** for video downloading
- **Pydantic** for data validation
- **Uvicorn** ASGI server

## 📁 Project Structure

```
framefetch/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── VideoDownloader.tsx
│   │   └── Footer.tsx
│   ├── App.tsx            # Main App component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── backend/               # Backend source code
│   ├── main.py           # FastAPI application
│   └── requirements.txt   # Python dependencies
├── public/               # Static assets
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🔧 Configuration

### Frontend Configuration
The frontend uses Vite for configuration. Key settings in `vite.config.ts`:
- Proxy API requests to backend (port 8000)
- Development server on port 3000

### Backend Configuration
FastAPI configuration in `backend/main.py`:
- CORS enabled for frontend origins
- File cleanup after downloads
- Temporary file storage

## 🎨 Design Features

- **Glassmorphism UI**: Modern glass-like effects
- **Gradient Animations**: Dynamic color transitions
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Easy on the eyes
- **Smooth Animations**: Framer Motion powered
- **Modern Typography**: Inter font family

## 🔒 Security & Privacy

- No user data collection
- Temporary file storage only
- Automatic file cleanup
- CORS protection
- Input validation
- No registration required

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚨 Legal Disclaimer

FrameFetch is for educational and personal use only. Users are responsible for:
- Respecting video content copyrights
- Following platform terms of service
- Using downloaded content appropriately

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Video downloading library
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - Frontend library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Email: contact@framefetch.com
- Check our [FAQ](docs/FAQ.md)

---

Made with ❤️ for video lovers worldwide.