"use client"

import { useState } from "react"
import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { InfoIcon, Mail } from "lucide-react"
import PerformanceToggle from "@/components/performance-toggle"
import LazyAirdropClaim from "@/components/lazy-airdrop-claim"

export default function ClaimPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  // Função para receber o estado da carteira do componente filho
  const handleWalletUpdate = (address: string | null, connected: boolean) => {
    setWalletAddress(address || "")
    setIsWalletConnected(connected)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar isWalletConnected={isWalletConnected} walletAddress={walletAddress} />

      <div className="max-w-3xl w-full z-10 mt-20">
        {/* Adicionando a informação de contato */}
        <div className="mb-6 bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex items-start">
          <InfoIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-gray-300">
            Para mais informações ou em caso de demora no envio dos seus tokens 💰, entre em contato conosco por e-mail{" "}
            <span className="flex items-center gap-1 text-blue-400 inline-flex">
              <Mail className="h-4 w-4" /> contato@anires.org
            </span>
          </p>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-purple-400">Reivindicar Tokens</h1>
          <p className="text-gray-300">Complete as etapas abaixo para reivindicar seus tokens $ANIRES</p>
        </div>

        <LazyAirdropClaim onWalletUpdate={handleWalletUpdate} />
      </div>

      <Toaster />
      <PerformanceToggle />
    </main>
  )
}

