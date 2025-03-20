"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import WalletConnector from "./wallet-connector"
import AirdropTasks from "./airdrop-tasks"
import { Button } from "@/components/ui/button"
// Importar o LogOut icon
import { Wallet, LogOut } from "lucide-react"

// Adicionar a interface de props no início do arquivo, logo após as importações
interface AirdropClaimProps {
  onWalletUpdate?: (address: string | null, connected: boolean) => void
}

type WalletType = "metamask" | "walletconnect" | "coinbase"

// Atualizar a definição da função para aceitar as props
export default function AirdropClaim({ onWalletUpdate }: AirdropClaimProps) {
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const handleWalletConnect = (address: string, type: WalletType) => {
    setWalletAddress(address)
    setWalletType(type)
    setIsConnected(true)

    // Notificar o componente pai sobre a conexão da carteira
    if (onWalletUpdate) {
      onWalletUpdate(address, true)
    }

    toast({
      title: "Carteira conectada",
      description: `Conectado com sucesso à carteira ${type}`,
      className: "bg-green-950 border-green-800 text-green-100",
    })
  }

  // Adicionar função para desconectar a carteira
  const handleDisconnect = () => {
    setWalletAddress(null)
    setWalletType(null)
    setIsConnected(false)

    // Notificar o componente pai sobre a desconexão da carteira
    if (onWalletUpdate) {
      onWalletUpdate("", false)
    }

    toast({
      title: "Carteira desconectada",
      description: "Sua carteira foi desconectada com sucesso",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6 fade-in">
      {!isConnected ? (
        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Conecte sua Carteira</CardTitle>
            <CardDescription className="text-gray-400">
              Conecte sua carteira para participar do AirDrop do Street Dog Coin
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <WalletConnector onConnect={handleWalletConnect} />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="border-b border-purple-900/20 bg-black/50">
              <CardTitle className="text-xl text-purple-400">Carteira Conectada</CardTitle>
              <CardDescription className="text-gray-400">
                Sua carteira está conectada e pronta para participar do AirDrop
              </CardDescription>
            </CardHeader>
            {/* Modificar o Card de carteira conectada para incluir o botão de desconexão */}
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Endereço da carteira:</p>
                    <p className="font-mono text-purple-300">
                      {walletAddress
                        ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                        : ""}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  className="border-red-800/30 hover:bg-red-900/20 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Desconectar
                </Button>
              </div>
            </CardContent>
          </Card>

          <AirdropTasks walletAddress={walletAddress || ""} walletType={walletType || ""} />
        </>
      )}
    </div>
  )
}

