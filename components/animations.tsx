"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { useInView } from "framer-motion"

// Componente para animar elementos quando entram na viewport
export const FadeInWhenVisible = ({
  children,
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  direction = null, // "up", "down", "left", "right", "scale"
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold })

  // Configurar variantes com base na direção
  const initial = { opacity: 0 }
  if (direction === "up") initial.y = 50
  if (direction === "down") initial.y = -50
  if (direction === "left") initial.x = 50
  if (direction === "right") initial.x = -50
  if (direction === "scale") initial.scale = 0.8

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : initial}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Botão animado com efeitos de hover e tap
export const AnimatedButton = ({ children, className, onClick, ...props }) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Texto com gradiente animado
export const GradientText = ({ children, className, colors = ["#FF0080", "#7928CA", "#0070F3"] }) => {
  return (
    <motion.h1
      className={`bg-clip-text text-transparent bg-gradient-to-r ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
        backgroundSize: "200% auto",
      }}
      animate={{
        backgroundPosition: ["0% center", "200% center", "0% center"],
      }}
      transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {children}
    </motion.h1>
  )
}

// Partículas flutuantes
export const FloatingParticles = ({ count = 20, colors = ["#FFFFFF"] }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      })
    }
    setParticles(newParticles)
  }, [count, colors])

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
            y: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0.2, 0.8, 0.4, 0.7, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </>
  )
}

