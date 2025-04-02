"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import AdminNavbar from "@/components/admin-navbar"
import { getTokenInfo } from "@/app/actions/token-info"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [token, setToken] = useState("")

  // Configurações do airdrop
  const [airdropEnabled, setAirdropEnabled] = useState(true)
  const [tokensPerClaim, setTokensPerClaim] = useState("1000")
  const [requireTwitter, setRequireTwitter] = useState(true)
  const [requireTelegram, setRequireTelegram] = useState(true)

  // Carregar configurações
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true)

        // Carregar token de forma segura
        const { token: serverToken } = await getTokenInfo()
        setToken(serverToken)

        // Carregar configurações do airdrop
        setAirdropEnabled(process.env.NEXT_PUBLIC_AIRDROP_ENABLED === "true")
        setTokensPerClaim(process.env.NEXT_PUBLIC_TOKENS_PER_CLAIM || "1000")
        setRequireTwitter(process.env.NEXT_PUBLIC_REQUIRE_TWITTER === "true")
        setRequireTelegram(process.env.NEXT_PUBLIC_REQUIRE_TELEGRAM === "true")
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Salvar configurações
  const handleSaveSettings = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)

      // Simular salvamento de configurações
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      })
    } catch (error) {
      console.error("Erro ao salvar configurações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Configurações</h1>

        {loading ? (
          <div className="text-center py-8">Carregando configurações...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Configurações do Airdrop */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Configurações do Airdrop</CardTitle>
                <CardDescription>Configure as opções do airdrop do Anires</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="airdrop-enabled" className="text-sm font-medium">
                        Airdrop Ativo
                      </label>
                      <p className="text-sm text-gray-400">Ativar ou desativar o airdrop para todos os usuários</p>
                    </div>
                    <Switch id="airdrop-enabled" checked={airdropEnabled} onCheckedChange={setAirdropEnabled} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tokens-per-claim" className="text-sm font-medium">
                      Tokens por Claim
                    </label>
                    <Input
                      id="tokens-per-claim"
                      type="number"
                      value={tokensPerClaim}
                      onChange={(e) => setTokensPerClaim(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                    <p className="text-xs text-gray-400">
                      Quantidade de tokens que cada usuário receberá ao participar do airdrop
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="require-twitter" className="text-sm font-medium">
                        Exigir Twitter
                      </label>
                      <p className="text-sm text-gray-400">Exigir que o usuário siga no Twitter para participar</p>
                    </div>
                    <Switch id="require-twitter" checked={requireTwitter} onCheckedChange={setRequireTwitter} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label htmlFor="require-telegram" className="text-sm font-medium">
                        Exigir Telegram
                      </label>
                      <p className="text-sm text-gray-400">Exigir que o usuário entre no Telegram para participar</p>
                    </div>
                    <Switch id="require-telegram" checked={requireTelegram} onCheckedChange={setRequireTelegram} />
                  </div>

                  <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                    {saving ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Configurações de Segurança */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>Configure as opções de segurança do Anires</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="admin-username" className="text-sm font-medium">
                      Nome de Usuário Admin
                    </label>
                    <Input
                      id="admin-username"
                      type="text"
                      value={process.env.NEXT_PUBLIC_ADMIN_USERNAME || ""}
                      disabled
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="admin-password" className="text-sm font-medium">
                      Senha Admin
                    </label>
                    <Input
                      id="admin-password"
                      type="password"
                      value="••••••••"
                      disabled
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="api-token" className="text-sm font-medium">
                      Token da API
                    </label>
                    <div className="relative">
                      <Input
                        id="api-token"
                        type="password"
                        value="••••••••••••••••••••••••••••••••"
                        disabled
                        className="bg-gray-800 border-gray-700"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                        onClick={() => {
                          navigator.clipboard.writeText(token)
                          toast({
                            title: "Copiado",
                            description: "Token copiado para a área de transferência",
                          })
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">Token usado para autenticar requisições à API do Anires</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

