"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react"

interface NotificationStatusCheckerProps {
  walletAddress: string
}

export default function NotificationStatusChecker({ walletAddress }: NotificationStatusCheckerProps) {
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)
  const [lastSent, setLastSent] = useState<string | null>(null)

  // Verificar se já enviou notificação recentemente (para evitar spam)
  useEffect(() => {
    const lastSentTime = localStorage.getItem(`notification_sent_${walletAddress}`)
    if (lastSentTime) {
      setLastSent(lastSentTime)
    }
  }, [walletAddress])

  const handleSendStatusNotification = async () => {
    // Verificar se já enviou notificação nos últimos 5 minutos
    if (lastSent) {
      const lastSentTime = new Date(lastSent).getTime()
      const now = new Date().getTime()
      const fiveMinutesInMs = 5 * 60 * 1000

      if (now - lastSentTime < fiveMinutesInMs) {
        const remainingSeconds = Math.ceil((fiveMinutesInMs - (now - lastSentTime)) / 1000)
        toast({
          title: "Aguarde um momento",
          description: `Você já solicitou uma notificação recentemente. Tente novamente em ${remainingSeconds} segundos.`,
          variant: "destructive",
        })
        return
      }
    }

    setIsSending(true)

    try {
      const response = await fetch("/api/status-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
        }),
      })

      if (response.ok) {
        // Salvar timestamp da última notificação enviada
        const now = new Date().toISOString()
        localStorage.setItem(`notification_sent_${walletAddress}`, now)
        setLastSent(now)

        toast({
          title: "Notificação enviada",
          description:
            "Uma notificação com o status da sua reivindicação foi enviada para o WhatsApp do administrador.",
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Erro ao enviar notificação",
          description: data.message || "Ocorreu um erro ao enviar a notificação de status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao enviar notificação de status:", error)
      toast({
        title: "Erro ao enviar notificação",
        description: "Ocorreu um erro ao enviar a notificação de status.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Verificar se pode enviar notificação novamente
  const canSendAgain = () => {
    if (!lastSent) return true

    const lastSentTime = new Date(lastSent).getTime()
    const now = new Date().getTime()
    const fiveMinutesInMs = 5 * 60 * 1000

    return now - lastSentTime >= fiveMinutesInMs
  }

  // Calcular tempo restante para poder enviar novamente
  const getRemainingTime = () => {
    if (!lastSent) return null

    const lastSentTime = new Date(lastSent).getTime()
    const now = new Date().getTime()
    const fiveMinutesInMs = 5 * 60 * 1000

    if (now - lastSentTime >= fiveMinutesInMs) return null

    const remainingMs = fiveMinutesInMs - (now - lastSentTime)
    const minutes = Math.floor(remainingMs / 60000)
    const seconds = Math.floor((remainingMs % 60000) / 1000)

    return `${minutes}m ${seconds}s`
  }

  return (
    <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden mt-6">
      <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14]">
        <CardTitle className="text-base text-purple-400">Solicitar Atualização</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Se você deseja receber uma atualização sobre o status da sua reivindicação, clique no botão abaixo para
            notificar um administrador.
          </p>

          {lastSent && !canSendAgain() && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-yellow-400 font-medium">Aguarde um momento</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Você já solicitou uma notificação recentemente. Tente novamente em {getRemainingTime()}.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSendStatusNotification}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSending || (lastSent && !canSendAgain())}
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Solicitar Atualização de Status
              </>
            )}
          </Button>

          {lastSent && canSendAgain() && (
            <div className="p-3 bg-green-900/20 border border-green-800/30 rounded-md">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-green-400 font-medium">Pronto para nova solicitação</h3>
                  <p className="text-sm text-gray-300 mt-1">Você pode solicitar uma nova atualização de status.</p>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500">
            Nota: Para evitar spam, você só pode solicitar uma atualização a cada 5 minutos.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

