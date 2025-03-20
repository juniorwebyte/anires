"use client"

import { useState, useEffect } from "react"
import AirdropClaim from "@/components/airdrop-claim"

interface LazyAirdropClaimProps {
  onWalletUpdate: (address: string | null, connected: boolean) => void
}

export default function LazyAirdropClaim({ onWalletUpdate }: LazyAirdropClaimProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return <AirdropClaim onWalletUpdate={onWalletUpdate} />
}

