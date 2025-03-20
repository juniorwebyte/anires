"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertTriangle, Shield, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TransactionGuardProps {
  children: React.ReactNode
  walletAddress?: string
  transactionType?: "connect" | "sign" | "send" | "approve"
}

export function TransactionGuard({ children, walletAddress, transactionType = "connect" }: TransactionGuardProps) {
  const [securityChecks, setSecurityChecks] = useState({
    domainVerified: false,
    connectionSecure: false,
    phishingProtection: false,
    contractVerified: false,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSecure, setIsSecure] = useState(false)

  useEffect(() => {
    // Simular verificações de segurança
    const runSecurityChecks = async () => {
      setIsLoading(true)

      // Verificar se estamos no domínio correto
      const isDomainCorrect =
        window.location.hostname === "streetdogcoin.com" ||
        window.location.hostname === "www.streetdogcoin.com" ||
        window.location.hostname === "airdrop.streetdogcoin.com" ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname === "localhost"

      // Verificar se a conexão é segura (HTTPS)
      const isConnectionSecure = window.location.protocol === "https:" || window.location.hostname === "localhost"

      // Verificar proteção contra phishing
      const hasPhishingProtection = true // Implementação real verificaria listas de phishing

      // Verificar se o contrato é verificado (para transações reais)
      const isContractVerified = true // Implementação real verificaria o contrato no Etherscan

      // Atualizar estado com os resultados
      setSecurityChecks({
        domainVerified: isDomainCorrect,
        connectionSecure: isConnectionSecure,
        phishingProtection: hasPhishingProtection,
        contractVerified: isContractVerified,
      })

      // Definir se é seguro com base em todas as verificações
      const secure = isDomainCorrect && isConnectionSecure && hasPhishingProtection && isContractVerified

      setIsSecure(secure)
      setIsLoading(false)
    }

    runSecurityChecks()
  }, [walletAddress, transactionType])

  // Se estiver carregando, mostrar indicador
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Alert className="bg-blue-900/20 border-blue-800/30">
          <Shield className="h-4 w-4 text-blue-400" />
          <AlertTitle className="text-blue-400">Verificando segurança...</AlertTitle>
          <AlertDescription className="text-blue-300">
            Estamos verificando a segurança desta transação.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    )
  }

  // Se não for seguro, mostrar alerta
  if (!isSecure) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alerta de Segurança</AlertTitle>
          <AlertDescription>
            <p>Detectamos um problema de segurança:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {!securityChecks.domainVerified && <li>Este não é o domínio oficial do Street Dog Coin</li>}
              {!securityChecks.connectionSecure && <li>Esta conexão não é segura (HTTPS)</li>}
              {!securityChecks.phishingProtection && <li>Este site pode estar em listas de phishing</li>}
              {!securityChecks.contractVerified && <li>O contrato inteligente não está verificado</li>}
            </ul>
          </AlertDescription>
        </Alert>
        {children}
      </div>
    )
  }

  // Se for seguro, mostrar confirmação
  return (
    <div className="space-y-4">
      <Alert className="bg-green-900/20 border-green-800/30">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertTitle className="text-green-400">Transação Segura</AlertTitle>
        <AlertDescription className="text-green-300">
          Todas as verificações de segurança foram aprovadas. Esta transação é segura.
        </AlertDescription>
      </Alert>
      {children}
    </div>
  )
}

