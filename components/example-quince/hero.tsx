"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Play, Pause } from "lucide-react"
import { useMusicContext } from "@/context/music-context"
import { motion } from "framer-motion"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { isPlaying, togglePlay } = useMusicContext()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/images/quince1.jpeg')",
          filter: "brightness(0.7)",
        }}
      />

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      {isLoaded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 text-center px-4"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white text-xl mb-2"
          >
            ¡Mis XV años!
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="font-script text-6xl md:text-8xl text-white mb-4"
          >
            Joanny Valeria
          </motion.h1>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center text-white z-10"
      >
        <p className="mb-2 text-center">Desliza para ver mi invitación</p>
        <ChevronDown className="animate-bounce w-6 h-6" />
      </motion.div>
    </section>
  )
}
