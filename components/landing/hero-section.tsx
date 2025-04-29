"use client";
import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaArrowRight } from "react-icons/fa";

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false)

  const slides = [
    {
      id: 1,
      src: "/images/wedding/boda5.jpeg",
      alt: "Imagen de boda",
      title: "BODAS",
      subtitle: "Crea invitaciones únicas para tu día especial"
    },
    {
      id: 2,
      src: "/images/fifteen/quince1.jpeg",
      alt: "Imagen de XV años",
      title: "XV AÑOS",
      subtitle: "Celebra tus quince con estilo"
    },
    {
      id: 3,
      src: "/images/baptism/bautizo1.jpeg",
      alt: "Imagen de bautizo",
      title: "BAUTIZOS",
      subtitle: "Comparte la alegría de este momento especial"
    },
    {
      id: 4,
      src: "/images/corporate/evento2.jpeg",
      alt: "Imagen de evento corporativo",
      title: "EVENTOS",
      subtitle: "Profesionalismo en cada detalle"
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
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
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
    // Reanuda la reproducción automática después de 10 segundos de inactividad
    const timeout = setTimeout(() => setIsAutoPlaying(true), 20000)
    return () => clearTimeout(timeout)
  }, [])

  // Autoreproducción
  useEffect(() => {
    if (!emblaApi || !isAutoPlaying) return
    
    const intervalId = setInterval(() => {
      emblaApi.scrollNext()
    }, 12000)
    
    return () => clearInterval(intervalId)
  }, [emblaApi, isAutoPlaying])

  return (
    <section className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] overflow-hidden">
      
      {/* Contenedor del carrusel principal */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div className="flex-[0_0_100%] h-full relative" key={slide.id}>
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-[1]"></div>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className="object-cover z-0"
                priority={slide.id === 1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="container mx-auto h-full relative">
          {/* Botón Anterior */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all pointer-events-auto"
            onClick={() => {
              scrollPrev();
              handleUserInteraction();
            }}
            aria-label="Slide anterior"
            disabled={prevBtnDisabled}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Botón Siguiente */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all pointer-events-auto"
            onClick={() => {
              scrollNext();
              handleUserInteraction();
            }}
            aria-label="Slide siguiente"
            disabled={nextBtnDisabled}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Contenido y overlay */}
      <div className="absolute inset-0 z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <h1 className="font-serif italic text-5xl md:text-7xl mb-2">Invitaciones</h1>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wide mb-4">INTERACTIVAS</h2>
            <p className="text-lg md:text-xl uppercase tracking-widest mb-2">
              {slides[currentIndex].title}
            </p>
            <p className="text-base md:text-lg mb-8">
              {slides[currentIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          ¡Crear ahora! <FaArrowRight className="ml-2 h-4 w-4" />
        </Button>
        
        {/* Indicadores */}
        <div className="absolute bottom-8 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white scale-100" : "bg-white/50 scale-75"
              }`}
              onClick={() => {
                emblaApi?.scrollTo(index);
                handleUserInteraction();
              }}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection