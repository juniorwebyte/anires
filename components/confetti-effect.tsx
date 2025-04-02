"use client"

import type React from "react"

import { useEffect } from "react"

interface ConfettiEffectProps {
  duration?: number
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ duration = 5000 }) => {
  useEffect(() => {
    const showConfetti = async () => {
      if (typeof window !== "undefined") {
        try {
          const confetti = (await import("canvas-confetti")).default

          const animationEnd = Date.now() + duration
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

          const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min
          }

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
              return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            // Confetes à esquerda e à direita
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })

            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
          }, 250)

          // Limpar o intervalo quando o componente for desmontado
          return () => clearInterval(interval)
        } catch (error) {
          console.error("Erro ao carregar confetti:", error)
        }
      }
    }

    showConfetti()
  }, [duration])

  return null // Este componente não renderiza nada visualmente
}

export default ConfettiEffect

