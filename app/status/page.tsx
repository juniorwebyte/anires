"use client"

import { useState, useEffect } from "react"
import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Loader2,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Wallet,
  ArrowRight,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAirdropStats, getClaimStatus } from "@/lib/storage-service"

// Tipos para o status da reivindicação
type ClaimStatus = "pending" | "approved" | "processing" | "completed" | "rejected" | "not_found"

interface ClaimData {
  status: ClaimStatus
  walletAddress: string
  tokensAllocated: number
  dateSubmitted: string
  dateProcessed?: string
  estimatedDelivery?: string
  transactionHash?: string
  message?: string
  tasks: {
    name: string
    completed: boolean
    points: number
  }[]
}

export default function StatusPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [claimData, setClaimData] = useState<ClaimData | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [connectedWalletAddress, setConnectedWalletAddress] = useState("")

  // Carregar estatísticas gerais
  useEffect(() => {
    const statsData = getAirdropStats()
    setStats(statsData)
  }, [])

  // Função para verificar o status da reivindicação
  const checkClaimStatus = async (address: string) => {
    if (!address || address.trim() === "") {
      toast({
        title: "Endereço inválido",
        description: "Por favor, insira um endereço de carteira válido",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)
    try {
      // Simular uma chamada de API
      const data = await getClaimStatus(address)
      setClaimData(data)

      if (data.status === "not_found") {
        toast({
          title: "Reivindicação não encontrada",
          description: "Não encontramos nenhuma reivindicação para este endereço",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Status encontrado",
          description: "Informações da sua reivindicação foram carregadas",
          className: "bg-green-950 border-green-800 text-green-100",
        })
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error)
      toast({
        title: "Erro ao verificar status",
        description: "Ocorreu um erro ao verificar o status da sua reivindicação",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Função para atualizar o status da carteira conectada
  const handleWalletUpdate = (address: string, connected: boolean) => {
    setIsWalletConnected(connected)
    setConnectedWalletAddress(address)
    if (connected && address) {
      setWalletAddress(address)
    }
  }

  // Renderizar o ícone de status apropriado
  const renderStatusIcon = (status: ClaimStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-400" />
      case "approved":
        return <CheckCircle2 className="h-8 w-8 text-blue-400" />
      case "processing":
        return <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
      case "completed":
        return <CheckCircle2 className="h-8 w-8 text-green-400" />
      case "rejected":
        return <XCircle className="h-8 w-8 text-red-400" />
      case "not_found":
        return <AlertTriangle className="h-8 w-8 text-orange-400" />
      default:
        return <AlertTriangle className="h-8 w-8 text-gray-400" />
    }
  }

  // Obter a cor de fundo e borda com base no status
  const getStatusColors = (status: ClaimStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/20 border-yellow-800/30 text-yellow-300"
      case "approved":
        return "bg-blue-900/20 border-blue-800/30 text-blue-300"
      case "processing":
        return "bg-blue-900/20 border-blue-800/30 text-blue-300"
      case "completed":
        return "bg-green-900/20 border-green-800/30 text-green-300"
      case "rejected":
        return "bg-red-900/20 border-red-800/30 text-red-300"
      case "not_found":
        return "bg-orange-900/20 border-orange-800/30 text-orange-300"
      default:
        return "bg-gray-900/20 border-gray-800/30 text-gray-300"
    }
  }

  // Obter o texto do status
  const getStatusText = (status: ClaimStatus) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "approved":
        return "Aprovado"
      case "processing":
        return "Em Processamento"
      case "completed":
        return "Concluído"
      case "rejected":
        return "Rejeitado"
      case "not_found":
        return "Não Encontrado"
      default:
        return "Desconhecido"
    }
  }

  // Calcular a porcentagem de progresso
  const calculateProgress = (status: ClaimStatus) => {
    switch (status) {
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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar
        isWalletConnected={isWalletConnected}
        walletAddress={connectedWalletAddress}
        onWalletUpdate={handleWalletUpdate}
      />

      <div className="max-w-3xl w-full z-10 mt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-purple-400">Verificar Status da Reivindicação</h1>
          <p className="text-gray-300">
            Verifique o status da sua reivindicação de tokens $STDOG inserindo o endereço da sua carteira abaixo.
          </p>
        </div>

        {/* Formulário de busca */}
        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden mb-8">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Consultar Status</CardTitle>
            <CardDescription className="text-gray-400">
              Insira o endereço da carteira que você usou para reivindicar os tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Endereço da Carteira</Label>
                <div className="flex gap-2">
                  <Input
                    id="wallet-address"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-black/50 border-purple-800/30 text-white"
                  />
                  <Button
                    onClick={() => checkClaimStatus(walletAddress)}
                    disabled={isSearching || !walletAddress}
                    className="bg-purple-700 hover:bg-purple-600"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Verificar
                  </Button>
                </div>
              </div>

              {isWalletConnected && (
                <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-400" />
                    <span className="text-sm text-purple-300">
                      Carteira conectada: {connectedWalletAddress.substring(0, 6)}...
                      {connectedWalletAddress.substring(connectedWalletAddress.length - 4)}
                    </span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setWalletAddress(connectedWalletAddress)
                      checkClaimStatus(connectedWalletAddress)
                    }}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Usar esta carteira
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resultados da busca */}
        {claimData && (
          <Card
            className={`border-${claimData.status === "not_found" ? "orange" : "purple"}-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden`}
          >
            <CardHeader className="border-b border-purple-900/20 bg-black/50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-purple-400">Detalhes da Reivindicação</CardTitle>
                  <CardDescription className="text-gray-400">
                    Informações sobre sua reivindicação de tokens $STDOG
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => checkClaimStatus(walletAddress)}
                  className="border-purple-800/30 hover:bg-purple-900/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </CardHeader>

            {claimData.status === "not_found" ? (
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-16 w-16 text-orange-400 mb-4" />
                  <h3 className="text-xl font-medium text-orange-300 mb-2">Reivindicação Não Encontrada</h3>
                  <p className="text-gray-300 max-w-md">
                    Não encontramos nenhuma reivindicação associada ao endereço{" "}
                    <span className="font-mono text-orange-300">
                      {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                    </span>
                  </p>
                  <div className="mt-6 space-y-2">
                    <p className="text-sm text-gray-400">Possíveis razões:</p>
                    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                      <li>Você ainda não completou o processo de reivindicação</li>
                      <li>Você usou um endereço de carteira diferente</li>
                      <li>Houve um erro ao processar sua reivindicação</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            ) : (
              <>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Status atual */}
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColors(claimData.status)}`}
                    >
                      <div className="flex items-center gap-4">
                        {renderStatusIcon(claimData.status)}
                        <div>
                          <h3 className="font-medium">Status da Reivindicação</h3>
                          <p className="text-sm">
                            {getStatusText(claimData.status)}
                            {claimData.status === "rejected" && claimData.message && (
                              <span className="block mt-1 text-xs">{claimData.message}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColors(claimData.status)}>
                        {getStatusText(claimData.status)}
                      </Badge>
                    </div>

                    {/* Barra de progresso */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progresso da Reivindicação</span>
                        <span className="text-purple-300">{calculateProgress(claimData.status)}%</span>
                      </div>
                      <Progress
                        value={calculateProgress(claimData.status)}
                        className="h-2 bg-purple-900/20"
                        indicatorClassName={
                          claimData.status === "rejected"
                            ? "bg-red-500"
                            : claimData.status === "completed"
                              ? "bg-green-500"
                              : "bg-purple-500"
                        }
                      />
                      <div className="flex justify-between text-xs text-gray-500 pt-1">
                        <span>Enviado</span>
                        <span>Aprovado</span>
                        <span>Processando</span>
                        <span>Concluído</span>
                      </div>
                    </div>

                    {/* Detalhes da reivindicação */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Endereço da Carteira</p>
                        <p className="font-mono text-sm text-purple-300 break-all">{claimData.walletAddress}</p>
                      </div>
                      <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Tokens Alocados</p>
                        <p className="text-lg font-bold text-purple-300">
                          {claimData.tokensAllocated.toLocaleString()} $STDOG
                        </p>
                      </div>
                      <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Data de Envio</p>
                        <p className="text-sm text-purple-300">
                          {new Date(claimData.dateSubmitted).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                        <p className="text-sm text-gray-400">
                          {claimData.status === "completed" ? "Data de Processamento" : "Entrega Estimada"}
                        </p>
                        <p className="text-sm text-purple-300">
                          {claimData.status === "completed" && claimData.dateProcessed
                            ? new Date(claimData.dateProcessed).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : claimData.estimatedDelivery
                              ? new Date(claimData.estimatedDelivery).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })
                              : "A ser determinado"}
                        </p>
                      </div>
                    </div>

                    {/* Tarefas completadas */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-purple-300">Tarefas Completadas</h3>
                      <div className="space-y-2">
                        {claimData.tasks.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-purple-900/10 border border-purple-800/20 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {task.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                              ) : (
                                <Clock className="h-5 w-5 text-yellow-400" />
                              )}
                              <span className={task.completed ? "text-gray-300" : "text-gray-400"}>{task.name}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                task.completed
                                  ? "bg-green-900/20 text-green-300 border-green-500/30"
                                  : "bg-yellow-900/20 text-yellow-300 border-yellow-500/30"
                              }
                            >
                              {task.completed ? "Concluído" : "Pendente"} • {task.points} pontos
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hash da transação (se concluído) */}
                    {claimData.status === "completed" && claimData.transactionHash && (
                      <div className="bg-green-900/10 border border-green-800/20 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Hash da Transação</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm text-green-300 break-all">{claimData.transactionHash}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-900/20"
                            onClick={() => {
                              navigator.clipboard.writeText(claimData.transactionHash || "")
                              toast({
                                title: "Hash copiado",
                                description: "O hash da transação foi copiado para a área de transferência",
                                className: "bg-green-950 border-green-800 text-green-100",
                              })
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                          </Button>
                        </div>
                        <a
                          href={`https://bscscan.com/tx/${claimData.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-400 hover:text-green-300 mt-2 inline-flex items-center"
                        >
                          Ver no BscScan
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            <path d="M7 7h10v10" />
                            <path d="M7 17 17 7" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-purple-900/20 bg-black/50 p-4">
                  <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <p className="text-sm text-gray-400">
                      Última atualização:{" "}
                      {new Date().toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="border-purple-800/30 hover:bg-purple-900/20"
                        onClick={() => checkClaimStatus(walletAddress)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Atualizar Status
                      </Button>
                      {claimData.status === "pending" && (
                        <Button className="bg-purple-700 hover:bg-purple-600">Completar Tarefas Pendentes</Button>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        )}

        {/* Estatísticas gerais */}
        {stats && (
          <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden mt-8">
            <CardHeader className="border-b border-purple-900/20 bg-black/50">
              <CardTitle className="text-xl text-purple-400">Estatísticas do AirDrop</CardTitle>
              <CardDescription className="text-gray-400">
                Informações gerais sobre o progresso do AirDrop
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Total de Participantes</p>
                  <p className="text-2xl font-bold text-purple-300">{stats.totalClaims.toLocaleString()}</p>
                </div>
                <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Reivindicações Processadas</p>
                  <p className="text-2xl font-bold text-green-300">{stats.processedClaims.toLocaleString()}</p>
                </div>
                <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                  <p className="text-sm text-gray-400">Tokens Distribuídos</p>
                  <p className="text-2xl font-bold text-purple-300">
                    {stats.tokensDistributed.toLocaleString()} $STDOG
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

