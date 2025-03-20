import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientProvider from "@/components/client-provider"
import GalaxyAnimation from "@/components/galaxy-animation"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import PerformanceToggle from "@/components/performance-toggle"
import { LanguageProvider } from "@/lib/i18n/language-context"

// Otimizar o carregamento da fonte
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Usar font-display: swap para melhorar o CLS
  preload: true,
})

export const metadata: Metadata = {
  title: "AirDrop Galáctico",
  description: "Sistema de reivindicação de AirDrop com tema galáctico para distribuição manual de tokens",
  // Adicionar meta tags para melhorar a performance
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#000000",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/street-logo-JfgoMWhc1jZ8Ze5yysaYlzOcr4CIXw.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/street-logo-JfgoMWhc1jZ8Ze5yysaYlzOcr4CIXw.png",
        type: "image/png",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Adicionar preconnect para domínios externos */}
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://v0.blob.com" />
        <link rel="dns-prefetch" href="https://v0.blob.com" />
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/street-logo-JfgoMWhc1jZ8Ze5yysaYlzOcr4CIXw.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/street-logo-JfgoMWhc1jZ8Ze5yysaYlzOcr4CIXw.png"
        />
      </head>
      <body className={inter.className}>
        <GalaxyAnimation />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <ClientProvider>
              <div className="flex flex-col min-h-screen">
                <div className="flex-grow">
                  {children}
                  <ScrollToTop />
                  <PerformanceToggle />
                </div>
                <Footer />
              </div>
            </ClientProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'