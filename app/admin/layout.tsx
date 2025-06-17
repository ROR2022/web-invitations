"use client"
import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  FileCode, 
  Settings, 
  Users, 
  BarChart4,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/packages", label: "Paquetes", icon: Package },
    { href: "/admin/templates", label: "Plantillas", icon: FileCode },
    { href: "/admin/features", label: "Características", icon: Settings },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/admin/reports", label: "Reportes", icon: BarChart4 },
  ];

  // Resolver el problema de hidratación inicializando con un valor predeterminado
  const [isMobileView, setIsMobileView] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 1000px)");
  
  // Efecto que se ejecuta solo del lado del cliente después de la hidratación
  useEffect(() => {
    setIsMobileView(isMobile);
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Manejar toggle del sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-wrap h-screen bg-gray-100 justify-center overflow-hidden">
      

      {/* Sidebar con transición */}
      <div 
        className={cn(
          "bg-white shadow-md transition-all duration-300 ease-in-out z-40",
          isMobileView 
            ? sidebarOpen 
              ? "fixed left-0 top-0 bottom-0 w-64 h-full" 
              : "fixed left-[-256px] top-0 bottom-0 w-64 h-full"
            : sidebarOpen
              ? "w-64 max-w-[20%]"
              : "w-16 max-w-[5%]"
        )}
      >
        <div className="p-4 border-b flex justify-between items-center">
          {/**Aqui cuando el usuario cierre el sidebar el titulo de Panel de Admin se ocultara y se mostrara un boton de hamburguesa */}
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Panel de Admin</h1>
          ) : (
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          )}
          {!isMobileView && (
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-full hover:bg-gray-100"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg hover:bg-gray-200 transition-colors",
                      sidebarOpen || isMobileView ? "p-2" : "py-4"
                    )}
                  >
                    {/* Tamaño mucho más grande para iconos en modo colapsado */}
                    {!sidebarOpen && !isMobileView ? (
                      <div className="flex justify-center w-full">
                        <IconComponent size={32} strokeWidth={1.5} />
                      </div>
                    ) : (
                      <IconComponent size={20} />
                    )}
                    <span className={cn("ml-3", !sidebarOpen && !isMobileView && "hidden")}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Overlay para cerrar sidebar en móvil cuando está abierto */}
      {isMobileView && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleSidebar();
              e.preventDefault();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Cerrar menú lateral"
        />
      )}


      {/* 
      Main content */}
      <div 
        className="flex-1 overflow-auto transition-all duration-300"
        style={{ height: "100vh" }}
      >
        {/* Header con botón de toggle para móviles */}
        {isMobileView && (
          <div className="sticky top-0 z-30 bg-white shadow-sm mb-6 px-4 py-3 flex items-center">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 mr-3"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-lg font-semibold">Panel de Administración</h1>
          </div>
        )}
        
        <div className="p-4 pb-16">
          {children}
        </div>
      </div>
    </div>
  );
}