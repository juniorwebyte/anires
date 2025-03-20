"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AniresMascot from "@/components/anires-mascot"

interface FunnyLoadingProps {
  isLoading: boolean
  text?: string
  variant?: "default" | "crypto" | "astral" | "random"
  showMascot?: boolean
  className?: string
}

export default function FunnyLoading({
  isLoading,
  text = "Carregando...",
  variant = "default",
  showMascot = true,
  className = "",
}: FunnyLoadingProps) {
  const [currentVariant, setCurrentVariant] = useState(variant)
  const [loadingText, setLoadingText] = useState(text)
  const [textIndex, setTextIndex] = useState(0)

  // Funny loading texts
  const funnyTexts = {
    default: [
      "Carregando...",
      "Quase lá...",
      "Só mais um pouquinho...",
      "Estamos chegando...",
      "Paciência é uma virtude...",
    ],
    crypto: [
      "Minerando burros digitais...",
      "Procurando cenouras na blockchain...",
      "Alimentando o burro com bytes...",
      "Verificando o preço do feno digital...",
      "Sincronizando com a rede de zurros...",
    ],
    astral: [
      "Alinhando as estrelas...",
      "Consultando o mapa astral do burro...",
      "Navegando pela Via Láctea...",
      "Buscando sinais astrais...",
      "Preparando o burro para decolar...",
    ],
  }

  // Set random variant if "random" is selected
  useEffect(() => {
    if (variant === "random") {
      const variants = ["default", "crypto", "astral"]
      const randomIndex = Math.floor(Math.random() * variants.length)
      setCurrentVariant(variants[randomIndex] as any)
    } else {
      setCurrentVariant(variant)
    }
  }, [variant])

  // Cycle through funny texts
  useEffect(() => {
    if (!isLoading) return

    const texts = funnyTexts[currentVariant as keyof typeof funnyTexts] || funnyTexts.default

    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length)
      setLoadingText(texts[(textIndex + 1) % texts.length])
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoading, currentVariant, textIndex])

  // Render different loading animations based on variant
  const renderLoadingAnimation = () => {
    switch (currentVariant) {
      case "crypto":
        return (
          <div className="relative">
            <div className="w-10 h-10 border-4 border-t-yellow-500 border-r-yellow-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              💰
            </motion.div>
          </div>
        )

      case "astral":
        return (
          <div className="relative">
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
              animate={{
                boxShadow: [
                  "0 0 10px rgba(139, 92, 246, 0.5)",
                  "0 0 20px rgba(139, 92, 246, 0.8)",
                  "0 0 10px rgba(139, 92, 246, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            </motion.div>
          </div>
        )

      default:
        return (
          <div className="relative">
            <div className="w-10 h-10 border-4 border-t-purple-500 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            {showMascot && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                🐴
              </motion.div>
            )}
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={`flex items-center justify-center gap-4 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderLoadingAnimation()}

          <motion.p
            className="text-purple-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={loadingText} // Key changes trigger animation
          >
            {loadingText}
          </motion.p>

          {showMascot && currentVariant !== "default" && (
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
              <AniresMascot variant={currentVariant === "crypto" ? "dancing" : "flying"} size="sm" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

