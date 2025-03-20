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
// Adicionar verificação de variáveis de ambiente no layout principal
import { checkRequiredEnvVars } from "@/lib/env-check"

// Verificar variáveis de ambiente no servidor
checkRequiredEnvVars()

// Otimizar o carregamento da fonte
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Usar font-display: swap para melhorar o CLS
  preload: true,
})

// Adicionar meta tags para SEO e segurança
export const metadata: Metadata = {
  title: "Anires Token - Airdrop",
  description: "Participe do airdrop do Anires Token e ajude animais de rua",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
    generator: 'v0.dev'
}

// Modificar o componente RootLayout para incluir o LanguageProvider
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Adicionar preconnect para domínios externos */}
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://v0.blob.com" />
        <link rel="dns-prefetch" href="https://v0.blob.com" />
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anires-5t475e82C0gIE9LYJM8EhAitHkEnag.png"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anires-5t475e82C0gIE9LYJM8EhAitHkEnag.png"
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