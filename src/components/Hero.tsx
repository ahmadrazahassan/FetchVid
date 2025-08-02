import React from 'react'
import { motion } from 'framer-motion'
import { Download, Play, Zap, Shield, Globe, Star, ArrowRight } from 'lucide-react'

const Hero: React.FC = () => {
  const scrollToDownload = () => {
    const downloadSection = document.getElementById('download')
    if (downloadSection) {
      downloadSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    { icon: Shield, text: "100% Secure", color: "from-green-400 to-emerald-500" },
    { icon: Zap, text: "Ultra Fast", color: "from-yellow-400 to-orange-500" },
    { icon: Globe, text: "Multi-Platform", color: "from-blue-400 to-cyan-500" },
    { icon: Star, text: "HD Quality", color: "from-purple-400 to-pink-500" }
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"
        />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 60, -90, 0],
            scale: [1, 0.7, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/15 via-pink-500/15 to-cyan-400/15 rounded-full blur-3xl"
        />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto text-center relative z-10">


        {/* Advanced Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9]">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
                className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              >
                Download
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="block bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient-x bg-[length:400%_400%]"
              >
                Everything
              </motion.span>
            </motion.h1>
          
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 1 }}
            className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mx-auto max-w-lg"
            />
          </motion.div>

        {/* Enhanced Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl lg:text-3xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
          The world's most <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">advanced video downloader</span>
            <br className="hidden md:block" />
          with lightning-fast downloads and premium quality
          </motion.p>

          {/* Advanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            <motion.button
              onClick={scrollToDownload}
            whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                <Download className="h-6 w-6" />
                </motion.div>
                <span>Start Downloading Now</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                <ArrowRight className="h-5 w-5" />
                </motion.div>
              </div>
            </motion.button>

            <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            className="group flex items-center space-x-3 bg-white/10 backdrop-blur-2xl border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-xl"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="bg-gradient-to-r from-blue-400 to-purple-400 p-2 rounded-full"
              >
                <Play className="h-4 w-4 text-white" />
              </motion.div>
              <span>Watch Demo</span>
            </motion.button>
        </motion.div>

                {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`bg-gradient-to-r ${feature.color} p-3 rounded-xl w-fit mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-5 w-5 text-white" />
              </motion.div>
              <div className="text-white font-semibold text-sm">{feature.text}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2"
          >
            <span className="text-white/50 text-xs font-medium">Scroll to explore</span>
            <motion.div 
              animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full p-1"
            >
              <div className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mx-auto" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero