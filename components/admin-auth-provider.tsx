"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getTokenInfo } from "@/app/actions/token-info"

// Contexto de autenticação
const AdminAuthContext = createContext({
  isLoggedIn: false,
  token: "",
  login: (username: string, password: string, token: string) => Promise.resolve(false),
  logout: () => {},
})

// Hook para usar o contexto de autenticação
export const useAdminAuth = () => useContext(AdminAuthContext)

// Provedor de autenticação
export function AdminAuthProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [token, setToken] = useState("")

  // Verificar se o administrador está logado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = sessionStorage.getItem("adminLoggedIn") === "true"
      const storedToken = sessionStorage.getItem("adminToken") || ""

      setIsLoggedIn(loggedIn)
      setToken(storedToken)

      // Se não estiver logado e estiver tentando acessar uma página de administração
      if (!loggedIn && pathname?.startsWith("/admin") && pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  // Função de login
  const login = async (username: string, password: string, providedToken: string) => {
    try {
      // Verificar credenciais de administrador
      const isAdminValid =
        username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD

      if (!isAdminValid) {
        return false
      }

      // Verificar token usando Server Action
      const { token: serverToken } = await getTokenInfo()
      const isTokenValid = providedToken === serverToken

      if (!isTokenValid) {
        return false
      }

      // Armazenar informações de login na sessão
      sessionStorage.setItem("adminLoggedIn", "true")
      sessionStorage.setItem("adminToken", providedToken)

      // Atualizar estado
      setIsLoggedIn(true)
      setToken(providedToken)

      return true
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return false
    }
  }

  // Função de logout
  const logout = () => {
    // Limpar informações de login
    sessionStorage.removeItem("adminLoggedIn")
    sessionStorage.removeItem("adminToken")

    // Atualizar estado
    setIsLoggedIn(false)
    setToken("")

    // Redirecionar para a página de login
    router.push("/admin/login")
  }

  return <AdminAuthContext.Provider value={{ isLoggedIn, token, login, logout }}>{children}</AdminAuthContext.Provider>
}

