"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { LanguageProvider } from "@/lib/i18n/language-context"

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Função para simular a conexão da carteira
  const handleConnectWallet = () => {
    // Simulação de conexão de carteira
    setIsWalletConnected(true)
    setWalletAddress("0x1234567890abcdef1234567890abcdef12345678")
  }

  return (
    <LanguageProvider>
      <Navbar
        onConnectClick={handleConnectWallet}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
      />
      <main className="pt-16">{children}</main>
    </LanguageProvider>
  )
}

