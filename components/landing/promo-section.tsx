"use client";
import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowRight } from "react-icons/fa";

const PromoSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Datos para diferentes tipos de invitaciones
  const invitations = [
    {
      id: 1,
      type: "XV AÑOS",
      price: "$299",
      textColor: "text-pink-600",
      image: "/images/fifteen/quince4.jpeg",
      label: "Elegancia y estilo para tu gran día"
    },
    {
      id: 2,
      type: "BODA",
      price: "$299",
      textColor: "text-amber-700",
      image: "/images/wedding/boda10.jpeg",
      label: "Para celebrar tu unión con elegancia"
    },
    {
      id: 3,
      type: "BAUTIZO",
      price: "$299",
      textColor: "text-sky-600",
      image: "/images/baptism/bautizo3.jpeg",
      label: "Un recuerdo inolvidable para tu celebración"
    },
    {
      id: 4,
      type: "CORPORATIVO",
      price: "$299",
      textColor: "text-gray-700",
      image: "/images/corporate/evento1.jpeg",
      label: "Profesionalismo y distinción para tus eventos"
    }
  ]

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    
    emblaApi.on('select', onSelect)
    onSelect()
    
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Pausa la reproducción automática cuando el usuario interactúa con el carrusel
  const handleUserInteraction = useCallback(() => {
    setIsAutoPlaying(false)
    // Reanuda la reproducción automática después de 15 segundos
    const timeout = setTimeout(() => setIsAutoPlaying(true), 20000)
    return () => clearTimeout(timeout)
  }, [])

  // Autoreproducción
  useEffect(() => {
    if (!emblaApi || !isAutoPlaying) return
    
    const intervalId = setInterval(() => {
      emblaApi.scrollNext()
    }, 10000)
    
    return () => clearInterval(intervalId)
  }, [emblaApi, isAutoPlaying])

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-500 mb-3 md:mb-4">TU INVITACIÓN INTERACTIVA</h2>
            <p className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-foreground">
              CREALA HOY MISMO <span className="text-pink-600">¡Y PAGA AL PUBLICAR!</span>
            </p>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <FaArrowRight className="mr-2 h-5 w-5" /> ¡Crear ahora!
            </Button>
            
            {/* Indicadores del carrusel */}
            <div className="flex items-center justify-center md:justify-start mt-6 md:mt-8 gap-2">
              {invitations.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-cyan-500 scale-100" 
                      : "bg-gray-300 scale-75"
                  }`}
                  onClick={() => {
                    emblaApi?.scrollTo(index);
                    handleUserInteraction();
                  }}
                  aria-label={`Ver invitación de ${invitations[index].type}`}
                />
              ))}
            </div>
          </div>
          
          {/* Carrusel de invitaciones */}
          <div className="w-full md:w-1/2 relative mt-8 md:mt-0">
            {/* Botones de navegación */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-2">
              <button
                className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-gray-600 shadow hover:bg-gray-100 transition-all pointer-events-auto"
                onClick={() => {
                  scrollPrev();
                  handleUserInteraction();
                }}
                aria-label="Invitación anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-gray-600 shadow hover:bg-gray-100 transition-all pointer-events-auto"
                onClick={() => {
                  scrollNext();
                  handleUserInteraction();
                }}
                aria-label="Invitación siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Contenedor del carrusel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {invitations.map((invitation) => (
                  <div 
                    key={invitation.id} 
                    className="flex-[0_0_100%] px-2 sm:px-4"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="bg-card text-card-foreground p-4 sm:p-6 rounded-lg shadow-lg text-center"
                      >
                        <h3 className="text-3xl font-bold text-foreground mb-2">INVITACIONES</h3>
                        <h4 className={`text-2xl font-bold ${invitation.textColor} mb-4`}>
                          {invitation.type}
                        </h4>
                        
                        {/* Imagen real de invitación */}
                        <div className="relative w-full h-56 sm:h-64 md:h-72 mb-4 overflow-hidden rounded-lg shadow-md">
                          <Image
                            src={invitation.image}
                            alt={`Invitación para ${invitation.type}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform hover:scale-105 duration-700"
                            priority
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                              <p className="text-xs sm:text-sm font-medium">{invitation.label}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Mockup de celular con la invitación */}
                        <div className="relative mx-auto w-24 sm:w-28 md:w-32 h-48 sm:h-56 md:h-64 bg-black rounded-3xl p-1 sm:p-2 shadow-xl mb-4 overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-4 sm:h-6 flex justify-center items-center">
                            <div className="w-12 sm:w-20 h-2 sm:h-3 bg-black rounded-b-xl"></div>
                          </div>
                          <div className="w-full h-full overflow-hidden rounded-2xl relative">
                            <Image
                              src={invitation.image}
                              alt={`Vista móvil de invitación para ${invitation.type}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 128px"
                              className="object-cover"
                              priority
                            />
                          </div>
                        </div>
                        
                        <div className={`text-3xl md:text-4xl font-bold ${invitation.textColor} mb-1`}>
                          {invitation.price}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">PESOS</div>
                        <p className="text-sm sm:text-base font-bold">PAGAS AL PUBLICAR</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoSection