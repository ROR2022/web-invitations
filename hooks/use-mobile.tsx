import * as React from "react"
import { useResponsive } from "./use-responsive"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

/**
 * Hook simple para detectar dispositivos móviles
 * Mantiene compatibilidad con código existente
 * @deprecated Use useResponsive para detección más avanzada
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

/**
 * Hook ampliado con más opciones de detección
 */
export function useDevice() {
  const responsive = useResponsive({
    mobileMaxWidth: MOBILE_BREAKPOINT,
    tabletMaxWidth: TABLET_BREAKPOINT
  })
  
  return {
    isMobile: responsive.isMobile,
    isTablet: responsive.isTablet,
    isDesktop: responsive.isDesktop,
    isPortrait: responsive.isPortrait,
    isLandscape: responsive.isLandscape,
    deviceType: responsive.deviceType,
    orientation: responsive.orientation,
    width: responsive.width,
    height: responsive.height
  }
}

export default {
  useIsMobile,
  useDevice
}
