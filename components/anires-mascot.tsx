"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface AniresMascotProps {
  variant?: "default" | "dancing" | "flying" | "moon" | "rocket" | "random"
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

export default function AniresMascot({
  variant = "default",
  size = "md",
  showText = false,
  className = "",
}: AniresMascotProps) {
  const [currentVariant, setCurrentVariant] = useState(variant)
  const [randomPhrase, setRandomPhrase] = useState("")

  // Size mapping
  const sizeMap = {
    sm: { width: 80, height: 80 },
    md: { width: 120, height: 120 },
    lg: { width: 180, height: 180 },
    xl: { width: 240, height: 240 },
  }

  // Funny phrases the mascot can say
  const phrases = [
    "To the moon! 🚀",
    "HODL tight, amigos!",
    "1 ANIRES = 1 ANIRES",
    "Who needs Bitcoin when you have a donkey?",
    "Elon who? I'm the real crypto influencer!",
    "Diamond hooves! 💎",
    "Not financial advice... or is it?",
    "Burrrrrrr to the moon!",
    "Astral donkey incoming!",
    "This isn't even my final form!",
    "Meme magic is real!",
    "Lambo? I prefer a golden carrot!",
    "Reject humanity, return to donkey",
    "Such donkey, much wow!",
    "NFTs? I prefer BFFs (Best Farm Friends)",
    "I'm not stubborn, I'm committed to the HODL!",
    "Crypto winter? I've got a warm coat!",
    "Buy the dip... of carrots!",
    "When moon? When stars align!",
    "Feeling astrological today!",
  ]

  // Set random variant if "random" is selected
  useEffect(() => {
    if (variant === "random") {
      const variants = ["default", "dancing", "flying", "moon", "rocket"]
      const randomIndex = Math.floor(Math.random() * variants.length)
      setCurrentVariant(variants[randomIndex] as any)
    } else {
      setCurrentVariant(variant)
    }

    // Set random phrase
    const randomIndex = Math.floor(Math.random() * phrases.length)
    setRandomPhrase(phrases[randomIndex])
  }, [variant])

  // Animation variants
  const animations = {
    default: {
      animate: {
        y: [0, -10, 0],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    },
    dancing: {
      animate: {
        rotate: [-5, 5, -5],
        scale: [1, 1.05, 1],
        transition: {
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    },
    flying: {
      animate: {
        y: [0, -15, 0],
        x: [0, 10, 0, -10, 0],
        rotate: [0, 5, 0, -5, 0],
        transition: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    },
    moon: {
      animate: {
        scale: [1, 1.1, 1],
        filter: [
          "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
          "drop-shadow(0 0 16px rgba(255, 255, 255, 0.8))",
          "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
        ],
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      },
    },
    rocket: {
      animate: {
        y: [0, -20],
        scale: [1, 0.8],
        opacity: [1, 0],
        transition: {
          duration: 1,
          ease: "easeOut",
        },
      },
      exit: {
        y: [0, -20],
        scale: [1, 0.8],
        opacity: [1, 0],
        transition: {
          duration: 0.5,
        },
      },
    },
  }

  // Render different mascot variants
  const renderMascot = () => {
    switch (currentVariant) {
      case "default":
        return (
          <motion.div className={`relative ${className}`} variants={animations.default} animate="animate">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascote.jpg-gQe3rOJGHCTIOITM0ffjL4dxDyvaen.jpeg"
              alt="Anires Mascot"
              width={sizeMap[size].width}
              height={sizeMap[size].height}
              className="rounded-full"
            />
          </motion.div>
        )

      case "dancing":
        return (
          <motion.div className={`relative ${className}`} variants={animations.dancing} animate="animate">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascote.jpg-gQe3rOJGHCTIOITM0ffjL4dxDyvaen.jpeg"
              alt="Dancing Anires Mascot"
              width={sizeMap[size].width}
              height={sizeMap[size].height}
              className="rounded-full"
            />
            {/* Party hat */}
            <motion.div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-purple-500"></div>
            </motion.div>
            {/* Music notes */}
            <motion.div
              className="absolute -top-5 -right-5"
              animate={{
                y: [-5, -15, -5],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            >
              <span className="text-xl text-yellow-400">♪</span>
            </motion.div>
            <motion.div
              className="absolute -top-8 -right-2"
              animate={{
                y: [-5, -15, -5],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-xl text-yellow-400">♫</span>
            </motion.div>
          </motion.div>
        )

      case "flying":
        return (
          <motion.div className={`relative ${className}`} variants={animations.flying} animate="animate">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascote.jpg-gQe3rOJGHCTIOITM0ffjL4dxDyvaen.jpeg"
              alt="Flying Anires Mascot"
              width={sizeMap[size].width}
              height={sizeMap[size].height}
              className="rounded-full"
            />
            {/* Cape */}
            <motion.div
              className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-[80%] h-[40px] bg-gradient-to-b from-red-500 to-red-600 rounded-b-full z-[-1]"
              animate={{
                scaleX: [1, 1.1, 1],
                scaleY: [1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            {/* Wind effect */}
            <motion.div
              className="absolute top-1/2 -left-10 transform -translate-y-1/2"
              animate={{
                x: [-5, -15, -5],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-lg text-blue-300">〰️</span>
            </motion.div>
          </motion.div>
        )

      case "moon":
        return (
          <motion.div className={`relative ${className}`} variants={animations.moon} animate="animate">
            {/* Moon background */}
            <div className="absolute inset-0 rounded-full bg-gray-800 transform scale-90 z-[-1]"></div>
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-200/20 z-[-1]"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />

            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascote.jpg-gQe3rOJGHCTIOITM0ffjL4dxDyvaen.jpeg"
              alt="Moon Anires Mascot"
              width={sizeMap[size].width}
              height={sizeMap[size].height}
              className="rounded-full"
            />

            {/* Stars around */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-300 text-xs"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              >
                ✦
              </motion.div>
            ))}

            {/* Flag */}
            <motion.div
              className="absolute -top-10 right-0"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="w-5 h-12 bg-gray-700 rounded-sm"></div>
              <div className="absolute top-0 left-5 w-10 h-6 bg-purple-600 rounded-sm"></div>
            </motion.div>
          </motion.div>
        )

      case "rocket":
        return (
          <AnimatePresence>
            <motion.div
              className={`relative ${className}`}
              variants={animations.rocket}
              animate="animate"
              exit="exit"
              onAnimationComplete={() => {
                // Reset after animation completes
                setTimeout(() => {
                  setCurrentVariant("default")
                }, 500)
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascote.jpg-gQe3rOJGHCTIOITM0ffjL4dxDyvaen.jpeg"
                alt="Rocket Anires Mascot"
                width={sizeMap[size].width}
                height={sizeMap[size].height}
                className="rounded-full"
              />

              {/* Rocket flames */}
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{
                  height: [20, 40, 20],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="w-12 h-12 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 rounded-b-full"></div>
              </motion.div>

              {/* Smoke particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gray-300/80"
                  style={{
                    left: `calc(50% + ${Math.random() * 20 - 10}px)`,
                  }}
                  animate={{
                    y: [0, 30],
                    x: [Math.random() * 10 - 5, Math.random() * 30 - 15],
                    opacity: [0.8, 0],
                    scale: [1, 2],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )

      default:
        return (
          <motion.div
            className={`relative ${className}`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascote.jpg-gQe3rOJGHCTIOITM0ffjL4dxDyvaen.jpeg"
              alt="Anires Mascot"
              width={sizeMap[size].width}
              height={sizeMap[size].height}
              className="rounded-full"
            />
          </motion.div>
        )
    }
  }

  return (
    <div className="relative inline-block">
      {renderMascot()}

      {/* Speech bubble with random phrase */}
      {showText && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm max-w-[200px] z-10"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative">
            {randomPhrase}
            {/* Triangle pointer */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

