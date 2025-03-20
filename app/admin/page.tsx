"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { checkAdminAuthentication, initializeStorage } from "@/lib/storage-service"

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Inicializar armazenamento
    initializeStorage()

    const checkAuth = () => {
      const isAuthenticated = checkAdminAuthentication()

      if (isAuthenticated) {
        router.push("/admin/dashboard")
      } else {
        router.push("/admin/login")
      }

      setIsLoading(false)
    }

    // Pequeno atraso para garantir que o localStorage esteja disponível
    const timer = setTimeout(() => {
      checkAuth()
    }, 500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-radial from-purple-500/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-radial from-blue-500/10 to-transparent"></div>

        {/* Estrelas estáticas */}
        <div className="stars-container">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `pulse ${Math.random() * 3 + 2}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        {/* Nebulosas */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      {isLoading && (
        <div className="z-10 flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
          <p className="text-purple-300 text-lg">Redirecionando para o painel administrativo...</p>
        </div>
      )}
    </main>
  )
}

