"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function BurroQuotes() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentQuote, setCurrentQuote] = useState("")

  const burroQuotes = [
    "Zurrar para a lua é o novo uivar! 🐴🌕",
    "HODL como um burro teimoso! 💎🙌",
    "Não é teimosia, é convicção! 🧠",
    "Burros astutos compram na baixa! 📉",
    "Quem tem burro tem tesouro! 💰",
    "Até um burro sabe que isso vai subir! 📈",
    "Burro que sou, comprei mais no topo! 🤦‍♂️",
    "Meu portfólio zurra de dor! 😭",
    "Burros juntos, fortes! 💪",
    "Não é um bear market, é uma promoção de burros! 🛒",
  ]

  useEffect(() => {
    // Mostrar citações aleatórias periodicamente
    const interval = setInterval(() => {
      // 20% de chance de mostrar uma citação
      if (Math.random() < 0.2 && !isVisible) {
        const randomQuote = burroQuotes[Math.floor(Math.random() * burroQuotes.length)]
        setCurrentQuote(randomQuote)
        setIsVisible(true)

        // Esconder após alguns segundos
        setTimeout(() => {
          setIsVisible(false)
        }, 5000)
      }
    }, 30000) // Verificar a cada 30 segundos

    return () => clearInterval(interval)
  }, [isVisible])

  // Posição aleatória na tela
  const position = {
    x: 20 + Math.random() * 60, // Entre 20% e 80% da largura
    y: 20 + Math.random() * 60, // Entre 20% e 80% da altura
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed z-50 bg-purple-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-purple-500/50 shadow-lg max-w-xs"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium">{currentQuote}</p>
          <div className="flex justify-center mt-2">
            <motion.button
              className="text-xs text-purple-300 hover:text-purple-100"
              onClick={() => setIsVisible(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Fechar
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

