"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ChevronDown, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { TransactionGuard } from "@/components/security/transaction-guard"

type WalletType = "metamask" | "walletconnect" | "coinbase"

interface WalletInfo {
  type: WalletType
  name: string
  icon: React.ReactNode
  installed: boolean
}

// Atualizar a interface para incluir a função de desconexão opcional
interface WalletConnectorProps {
  onConnect: (address: string, walletType: WalletType) => void
  onDisconnect?: () => void
}

// Memoizar os ícones SVG para evitar re-renderizações
const MetaMaskIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32.9582 1L19.8241 10.7183L22.2665 5.09082L32.9582 1Z"
      fill="#E17726"
      stroke="#E17726"
      strokeWidth="0.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.04858 1L15.0707 10.809L12.7423 5.09082L2.04858 1Z"
      fill="#E27625"
      stroke="#E27625"
      strokeWidth="0.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M28.2292 23.5334L24.7545 28.8644L32.2677 30.8961L34.4333 23.6523L28.2292 23.5334Z"
      fill="#E27625"
      stroke="#E27625"
      strokeWidth="0.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.5834 23.6523L2.73709 30.8961L10.2502 28.8644L6.78357 23.5334L0.5834 23.6523Z"
      fill="#E27625"
      stroke="#E27625"
      strokeWidth="0.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.86646 14.6777L7.77295 17.8058L15.2023 18.1437L14.9709 10.1072L9.86646 14.6777Z"
      fill="#E27625"
      stroke="#E27625"
      strokeWidth="0.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.1411 14.6775L19.9607 10.0178L19.8242 18.1435L27.2536 17.8056L25.1411 14.6775Z"
      fill="#E27625"
      stroke="#E27625"
      strokeWidth="0.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.2502 28.8639L14.7545 26.7113L10.8969 23.7031L10.2502 28.8639Z"
      fill="#E27625"
      stroke="#E27625"
      strokeWidth="0.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.2539 26.7113L24.7543 28.8639L24.1115 23.7031L20.2539 26.7113Z"
      fill="#E27625"
      stroke="#E27625"
      strokeWidth="0.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const WalletConnectIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.58818 11.8556C13.1293 8.31442 18.8706 8.31442 22.4117 11.8556L22.8379 12.2818C23.015 12.4589 23.015 12.7459 22.8379 12.9229L21.3801 14.3808C21.2915 14.4693 21.148 14.4693 21.0595 14.3808L20.473 13.7943C18.0026 11.3239 13.9973 11.3239 11.5269 13.7943L10.8989 14.4223C10.8104 14.5109 10.6669 14.5109 10.5783 14.4223L9.12053 12.9646C8.94349 12.7875 8.94349 12.5005 9.12053 12.3235L9.58818 11.8556ZM25.4268 14.8706L26.7243 16.1682C26.9013 16.3452 26.9013 16.6323 26.7243 16.8093L20.8737 22.6599C20.6967 22.8369 20.4097 22.8369 20.2326 22.6599L16.2641 18.6914C16.2198 18.6471 16.1481 18.6471 16.1038 18.6914L12.1353 22.6599C11.9583 22.8369 11.6713 22.8369 11.4942 22.6599L5.6756 16.8413C5.49856 16.6643 5.49856 16.3773 5.6756 16.2002L6.97316 14.9027C7.15021 14.7256 7.43725 14.7256 7.61429 14.9027L11.5828 18.8712C11.6271 18.9155 11.6988 18.9155 11.7431 18.8712L15.7116 14.9027C15.8886 14.7256 16.1757 14.7256 16.3527 14.9027L20.3212 18.8712C20.3655 18.9155 20.4372 18.9155 20.4815 18.8712L24.45 14.9027C24.627 14.7256 24.9141 14.7256 25.0911 14.9027L25.4268 14.8706Z"
      fill="#3B99FC"
    />
  </svg>
)

const CoinbaseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 0C6.268 0 0 6.268 0 14C0 21.732 6.268 28 14 28C21.732 28 28 21.732 28 14C28 6.268 21.732 0 14 0Z"
      fill="#0052FF"
    />
    <path
      d="M14.2534 19.5832C11.5223 19.5832 9.30566 17.3666 9.30566 14.6354C9.30566 11.9043 11.5223 9.68774 14.2534 9.68774C16.6559 9.68774 18.6765 11.4351 19.0942 13.7266H23.6277C23.1748 9.02208 19.1294 5.33887 14.2534 5.33887C9.12208 5.33887 4.95679 9.50417 4.95679 14.6354C4.95679 19.7667 9.12208 23.932 14.2534 23.932C19.1294 23.932 23.1748 20.2488 23.6277 15.5443H19.0942C18.6765 17.8358 16.6559 19.5832 14.2534 19.5832Z"
      fill="white"
    />
  </svg>
)

export default function WalletConnector({ onConnect, onDisconnect }: WalletConnectorProps) {
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)
  const [wallets, setWallets] = useState<WalletInfo[]>([
    {
      type: "metamask",
      name: "MetaMask",
      icon: <MetaMaskIcon />,
      installed: false,
    },
    {
      type: "walletconnect",
      name: "WalletConnect",
      icon: <WalletConnectIcon />,
      installed: false,
    },
    {
      type: "coinbase",
      name: "Coinbase Wallet",
      icon: <CoinbaseIcon />,
      installed: false,
    },
  ])

  // Check for installed wallets - usar useCallback para evitar recriação da função
  useEffect(() => {
    const checkWallets = async () => {
      const updatedWallets = [...wallets]

      // Check for MetaMask
      if (typeof window !== "undefined" && window.ethereum) {
        const isMetaMask = window.ethereum.isMetaMask
        if (isMetaMask) {
          updatedWallets[0].installed = true
        }
      }

      // For demo purposes, we'll just assume the others are not installed
      // In a real app, you would check for WalletConnect and Coinbase Wallet

      setWallets(updatedWallets)
    }

    checkWallets()
  }, [])

  // Verificar se o site está em uma lista de phishing
  const checkPhishingStatus = useCallback(async () => {
    try {
      // Em um ambiente real, você consultaria uma API de verificação de phishing
      // Aqui estamos apenas simulando uma verificação bem-sucedida
      return true
    } catch (error) {
      console.error("Erro ao verificar status de phishing:", error)
      return false
    }
  }, [])

  // Verificar se o domínio é seguro
  const verifyDomain = useCallback(() => {
    const trustedDomains = [
      "anires.org",
      "www.anires.org",
      "airdrop.anires.org",
      "localhost",
      "vercel.app",
    ]

    const currentDomain = window.location.hostname
    return trustedDomains.some((domain) => currentDomain === domain || currentDomain.endsWith(`.${domain}`))
  }, [])

  // Verificar se o contrato é seguro
  const verifyContract = useCallback(async () => {
    // Endereço do contrato do AniRes
    const contractAddress = "0xA5F0A72A780F69BC6a476Cc6a37E533C2A046434" // Substitua pelo endereço real

    try {
      // Em um ambiente real, você verificaria se o contrato está verificado no Etherscan/BSCScan
      // e se não há problemas de segurança conhecidos

      // Simulação de verificação bem-sucedida
      return {
        verified: true,
        securityIssues: [],
        message: "Contrato verificado e seguro",
      }
    } catch (error) {
      console.error("Erro ao verificar contrato:", error)
      return {
        verified: false,
        securityIssues: ["Não foi possível verificar o contrato"],
        message: "Falha na verificação do contrato",
      }
    }
  }, [])

  // Usar useCallback para evitar recriação da função em cada renderização
  const connectWallet = useCallback(
    async (walletType: WalletType) => {
      setSelectedWallet(walletType)
      setIsConnecting(true)

      try {
        // Verificar segurança antes de conectar
        const isNotPhishing = await checkPhishingStatus()
        const isDomainVerified = verifyDomain()
        const contractVerification = await verifyContract()

        if (!isNotPhishing || !isDomainVerified || !contractVerification.verified) {
          throw new Error("Verificação de segurança falhou. Por favor, verifique se você está no site oficial.")
        }

        let address = ""

        if (walletType === "metamask") {
          if (typeof window.ethereum !== "undefined") {
            // Adicionar verificação EIP-2255 (permissões)
            const permissions = await window.ethereum
              .request({
                method: "wallet_requestPermissions",
                params: [{ eth_accounts: {} }],
              })
              .catch(() => {
                // Se o wallet não suportar EIP-2255, continue com o método padrão
                return null
              })

            // Solicitar contas
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
            address = accounts[0]

            // Verificar chainId para garantir que estamos na rede correta
            const chainId = await window.ethereum.request({ method: "eth_chainId" })
            // BSC Mainnet: 0x38, BSC Testnet: 0x61
            const supportedChains = ["0x38", "0x61", "0x1", "0x5"] // BSC + Ethereum para testes

            if (!supportedChains.includes(chainId)) {
              toast({
                title: "Rede incorreta",
                description: "Por favor, conecte-se à Binance Smart Chain para continuar",
                variant: "destructive",
              })
            }

            // Subscribe to account changes
            // Adicionar função para desconectar no evento accountsChanged
            window.ethereum.on("accountsChanged", (accounts: string[]) => {
              if (accounts.length === 0) {
                // User disconnected
                toast({
                  title: "Carteira desconectada",
                  description: "Sua carteira foi desconectada.",
                  variant: "destructive",
                })
                // Notificar o componente pai sobre a desconexão
                if (typeof onDisconnect === "function") {
                  onDisconnect()
                }
              } else {
                // Account changed
                onConnect(accounts[0], walletType)
              }
            })

            // Monitorar alterações de rede
            window.ethereum.on("chainChanged", (chainId: string) => {
              const supportedChains = ["0x38", "0x61", "0x1", "0x5"] // BSC + Ethereum para testes
              if (!supportedChains.includes(chainId)) {
                toast({
                  title: "Rede incorreta",
                  description: "Por favor, conecte-se à Binance Smart Chain para continuar",
                  variant: "destructive",
                })
              } else {
                toast({
                  title: "Rede alterada",
                  description: "Você está conectado à rede correta",
                  className: "bg-green-950 border-green-800 text-green-100",
                })
              }
            })
          } else {
            throw new Error("MetaMask não encontrado. Por favor, instale a extensão MetaMask.")
          }
        } else if (walletType === "walletconnect") {
          // Simulate WalletConnect
          await new Promise((resolve) => setTimeout(resolve, 1500))
          address = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7" // Simulated address
        } else if (walletType === "coinbase") {
          // Simulate Coinbase Wallet
          await new Promise((resolve) => setTimeout(resolve, 1500))
          address = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" // Simulated address
        }

        if (address) {
          onConnect(address, walletType)

          toast({
            title: "Carteira conectada",
            description: `Conectado com sucesso à carteira ${getWalletName(walletType)}`,
            variant: "default",
            className: "bg-green-950 border-green-800 text-green-100",
          })
        }
      } catch (error) {
        console.error("Erro ao conectar carteira:", error)

        toast({
          title: "Erro ao conectar",
          description: error instanceof Error ? error.message : "Erro ao conectar carteira",
          variant: "destructive",
          action: <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>,
        })
      } finally {
        setIsConnecting(false)
      }
    },
    [onConnect, onDisconnect, toast, checkPhishingStatus, verifyDomain, verifyContract],
  )

  const getWalletName = (type: WalletType): string => {
    const wallet = wallets.find((w) => w.type === type)
    return wallet ? wallet.name : "Desconhecida"
  }

  return (
    <TransactionGuard transactionType="connect">
      <Card className="border-purple-800/30 bg-black/40 backdrop-blur-sm shadow-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-purple-400">Conecte sua Carteira</h3>
              <div className="flex items-center text-green-400 text-xs">
                <Shield className="h-4 w-4 mr-1" />
                <span>Conexão Segura</span>
              </div>
            </div>

            <p className="text-gray-400 text-center text-sm">
              Escolha um dos provedores de carteira abaixo para continuar
            </p>

            <div className="grid gap-3">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.type}
                  variant="outline"
                  className="flex justify-between items-center w-full py-5 border-purple-800/20 bg-black/40 hover:bg-purple-900/20 hover:border-purple-600/30 transition-all duration-300 group"
                  onClick={() => connectWallet(wallet.type)}
                  disabled={isConnecting && selectedWallet !== wallet.type}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center">
                      {wallet.icon}
                    </div>
                    <span className="font-medium group-hover:text-purple-300 transition-colors">{wallet.name}</span>
                    {wallet.installed && (
                      <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded-full">Instalado</span>
                    )}
                  </div>

                  {isConnecting && selectedWallet === wallet.type ? (
                    <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  )}
                </Button>
              ))}
            </div>

            <div className="text-center text-xs text-gray-500 pt-2">
              Ao conectar sua carteira, você concorda com os{" "}
              <a href="/termos-de-servico" className="text-purple-400 hover:text-purple-300">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="/politica-de-privacidade" className="text-purple-400 hover:text-purple-300">
                Política de Privacidade
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </TransactionGuard>
  )
}

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: any) => void
    }
  }
}

