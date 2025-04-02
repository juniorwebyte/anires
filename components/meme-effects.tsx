"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

type MemeEffectsProps = {
  children: React.ReactNode
  type?: "explosion" | "rainbow" | "matrix" | "earthquake" | "random" | "burroRain" | "colorCycle" | "glitch" | "disco"
  trigger?: "click" | "hover" | "auto"
  duration?: number
}

const MemeEffects = ({ children, type = "random", trigger = "click", duration = 3000 }: MemeEffectsProps) => {
  const [isActive, setIsActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const matrixRef = useRef<HTMLCanvasElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Efeito para limpar o timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Função para ativar o efeito
  const activateEffect = () => {
    if (isActive) return

    setIsActive(true)

    // Determinar qual efeito usar
    const effectToUse = type === "random" ? getRandomEffect() : type

    // Executar o efeito
    switch (effectToUse) {
      case "explosion":
        triggerExplosion()
        break
      case "rainbow":
        triggerRainbow()
        break
      case "matrix":
        triggerMatrix()
        break
      case "earthquake":
        triggerEarthquake()
        break
      case "burroRain":
        triggerBurroRain()
        break
      case "colorCycle":
        triggerColorCycle()
        break
      case "glitch":
        triggerGlitch()
        break
      case "disco":
        triggerDisco()
        break
      default:
        triggerExplosion()
    }

    // Desativar o efeito após a duração especificada
    timeoutRef.current = setTimeout(() => {
      setIsActive(false)
    }, duration)
  }

  // Função para obter um efeito aleatório
  const getRandomEffect = () => {
    const effects = ["explosion", "rainbow", "matrix", "earthquake", "burroRain", "colorCycle", "glitch", "disco"]
    return effects[Math.floor(Math.random() * effects.length)] as MemeEffectsProps["type"]
  }

  // Efeito de explosão
  const triggerExplosion = () => {
    if (typeof window === "undefined") return

    // Usar canvas-confetti para criar uma explosão de partículas
    const options = {
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#8A2BE2", "#1E90FF", "#FFD700", "#FF4500", "#32CD32"],
    }

    confetti(options)

    // Segunda explosão com atraso
    setTimeout(() => {
      confetti({
        ...options,
        origin: { y: 0.7, x: 0.3 },
      })
    }, 300)

    // Terceira explosão com atraso
    setTimeout(() => {
      confetti({
        ...options,
        origin: { y: 0.7, x: 0.7 },
      })
    }, 600)
  }

  // Efeito de arco-íris
  const triggerRainbow = () => {
    if (typeof window === "undefined" || !containerRef.current) return

    // Criar um overlay de arco-íris que se move
    const overlay = document.createElement("div")
    overlay.className = "fixed inset-0 pointer-events-none z-50 rainbow-overlay"
    overlay.style.background = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)"
    overlay.style.opacity = "0.3"
    overlay.style.animation = "rainbow-move 3s ease-in-out"

    document.body.appendChild(overlay)

    // Remover o overlay após a animação
    setTimeout(() => {
      overlay.remove()
    }, duration)
  }

  // Efeito Matrix
  const triggerMatrix = () => {
    if (typeof window === "undefined" || !matrixRef.current) return

    const canvas = matrixRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar o canvas para cobrir toda a tela
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.display = "block"

    // Caracteres para o efeito matrix
    const characters =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"
    const fontSize = 16
    const columns = canvas.width / fontSize

    // Array para controlar a posição Y de cada coluna
    const drops: number[] = []
    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    // Função para desenhar o efeito matrix
    const drawMatrix = () => {
      // Fundo semi-transparente para criar o efeito de desvanecimento
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Cor e fonte para os caracteres
      ctx.fillStyle = "#0F0"
      ctx.font = `${fontSize}px monospace`

      // Loop através de cada coluna
      for (let i = 0; i < drops.length; i++) {
        // Escolher um caractere aleatório
        const text = characters.charAt(Math.floor(Math.random() * characters.length))

        // Desenhar o caractere
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        // Incrementar a posição Y
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    // Iniciar a animação
    const matrixInterval = setInterval(drawMatrix, 33)

    // Limpar a animação após a duração
    setTimeout(() => {
      clearInterval(matrixInterval)
      canvas.style.display = "none"
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }, duration)
  }

  // Efeito de terremoto
  const triggerEarthquake = () => {
    if (typeof window === "undefined" || !containerRef.current) return

    // Adicionar classe de terremoto ao body
    document.body.classList.add("earthquake-effect")

    // Remover a classe após a duração
    setTimeout(() => {
      document.body.classList.remove("earthquake-effect")
    }, duration)
  }

  // Efeito de chuva de burros
  const triggerBurroRain = () => {
    if (typeof window === "undefined" || !containerRef.current) return

    const container = document.createElement("div")
    container.className = "fixed inset-0 pointer-events-none z-50 overflow-hidden"
    document.body.appendChild(container)

    // Criar vários burros caindo
    const burroCount = 15
    const burroImages = [
      "/burro-astral-1.png",
      "/burro-astral-2.png",
      "/burro-astral-3.png",
      "/burro-astral-4.png",
      "/burro-astral-5.png",
      "/jumento.png",
    ]

    for (let i = 0; i < burroCount; i++) {
      const burro = document.createElement("img")
      const randomImage = burroImages[Math.floor(Math.random() * burroImages.length)]
      burro.src = randomImage || "/burro-astral-1.png" // Fallback
      burro.className = "absolute burro-falling"
      burro.style.width = `${Math.random() * 50 + 50}px`
      burro.style.left = `${Math.random() * 100}vw`
      burro.style.top = `-100px`
      burro.style.animationDuration = `${Math.random() * 3 + 2}s`
      burro.style.animationDelay = `${Math.random() * 2}s`

      container.appendChild(burro)
    }

    // Remover o container após a duração
    setTimeout(() => {
      container.remove()
    }, duration + 2000) // Adicionar tempo extra para as animações terminarem
  }

  // Efeito de ciclo de cores
  const triggerColorCycle = () => {
    if (typeof window === "undefined" || !containerRef.current) return

    // Adicionar classe de ciclo de cores ao body
    document.body.classList.add("color-cycle-effect")

    // Remover a classe após a duração
    setTimeout(() => {
      document.body.classList.remove("color-cycle-effect")
    }, duration)
  }

  // Efeito de glitch
  const triggerGlitch = () => {
    if (typeof window === "undefined" || !containerRef.current) return

    // Adicionar classe de glitch ao body
    document.body.classList.add("glitch-effect")

    // Criar elementos de glitch
    const glitchContainer = document.createElement("div")
    glitchContainer.className = "fixed inset-0 pointer-events-none z-50 glitch-container"
    document.body.appendChild(glitchContainer)

    for (let i = 0; i < 10; i++) {
      const glitchElement = document.createElement("div")
      glitchElement.className = "glitch-element"
      glitchElement.style.top = `${Math.random() * 100}%`
      glitchElement.style.left = `${Math.random() * 100}%`
      glitchElement.style.width = `${Math.random() * 300 + 50}px`
      glitchElement.style.height = `${Math.random() * 20 + 5}px`
      glitchElement.style.animationDelay = `${Math.random() * 2}s`
      glitchContainer.appendChild(glitchElement)
    }

    // Remover os elementos após a duração
    setTimeout(() => {
      document.body.classList.remove("glitch-effect")
      glitchContainer.remove()
    }, duration)
  }

  // Efeito de discoteca
  const triggerDisco = () => {
    if (typeof window === "undefined" || !containerRef.current) return

    // Criar um overlay de discoteca
    const discoContainer = document.createElement("div")
    discoContainer.className = "fixed inset-0 pointer-events-none z-50 disco-container"
    document.body.appendChild(discoContainer)

    // Criar luzes de discoteca
    for (let i = 0; i < 20; i++) {
      const discoLight = document.createElement("div")
      discoLight.className = "disco-light"
      discoLight.style.top = `${Math.random() * 100}%`
      discoLight.style.left = `${Math.random() * 100}%`
      discoLight.style.width = `${Math.random() * 100 + 50}px`
      discoLight.style.height = `${Math.random() * 100 + 50}px`
      discoLight.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`
      discoLight.style.animationDuration = `${Math.random() * 2 + 1}s`
      discoLight.style.animationDelay = `${Math.random() * 1}s`
      discoContainer.appendChild(discoLight)
    }

    // Remover o container após a duração
    setTimeout(() => {
      discoContainer.remove()
    }, duration)
  }

  // Configurar os handlers de eventos com base no trigger
  const eventHandlers = {
    onClick: trigger === "click" ? activateEffect : undefined,
    onMouseEnter: trigger === "hover" ? activateEffect : undefined,
  }

  // Efeito para ativar automaticamente se o trigger for "auto"
  useEffect(() => {
    if (trigger === "auto") {
      activateEffect()
    }
  }, [trigger])

  return (
    <div ref={containerRef} {...eventHandlers} className="relative">
      {children}

      {/* Canvas para efeitos de confete */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ display: "none" }} />

      {/* Canvas para efeito matrix */}
      <canvas ref={matrixRef} className="fixed inset-0 pointer-events-none z-50" style={{ display: "none" }} />

      {/* Elementos para efeitos visuais */}
      <AnimatePresence>
        {isActive && type === "explosion" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 bg-yellow-500 rounded-full blur-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MemeEffects

