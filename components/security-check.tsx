"use client"

import { useEffect, useState } from "react"
import { Shield, AlertTriangle, Lock, Unlock } from "lucide-react"
import { motion } from "framer-motion"

export default function SecurityCheck() {
  const [isSecure, setIsSecure] = useState(true)
  const [domainStatus, setDomainStatus] = useState<"official" | "unofficial" | "unknown">("unknown")
  const [isVisible, setIsVisible] = useState(false)
  const [showMemeMessage, setShowMemeMessage] = useState(false)

  // Mensagens de meme para segurança
  const securityMemes = [
    "Seu burro está seguro! Nenhum predador digital detectado! 🐴🔒",
    "Segurança verificada! Seus zurros estão protegidos! 🔐",
    "Conexão segura! Nem mesmo um hacker burro conseguiria entrar! 🛡️",
    "Site oficial confirmado! Não é um burro falso! ✅",
    "Segurança em dia! Seus tokens de burro estão a salvo! 💰",
  ]

  // Mensagens de meme para insegurança
  const insecurityMemes = [
    "ALERTA! Este site é tão falso quanto um burro com chifres! 🦄",
    "PERIGO! Site não oficial detectado! Até um burro perceberia! 🚨",
    "CUIDADO! Este não é o Anires oficial! É um burro disfarçado! 🎭",
    "ATENÇÃO! Site suspeito! Nem um burro cairia nessa! 🕵️",
    "ALERTA MÁXIMO! Site falso detectado! Proteja seus zurros! 🔥",
  ]

  const [memeMessage, setMemeMessage] = useState("")

  useEffect(() => {
    // Verificar se estamos em um domínio oficial
    const trustedDomains = ["anires.com", "www.anires.com", "airdrop.anires.com", "localhost", "vercel.app"]
    const currentDomain = window.location.hostname
    const isOfficial = trustedDomains.some((domain) => currentDomain === domain || currentDomain.endsWith(`.${domain}`))

    setDomainStatus(isOfficial ? "official" : "unofficial")
    setIsSecure(isOfficial)

    // Selecionar mensagem de meme com base na segurança
    const messages = isOfficial ? securityMemes : insecurityMemes
    setMemeMessage(messages[Math.floor(Math.random() * messages.length)])

    // Mostrar o componente após um pequeno delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    // Mostrar mensagem de meme após outro delay
    const memeTimer = setTimeout(() => {
      setShowMemeMessage(true)

      // Esconder a mensagem de meme após alguns segundos
      setTimeout(() => {
        setShowMemeMessage(false)
      }, 5000)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(memeTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-lg shadow-lg ${
        isSecure ? "bg-green-900/90" : "bg-red-900/90"
      } backdrop-blur-sm border ${isSecure ? "border-green-600" : "border-red-600"} p-3 max-w-md w-full`}
    >
      <div className="flex items-center">
        {isSecure ? (
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            <Shield className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
          </motion.div>
        ) : (
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 0.5,
            }}
          >
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
          </motion.div>
        )}
        <div className="flex-1">
          {isSecure ? (
            <p className="text-sm text-green-200">Conexão segura verificada. Você está no site oficial do Anires.</p>
          ) : (
            <div>
              <p className="text-sm font-bold text-red-200">Alerta de Segurança</p>
              <p className="text-xs text-red-300 mt-1">
                Detectamos um problema de segurança. Este não é o domínio oficial do Anires Coin!
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className={`ml-2 text-xs px-2 py-1 rounded ${
            isSecure ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"
          } hover:opacity-80`}
        >
          Fechar
        </button>
      </div>

      {/* Mensagem de meme */}
      {showMemeMessage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 pt-2 border-t border-dashed"
        >
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="mr-2"
            >
              {isSecure ? <Lock className="h-4 w-4 text-green-300" /> : <Unlock className="h-4 w-4 text-red-300" />}
            </motion.div>
            <p className={`text-xs italic ${isSecure ? "text-green-200" : "text-red-200"}`}>{memeMessage}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

