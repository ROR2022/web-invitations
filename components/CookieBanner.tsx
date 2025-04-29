'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    // Verificar si el usuario ya ha tomado una decisión sobre las cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    // Aquí podrías activar scripts de análisis o marketing
  };

  const acceptEssentialCookies = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setShowBanner(false);
    // Solo aceptar cookies esenciales
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex-1 pr-4 mb-4 sm:mb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Uso de Cookies
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Utilizamos cookies para mejorar su experiencia en nuestro sitio web. Para obtener más información, 
              consulte nuestra{' '}
              <Link 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Política de Privacidad
              </Link>.
            </p>
          </div>
          <div className="flex flex-shrink-0 space-x-3">
            <button
              onClick={acceptEssentialCookies}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Solo Esenciales
            </button>
            <button
              onClick={acceptAllCookies}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Aceptar Todas
            </button>
            <button
              onClick={acceptEssentialCookies}
              className="inline-flex p-1 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 