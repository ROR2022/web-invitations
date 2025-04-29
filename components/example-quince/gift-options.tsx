"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Mail, Gift } from "lucide-react"

export default function GiftOptions() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-16 px-4 bg-white">
      <div
        ref={ref}
        className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="section-title">OPCIONES DE REGALO</h2>

        <div className="divider">
          <div className="divider-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        <p className="text-lg mt-8 mb-12 max-w-2xl mx-auto">
          Mi mejor regalo es compartir contigo este gran día, si deseas obsequiarme algo, puedo sugerir las siguientes
          opciones:
        </p>

        <div className="grid md:grid-cols-2 gap-12 mt-8">
          <div className="flex flex-col items-center">
            <Mail className="w-16 h-16 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-4">¡Lluvia de sobres!</h3>
            <p className="text-base">
              La lluvia de sobres es la tradición de regalar dinero en efectivo dentro de un sobre el día del evento.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Gift className="w-16 h-16 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-4">¡Regalo sorpresa!</h3>
            <p className="text-base">Estoy segura que me encantará.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
