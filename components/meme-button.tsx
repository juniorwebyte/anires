"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AniresMascot from "@/components/anires-mascot"

interface MemeButtonProps {
  variant?: "meme" | "astral" | "rainbow" | "rocket" | "random"
  onClick?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  showMascot?: boolean
  mascotVariant?: "default" | "dancing" | "flying" | "moon" | "rocket" | "random"
  memeText?: string[]
}

export default function MemeButton({
  variant = "meme",
  onClick,
  children,
  className = "",
  disabled = false,
  showMascot = false,
  mascotVariant = "default",
  memeText = [],
}: MemeButtonProps) {
  const [currentVariant, setCurrentVariant] = useState(variant)
  const [isHovered, setIsHovered] = useState(false)
  const [showText, setShowText] = useState(false)
  const [currentText, setCurrentText] = useState("")

  // Set random variant if "random" is selected
  useEffect(() => {
    if (variant === "random") {
      const variants = ["meme", "astral", "rainbow", "rocket"]
      const randomIndex = Math.floor(Math.random() * variants.length)
      setCurrentVariant(variants[randomIndex] as any)
    } else {
      setCurrentVariant(variant)
    }
  }, [variant])

  // Handle hover state
  const handleMouseEnter = () => {
    setIsHovered(true)

    // Show random meme text if provided
    if (memeText.length > 0) {
      const randomIndex = Math.floor(Math.random() * memeText.length)
      setCurrentText(memeText[randomIndex])
      setShowText(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowText(false)
  }

  // Get button styles based on variant
  const getButtonStyles = () => {
    switch (currentVariant) {
      case "meme":
        return "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:from-purple-600/30 hover:to-pink-600/30"
      case "astral":
        return "bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border-indigo-500/30 hover:from-indigo-600/30 hover:to-blue-600/30"
      case "rainbow":
        return "bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 border-yellow-500/30 hover:from-red-500/30 hover:via-yellow-500/30 hover:to-green-500/30"
      case "rocket":
        return "bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30 hover:from-orange-600/30 hover:to-red-600/30"
      default:
        return "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:from-purple-600/30 hover:to-pink-600/30"
    }
  }

  return (
    <div className="relative">
      {/* Meme text bubble */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm max-w-[200px] z-10"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              {currentText}
              {/* Triangle pointer */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`relative flex items-center justify-center px-4 py-2 rounded-lg border ${getButtonStyles()} ${className}`}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Button content */}
        <div className="relative z-10">{children}</div>

        {/* Mascot */}
        {showMascot && isHovered && (
          <motion.div
            className="absolute -top-12 right-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <AniresMascot variant={mascotVariant} size="sm" />
          </motion.div>
        )}

        {/* Background effects */}
        {currentVariant === "rainbow" && isHovered && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10 z-0"
            animate={{
              background: [
                "linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(234, 179, 8, 0.1), rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
                "linear-gradient(to right, rgba(168, 85, 247, 0.1), rgba(239, 68, 68, 0.1), rgba(234, 179, 8, 0.1), rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))",
                "linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(239, 68, 68, 0.1), rgba(234, 179, 8, 0.1), rgba(34, 197, 94, 0.1))",
                "linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(239, 68, 68, 0.1), rgba(234, 179, 8, 0.1))",
                "linear-gradient(to right, rgba(234, 179, 8, 0.1), rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(239, 68, 68, 0.1))",
              ],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        )}

        {currentVariant === "rocket" && isHovered && (
          <>
            {/* Rocket flames */}
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-0"
              animate={{
                height: [10, 20, 10],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="w-8 h-8 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-b-full"></div>
            </motion.div>

            {/* Button shake */}
            <motion.div
              className="absolute inset-0 z-0"
              animate={{ x: [-1, 1, -1] }}
              transition={{ duration: 0.1, repeat: Number.POSITIVE_INFINITY }}
            />
          </>
        )}
      </motion.button>
    </div>
  )
}

