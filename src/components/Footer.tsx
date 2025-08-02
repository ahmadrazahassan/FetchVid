import React from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Youtube,
  Facebook,
  Music,
  Video
} from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Product',
      icon: '🚀',
      links: [
        { name: 'Video Downloader', href: '#download', icon: '🎬' },
        { name: 'Audio Extractor', href: '#audio', icon: '🎵' },
        { name: 'Quality Selector', href: '#quality', icon: '⚡' },
        { name: 'Batch Download', href: '#batch', icon: '📦' },
      ]
    },
    {
      title: 'Support',
      icon: '💡', 
      links: [
        { name: 'Help Center', href: '#help', icon: '❓' },
        { name: 'Live Chat', href: '#chat', icon: '💬' },
        { name: 'Video Guides', href: '#guides', icon: '📹' },
        { name: 'API Docs', href: '#api', icon: '📚' },
      ]
    },

  ]



  const supportedPlatforms = [
    { name: 'YouTube', icon: <Youtube className="h-8 w-8" />, color: 'from-red-500 to-red-600', count: '2B+ videos' },
    { name: 'TikTok', icon: <Video className="h-8 w-8" />, color: 'from-purple-500 to-pink-500', count: '1B+ videos' },
    { name: 'Facebook', icon: <Facebook className="h-8 w-8" />, color: 'from-blue-500 to-blue-600', count: '500M+ videos' },
    { name: 'Instagram', icon: <Music className="h-8 w-8" />, color: 'from-pink-500 to-purple-500', count: '300M+ reels' },
  ]



  return (
    <footer className="relative bg-gradient-to-br from-black/40 via-purple-900/30 to-blue-900/20 backdrop-blur-3xl border-t-2 border-white/30">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-br from-blue-500/15 via-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-br from-purple-500/15 via-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-yellow-500/10 rounded-full blur-2xl" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-20">
        {/* Top Section - Brand & Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Advanced Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-6 rounded-3xl shadow-2xl backdrop-blur-xl border-2 border-white/20">
                  <Download className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse shadow-lg" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl md:text-6xl font-black">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">Frame</span>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Fetch</span>
                </h1>
                <p className="text-white/70 text-lg font-medium mt-2">Advanced Video Downloading Platform</p>
              </div>
            </div>
          </motion.div>

          {/* Advanced Platform Showcase */}
          <div className="mb-16">
            <motion.h3 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-2xl font-bold text-white mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Supporting Major Platforms Worldwide
            </motion.h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {supportedPlatforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-3xl p-6 text-center hover:border-white/40 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <div className={`bg-gradient-to-br ${platform.color} p-4 rounded-2xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {React.cloneElement(platform.icon, { className: "h-8 w-8 text-white" })}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-1">{platform.name}</h4>
                  <p className="text-white/60 text-sm">{platform.count}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Advanced Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/5 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 hover:border-white/30 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="text-3xl">{section.icon}</div>
                <h3 className="text-white font-bold text-xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + (linkIndex * 0.1) }}
                  >
                    <a
                      href={link.href}
                      className="group flex items-center space-x-3 text-white/70 hover:text-white transition-all duration-300 p-3 rounded-2xl hover:bg-white/10 backdrop-blur-xl"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                      <span className="font-medium">{link.name}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>


      </div>

      {/* Advanced Bottom Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative border-t-2 border-white/30 bg-gradient-to-r from-black/40 via-purple-900/30 to-blue-900/30 backdrop-blur-3xl"
      >
        <div className="container mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-white/80 font-medium">© {currentYear} FrameFetch. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white/60 text-sm">Status: Online</span>
              </div>
              <div className="text-white/60 text-sm">v2.0.1</div>
            </div>
          </div>
        </div>

        {/* Advanced Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 via-purple-500/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </motion.div>
    </footer>
  )
}

export default Footer