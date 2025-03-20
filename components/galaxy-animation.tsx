"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { usePerformanceMode } from "@/hooks/use-performance-mode"
import AniresMascot from "@/components/anires-mascot"

interface GalaxyAnimationProps {
  className?: string
  starCount?: number
  nebulaCount?: number
  planetCount?: number
  shootingStarCount?: number
  constellationCount?: number
  zodiacCount?: number
  showMascots?: boolean
  mascotCount?: number
}

export default function GalaxyAnimation({
  className = "",
  starCount = 100,
  nebulaCount = 5,
  planetCount = 3,
  shootingStarCount = 5,
  constellationCount = 3,
  zodiacCount = 6,
  showMascots = true,
  mascotCount = 3,
}: GalaxyAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isLowPerformanceMode } = usePerformanceMode()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Adjust counts based on performance mode
  const adjustedStarCount = isLowPerformanceMode ? Math.floor(starCount / 3) : starCount
  const adjustedNebulaCount = isLowPerformanceMode ? 0 : nebulaCount
  const adjustedPlanetCount = isLowPerformanceMode ? 0 : planetCount
  const adjustedShootingStarCount = isLowPerformanceMode ? 0 : shootingStarCount
  const adjustedConstellationCount = isLowPerformanceMode ? 0 : constellationCount
  const adjustedZodiacCount = isLowPerformanceMode ? 0 : zodiacCount
  const adjustedMascotCount = isLowPerformanceMode ? 0 : mascotCount

  // Update dimensions on resize
  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    // Initial dimensions
    updateDimensions()

    // Add resize listener
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Generate stars
  const stars = Array.from({ length: adjustedStarCount }).map((_, i) => {
    const size = Math.random() * 2 + 1
    const opacity = Math.random() * 0.7 + 0.3
    const animationDuration = Math.random() * 3 + 2
    const delay = Math.random() * 5

    return (
      <motion.div
        key={`star-${i}`}
        className="star"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [opacity, opacity * 1.5, opacity],
        }}
        transition={{
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          delay,
        }}
      />
    )
  })

  // Generate nebulae
  const nebulae = Array.from({ length: adjustedNebulaCount }).map((_, i) => {
    const size = Math.random() * 150 + 50
    const hue = Math.floor(Math.random() * 360)
    const opacity = Math.random() * 0.3 + 0.1

    return (
      <motion.div
        key={`nebula-${i}`}
        className="nebula"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `hsla(${hue}, 70%, 60%, ${opacity})`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [opacity, opacity * 1.2, opacity],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    )
  })

  // Generate planets
  const planets = Array.from({ length: adjustedPlanetCount }).map((_, i) => {
    const size = Math.random() * 30 + 10
    const hue = Math.floor(Math.random() * 360)

    return (
      <motion.div
        key={`planet-${i}`}
        className="planet"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `hsl(${hue}, 70%, 50%)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 100,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    )
  })

  // Generate shooting stars
  const shootingStars = Array.from({ length: adjustedShootingStarCount }).map((_, i) => {
    const top = Math.random() * 100
    const left = Math.random() * 100
    const angle = Math.random() * 45 - 45 // -45 to 0 degrees (down-right)
    const delay = Math.random() * 10
    const duration = Math.random() * 2 + 1

    return (
      <motion.div
        key={`shooting-star-${i}`}
        className="shooting-star"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          transform: `rotate(${angle}deg)`,
        }}
        animate={{
          opacity: [0, 1, 0],
          left: [`${left}%`, `${left + 20}%`],
          top: [`${top}%`, `${top + 20}%`],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: delay,
        }}
      />
    )
  })

  // Generate constellations
  const constellations = Array.from({ length: adjustedConstellationCount }).map((_, i) => {
    const centerX = Math.random() * 80 + 10 // 10% to 90%
    const centerY = Math.random() * 80 + 10 // 10% to 90%
    const points = Math.floor(Math.random() * 5) + 3 // 3 to 7 points

    // Generate constellation points
    const constellationPoints = Array.from({ length: points }).map((_, j) => {
      const angle = (j / points) * Math.PI * 2
      const distance = Math.random() * 50 + 20
      const x = centerX + ((Math.cos(angle) * distance) / dimensions.width) * 100
      const y = centerY + ((Math.sin(angle) * distance) / dimensions.height) * 100

      return { x, y }
    })

    // Generate constellation lines
    const constellationLines = constellationPoints.map((point, j) => {
      const nextPoint = constellationPoints[(j + 1) % points]
      const dx = nextPoint.x - point.x
      const dy = nextPoint.y - point.y
      const length = (Math.sqrt(dx * dx + dy * dy) * dimensions.width) / 100
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI

      return (
        <motion.div
          key={`constellation-line-${i}-${j}`}
          className="constellation-line"
          style={{
            width: `${length}px`,
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: `rotate(${angle}deg)`,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: j * 0.2,
          }}
        />
      )
    })

    // Generate constellation stars
    const constellationStars = constellationPoints.map((point, j) => {
      return (
        <motion.div
          key={`constellation-star-${i}-${j}`}
          className="constellation-star"
          style={{
            width: "3px",
            height: "3px",
            left: `${point.x}%`,
            top: `${point.y}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: j * 0.3,
          }}
        />
      )
    })

    return (
      <div key={`constellation-${i}`} className="constellation">
        {constellationLines}
        {constellationStars}
      </div>
    )
  })

  // Generate zodiac symbols
  const zodiacSymbols = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"]
  const zodiacElements = Array.from({ length: adjustedZodiacCount }).map((_, i) => {
    const symbol = zodiacSymbols[i % zodiacSymbols.length]

    return (
      <motion.div
        key={`zodiac-${i}`}
        className="zodiac-symbol"
        style={{
          left: `${Math.random() * 80 + 10}%`,
          top: `${Math.random() * 80 + 10}%`,
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          delay: i * 0.5,
        }}
      >
        {symbol}
      </motion.div>
    )
  })

  // Generate astral circles
  const astralCircles = Array.from({ length: 3 }).map((_, i) => {
    const size = (i + 1) * 20

    return (
      <motion.div
        key={`astral-circle-${i}`}
        className="astral-circle"
        style={{
          width: `${size}%`,
          height: `${size}%`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: {
            duration: 100 + i * 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
          scale: {
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
        }}
      />
    )
  })

  // Generate floating mascots
  const mascots = showMascots
    ? Array.from({ length: adjustedMascotCount }).map((_, i) => {
        const variants: ("default" | "dancing" | "flying" | "moon")[] = ["default", "dancing", "flying", "moon"]
        const variant = variants[i % variants.length]
        const size: ("sm" | "md")[] = ["sm", "md"]
        const mascotSize = size[Math.floor(Math.random() * size.length)]

        return (
          <motion.div
            key={`mascot-${i}`}
            style={{
              position: "absolute",
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              zIndex: 10,
            }}
            animate={{
              x: [0, Math.random() * 30 - 15, 0],
              y: [0, Math.random() * 30 - 15, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <AniresMascot variant={variant} size={mascotSize} />
          </motion.div>
        )
      })
    : []

  // Add meme elements - floating emojis
  const memeEmojis = ["🚀", "💎", "🌕", "🔥", "💰", "🤣", "👑", "✨"]
  const floatingEmojis = Array.from({ length: 8 }).map((_, i) => {
    const emoji = memeEmojis[i % memeEmojis.length]

    return (
      <motion.div
        key={`emoji-${i}`}
        style={{
          position: "absolute",
          left: `${Math.random() * 80 + 10}%`,
          top: `${Math.random() * 80 + 10}%`,
          fontSize: `${Math.random() * 20 + 10}px`,
          opacity: 0.5,
          zIndex: 5,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          y: {
            duration: Math.random() * 5 + 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
          rotate: {
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
          opacity: {
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
        }}
      >
        {emoji}
      </motion.div>
    )
  })

  return (
    <div ref={containerRef} className={`stars-container ${isLowPerformanceMode ? "low-perf-mode" : ""} ${className}`}>
      {stars}
      {nebulae}
      {planets}
      {shootingStars}
      {constellations}
      {zodiacElements}
      {astralCircles}
      {mascots}
      {floatingEmojis}
    </div>
  )
}

