"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { verifyToken } from "@/app/actions/verify-token"

export default function AdminLoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password || !token) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Verificar credenciais de administrador
      const isAdminValid =
        username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD

      if (!isAdminValid) {
        toast({
          title: "Credenciais inválidas",
          description: "Nome de usuário ou senha incorretos",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Verificar token usando Server Action
      const { isValid } = await verifyToken(token)

      if (!isValid) {
        toast({
          title: "Token inválido",
          description: "O token fornecido é inválido",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Armazenar informações de login na sessão
      sessionStorage.setItem("adminLoggedIn", "true")
      sessionStorage.setItem("adminToken", token)

      // Redirecionar para o painel de administração
      router.push("/admin/dashboard")

      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao painel de administração",
      })
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao processar o login",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-xl text-white">Login de Administrador</CardTitle>
        <CardDescription className="text-gray-400">Acesse o painel de administração do Anires</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-300">
              Nome de usuário
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Digite seu nome de usuário"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Digite sua senha"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium text-gray-300">
              Token de acesso
            </label>
            <Input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Digite o token de acesso"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

