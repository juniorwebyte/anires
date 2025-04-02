"use client"

import { useState } from "react"
import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import dynamic from "next/dynamic"
import PerformanceToggle from "@/components/performance-toggle"
import { motion } from "framer-motion"
import { Info, Mail } from "lucide-react"
import Link from "next/link"
import WalletConnector from "@/components/wallet-connector"

// Lazy load the AirdropClaim component
const LazyAirdropClaim = dynamic(() => import("@/components/lazy-airdrop-claim"), {
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-t-purple-500 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
  ),
})

export default function ClaimPage() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleWalletUpdate = (address: string | null, connected: boolean) => {
    setWalletAddress(address || "")
    setIsWalletConnected(connected)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#0a0a14] text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar isWalletConnected={isWalletConnected} walletAddress={walletAddress} />

      <div className="max-w-3xl w-full z-10 px-4 py-8">
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-[#111827]/80 rounded-lg p-4 mb-8 border border-blue-900/30"
        >
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              Para mais informações ou em caso de demora no envio dos seus tokens 💰, entre em contato conosco por
              e-mail <Mail className="h-4 w-4 inline mx-1" />
              <Link href="mailto:contato@anires.org" className="text-blue-400 hover:underline">
                contato@anires.org
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-purple-400">Reivindicar Tokens</h1>
          <p className="text-gray-300">Complete as etapas abaixo para reivindicar seus tokens $ANIRES</p>
        </motion.div>

        <LazyAirdropClaim onWalletUpdate={handleWalletUpdate}>
          {/* Display wallet connector directly on the page for easier access */}
          <div className="mt-8 p-6 bg-[#0f0f1a] rounded-lg border border-purple-900/30">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Conectar Carteira</h2>
            <p className="text-gray-300 mb-4">Conecte sua carteira para verificar se você é elegível para o airdrop.</p>
            <WalletConnector
              onConnect={(address, type) => handleWalletUpdate(address, true)}
              onDisconnect={() => handleWalletUpdate(null, false)}
            />
          </div>
        </LazyAirdropClaim>
      </div>

      <Toaster />
      <PerformanceToggle />
    </main>
  )
}

