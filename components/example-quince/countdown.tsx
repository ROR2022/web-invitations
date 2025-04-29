"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "framer-motion"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Set your event date here
  const eventDate = new Date("July 20, 2024 14:30:00").getTime()

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = eventDate - now

      if (distance < 0) {
        clearInterval(interval)
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [eventDate])

  return (
    <section className="py-16 px-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-80"
        style={{
          backgroundImage: "url('/images/countdown-bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div
        ref={ref}
        className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-white text-3xl md:text-4xl mb-12">Faltan:</h2>

        <div className="flex justify-center gap-4 md:gap-8">
          <div className="bg-white/20 backdrop-blur-sm p-3 md:p-6 rounded-lg w-16 md:w-24 text-center">
            <div className="text-white text-2xl md:text-4xl font-bold">{String(timeLeft.days).padStart(2, "0")}</div>
            <div className="text-white text-xs md:text-sm mt-1">Días</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-3 md:p-6 rounded-lg w-16 md:w-24 text-center">
            <div className="text-white text-2xl md:text-4xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
            <div className="text-white text-xs md:text-sm mt-1">Hrs.</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-3 md:p-6 rounded-lg w-16 md:w-24 text-center">
            <div className="text-white text-2xl md:text-4xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
            <div className="text-white text-xs md:text-sm mt-1">Min.</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-3 md:p-6 rounded-lg w-16 md:w-24 text-center">
            <div className="text-white text-2xl md:text-4xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
            <div className="text-white text-xs md:text-sm mt-1">Seg.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
