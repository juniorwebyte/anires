"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"

export default function AdminNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminToken, setAdminToken] = useState("")

  useEffect(() => {
    // Verificar se o administrador está logado
    const loggedIn = sessionStorage.getItem("adminLoggedIn") === "true"
    const token = sessionStorage.getItem("adminToken") || ""

    setIsLoggedIn(loggedIn)
    setAdminToken(token)

    // Se não estiver logado, redirecionar para a página de login
    if (!loggedIn && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    // Limpar informações de login
    sessionStorage.removeItem("adminLoggedIn")
    sessionStorage.removeItem("adminToken")

    // Redirecionar para a página de login
    router.push("/admin/login")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Se não estiver logado, não mostrar a navbar
  if (!isLoggedIn) {
    return null
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold text-white">
              Anires Admin
            </Link>
          </div>

          {/* Links de navegação para desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/admin/dashboard" current={pathname === "/admin/dashboard"}>
              Dashboard
            </NavLink>
            <NavLink href="/admin/claims" current={pathname === "/admin/claims"}>
              Claims
            </NavLink>
            <NavLink href="/admin/users" current={pathname === "/admin/users"}>
              Usuários
            </NavLink>
            <NavLink href="/admin/notifications" current={pathname === "/admin/notifications"}>
              Notificações
            </NavLink>
            <NavLink href="/admin/settings" current={pathname === "/admin/settings"}>
              Configurações
            </NavLink>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>

          {/* Botão de menu para mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-2">
          <div className="container mx-auto px-4 space-y-2">
            <MobileNavLink href="/admin/dashboard" current={pathname === "/admin/dashboard"}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink href="/admin/claims" current={pathname === "/admin/claims"}>
              Claims
            </MobileNavLink>
            <MobileNavLink href="/admin/users" current={pathname === "/admin/users"}>
              Usuários
            </MobileNavLink>
            <MobileNavLink href="/admin/notifications" current={pathname === "/admin/notifications"}>
              Notificações
            </MobileNavLink>
            <MobileNavLink href="/admin/settings" current={pathname === "/admin/settings"}>
              Configurações
            </MobileNavLink>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

// Componente de link de navegação para desktop
function NavLink({ href, current, children }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        current ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {children}
    </Link>
  )
}

// Componente de link de navegação para mobile
function MobileNavLink({ href, current, children }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        current ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {children}
    </Link>
  )
}

