"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"
import AniresMascot from "@/components/anires-mascot"

interface SurpriseButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  surpriseType?: "confetti" | "meme" | "mascot" | "random"
  surpriseChance?: number // 0-1, chance of triggering surprise
}

export default function SurpriseButton({
  children,
  className = "",
  onClick,
  surpriseType = "random",
  surpriseChance = 0.3,
}: SurpriseButtonProps) {
  const [hasTriggered, setHasTriggered] = useState(false)
  const [currentSurpriseType, setCurrentSurpriseType] = useState(surpriseType)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotVariant, setMascotVariant] = useState<"default" | "dancing" | "flying" | "moon" | "rocket">("default")
  const { toast } = useToast()

  // Meme phrases
  const memePhrases = [
    "Você encontrou um burro selvagem!",
    "Parabéns! Você ganhou um zurro digital!",
    "Burro surpresa ativado!",
    "Você desbloqueou o modo burro secreto!",
    "Um burro apareceu do nada!",
    "Burro astral detectado!",
    "Você foi abençoado pelo burro da sorte!",
    "Burro meme te escolheu!",
    "Você ganhou na loteria dos burros!",
    "Burro surpresa diz: HODL!",
  ]

  // Set random surprise type if "random" is selected
  useEffect(() => {
    if (surpriseType === "random") {
      const types = ["confetti", "meme", "mascot"]
      const randomIndex = Math.floor(Math.random() * types.length)
      setCurrentSurpriseType(types[randomIndex] as any)
    } else {
      setCurrentSurpriseType(surpriseType)
    }
  }, [surpriseType])

  const handleClick = () => {
    // Call original onClick if provided
    if (onClick) onClick()

    // Check if surprise should be triggered
    if (!hasTriggered && Math.random() < surpriseChance) {
      triggerSurprise()
      setHasTriggered(true)

      // Reset after some time
      setTimeout(() => {
        setHasTriggered(false)
        setShowMascot(false)
      }, 5000)
    }
  }

  const triggerSurprise = () => {
    switch (currentSurpriseType) {
      case "confetti":
        // Launch confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#8b5cf6", "#6366f1", "#3b82f6", "#10b981", "#f59e0b"],
        })
        break

      case "meme":
        // Show meme toast
        const randomIndex = Math.floor(Math.random() * memePhrases.length)

        toast({
          title: "🎉 Surpresa! 🎉",
          description: memePhrases[randomIndex],
          className: "bg-gradient-to-r from-purple-600 to-pink-600 border-yellow-400 border-2",
        })
        break

      case "mascot":
        // Show mascot
        setShowMascot(true)

        // Select random mascot variant
        const variants: ("default" | "dancing" | "flying" | "moon" | "rocket")[] = [
          "dancing",
          "flying",
          "moon",
          "rocket",
        ]
        const randomVariantIndex = Math.floor(Math.random() * variants.length)
        setMascotVariant(variants[randomVariantIndex])
        break
    }
  }

  return (
    <div className="relative">
      {/* Mascot */}
      <AnimatePresence>
        {showMascot && (
          <motion.div
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <AniresMascot variant={mascotVariant} size="md" showText={true} />
          </motion.div>
        )}
      </AnimatePresence>

      <Button onClick={handleClick} className={className}>
        {children}
      </Button>
    </div>
  )
}

