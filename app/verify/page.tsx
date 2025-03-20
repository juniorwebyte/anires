"use client"

import { useState } from "react"
import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Search, Loader2 } from "lucide-react"
import PerformanceToggle from "@/components/performance-toggle"
import { getClaimByWalletAddress } from "@/lib/storage-service"
import { useToast } from "@/components/ui/use-toast"

export default function VerifyPage() {
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<"eligible" | "not-eligible" | null>(null)
  const [claimDetails, setClaimDetails] = useState<any>(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleVerify = async () => {
    // Validar o endereço da carteira (formato básico de endereço Ethereum)
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      toast({
        title: "Endereço inválido",
        description: "Por favor, insira um endereço de carteira Ethereum válido",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)
    setClaimDetails(null)

    try {
      // Simular um pequeno atraso para mostrar o estado de carregamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Verificar se o endereço está na lista de reivindicações
      const claim = getClaimByWalletAddress(walletAddress)

      if (claim) {
        setVerificationResult("eligible")
        setClaimDetails(claim)
      } else {
        setVerificationResult("not-eligible")
      }
    } catch (error) {
      console.error("Erro ao verificar endereço:", error)
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar o endereço. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar isWalletConnected={isWalletConnected} walletAddress={walletAddress} />

      <div className="max-w-3xl w-full z-10 mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-purple-400">Verificar Elegibilidade</h1>
          <p className="text-gray-300">Verifique se seu endereço é elegível para o AirDrop</p>
        </div>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Verificar Endereço</CardTitle>
            <CardDescription className="text-gray-400">
              Insira o endereço da carteira para verificar a elegibilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="flex-1 px-4 py-2 bg-black/50 border border-purple-800/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600/50"
                />
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleVerify} disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Verificar
                    </>
                  )}
                </Button>
              </div>

              {verificationResult === "eligible" && (
                <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-400">Endereço Elegível!</h4>
                    <p className="text-sm text-gray-300 mt-1">
                      Este endereço está elegível para receber {claimDetails?.tokensRequested || 1000} $STDOG tokens.
                    </p>
                    {claimDetails?.status === "processed" && (
                      <p className="text-sm text-green-300 mt-2">
                        Status: Tokens já processados em {new Date(claimDetails.processedAt).toLocaleDateString()}
                      </p>
                    )}
                    {claimDetails?.status === "pending" && (
                      <p className="text-sm text-yellow-300 mt-2">Status: Reivindicação pendente de processamento</p>
                    )}
                  </div>
                </div>
              )}

              {verificationResult === "not-eligible" && (
                <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-400">Endereço Não Elegível</h4>
                    <p className="text-sm text-gray-300 mt-1">
                      Este endereço não está na lista de distribuição do AirDrop. Você pode participar completando as
                      tarefas na página de reivindicação.
                    </p>
                    <Button
                      className="mt-3 bg-purple-600 hover:bg-purple-700"
                      onClick={() => (window.location.href = "/claim")}
                    >
                      Ir para Reivindicação
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                <h3 className="font-medium text-blue-400 mb-2">Como funciona?</h3>
                <p className="text-sm text-gray-300">1. Insira o endereço da sua carteira Ethereum (formato 0x...)</p>
                <p className="text-sm text-gray-300 mt-1">
                  2. Clique em "Verificar" para checar se seu endereço está na lista de distribuição
                </p>
                <p className="text-sm text-gray-300 mt-1">
                  3. Se seu endereço não estiver na lista, você pode participar completando as tarefas na página de
                  reivindicação
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PerformanceToggle />
    </main>
  )
}

