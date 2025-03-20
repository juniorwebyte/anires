"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { authenticateAdmin, checkAdminAuthentication } from "@/lib/storage-service"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminLogin() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Animação de fundo
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; opacity: number; speed: number }>>([])

  useEffect(() => {
    // Gerar estrelas para animação
    const generateStars = () => {
      const newStars = []
      for (let i = 0; i < 150; i++) {
        newStars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.5 + 0.1,
        })
      }
      setStars(newStars)
    }

    generateStars()
  }, [])

  // Verificar se já está autenticado
  useEffect(() => {
    try {
      // Verificar se há um nome de usuário salvo
      if (typeof window !== "undefined") {
        const savedUsername = localStorage.getItem("admin_remembered_username")
        if (savedUsername) {
          setUsername(savedUsername)
          setRememberMe(true)
        }
      }

      const verifySession = async () => {
        try {
          const isAuthenticated = checkAdminAuthentication()
          if (isAuthenticated) {
            router.push("/admin/dashboard")
          }
        } catch (error) {
          console.error("Erro ao verificar sessão:", error)
        } finally {
          setIsCheckingSession(false)
        }
      }

      verifySession()
    } catch (error) {
      console.error("Erro ao inicializar:", error)
      setIsCheckingSession(false)
    }
  }, [router])

  const validateForm = () => {
    let isValid = true

    // Validar nome de usuário
    if (!username.trim()) {
      setUsernameError("O nome de usuário é obrigatório")
      isValid = false
    } else {
      setUsernameError("")
    }

    // Validar senha
    if (!password) {
      setPasswordError("A senha é obrigatória")
      isValid = false
    } else {
      setPasswordError("")
    }

    return isValid
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulário
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const isAuthenticated = authenticateAdmin(username, password)

      if (isAuthenticated) {
        // Salvar nome de usuário se "lembrar-me" estiver marcado
        if (rememberMe && typeof window !== "undefined") {
          localStorage.setItem("admin_remembered_username", username)
        } else if (typeof window !== "undefined") {
          localStorage.removeItem("admin_remembered_username")
        }

        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo ao painel administrativo",
          className: "bg-green-950 border-green-800 text-green-100",
        })

        // Pequeno atraso para garantir que o localStorage seja atualizado
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 500)
      } else {
        setError("Credenciais inválidas")
        toast({
          title: "Erro de autenticação",
          description: "Credenciais inválidas",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setError("Ocorreu um erro ao tentar fazer login")
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-radial from-purple-500/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-radial from-blue-500/10 to-transparent"></div>

          {/* Estrelas estáticas */}
          <div className="stars-container">
            {stars.map((star, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${star.y}%`,
                  left: `${star.x}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animation: `pulse ${3 + star.speed}s infinite ease-in-out`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          </div>
          <p className="text-purple-300 text-lg">Verificando autenticação...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-radial from-purple-500/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-radial from-blue-500/10 to-transparent"></div>

        {/* Estrelas animadas */}
        <div className="stars-container">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${star.y}%`,
                left: `${star.x}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animation: `pulse ${3 + star.speed}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        {/* Nebulosas */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>

        {/* Planeta */}
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/30 to-purple-600/30 blur-sm animate-pulse"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-purple-900/30 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
            <ShieldCheck className="h-10 w-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
            Painel Administrativo
          </h1>
          <p className="text-gray-300">Faça login para acessar o painel de gerenciamento do AirDrop</p>
        </div>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Login Administrativo</CardTitle>
            <CardDescription className="text-gray-400">Acesso restrito apenas para administradores</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="p-6 space-y-4">
              {error && (
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 flex items-start animate-pulse">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300 flex items-center">
                  <User className="h-4 w-4 mr-2 text-purple-400" />
                  Usuário
                </Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      if (usernameError) setUsernameError("")
                    }}
                    className={`bg-black/50 border-purple-800/30 text-white pl-10 ${
                      usernameError ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                    placeholder="Digite seu nome de usuário"
                  />
                  <User className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                {usernameError && <p className="text-xs text-red-400 mt-1">{usernameError}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-purple-400" />
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) setPasswordError("")
                    }}
                    className={`bg-black/50 border-purple-800/30 text-white pl-10 ${
                      passwordError ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                    placeholder="Digite sua senha"
                  />
                  <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && <p className="text-xs text-red-400 mt-1">{passwordError}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-300 cursor-pointer select-none">
                  Lembrar meu usuário
                </label>
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-900/20 p-4 bg-black/50">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Entrar
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute bottom-10 left-10 w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
      <div
        className="absolute top-10 right-10 w-20 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Círculos decorativos */}
      <div
        className="absolute bottom-20 right-20 w-40 h-40 rounded-full border border-purple-500/10 animate-ping"
        style={{ animationDuration: "8s" }}
      ></div>
      <div
        className="absolute top-20 left-20 w-60 h-60 rounded-full border border-blue-500/10 animate-ping"
        style={{ animationDuration: "12s" }}
      ></div>
    </main>
  )
}

