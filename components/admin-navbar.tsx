"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, LayoutDashboard, Users, Settings, Bell, LogOut } from "lucide-react"
import { logoutAdmin } from "@/lib/storage-service"

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = () => {
    logoutAdmin()
    window.location.href = "/admin/login"
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      name: "Reivindicações",
      href: "/admin/claims",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "Notificações",
      href: "/admin/test-notification",
      icon: <Bell className="h-4 w-4 mr-2" />,
    },
    {
      name: "Configurações",
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="mb-8">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between py-4 border-b border-purple-800/30">
        <div className="flex items-center">
          <Link href="/admin" className="text-xl font-bold text-purple-400 mr-8">
            AniRes Admin
          </Link>
          <nav className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  pathname === item.href
                    ? "bg-purple-900/30 text-purple-300"
                    : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Button
          variant="outline"
          className="border-purple-800/30 text-purple-400 hover:bg-purple-900/20"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between py-4 border-b border-purple-800/30">
          <Link href="/admin" className="text-xl font-bold text-purple-400">
            AniRes Admin
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="border-purple-800/30 text-purple-400 hover:bg-purple-900/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="py-2 border-b border-purple-800/30">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm flex items-center ${
                    pathname === item.href
                      ? "bg-purple-900/30 text-purple-300"
                      : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <Button
                variant="outline"
                className="border-purple-800/30 text-purple-400 hover:bg-purple-900/20 mt-2 w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

