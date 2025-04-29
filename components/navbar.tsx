'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  ChevronDown, 
  User as LogoUser, 
  Package, 
  CreditCard, 
  Settings, 
  LogOut, 
  Mail 
} from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { ThemeSwitcher } from './theme-switcher'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

  /**
   * A navigation bar component.
   *
   * @returns A JSX element representing the navigation bar.
   */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)    
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()
  const router = useRouter()
  
  // Verificar sesión del usuario al cargar
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user || null)
      
      // Verificar si el usuario es admin (consultando metadata o rol)
      if (user) {
        setIsAdmin(user.user_metadata?.role === 'admin')
      }
    }
    
    checkSession()
    
    // Suscribirse a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setIsAdmin(session?.user?.user_metadata?.role === 'admin')
    })
    
    return () => subscription.unsubscribe()
  }, [supabase.auth])
  
  // Función para cerrar sesión
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    router.push('/sign-in')
  }
  
  // Determinar enlaces de navegación según estado de autenticación
  const navLinks = !user 
    ? [
        { href: '/', label: 'Inicio' },
        { href: '/paquetes', label: 'Paquetes' },
        { href: '/ejemplos', label: 'Ejemplos' },
        { href: '/faq', label: 'FAQ' },
      ]
    : [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/invitaciones', label: 'Mis Invitaciones' },
        { href: '/crear-invitacion', label: 'Nueva Invitación' },
      ]
      
  // Enlaces de administrador
  const adminLinks = [
    { href: '/admin/dashboard', label: 'Panel Admin' },
    { href: '/admin/paquetes', label: 'Gestionar Paquetes' },
    { href: '/admin/plantillas', label: 'Gestionar Plantillas' },
    { href: '/admin/usuarios', label: 'Usuarios' },
  ]
  
  return (
    <nav className="w-full border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      
      >
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex-shrink-0 flex items-center gap-2 font-bold text-primary"
            >
              <Mail className="h-6 w-6" />
              <span className="hidden md:block">Invitaciones Interactivas</span>
            </Link>
            
            {/* Navegación escritorio */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Menú de admin en escritorio */}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-3 py-2 rounded-md text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 flex items-center">
                      Administración <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {adminLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href}>{link.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          {/* Sección derecha: Autenticación, Tema, etc. */}
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            
            {!user ? (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback>{(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col p-2">
                    <span className="text-sm font-medium">{user.user_metadata?.full_name}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="flex items-center cursor-pointer">
                      <LogoUser className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/invitaciones" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Mis Invitaciones</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pagos" className="flex items-center cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Historial de Pagos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Botón móvil de menú */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-primary hover:bg-primary/5 focus:outline-none"
              >
                <span className="sr-only">Abrir menú principal</span>
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Admin links en móvil */}
          {isAdmin && (
            <>
              <div className="pt-2 pb-1">
                <p className="px-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                  Administración
                </p>
              </div>
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-primary hover:bg-primary/5"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
          
          {/* Auth links en móvil */}
          {!user ? (
            <div className="mt-4 pt-4 border-t border-border/30 flex flex-col space-y-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-foreground/70">Cambiar tema</span>
                <ThemeSwitcher />
              </div>
              <Link
                href="/sign-in"
                className="block w-full px-3 py-2 text-center rounded-md bg-transparent hover:bg-primary/5 text-primary border border-primary/20"
                onClick={() => setIsOpen(false)}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/sign-up"
                className="block w-full px-3 py-2 text-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsOpen(false)}
              >
                Registrarse
              </Link>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-border/30 flex flex-col space-y-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-foreground/70">Cambiar tema</span>
                <ThemeSwitcher />
              </div>
              <Link
                href="/perfil"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground/70 hover:text-primary hover:bg-primary/5"
                onClick={() => setIsOpen(false)}
              >
                <LogoUser className="mr-2 h-5 w-5" />
                Mi Perfil
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-500/5"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar