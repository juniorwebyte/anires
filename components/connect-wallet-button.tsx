"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LogOut, Wallet, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function ConnectWalletButton() {
  const { toast } = useToast()
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    // Verificar se já existe uma conexão salva
    if (typeof window !== "undefined") {
      // Use setTimeout to ensure this doesn't happen during rendering
      setTimeout(() => {
        const savedAddress = localStorage.getItem("walletAddress")
        if (savedAddress) {
          setAddress(savedAddress)
          setIsConnected(true)
        }
      }, 0)
    }
  }, [])

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          localStorage.setItem("walletAddress", accounts[0])
          localStorage.setItem("walletType", "metamask")
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been connected successfully.",
            variant: "default",
            className: "bg-green-950 border-green-800 text-green-100",
          })
        }
      } else {
        // Abrir página de download do MetaMask se não estiver instalado
        window.open("https://metamask.io/download/", "_blank")
        toast({
          title: "MetaMask Not Found",
          description: "Please install the MetaMask extension to continue.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Error",
        description: "There was an error connecting your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletType")
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
      variant: "default",
    })
  }

  // Formatar o endereço para exibição
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <>
      {isConnected ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300 hidden md:inline">{address && formatAddress(address)}</span>
          <Button
            variant="outline"
            className="border-red-800/30 text-red-400 hover:bg-red-900/20 flex items-center gap-2"
            onClick={disconnectWallet}
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-purple-700/20"
          size="sm"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </>
  )
}

