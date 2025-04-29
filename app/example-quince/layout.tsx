import { ThemeProvider } from 'next-themes';
import { Playfair_Display, Great_Vibes } from "next/font/google";
import { Providers } from '@/app/providers';
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from '@/components/CookieBanner';
import '../globals.css';

// Definir las fuentes
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

// Importante: esta configuración le dice a Next.js que no use el layout raíz
export const metadata = {
  title: 'Invitación Quinceañera',
  description: 'Ejemplo de invitación digital para quinceañera',
};

// Indica a Next.js que este es un layout aislado sin herencia
// https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${playfair.variable} ${greatVibes.variable} font-serif`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <CookieBanner />
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}