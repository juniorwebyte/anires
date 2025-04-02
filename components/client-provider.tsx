"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Function to simulate wallet connection
  const handleConnectWallet = () => {
    // Wallet connection simulation
    setIsWalletConnected(true)
    setWalletAddress("0x1234567890abcdef1234567890abcdef12345678")
  }

  return (
    <>
      <Navbar
        onConnectClick={handleConnectWallet}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
      />
      <main className="pt-16">{children}</main>
    </>
  )
}

