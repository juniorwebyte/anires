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
import PreSaleBanner from "@/components/pre-sale-banner"
// Add environment variable check in the main layout
import { checkRequiredEnvVars } from "@/lib/env-check"

// Check environment variables on the server
// Wrap in try/catch to prevent build failures
try {
  if (typeof window === "undefined") {
    checkRequiredEnvVars()
  }
} catch (error) {
  console.warn("Environment variable check failed:", error)
}

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Use font-display: swap to improve CLS
  preload: true,
})

// Add meta tags for SEO and security
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

// Modify the RootLayout component to include the LanguageProvider
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Add preconnect for external domains */}
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
                <PreSaleBanner />
              </div>
            </ClientProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'