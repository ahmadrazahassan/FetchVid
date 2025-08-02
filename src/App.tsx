import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import VideoDownloader from './components/VideoDownloader'
import Footer from './components/Footer'
import { motion } from 'framer-motion'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Header />
        
        <main>
          <Hero />
          
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-20"
          >
            <VideoDownloader />
          </motion.section>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}

export default App