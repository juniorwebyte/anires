"use client"

import { useEffect, useState } from "react"
import { Shield, ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SecurityBadge() {
  const [isSecure, setIsSecure] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSecurity = async () => {
      try {
        setIsLoading(true)

        // Fazer uma solicitação à API de verificação de segurança
        const response = await fetch("/api/security/verify-site")
        const data = await response.json()

        setIsSecure(data.isSecure)
      } catch (error) {
        console.error("Erro ao verificar segurança:", error)
        setIsSecure(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkSecurity()
  }, [])

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-900/80 text-white p-2 rounded-full shadow-lg">
        <Shield className="h-5 w-5 text-gray-400 animate-pulse" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`fixed bottom-4 right-4 ${isSecure ? "bg-green-900/80" : "bg-red-900/80"} text-white p-2 rounded-full shadow-lg cursor-pointer`}
          >
            {isSecure ? (
              <ShieldCheck className="h-5 w-5 text-green-300" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-red-300" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          {isSecure ? (
            <div>
              <p className="font-bold text-green-500">Site Seguro</p>
              <p className="text-sm">Este site é oficial e seguro do AniRes.</p>
            </div>
          ) : (
            <div>
              <p className="font-bold text-red-500">Alerta de Segurança</p>
              <p className="text-sm">
                Este site pode não ser seguro. Verifique o URL e certifique-se de estar em https://anires.org
              </p>
              <a
                href="https://anires.org"
                className="text-xs flex items-center mt-1 text-blue-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ir para o site oficial <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

