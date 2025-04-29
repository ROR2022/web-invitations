"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EventDetails() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="py-16 px-4 bg-white">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="section-title">¡LO QUE TIENES QUE SABER!</h2>

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

        <div className="grid md:grid-cols-4 gap-8 mt-12">
          <div className="flex flex-col items-center">
            <Calendar className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">¿Cuándo?</h3>
            <p className="text-lg">Sábado</p>
            <p className="text-lg">20 de Julio 2024</p>
          </div>

          <div className="flex flex-col items-center">
            <Clock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Ceremonia</h3>
            <p className="text-lg">14:30 hrs.</p>
            <p className="text-lg mt-2">Parroquia del Sagrado Corazón de Jesús</p>
            <p className="text-sm mt-1">5 de Mayo, Centro, 64000 Monterrey, N.L.</p>
            <Button variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-white">
              IR A MAPS
            </Button>
          </div>

          <div className="flex flex-col items-center">
            <Clock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Fiesta</h3>
            <p className="text-lg">16:30 hrs.</p>
            <p className="text-lg mt-2">La Cantera Eventos</p>
            <p className="text-sm mt-1">Carr Nacional 2700, Valle de Cristal, 64986 Monterrey, N.L.</p>
            <Button variant="outline" className="mt-4 border-primary text-primary hover:bg-primary hover:text-white">
              IR A MAPS
            </Button>
          </div>

          <div className="flex flex-col items-center">
            <MapPin className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">Código de Vestimenta</h3>
            <p className="text-lg text-primary font-medium">Formal</p>
          </div>
        </div>
      </div>
    </section>
  )
}
