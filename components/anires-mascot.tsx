"use client"

import { motion } from "framer-motion"
import Image from "next/image"

type MascotVariant = "default" | "dancing" | "flying" | "moon" | "rocket"
type MascotSize = "sm" | "md" | "lg" | "xl"

interface AniresMascotProps {
  variant?: MascotVariant
  size?: MascotSize
  className?: string
}

export default function AniresMascot({ variant = "default", size = "md", className = "" }: AniresMascotProps) {
  // Definir tamanhos
  const sizeMap = {
    sm: { width: 60, height: 60 },
    md: { width: 80, height: 80 },
    lg: { width: 120, height: 120 },
    xl: { width: 160, height: 160 },
  }

  // Definir animações com base na variante
  const getAnimationProps = () => {
    switch (variant) {
      case "dancing":
        return {
          animate: {
            rotate: [0, 5, -5, 0],
            y: [0, -5, 0],
          },
          transition: {
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "flying":
        return {
          animate: {
            y: [0, -10, 0],
            x: [0, 5, -5, 0],
            rotate: [0, 5, -5, 0],
          },
          transition: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "moon":
        return {
          animate: {
            scale: [1, 1.1, 1],
            filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"],
          },
          transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
      case "rocket":
        return {
          animate: {
            y: [0, -10, -5, -15, -10, -20, -15, -25, -20, -30],
            rotate: [0, 2, -2, 3, -3, 2, -2, 1, -1, 0],
            scale: [1, 1.1, 1.05, 1.15, 1.1, 1.2, 1.15, 1.25, 1.2, 1.3],
          },
          transition: {
            duration: 2,
            ease: "easeOut",
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1],
          },
        }
      default:
        return {
          animate: {
            scale: [1, 1.03, 1],
          },
          transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }
    }
  }

  // Obter a imagem correta com base na variante
  const getMascotImage = () => {
    switch (variant) {
      case "flying":
        return "/burro-astral-2.png"
      case "dancing":
        return "/burro-astral-3.png"
      case "moon":
        return "/burro-astral-4.png"
      case "rocket":
        return "/burro-astral-5.png"
      default:
        return "/burro-astral-1.png"
    }
  }

  const { animate, transition } = getAnimationProps()
  const { width, height } = sizeMap[size]

  return (
    <motion.div className={`relative ${className}`} animate={animate} transition={transition} style={{ width, height }}>
      <Image
        src={getMascotImage() || "/placeholder.svg"}
        alt="Anires Mascot"
        width={width}
        height={height}
        className="object-contain"
      />
    </motion.div>
  )
}

