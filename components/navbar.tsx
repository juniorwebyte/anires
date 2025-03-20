"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Wallet, Menu, X, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import LanguageSwitcher from "@/components/language-switcher"

interface NavbarProps {
  onConnectClick?: () => void
  isWalletConnected?: boolean
  walletAddress?: string
}

export default function Navbar({ onConnectClick, isWalletConnected = false, walletAddress = "" }: NavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const navItems = [
    { name: t("navbar.home"), href: "/" },
    { name: t("navbar.about"), href: "/about" },
    { name: t("navbar.claim"), href: "/claim" },
    { name: t("navbar.verify"), href: "/verify" },
    { name: t("navbar.status"), href: "/status" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Função para formatar o endereço da carteira
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-purple-900/20">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="/anires.png"
              alt="Anires Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <span className="font-bold text-white">Animal Rescue</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors",
                pathname === item.href
                  ? "text-purple-300 bg-purple-900/20"
                  : "text-gray-300 hover:text-purple-300 hover:bg-purple-900/10",
              )}
            >
              {item.name}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          {isWalletConnected ? (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-1 flex items-center gap-1"
              size="sm"
            >
              <CheckCircle className="h-3 w-3" />
              <span>{walletAddress ? formatWalletAddress(walletAddress) : t("navbar.connected")}</span>
            </Button>
          ) : (
            <Button
              onClick={onConnectClick}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-3 py-1 flex items-center gap-1"
              size="sm"
            >
              <Wallet className="h-3 w-3" />
              <span>{t("navbar.connect")}</span>
            </Button>
          )}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-300 hover:text-purple-300 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Connect Button */}
        {isWalletConnected ? (
          <Button className="hidden md:flex bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{walletAddress ? formatWalletAddress(walletAddress) : t("navbar.connected")}</span>
          </Button>
        ) : (
          <Button
            onClick={onConnectClick}
            className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            <span>{t("navbar.connect")}</span>
          </Button>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-b border-purple-900/20 animate-in slide-in-from-top-5 duration-300">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-3 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "text-purple-300 bg-purple-900/20"
                      : "text-gray-300 hover:text-purple-300 hover:bg-purple-900/10",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

