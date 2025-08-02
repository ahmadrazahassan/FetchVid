import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Menu, X, Home, Info } from 'lucide-react'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home', icon: <Home className="h-4 w-4" /> },
    { name: 'Download', href: '#download', icon: <Download className="h-4 w-4" /> },
    { name: 'About', href: '#about', icon: <Info className="h-4 w-4" /> },
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gradient-to-r from-white/10 via-purple-500/5 to-white/10 backdrop-blur-3xl border-b-2 border-white/30 shadow-2xl shadow-purple-500/20' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-3 rounded-3xl shadow-2xl group-hover:shadow-purple-500/60 transition-all duration-300 border-2 border-white/20 backdrop-blur-xl">
                <Download className="h-6 w-6 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-lg"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Frame<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Fetch</span>
              </span>
              <span className="text-xs text-white/60 font-medium tracking-wide">Professional Downloader</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-6 py-3 rounded-3xl font-semibold text-white/80 hover:text-white transition-all duration-300 overflow-hidden backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-purple-500/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl backdrop-blur-xl border border-white/20" />
                <div className="relative flex items-center space-x-2">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>



          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-4 rounded-3xl bg-gradient-to-br from-white/15 via-purple-500/10 to-white/15 backdrop-blur-2xl border-2 border-white/30 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMenuOpen ? 1 : 0,
            height: isMenuOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-8 space-y-4 bg-gradient-to-br from-white/15 via-purple-500/10 to-white/15 backdrop-blur-3xl rounded-3xl mt-4 border-2 border-white/30 shadow-2xl">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -30 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-4 px-8 py-4 text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-white/15 hover:to-white/10 transition-all duration-300 font-medium rounded-2xl mx-4 backdrop-blur-xl"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </motion.a>
            ))}

          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}

export default Header