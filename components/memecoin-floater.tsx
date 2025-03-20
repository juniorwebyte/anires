"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MemecoinFloaterProps {
  enabled?: boolean
  frequency?: number // segundos entre aparições
  duration?: number // segundos de duração da animação
}

type Memecoin = {
  id: number
  emoji: string
  x: number
  y: number
  rotation: number
  scale: number
  delay: number
  duration: number
}

const EMOJIS = ["🐴", "🚀", "🌕", "💰", "💎", "🔥", "💸", "🤑", "🪙", "🏆"]

export default function MemecoinFloater({ enabled = true, frequency = 30, duration = 8 }: MemecoinFloaterProps) {
  const [memecoins, setMemecoins] = useState<Memecoin[]>([])
  const [isActive, setIsActive] = useState(false)

  // Criar uma nova memecoin flutuante
  const createMemecoin = () => {
    const id = Date.now()
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const x = Math.random() * 100 // posição horizontal em porcentagem
    const y = 80 + Math.random() * 20 // posição vertical inicial (parte inferior da tela)
    const rotation = Math.random() * 360
    const scale = 0.8 + Math.random() * 1.2
    const delay = Math.random() * 0.5
    const coinDuration = duration * (0.8 + Math.random() * 0.4) // variação na duração

    return { id, emoji, x, y, rotation, scale, delay, duration: coinDuration }
  }

  // Adicionar uma nova memecoin
  const addMemecoin = () => {
    if (!enabled || !isActive) return

    const newMemecoin = createMemecoin()
    setMemecoins((prev) => [...prev, newMemecoin])

    // Remover a memecoin após a duração da animação
    setTimeout(
      () => {
        setMemecoins((prev) => prev.filter((coin) => coin.id !== newMemecoin.id))
      },
      (newMemecoin.duration + newMemecoin.delay) * 1000,
    )
  }

  // Iniciar o intervalo quando o componente montar
  useEffect(() => {
    if (!enabled) return

    setIsActive(true)

    // Adicionar uma memecoin imediatamente
    addMemecoin()

    // Configurar o intervalo para adicionar memecoins periodicamente
    const interval = setInterval(() => {
      // Adicionar 1-3 memecoins de cada vez
      const count = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        setTimeout(addMemecoin, i * 300) // Espaçar as adições
      }
    }, frequency * 1000)

    return () => {
      clearInterval(interval)
      setIsActive(false)
    }
  }, [enabled, frequency])

  if (!enabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {memecoins.map((coin) => (
          <motion.div
            key={coin.id}
            className="absolute text-2xl md:text-3xl"
            style={{ left: `${coin.x}%` }}
            initial={{
              y: `${coin.y}%`,
              opacity: 0,
              rotate: coin.rotation,
              scale: coin.scale,
            }}
            animate={{
              y: "-20%",
              opacity: [0, 1, 1, 0],
              rotate: coin.rotation + (Math.random() > 0.5 ? 360 : -360),
            }}
            transition={{
              duration: coin.duration,
              delay: coin.delay,
              ease: "easeOut",
            }}
            exit={{ opacity: 0 }}
          >
            {coin.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

