"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import AniresMascot from "@/components/anires-mascot"
import { useToast } from "@/components/ui/use-toast"
import { Sparkles, Rocket, TrendingUp, ChevronsUp, Laugh } from "lucide-react"

interface CryptoMemeCardProps {
  title: string
  description?: string
  image?: string
  price?: string
  change?: string
  positive?: boolean
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function CryptoMemeCard({
  title,
  description,
  image,
  price,
  change,
  positive = true,
  children,
  className = "",
  onClick,
}: CryptoMemeCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotVariant, setMascotVariant] = useState<"default" | "dancing" | "flying" | "moon" | "rocket">("default")
  const [clickCount, setClickCount] = useState(0)
  const { toast } = useToast()

  // Meme phrases
  const memePhrases = [
    "To the moon! 🚀",
    "HODL tight, amigos!",
    "1 ANIRES = 1 ANIRES",
    "Who needs Bitcoin when you have a donkey?",
    "Diamond hooves! 💎",
    "Burrrrrrr to the moon!",
    "Astral donkey incoming!",
    "Such donkey, much wow!",
    "Buy the dip... of carrots!",
    "When moon? When stars align!",
  ]

  // Handle hover state
  const handleMouseEnter = () => {
    setIsHovered(true)

    // Random chance to show mascot
    if (Math.random() > 0.5) {
      setShowMascot(true)

      // Select random mascot variant
      const variants: ("default" | "dancing" | "flying" | "moon" | "rocket")[] = [
        "default",
        "dancing",
        "flying",
        "moon",
        "rocket",
      ]
      const randomIndex = Math.floor(Math.random() * variants.length)
      setMascotVariant(variants[randomIndex])
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowMascot(false)
  }

  // Handle card click
  const handleClick = () => {
    setClickCount((prev) => prev + 1)

    // Easter egg: After 3 clicks, show special toast
    if (clickCount >= 2) {
      const randomIndex = Math.floor(Math.random() * memePhrases.length)

      toast({
        title: "🐴 Anires diz:",
        description: memePhrases[randomIndex],
        className: "bg-gradient-to-r from-purple-600 to-blue-600 border-purple-400",
      })

      // Reset click count
      setClickCount(0)
    }

    // Call onClick prop if provided
    if (onClick) onClick()
  }

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
      }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
    >
      <Card className="border-purple-800/30 bg-black/40 backdrop-blur-sm overflow-hidden">
        {/* Mascot */}
        <AnimatePresence>
          {showMascot && (
            <motion.div
              className="absolute -top-16 right-4 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AniresMascot variant={mascotVariant} size="md" showText={true} />
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {title}
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.span>
              )}
            </span>

            {price && <span className="text-sm font-normal text-gray-400">{price}</span>}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {image && (
            <div className="relative w-full h-40 mb-4 overflow-hidden rounded-lg">
              <img
                src={image || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
              />

              {/* Overlay effect on hover */}
              {isHovered && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          )}

          {description && <p className="text-gray-400 text-sm">{description}</p>}

          {children}
        </CardContent>

        {change && (
          <CardFooter className="pt-0">
            <div className={`flex items-center gap-1 text-sm ${positive ? "text-green-500" : "text-red-500"}`}>
              {positive ? (
                <>
                  <TrendingUp className="h-4 w-4" />
                  <span>{change}</span>

                  {/* Animated rocket on hover for positive change */}
                  {isHovered && positive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Rocket className="h-4 w-4 ml-1" />
                      </motion.div>
                    </motion.div>
                  )}
                </>
              ) : (
                <>
                  <ChevronsUp className="h-4 w-4 transform rotate-180" />
                  <span>{change}</span>

                  {/* Animated laugh on hover for negative change */}
                  {isHovered && !positive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Laugh className="h-4 w-4 ml-1" />
                      </motion.div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}

