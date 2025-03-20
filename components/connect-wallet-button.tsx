"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/app/providers"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function ConnectWalletButton() {
  const { address, isConnected, connect, disconnect } = useWallet()
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  // Formatar o endereço para exibição
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      onClick={isConnected ? handleDisconnect : handleConnect}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Conectando...
        </>
      ) : isConnected ? (
        formatAddress(address as string)
      ) : (
        "Conectar Carteira"
      )}
    </Button>
  )
}

