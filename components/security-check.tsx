"use client"

import { useEffect, useState } from "react"
import { verifyDomain, verifySecureConnection, checkPhishingStatus } from "@/lib/security-utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

export default function SecurityCheck() {
  const [isSecure, setIsSecure] = useState<boolean | null>(null)
  const [securityIssues, setSecurityIssues] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Função para verificar a segurança do site
    const checkSecurity = async () => {
      try {
        setIsLoading(true)
        const issues: string[] = []

        // Verificar se o domínio é confiável
        const isDomainValid = verifyDomain()
        if (!isDomainValid) {
          issues.push("Você está acessando um domínio não oficial do AniRes. Verifique o URL.")
        }

        // Verificar se a conexão é segura (HTTPS)
        const isConnectionSecure = verifySecureConnection()
        if (!isConnectionSecure) {
          issues.push("Sua conexão não é segura. Certifique-se de usar HTTPS.")
        }

        // Verificar se o site está em uma lista de phishing
        const isNotPhishing = await checkPhishingStatus()
        if (!isNotPhishing) {
          issues.push("Este site pode ser uma tentativa de phishing.")
        }

        // Verificar se há scripts maliciosos
        try {
          // Implementação simplificada - em produção, seria mais complexo
          const hasNoMaliciousScripts = document.querySelectorAll('script[src*="suspicious"]').length === 0
          if (!hasNoMaliciousScripts) {
            issues.push("Foram detectados scripts potencialmente maliciosos.")
          }
        } catch (error) {
          console.error("Erro ao verificar scripts:", error)
        }

        // Definir o estado de segurança com base nas verificações
        setSecurityIssues(issues)
        setIsSecure(issues.length === 0)
      } catch (error) {
        console.error("Erro ao verificar segurança:", error)
        setSecurityIssues(["Ocorreu um erro ao verificar a segurança do site."])
        setIsSecure(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Executar verificação de segurança
    checkSecurity()

    // Limpar efeito
    return () => {
      // Nada a limpar neste caso
    }
  }, [])

  // Não renderizar nada se ainda estiver carregando
  if (isLoading) {
    return null
  }

  // Não mostrar nada se o site for seguro
  if (isSecure) {
    return null
  }

  // Mostrar alerta se houver problemas de segurança
  return (
    <Alert variant="destructive" className="mb-4 border-red-800 bg-red-950/50">
      <ShieldAlert className="h-5 w-5" />
      <AlertTitle className="text-red-300">Alerta de Segurança</AlertTitle>
      <AlertDescription className="text-red-200">
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {securityIssues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
        <p className="mt-2">
          Para sua segurança, acesse apenas o site oficial:{" "}
          <a
            href="https://anires.org"
            className="font-bold underline text-red-300 hover:text-red-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://anires.org
          </a>
        </p>
      </AlertDescription>
    </Alert>
  )
}

