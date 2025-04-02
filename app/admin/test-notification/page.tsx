"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react"
import AdminNavbar from "@/components/admin-navbar"

export default function TestNotificationPage() {
  const { toast } = useToast()
  const [phoneNumber, setPhoneNumber] = useState("5511984801839")
  const [apiKey, setApiKey] = useState("1782254")
  const [message, setMessage] = useState(
    "🚨 Teste de Notificação ANIRES 🚨\n\nEsta é uma mensagem de teste do sistema de notificações do AniRes Bank.",
  )
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSendTestNotification = async () => {
    if (!phoneNumber || !apiKey || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    setSendResult(null)

    try {
      const response = await fetch("/api/admin/send-test-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          apiKey,
          message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSendResult({
          success: true,
          message: "Notificação enviada com sucesso!",
        })
        toast({
          title: "Notificação enviada",
          description: "A notificação de teste foi enviada com sucesso.",
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } else {
        setSendResult({
          success: false,
          message: data.message || "Erro ao enviar notificação",
        })
        toast({
          title: "Erro ao enviar",
          description: data.message || "Ocorreu um erro ao enviar a notificação de teste.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao enviar notificação de teste:", error)
      setSendResult({
        success: false,
        message: "Erro ao enviar notificação. Verifique o console para mais detalhes.",
      })
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar a notificação de teste.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminNavbar />

      <h1 className="text-3xl font-bold text-purple-400 mb-6">Teste de Notificação WhatsApp</h1>

      <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden mb-6">
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14]">
          <CardTitle className="text-xl text-purple-400">Enviar Notificação de Teste</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="phone-number" className="text-sm text-gray-400 mb-1 block">
                Número de Telefone (com código do país)
              </label>
              <Input
                id="phone-number"
                placeholder="5511984801839"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-[#13131f] border-purple-800/30 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Formato: código do país + DDD + número (ex: 5511984801839)</p>
            </div>

            <div>
              <label htmlFor="api-key" className="text-sm text-gray-400 mb-1 block">
                Chave API do CallMeBot
              </label>
              <Input
                id="api-key"
                placeholder="1782254"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-[#13131f] border-purple-800/30 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Chave API fornecida pelo CallMeBot para este número</p>
            </div>

            <div>
              <label htmlFor="message" className="text-sm text-gray-400 mb-1 block">
                Mensagem de Teste
              </label>
              <textarea
                id="message"
                placeholder="Digite a mensagem de teste..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full bg-[#13131f] border-purple-800/30 text-white rounded-md p-2"
              />
            </div>

            <Button
              onClick={handleSendTestNotification}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Notificação de Teste
                </>
              )}
            </Button>

            {sendResult && (
              <div
                className={`p-3 rounded-md ${
                  sendResult.success
                    ? "bg-green-900/20 border border-green-800/30"
                    : "bg-red-900/20 border border-red-800/30"
                }`}
              >
                <div className="flex items-start">
                  {sendResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className={`font-medium ${sendResult.success ? "text-green-400" : "text-red-400"}`}>
                      {sendResult.success ? "Sucesso" : "Erro"}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">{sendResult.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14]">
          <CardTitle className="text-xl text-purple-400">Instruções</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Como Obter a Chave API do CallMeBot</h3>
              <ol className="list-decimal list-inside text-gray-300 text-sm space-y-2">
                <li>Envie uma mensagem para o número do CallMeBot no WhatsApp: +34 644 66 01 60</li>
                <li>Digite "I allow callmebot to send me messages"</li>
                <li>Aguarde a resposta com sua chave API</li>
                <li>Copie a chave API e cole no campo acima</li>
              </ol>
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Dicas para Mensagens</h3>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-2">
                <li>Use \n para quebras de linha</li>
                <li>Evite caracteres especiais que possam causar problemas na codificação</li>
                <li>Mantenha as mensagens concisas para melhor legibilidade</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

