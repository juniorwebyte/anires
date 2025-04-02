"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { isMetaMaskInstalled } from "@/lib/ethers-utils"

interface WalletConnectorProps {
  onConnect: (address: string, type: string) => void
  onDisconnect: () => void
}

export default function WalletConnector({ onConnect, onDisconnect }: WalletConnectorProps) {
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)

  // Verificar se já existe uma conexão salva
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress")
    const savedType = localStorage.getItem("walletType")

    if (savedAddress && savedType) {
      setConnectedAddress(savedAddress)
      onConnect(savedAddress, savedType)
    }
  }, [onConnect])

  const connectMetaMask = async () => {
    setIsConnecting(true)

    try {
      if (!isMetaMaskInstalled()) {
        toast({
          title: "MetaMask não detectado",
          description: "Por favor, instale a extensão MetaMask para continuar.",
          variant: "destructive",
        })
        setIsConnecting(false)
        return
      }

      // Solicitar contas ao MetaMask
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length > 0) {
        const address = accounts[0]
        setConnectedAddress(address)

        // Salvar a conexão no localStorage
        localStorage.setItem("walletAddress", address)
        localStorage.setItem("walletType", "metamask")

        onConnect(address, "metamask")
      } else {
        toast({
          title: "Conexão falhou",
          description: "Nenhuma conta foi selecionada.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao conectar MetaMask:", error)
      toast({
        title: "Erro na conexão",
        description: "Ocorreu um erro ao conectar com o MetaMask.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const connectCoinbase = async () => {
    setIsConnecting(true)

    try {
      // Verificar se a Coinbase Wallet está instalada
      if (typeof window.ethereum === "undefined" || !window.ethereum.isCoinbaseWallet) {
        toast({
          title: "Coinbase Wallet não detectada",
          description: "Por favor, instale a extensão Coinbase Wallet para continuar.",
          variant: "destructive",
        })
        setIsConnecting(false)
        return
      }

      // Solicitar contas à Coinbase Wallet
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length > 0) {
        const address = accounts[0]
        setConnectedAddress(address)

        // Salvar a conexão no localStorage
        localStorage.setItem("walletAddress", address)
        localStorage.setItem("walletType", "coinbase")

        onConnect(address, "coinbase")
      } else {
        toast({
          title: "Conexão falhou",
          description: "Nenhuma conta foi selecionada.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao conectar Coinbase Wallet:", error)
      toast({
        title: "Erro na conexão",
        description: "Ocorreu um erro ao conectar com a Coinbase Wallet.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setConnectedAddress(null)

    // Remover a conexão do localStorage
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletType")

    onDisconnect()
  }

  return (
    <div className="space-y-4">
      {connectedAddress ? (
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">Conectado com</p>
          <p className="font-mono text-purple-400 text-sm mb-4 break-all">
            {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
          </p>
          <Button
            variant="outline"
            className="border-red-800/30 text-red-400 hover:bg-red-900/20 w-full flex items-center justify-center gap-2"
            onClick={disconnectWallet}
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
              className="h-4 w-4"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Desconectar Carteira
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          <Card
            className="p-4 border-purple-800/30 bg-[#13131f] hover:bg-[#1a1a2e] cursor-pointer transition-colors"
            onClick={connectMetaMask}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 flex-shrink-0">
                <img
                  src="/metamask.svg"
                  alt="MetaMask"
                  className="w-full h-full object-contain"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-white font-medium">MetaMask</h3>
                <p className="text-gray-400 text-xs">Conecte usando a extensão MetaMask</p>
              </div>
              {isConnecting && (
                <div className="h-4 w-4 border-2 border-t-white border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </Card>

          <Card
            className="p-4 border-purple-800/30 bg-[#13131f] hover:bg-[#1a1a2e] cursor-pointer transition-colors"
            onClick={connectCoinbase}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 flex-shrink-0">
                <img
                  src="/coinbase.svg"
                  alt="Coinbase Wallet"
                  className="w-full h-full object-contain"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-white font-medium">Coinbase Wallet</h3>
                <p className="text-gray-400 text-xs">Conecte usando a Coinbase Wallet</p>
              </div>
              {isConnecting && (
                <div className="h-4 w-4 border-2 border-t-white border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

