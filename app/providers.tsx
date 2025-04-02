"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { useState, useEffect, createContext, useContext } from "react"
import { Toaster } from "@/components/ui/toaster"

// Contexto simplificado para wallet
type WalletContextType = {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
})

export const useWallet = () => useContext(WalletContext)

// Provider simplificado
function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  // Verificar se já está conectado ao carregar
  useEffect(() => {
    let isMounted = true

    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0 && isMounted) {
            // Use setTimeout to ensure this doesn't happen during rendering
            setTimeout(() => {
              if (isMounted) {
                setAddress(accounts[0])
                setIsConnected(true)
              }
            }, 0)
          }
        } catch (error) {
          console.error("Failed to get accounts:", error)
        }
      }
    }

    checkConnection()

    return () => {
      isMounted = false
    }
  }, [])

  // Lidar com mudanças de conta
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAddress(null)
          setIsConnected(false)
        } else {
          setAddress(accounts[0])
          setIsConnected(true)
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  // Conectar carteira
  const connect = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setAddress(accounts[0])
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to connect:", error)
      }
    } else {
      alert("MetaMask não encontrado! Instale a extensão MetaMask para usar este aplicativo.")
    }
  }

  // Desconectar carteira
  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}

// Declare a interface para window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, listener: (...args: any[]) => void) => void
      removeListener: (event: string, listener: (...args: any[]) => void) => void
    }
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratação com SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <WalletProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </WalletProvider>
  )
}

