"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Users, Settings, Bell, LogOut, Menu, X, Database, BarChart3 } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar se está logado
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    setIsLoggedIn(adminLoggedIn)
    setIsLoading(false)

    if (!adminLoggedIn && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    setIsLoggedIn(false)
    router.push("/admin/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14]">
        <div className="h-12 w-12 border-4 border-t-purple-500 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isLoggedIn && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/admin/claims", label: "Reivindicações", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/notifications", label: "Notificações", icon: <Bell className="h-5 w-5" /> },
    { href: "/admin/statistics", label: "Estatísticas", icon: <BarChart3 className="h-5 w-5" /> },
    { href: "/admin/database", label: "Banco de Dados", icon: <Database className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Configurações", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white flex">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex w-64 flex-col bg-[#13131f] border-r border-purple-800/30">
        <div className="p-4 border-b border-purple-800/30">
          <h1 className="text-xl font-bold text-purple-400">Admin Panel</h1>
          <p className="text-xs text-gray-400">Gerenciamento do sistema</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                pathname === item.href ? "bg-purple-900/30 text-purple-400" : "text-gray-300 hover:bg-[#1a1a2e]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-800/30">
          <Button
            variant="outline"
            className="w-full border-red-800/30 text-red-400 hover:bg-red-900/20 flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-[#13131f] border-b border-purple-800/30 p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-purple-400">Admin Panel</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-300"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed inset-0 z-10 bg-[#0a0a14]/90 pt-16"
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-colors ${
                  pathname === item.href ? "bg-purple-900/30 text-purple-400" : "text-gray-300 hover:bg-[#1a1a2e]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            <Button
              variant="outline"
              className="w-full mt-4 border-red-800/30 text-red-400 hover:bg-red-900/20 flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </nav>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-0 mt-16 md:mt-0 p-4 md:p-6 overflow-auto">{children}</div>

      <Toaster />
    </div>
  )
}

