"use client";
import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaArrowRight } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-8 w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sección de Información de la Empresa */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">INVITACIONES WEB MX</h3>
            <p className="text-gray-300 mb-2">Crea invitaciones digitales interactivas para tus eventos especiales.</p>
            <p className="text-gray-300">Elegancia. Creatividad. Innovación.</p>
            <div className="mt-4">
              <Link 
                href="/" 
                className="inline-flex items-center text-sm text-gray-300 hover:text-white group"
              >
                <span>Comenzar ahora</span>
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
              </Link>
            </div>
          </div>
          
          {/* Sección de Paquetes */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Nuestros Paquetes</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className="text-gray-300 hover:text-white hover:underline cursor-pointer text-left w-auto"
                >
                  Paquete Básico
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className="text-gray-300 hover:text-white hover:underline cursor-pointer text-left w-auto"
                >
                  Paquete Premium
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className="text-gray-300 hover:text-white hover:underline cursor-pointer text-left w-auto"
                >
                  Paquete VIP
                </button>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white hover:underline">
                  Comparar paquetes
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Sección de Enlaces Útiles */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Enlaces Útiles</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white hover:underline">Inicio</Link></li>
              <li><Link href="/#templates" className="text-gray-300 hover:text-white hover:underline">Galería de Plantillas</Link></li>
              <li><Link href="/#features" className="text-gray-300 hover:text-white hover:underline">Características</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white hover:underline">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
          
          {/* Sección de Contacto */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
            <p className="flex items-center justify-center md:justify-start text-gray-300 mb-2">
              <FaEnvelope className="mr-2" aria-hidden="true" /> 
              <a href="mailto:contacto@invitacionesweb.mx" className="hover:underline">
                contacto@invitacionesweb.mx
              </a>
            </p>
            <p className="flex items-center justify-center md:justify-start text-gray-300 mb-4">
              <FaWhatsapp className="mr-2" aria-hidden="true" /> 
              <a href="https://wa.me/5212345678" target="_blank" rel="noopener noreferrer" className="hover:underline">
                +52 55 1234 5678
              </a>
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white" 
                aria-label="Síguenos en Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white"
                aria-label="Síguenos en Instagram"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Sección de Derechos y Políticas */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">INVITACIONES WEB MX {currentYear}. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white hover:underline">
              Aviso de Privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-gray-400 hover:text-white hover:underline">
              Términos y Condiciones
            </Link>
            <Link href="/cookies" className="text-sm text-gray-400 hover:text-white hover:underline">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer