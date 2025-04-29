"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"

export default function Invitation() {
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
        <h2 className="text-2xl md:text-3xl mb-8 leading-relaxed">
          Acompáñanos a celebrar
          <br />
          <span className="text-3xl md:text-4xl font-medium">Mis XV años</span>
          <br />
          con la bendición de Dios
          <br />y mis padres:
        </h2>

        <div className="my-8">
          <p className="text-primary text-2xl font-medium">JOEL ALFONSO</p>
          <p className="text-primary text-2xl font-medium">CANTÚ SARABIA</p>
          <p className="my-2">&</p>
          <p className="text-primary text-2xl font-medium">MARIANA</p>
          <p className="text-primary text-2xl font-medium">TORRES MARTÍNEZ</p>
        </div>

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
      </div>
    </section>
  )
}
