"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface BurroIcon {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  delay: number
  duration: number
  variant: number
}

export default function FloatingBurros() {
  const [burros, setBurros] = useState<BurroIcon[]>([])

  useEffect(() => {
    // Criar ícones de burro aleatórios
    const newBurros: BurroIcon[] = []
    const numBurros = 8 // Número de burros flutuantes

    for (let i = 0; i < numBurros; i++) {
      newBurros.push({
        id: i,
        x: Math.random() * 100, // Posição X em porcentagem
        y: Math.random() * 100, // Posição Y em porcentagem
        size: 30 + Math.random() * 40, // Tamanho entre 30px e 70px
        rotation: Math.random() * 360, // Rotação aleatória
        delay: Math.random() * 5, // Atraso na animação
        duration: 15 + Math.random() * 25, // Duração da animação
        variant: Math.floor(Math.random() * 5), // Variante do ícone (0-4)
      })
    }

    setBurros(newBurros)
  }, [])

  // Variantes de burros (diferentes estilos/cores)
  const burroVariants = [
    "/burro-astral-1.png", // Burro com óculos de sol
    "/burro-astral-2.png", // Burro com chapéu de festa
    "/burro-astral-3.png", // Burro com moedas
    "/burro-astral-4.png", // Burro com foguete
    "/burro-astral-5.png", // Burro com diamantes
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <AnimatePresence>
        {burros.map((burro) => (
          <motion.div
            key={burro.id}
            className="absolute"
            style={{
              left: `${burro.x}%`,
              top: `${burro.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.7, 0.7, 0],
              scale: [0, 1, 1, 0],
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
              rotate: [0, burro.rotation, burro.rotation * 2, burro.rotation * 3],
            }}
            transition={{
              duration: burro.duration,
              delay: burro.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: Math.random() * 10 + 5,
            }}
          >
            <div
              style={{
                width: burro.size,
                height: burro.size,
              }}
              className="relative"
            >
              <Image
                src={burroVariants[burro.variant] || "/placeholder.svg"}
                alt="Burro Astral"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

