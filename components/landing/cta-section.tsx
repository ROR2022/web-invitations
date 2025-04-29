import React from 'react'
import { Button } from '../ui/button'
import { FaArrowRight } from "react-icons/fa";

const CTASection = () => {
  return (
    <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-medium text-pink-600 mb-4">
            Creación súper rápida, puedes iniciar ahora mismo, editarla en línea, tu decides cuando publicarla.
          </h2>
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
            <FaArrowRight className="mr-2 h-5 w-5" /> ¡Crear ahora!
          </Button>

          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              No esperes más, somos la opción más económica y profesional que encontrarás.
            </h3>
            <h3 className="text-2xl text-pink-600 font-bold">Las Invitaciones más TOP de México.</h3>
          </div>
        </div>
      </section>
  )
}

export default CTASection