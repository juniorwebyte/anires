"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { getClaimByWalletAddress } from "@/lib/storage-service"
import type { UserClaim } from "@/lib/storage-service"

interface ClaimStatusMonitorProps {
  walletAddress: string
}

export default function ClaimStatusMonitor({ walletAddress }: ClaimStatusMonitorProps) {
  const [claim, setClaim] = useState<UserClaim | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)

  useEffect(() => {
    if (!walletAddress) return

    // Função para carregar os dados da reivindicação
    const loadClaimData = () => {
      const claimData = getClaimByWalletAddress(walletAddress)
      setClaim(claimData)
      setLoading(false)

      // Calcular progresso com base no status
      if (claimData) {
        switch (claimData.status) {
          case "pending":
            setProgress(25)
            break
          case "processed":
            setProgress(75)
            break
          case "rejected":
            setProgress(100)
            break
          case "failed":
            setProgress(100)
            break
          default:
            setProgress(0)
        }

        // Calcular tempo restante se estiver pendente
        if (claimData.status === "pending" && claimData.createdAt) {
          const createdAt = new Date(claimData.createdAt).getTime()
          const oneHourLater = createdAt + 3600000 // 1 hora em milissegundos
          const now = Date.now()

          if (now < oneHourLater) {
            const remainingMs = oneHourLater - now
            const remainingMinutes = Math.floor(remainingMs / 60000)
            const remainingSeconds = Math.floor((remainingMs % 60000) / 1000)
            setTimeRemaining(`${remainingMinutes}m ${remainingSeconds}s`)
          } else {
            setTimeRemaining("Processando...")
          }
        } else {
          setTimeRemaining(null)
        }
      }
    }

    // Carregar dados iniciais
    loadClaimData()

    // Configurar intervalo para atualizar a cada 10 segundos
    const intervalId = setInterval(loadClaimData, 10000)

    // Limpar intervalo ao desmontar
    return () => clearInterval(intervalId)
  }, [walletAddress])

  if (loading) {
    return (
      <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14] py-3 px-4">
          <CardTitle className="text-base text-purple-400">Status da Reivindicação</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-center items-center py-6">
            <div className="h-6 w-6 border-2 border-t-purple-400 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-400">Carregando status...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!claim) {
    return (
      <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14] py-3 px-4">
          <CardTitle className="text-base text-purple-400">Status da Reivindicação</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-md">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-yellow-400 font-medium">Nenhuma reivindicação encontrada</h3>
              <p className="text-sm text-gray-300 mt-1">
                Não encontramos nenhuma reivindicação associada a esta carteira.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
      <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14] py-3 px-4">
        <CardTitle className="text-base text-purple-400">Status da Reivindicação</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progresso</span>
              <span className="text-purple-300">
                {claim.status === "pending"
                  ? "Pendente"
                  : claim.status === "processed"
                    ? "Processado"
                    : claim.status === "rejected"
                      ? "Rejeitado"
                      : "Falhou"}
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-purple-900/20" />
          </div>

          {claim.status === "pending" && (
            <div className="p-3 bg-blue-900/20 border border-blue-800/30 rounded-md">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-blue-400 font-medium">Processamento em Andamento</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Sua reivindicação está sendo processada. Isso pode levar até 1 hora.
                    {timeRemaining && <span className="block mt-1">Tempo restante estimado: {timeRemaining}</span>}
                  </p>
                </div>
              </div>
            </div>
          )}

          {claim.status === "processed" && (
            <div className="p-3 bg-green-900/20 border border-green-800/30 rounded-md">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-green-400 font-medium">Reivindicação Processada</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Sua reivindicação foi processada com sucesso. Os tokens serão enviados em breve.
                    {claim.processedAt && (
                      <span className="block mt-1">Processado em: {new Date(claim.processedAt).toLocaleString()}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {(claim.status === "rejected" || claim.status === "failed") && (
            <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-medium">
                    Reivindicação {claim.status === "rejected" ? "Rejeitada" : "Falhou"}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {claim.notes || "Não foi possível processar sua reivindicação. Entre em contato com o suporte."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2">
            <p>ID da Reivindicação: {claim.id}</p>
            <p>Criado em: {new Date(claim.createdAt).toLocaleString()}</p>
            <p>Tokens Solicitados: {claim.tokensRequested}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

