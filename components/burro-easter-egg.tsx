// Criar um novo componente para easter eggs adicionais

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import AniresMascot from "@/components/anires-mascot"

interface BurroEasterEggProps {
  triggerChance?: number // Chance de ativar o easter egg (0-1)
  children: React.ReactNode
}

export default function BurroEasterEgg({ triggerChance = 0.05, children }: BurroEasterEggProps) {
  const [isActive, setIsActive] = useState(false)
  const [burroPosition, setBurroPosition] = useState({ x: 0, y: 0 })
  const [burroSize, setBurroSize] = useState("sm")
  const [burroVariant, setBurroVariant] = useState<"default" | "dancing" | "flying">("default")
  const [clickCount, setClickCount] = useState(0)
  const { toast } = useToast()

  // Função para ativar o easter egg
  const activateEasterEgg = () => {
    // Verificar se o easter egg deve ser ativado com base na chance
    if (Math.random() < triggerChance) {
      // Posicionar o burro em um local aleatório na tela
      const x = Math.random() * 80 // 0-80% da largura
      const y = Math.random() * 80 // 0-80% da altura

      // Escolher um tamanho aleatório
      const sizes = ["sm", "md", "lg"] as const
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)]

      // Escolher uma variante aleatória
      const variants = ["default", "dancing", "flying"] as const
      const randomVariant = variants[Math.floor(Math.random() * variants.length)]

      // Definir as propriedades do burro
      setBurroPosition({ x, y })
      setBurroSize(randomSize)
      setBurroVariant(randomVariant)

      // Ativar o easter egg
      setIsActive(true)

      // Desativar após um tempo aleatório entre 3 e 8 segundos
      const timeout = Math.random() * 5000 + 3000
      setTimeout(() => {
        setIsActive(false)
      }, timeout)
    }
  }

  // Função para lidar com cliques no burro
  const handleBurroClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1

      // Mensagens diferentes com base no número de cliques
      if (newCount === 1) {
        toast({
          title: "🐴 Oi!",
          description: "Você encontrou o Burro Astral escondido!",
          className: "bg-purple-900 border-purple-600",
        })
      } else if (newCount === 3) {
        toast({
          title: "🌟 Burro Astral diz:",
          description: "Continue clicando para ganhar uma surpresa!",
          className: "bg-blue-900 border-blue-600",
        })
      } else if (newCount === 5) {
        // Recompensa após 5 cliques
        toast({
          title: "🎁 Parabéns!",
          description: "Você ganhou um Burro Astral de estimação! Ele aparecerá aleatoriamente na página.",
          className: "bg-gradient-to-r from-purple-600 to-blue-600",
        })

        // Aumentar a chance de aparecer
        // Não podemos modificar props diretamente, mas podemos simular isso
        // ativando o easter egg mais frequentemente
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            activateEasterEgg()
          }, i * 10000) // Ativar a cada 10 segundos
        }
      }

      return newCount
    })

    // Esconder o burro após ser clicado
    setIsActive(false)
  }

  // Ativar o easter egg quando o componente for montado
  useEffect(() => {
    // Verificar se deve ativar o easter egg
    activateEasterEgg()

    // Também verificar periodicamente se deve ativar o easter egg
    const interval = setInterval(() => {
      if (!isActive) {
        activateEasterEgg()
      }
    }, 30000) // Verificar a cada 30 segundos

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="relative">
      {children}

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute z-50 cursor-pointer"
            style={{
              top: `${burroPosition.y}%`,
              left: `${burroPosition.x}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={handleBurroClick}
          >
            <div className="relative">
              <AniresMascot variant={burroVariant} size={burroSize as any} />

              {/* Efeito de brilho */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(138, 43, 226, 0)",
                    "0 0 20px rgba(138, 43, 226, 0.7)",
                    "0 0 0 rgba(138, 43, 226, 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

