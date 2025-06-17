"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Lista de rutas donde se debe ocultar navbar y footer
  const hideNavbarAndFooter = pathname.startsWith('/example-quince');
  
  // Si estamos en una ruta de ejemplo/invitación, no mostramos navbar/footer
  if (hideNavbarAndFooter) {
    return (
      <div className="w-full h-full">
        {children}
      </div>
    );
  }
  
  // Layout normal con navbar y footer
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:gap-20 gap-12 w-full px-4 sm:px-5 mx-auto"
      style={{width:'90vw'}}
      >
        {children}
      </div>
      <Footer />
    </>
  );
}
