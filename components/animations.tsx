"use client"

import { useState } from "react"

import type React from "react"
import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

// Componente para animar a entrada de elementos quando entram no viewport
export const FadeInWhenVisible = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  direction = "up", // "up", "down", "left", "right"
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
}) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Determinar a direção da animação
  const getDirectionVariants = () => {
    switch (direction) {
      case "up":
        return { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } }
      case "down":
        return { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1 } }
      case "left":
        return { hidden: { x: 50, opacity: 0 }, visible: { x: 0, opacity: 1 } }
      case "right":
        return { hidden: { x: -50, opacity: 0 }, visible: { x: 0, opacity: 1 } }
      default:
        return { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1 } }
    }
  }

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={getDirectionVariants()}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Componente para animar texto com efeito de digitação
export const TypewriterText = ({
  text,
  speed = 0.05,
  delay = 0,
  className = "",
}: {
  text: string
  speed?: number
  delay?: number
  className?: string
}) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        transition: {
          delay,
          staggerChildren: speed,
        },
      })
    }
  }, [controls, isInView, delay, speed])

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={controls} className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0 }}
          variants={{
            opacity: 1,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Componente para animar partículas flutuantes
export const FloatingParticles = ({
  count = 20,
  colors = ["#8A2BE2", "#FFD700", "#1E90FF", "#FFFFFF"],
  className = "",
}: {
  count?: number
  colors?: string[]
  className?: string
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          }}
          animate={{
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.3],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            width: `${Math.random() * 10 + 2}px`,
            height: `${Math.random() * 10 + 2}px`,
          }}
        />
      ))}
    </div>
  )
}

// Componente para animar um brilho pulsante
export const PulsingGlow = ({
  children,
  color = "rgba(138, 43, 226, 0.5)",
  intensity = 20,
  duration = 3,
  className = "",
}: {
  children: React.ReactNode
  color?: string
  intensity?: number
  duration?: number
  className?: string
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [`0 0 ${intensity}px ${color}`, `0 0 ${intensity * 1.5}px ${color}`, `0 0 ${intensity}px ${color}`],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}

// Componente para animar um botão com efeito de hover
export const AnimatedButton = ({
  children,
  onClick,
  className = "",
  hoverScale = 1.05,
  tapScale = 0.95,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  hoverScale?: number
  tapScale?: number
}) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{
        scale: hoverScale,
        boxShadow: "0 0 15px rgba(138, 43, 226, 0.7)",
      }}
      whileTap={{ scale: tapScale }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )
}

// Componente para animar um card com efeito de hover 3D
export const AnimatedCard = ({
  children,
  className = "",
  depth = 20,
}: {
  children: React.ReactNode
  className?: string
  depth?: number
}) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateXValue = ((y - centerY) / centerY) * depth * -1
    const rotateYValue = ((x - centerX) / centerX) * depth

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${className} perspective-1000`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setRotateX(0)
        setRotateY(0)
      }}
      animate={{
        rotateX: isHovering ? rotateX : 0,
        rotateY: isHovering ? rotateY : 0,
        boxShadow: isHovering
          ? "0 20px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(138, 43, 226, 0.5)"
          : "0 10px 20px rgba(0, 0, 0, 0.2)",
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// Componente para animar um texto com efeito de gradiente
export const GradientText = ({
  children,
  className = "",
  colors = ["#8A2BE2", "#1E90FF", "#FFD700"],
  duration = 10,
}: {
  children: React.ReactNode
  className?: string
  colors?: string[]
  duration?: number
}) => {
  const gradientString = `linear-gradient(to right, ${colors.join(", ")}, ${colors[0]})`

  return (
    <motion.div
      className={`${className} bg-clip-text text-transparent bg-gradient-to-r inline-block`}
      style={{ backgroundImage: gradientString, backgroundSize: "200% 100%" }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  )
}

