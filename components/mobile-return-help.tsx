// Modificar o componente MobileReturnHelp para que ele só apareça
// quando acessado pelo navegador embutido do MetaMask

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

export default function MobileReturnHelp() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Verificar se estamos no navegador embutido do MetaMask
    const isMetaMaskBrowser =
      typeof window !== "undefined" && /MetaMaskMobile/i.test(navigator.userAgent) && window.location.pathname === "/" // Apenas na página inicial

    setIsVisible(isMetaMaskBrowser)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-yellow-500/30 p-4 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-yellow-400 font-bold text-lg mb-2">Como retornar ao app</h3>
          <p className="text-white/90 text-sm">
            Você foi redirecionado para completar uma tarefa. Para retornar ao app após concluí-la:
          </p>
          <ul className="text-white/80 text-sm mt-2 space-y-1 list-disc list-inside">
            <li>Complete a tarefa no aplicativo que foi aberto</li>
            <li>Feche o aplicativo ou use o botão voltar do seu dispositivo</li>
            <li>Se estiver usando o navegador, volte para esta aba</li>
          </ul>
          <p className="text-white/90 text-sm mt-2">
            Após retornar, sua tarefa será marcada como concluída automaticamente.
          </p>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-white/70 hover:text-white p-1" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}

