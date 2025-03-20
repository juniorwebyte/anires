"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import CryptoQuotes from "./crypto-quotes"

interface MemePageWrapperProps {
  children: React.ReactNode
}

export default function MemePageWrapper({ children }: MemePageWrapperProps) {
  const [showQuote, setShowQuote] = useState(false)

  useEffect(() => {
    // Mostrar citação após um pequeno delay
    const timer = setTimeout(() => {
      setShowQuote(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative">
      {/* Elementos flutuantes aleatórios */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          >
            {["🐴", "🚀", "💰", "💎", "🌕"][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      {/* Conteúdo principal */}
      {children}

      {/* Citação de crypto */}
      {showQuote && <CryptoQuotes />}
    </div>
  )
}

