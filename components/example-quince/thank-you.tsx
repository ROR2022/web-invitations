"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"

export default function ThankYou() {
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
        <p className="text-xl mb-6">¡Gracias por ser parte de uno de los mejores días de mi vida!</p>

        <p className="text-lg mb-4">Con cariño:</p>

        <h2 className="font-script text-primary text-5xl md:text-6xl mb-8">Joanny Valeria</h2>

        <div className="text-sm text-gray-500 mt-12">
          <p> 2025 JOANNY VALERIA BY ROR2022 XV ALL RIGHTS RESERVED</p>
          <p className="mt-4">¿TIENES UN EVENTO EN PUERTA?</p>
          <p>DISEÑA CON NOSOTROS TU INVITACIÓN WEB DIGITAL.</p>
          <p className="mt-2">
            DANDO CLICK{" "}
            <button className="text-primary bg-transparent border-none p-0 cursor-pointer font-inherit">
              AQUÍ
            </button>
          </p>
        </div>
      </div>
    </section>
  )
}
