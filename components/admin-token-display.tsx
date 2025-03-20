"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getTokenInfo } from "@/app/actions/token-info"

export default function AdminTokenDisplay() {
  const { toast } = useToast()
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true)
  const [showToken, setShowToken] = useState(false)

  useEffect(() => {
    async function loadToken() {
      try {
        setLoading(true)

        // Carregar token de forma segura
        const { token: serverToken } = await getTokenInfo()
        setToken(serverToken)
      } catch (error) {
        console.error("Erro ao carregar token:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar o token",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadToken()
  }, [])

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token)
    toast({
      title: "Copiado",
      description: "Token copiado para a área de transferência",
    })
  }

  const toggleShowToken = () => {
    setShowToken(!showToken)
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Token da API</CardTitle>
        <CardDescription>Token usado para autenticar requisições à API do Anires</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Carregando token...</div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-800 p-3 rounded-md font-mono text-sm overflow-x-auto">
              {showToken ? token : "••••••••••••••••••••••••••••••••"}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleShowToken}
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {showToken ? "Ocultar" : "Mostrar"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToken}
                className="border-blue-800 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              >
                Copiar
              </Button>
            </div>

            <p className="text-xs text-gray-400">
              Este token é usado para autenticar requisições à API do Anires. Mantenha-o em segredo.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

