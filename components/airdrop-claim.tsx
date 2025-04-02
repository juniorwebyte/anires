"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import WalletConnector from "./wallet-connector"
import AirdropTasks from "./airdrop-tasks"
import { Check, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import { hasClaimedTokens, getClaimRecord } from "@/lib/claim-storage"
import { useSearchParams } from "next/navigation"
import { storeReferralInfo } from "@/lib/referral-utils"
import ReferralShare from "./referral-share"

interface AirdropClaimProps {
  onWalletUpdate?: (address: string | null, connected: boolean) => void
}

type WalletType = "metamask" | "coinbase"

export default function AirdropClaim({ onWalletUpdate }: AirdropClaimProps) {
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [tasksCompleted, setTasksCompleted] = useState(false)
  const [hasAlreadyClaimed, setHasAlreadyClaimed] = useState(false)
  const [claimRecord, setClaimRecord] = useState<any>(null)
  const [referralWallet, setReferralWallet] = useState<string | null>(null)
  const tasksCompletedRef = useRef(false)
  const searchParams = useSearchParams()

  // No início do componente, após as declarações de estado
  useEffect(() => {
    // Efeito de limpeza para garantir que não haja problemas com referências
    return () => {
      tasksCompletedRef.current = false
    }
  }, [])

  // Verificar parâmetros de referral na URL
  useEffect(() => {
    if (searchParams) {
      const ref = searchParams.get("ref")
      const wallet = searchParams.get("wallet")

      if (ref && wallet) {
        console.log("Referral detectado:", { ref, wallet })
        setReferralWallet(wallet)
        storeReferralInfo(ref, wallet)
      }
    }
  }, [searchParams])

  const handleWalletConnect = (address: string, type: WalletType) => {
    setWalletAddress(address)
    setWalletType(type)
    setIsConnected(true)

    // Verificar se a carteira já fez reivindicação
    const claimed = hasClaimedTokens(address)
    setHasAlreadyClaimed(claimed)

    if (claimed) {
      const record = getClaimRecord(address)
      setClaimRecord(record)

      toast({
        title: "Reivindicação já realizada",
        description: "Esta carteira já reivindicou tokens anteriormente.",
        variant: "default",
        className: "bg-yellow-950 border-yellow-800 text-yellow-100",
      })
    }

    // Notificar o componente pai sobre a conexão da carteira
    if (onWalletUpdate) {
      onWalletUpdate(address, true)
    }

    toast({
      title: "Carteira conectada",
      description: "Sua carteira foi conectada com sucesso.",
      variant: "default",
      className: "bg-green-950 border-green-800 text-green-100",
    })
  }

  const handleDisconnect = () => {
    setWalletAddress(null)
    setWalletType(null)
    setIsConnected(false)
    setTasksCompleted(false)
    setHasAlreadyClaimed(false)
    setClaimRecord(null)
    tasksCompletedRef.current = false

    // Notificar o componente pai sobre a desconexão da carteira
    if (onWalletUpdate) {
      onWalletUpdate(null, false)
    }

    toast({
      title: "Carteira desconectada",
      description: "Sua carteira foi desconectada com sucesso.",
      variant: "default",
    })
  }

  const handleTasksCompleted = (completed: boolean) => {
    // Não usar setTimeout aqui para evitar problemas de ciclo de vida
    if (completed !== tasksCompletedRef.current) {
      tasksCompletedRef.current = completed
      setTasksCompleted(completed)

      // Não enviar notificações aqui - apenas após o pagamento bem-sucedido
      console.log("Tarefas concluídas:", completed)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-left mb-2">
        <h2 className="text-xl text-purple-400 font-semibold">Conecte sua Carteira</h2>
        <p className="text-gray-400 text-sm">Conecte sua carteira para participar do AirDrop do Street Dog Coin</p>
      </div>

      {isConnected && !hasAlreadyClaimed && (
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <p className="text-green-300 font-medium">Transação Segura</p>
              <p className="text-green-400/80 text-sm">
                Todas as verificações de segurança foram aprovadas. Esta transação é segura.
              </p>
            </div>
          </div>
        </div>
      )}

      {isConnected && hasAlreadyClaimed && (
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-yellow-300 font-medium">Reivindicação já realizada</p>
              <p className="text-yellow-400/80 text-sm">
                Esta carteira já reivindicou {claimRecord?.tokenAmount || 100} tokens em{" "}
                {new Date(claimRecord?.timestamp || Date.now()).toLocaleDateString()}.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isConnected ? (
        <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
          <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-purple-400">Conecte sua Carteira</CardTitle>
              <div className="flex items-center text-green-400 text-xs">
                <Shield className="h-4 w-4 mr-1" />
                <span>Conexão Segura</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-300 text-sm mb-4">Escolha um dos provedores de carteira abaixo para continuar</p>
            <WalletConnector onConnect={handleWalletConnect} onDisconnect={handleDisconnect} />

            <div className="mt-6 text-center text-xs text-gray-400">
              Ao conectar sua carteira, você concorda com os{" "}
              <Link href="/termos-de-servico" className="text-purple-400 hover:underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link href="/politica-de-privacidade" className="text-purple-400 hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : hasAlreadyClaimed ? (
        <div className="space-y-6">
          <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
            <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14]">
              <CardTitle className="text-lg text-purple-400">Reivindicação Concluída</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl text-green-400 font-medium mb-2">Tokens Reivindicados com Sucesso!</h3>
                <p className="text-gray-300 mb-4">
                  Você já reivindicou {claimRecord?.tokenAmount || 100} tokens ANIRES.
                </p>
                <div className="bg-[#13131f] p-4 rounded-md border border-purple-800/30 mb-4">
                  <p className="text-sm text-gray-400 mb-1">Transação:</p>
                  <p className="font-mono text-xs text-purple-400 break-all">
                    {claimRecord?.transactionHash || "Transação processada"}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  Os tokens serão distribuídos após o lançamento oficial do token ANIRES.
                </p>
              </div>
            </CardContent>
          </Card>

          <ReferralShare walletAddress={walletAddress || ""} />
        </div>
      ) : (
        <div className="space-y-6">
          <AirdropTasks
            walletAddress={walletAddress || ""}
            walletType={walletType || ""}
            onTasksCompleted={handleTasksCompleted}
            referredBy={referralWallet}
          />

          {tasksCompleted && <ReferralShare walletAddress={walletAddress || ""} />}
        </div>
      )}
    </div>
  )
}

