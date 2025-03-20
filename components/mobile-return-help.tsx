"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Smartphone, X } from "lucide-react"
import { motion } from "framer-motion"
import { isMobileDevice } from "@/lib/utils"

export default function MobileReturnHelp() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Verificar se é um dispositivo móvel
    const mobile = isMobileDevice()
    setIsMobile(mobile)

    // Mostrar apenas em dispositivos móveis e apenas na primeira visita
    if (mobile) {
      const hasSeenHelp = localStorage.getItem("hasSeenMobileReturnHelp")
      if (!hasSeenHelp) {
        setIsVisible(true)
        localStorage.setItem("hasSeenMobileReturnHelp", "true")
      }
    }
  }, [])

  // Se não for dispositivo móvel, não renderizar nada
  if (!isMobile) return null

  // Se o usuário já fechou, não mostrar
  if (!isVisible) return null

  return (
    <motion.div
      className="fixed bottom-4 left-0 right-0 z-50 px-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-blue-800/30 bg-black/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm text-blue-400 flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            Dica para dispositivos móveis
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <p className="text-xs text-gray-300 mb-2">
            Ao clicar nos links de redes sociais, você será redirecionado para os aplicativos correspondentes.
          </p>
          <div className="bg-blue-900/20 p-2 rounded-md text-xs text-blue-200 flex items-start">
            <ArrowLeft className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              Após completar a tarefa, use o botão <strong>voltar</strong> do seu dispositivo ou feche o aplicativo e
              retorne a esta página para continuar o airdrop.
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

