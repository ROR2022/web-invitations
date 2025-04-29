"use client"

import type { ReactNode } from "react"
import { MusicProvider } from "@/context/music-context"

export function Providers({ children }: { children: ReactNode }) {
  return <MusicProvider>{children}</MusicProvider>
}
