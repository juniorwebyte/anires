"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogOut, LayoutDashboard, Coins } from "lucide-react"

interface AdminNavbarProps {
  onLogout: () => void
}

export default function AdminNavbar({ onLogout }: AdminNavbarProps) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { name: "Distribuição", href: "/admin/dashboard?tab=distribution", icon: <Coins className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-purple-900/20">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          {/* Substituir a letra A por uma imagem de logo */}
          <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/street-logo-Lwlo4CyibHQIRkaFgNMeF9P1QNF4B1.png"
              alt="Street Dog Coin Logo"
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <span className="font-bold text-white">Admin Street Dog Coin</span>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors flex items-center",
                pathname === item.href || (item.href.includes("?tab=") && pathname.includes(item.href.split("?")[0]))
                  ? "text-purple-300 bg-purple-900/20"
                  : "text-gray-300 hover:text-purple-300 hover:bg-purple-900/10",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <Button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      </div>
    </header>
  )
}

