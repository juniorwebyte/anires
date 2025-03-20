"use client"

import type React from "react"
import CryptoPriceTicker from "@/components/crypto-price-ticker"
import CryptoFacts from "@/components/crypto-facts"
import MemecoinFloater from "@/components/memecoin-floater"

export default function MemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* StandaloneMemePopup removido para evitar popups duplicados */}
      <CryptoPriceTicker />
      <CryptoFacts />
      <MemecoinFloater enabled={true} frequency={60} duration={8} />
    </>
  )
}

