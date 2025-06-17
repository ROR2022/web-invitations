import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import CookieBanner from '@/components/CookieBanner'
import { Providers } from '@/app/providers'
import { 
  Playfair_Display, 
  Great_Vibes,
  Montserrat,
  Roboto,
  Lora,
  Dancing_Script,
  Pacifico,
  Open_Sans,
  Oswald,
  Merriweather
} from "next/font/google"
import ConditionalLayout from '@/components/ConditionalLayout';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Invitaciones Web MX',
  description: 'Invitaciones Web MX',
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
})

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
})

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
})

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${greatVibes.variable} ${montserrat.variable} ${roboto.variable} ${lora.variable} ${dancingScript.variable} ${pacifico.variable} ${openSans.variable} ${oswald.variable} ${merriweather.variable} font-serif`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col md:gap-20 gap-12 items-center mx-auto">
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
                <CookieBanner />
                <Toaster />
              </div>
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
