"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Loading component to show while AirdropClaim is loading
const LoadingComponent = () => (
  <div className="w-full space-y-6">
    <div className="h-64 w-full animate-pulse bg-purple-900/20 rounded-lg"></div>
    <div className="h-96 w-full animate-pulse bg-purple-900/20 rounded-lg"></div>
  </div>
)

interface LazyAirdropClaimProps {
  onWalletUpdate?: (address: string | null, connected: boolean) => void
}

// Dynamically import AirdropClaim with ssr: false
const AirdropClaim = dynamic(() => import("@/components/airdrop-claim"), {
  loading: () => <LoadingComponent />,
  ssr: false,
})

export default function LazyAirdropClaim({ onWalletUpdate }: LazyAirdropClaimProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is only rendered client-side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <LoadingComponent />
  }

  return <AirdropClaim onWalletUpdate={onWalletUpdate} />
}

