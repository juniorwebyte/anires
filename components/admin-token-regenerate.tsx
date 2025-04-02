"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { getTokenInfo } from "@/app/actions/token-info"

export default function AdminTokenRegenerate() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleRegenerateToken = async () => {
    if (
      !confirm("Tem certeza que deseja regenerar o token? Todas as integrações existentes precisarão ser atualizadas.")
    ) {
      return
    }

    setLoading(true)

    try {
      // Simular regeneração de token
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Obter o novo token
      const { token } = await getTokenInfo()

      toast({
        title: "Token regenerado",
        description: "O token da API foi regenerado com sucesso",
      })
    } catch (error) {
      console.error("Erro ao regenerar token:", error)
      toast({
        title: "Erro",
        description: "Não foi possível regenerar o token",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>Regenerar Token</CardTitle>
        <CardDescription>Gere um novo token para a API do Anires</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Regenerar o token invalidará todas as integrações existentes. Use esta opção apenas se o token atual foi
            comprometido.
          </p>

          <Button variant="destructive" disabled={loading} onClick={handleRegenerateToken} className="w-full">
            {loading ? "Regenerando..." : "Regenerar Token"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

