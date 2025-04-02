"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getClaimStatus } from "@/lib/storage-service"
import { CheckCircle, Clock, AlertCircle, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import ClaimStatusMonitor from "@/components/claim-status-monitor"
import NotificationStatusChecker from "@/components/notification-status-checker"

export default function StatusPage() {
  const searchParams = useSearchParams()
  const walletParam = searchParams?.get("wallet")

  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState(walletParam || "")
  const [searchedWallet, setSearchedWallet] = useState(walletParam || "")
  const [isLoading, setIsLoading] = useState(false)
  const [claimData, setClaimData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (walletParam) {
      handleCheckStatus()
    }
  }, [walletParam])

  const handleCheckStatus = async () => {
    if (!walletAddress) {
      toast({
        title: "Endereço não fornecido",
        description: "Por favor, insira um endereço de carteira para verificar o status.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setSearchedWallet(walletAddress)

    try {
      const data = await getClaimStatus(walletAddress)
      setClaimData(data)

      if (data.status === "not_found") {
        setError("Nenhuma reivindicação encontrada para este endereço de carteira.")
      }
    } catch (err) {
      console.error("Erro ao verificar status:", err)
      setError("Ocorreu um erro ao verificar o status. Por favor, tente novamente mais tarde.")
      setClaimData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusMessage = () => {
    if (!claimData) return null

    switch (claimData.status) {
      case "pending":
        return "Sua reivindicação está pendente de processamento. Por favor, aguarde enquanto verificamos suas informações."
      case "approved":
        return "Sua reivindicação foi aprovada! Os tokens serão enviados em breve para sua carteira."
      case "processing":
        return "Sua reivindicação está sendo processada. Os tokens serão enviados para sua carteira em breve."
      case "completed":
        return "Sua reivindicação foi concluída com sucesso! Os tokens foram enviados para sua carteira."
      case "rejected":
        return `Sua reivindicação foi rejeitada. Motivo: ${claimData.message || "Não especificado"}`
      case "not_found":
        return "Nenhuma reivindicação encontrada para este endereço de carteira."
      default:
        return "Status desconhecido. Entre em contato com o suporte para mais informações."
    }
  }

  const getStatusColor = () => {
    if (!claimData) return "bg-gray-900/20 border-gray-800/30"

    switch (claimData.status) {
      case "pending":
      case "processing":
        return "bg-yellow-900/20 border-yellow-800/30"
      case "approved":
      case "completed":
        return "bg-green-900/20 border-green-800/30"
      case "rejected":
      case "not_found":
        return "bg-red-900/20 border-red-800/30"
      default:
        return "bg-gray-900/20 border-gray-800/30"
    }
  }

  const getStatusIcon = () => {
    if (!claimData) return <AlertCircle className="h-5 w-5 text-gray-400" />

    switch (claimData.status) {
      case "pending":
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-400" />
      case "approved":
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "rejected":
      case "not_found":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getProgressValue = () => {
    if (!claimData) return 0

    switch (claimData.status) {
      case "pending":
        return 25
      case "approved":
        return 50
      case "processing":
        return 75
      case "completed":
        return 100
      case "rejected":
        return 100
      case "not_found":
        return 0
      default:
        return 0
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Status da Reivindicação</h1>

      <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden mb-8">
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14]">
          <CardTitle className="text-xl text-purple-400">Verificar Status</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Digite o endereço da sua carteira"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-[#13131f] border-purple-800/30 text-white"
              />
            </div>
            <Button onClick={handleCheckStatus} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-t-white border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin mr-2"></div>
                  Verificando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verificar Status
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchedWallet && <ClaimStatusMonitor walletAddress={searchedWallet} />}

      {error && (
        <Card className="border-red-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden mt-6">
          <CardContent className="p-4">
            <div className="flex items-start p-3 bg-red-900/20 border border-red-800/30 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-medium">Erro</h3>
                <p className="text-sm text-gray-300 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {claimData && !error && (
        <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden mt-6">
          <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14]">
            <CardTitle className="text-xl text-purple-400">Detalhes da Reivindicação</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progresso</span>
                  <span className="text-purple-300">
                    {claimData.status === "pending"
                      ? "Pendente"
                      : claimData.status === "approved"
                        ? "Aprovado"
                        : claimData.status === "processing"
                          ? "Processando"
                          : claimData.status === "completed"
                            ? "Concluído"
                            : claimData.status === "rejected"
                              ? "Rejeitado"
                              : "Desconhecido"}
                  </span>
                </div>
                <Progress value={getProgressValue()} className="h-2 bg-purple-900/20" />
              </div>

              <div className={`p-4 rounded-md ${getStatusColor()}`}>
                <div className="flex items-start">
                  {getStatusIcon()}
                  <div className="ml-3">
                    <p className="text-white">{getStatusMessage()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Endereço da Carteira</h3>
                  <p className="text-white break-all">{claimData.walletAddress}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Tokens Alocados</h3>
                  <p className="text-white">{claimData.tokensAllocated || "N/A"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Data de Envio</h3>
                  <p className="text-white">
                    {claimData.dateSubmitted ? new Date(claimData.dateSubmitted).toLocaleString() : "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Data de Processamento</h3>
                  <p className="text-white">
                    {claimData.dateProcessed ? new Date(claimData.dateProcessed).toLocaleString() : "Pendente"}
                  </p>
                </div>

                {claimData.transactionHash && (
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Hash da Transação</h3>
                    <p className="text-white break-all font-mono text-xs">{claimData.transactionHash}</p>
                  </div>
                )}

                {claimData.estimatedDelivery && (
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Entrega Estimada</h3>
                    <p className="text-white">{new Date(claimData.estimatedDelivery).toLocaleString()}</p>
                  </div>
                )}
              </div>

              {claimData.tasks && claimData.tasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Tarefas Completadas</h3>
                  <div className="space-y-2">
                    {claimData.tasks.map((task: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-[#13131f] rounded-md">
                        <span className="text-sm text-gray-300">{task.name}</span>
                        <div className="flex items-center">
                          <span className="text-xs text-purple-300 mr-2">+{task.points} pontos</span>
                          {task.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {searchedWallet && <NotificationStatusChecker walletAddress={searchedWallet} />}
    </div>
  )
}

