"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { useToast } from "@/components/ui/use-toast"

// Tipos de efeitos disponíveis
type EffectType = "confetti" | "matrix" | "burro" | "glitch" | "rainbow" | "explosion" | "random"

interface MemeEffectsProps {
  children: React.ReactNode
  type: EffectType
  trigger?: "click" | "hover" | "auto"
  duration?: number
}

export default function MemeEffects({ children, type, trigger = "click", duration = 3000 }: MemeEffectsProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentEffect, setCurrentEffect] = useState<EffectType>(type)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Referência para o contexto do canvas (para efeito matrix)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const matrixCharsRef = useRef<{ x: number; y: number; char: string; speed: number; opacity: number }[]>([])
  const animationFrameRef = useRef<number | null>(null)

  // Referência para burros caindo (para efeito burro)
  const burrosRef = useRef<{ x: number; y: number; size: number; speed: number; rotation: number }[]>([])

  // Para efeito de glitch
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Para efeito de explosão
  const explosionParticlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; size: number; color: string; life: number }[]
  >([])

  // Inicializar o canvas quando o componente montar
  useEffect(() => {
    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext("2d")

      // Ajustar o tamanho do canvas para preencher o container
      const resizeCanvas = () => {
        if (canvasRef.current && containerRef.current) {
          canvasRef.current.width = window.innerWidth
          canvasRef.current.height = window.innerHeight
        }
      }

      resizeCanvas()
      window.addEventListener("resize", resizeCanvas)

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        if (glitchTimeoutRef.current) {
          clearTimeout(glitchTimeoutRef.current)
        }
      }
    }
  }, [])

  // Função para ativar o efeito
  const activateEffect = () => {
    // Se o tipo for aleatório, escolha um efeito aleatório
    if (type === "random") {
      const effects: EffectType[] = ["confetti", "matrix", "burro", "glitch", "rainbow", "explosion"]
      const randomEffect = effects[Math.floor(Math.random() * effects.length)]
      setCurrentEffect(randomEffect)

      toast({
        title: "Efeito ativado! 🎉",
        description: `Efeito "${randomEffect}" ativado!`,
        variant: "default",
      })
    } else {
      setCurrentEffect(type)
    }

    setIsActive(true)

    // Desativar o efeito após a duração especificada
    setTimeout(() => {
      setIsActive(false)
    }, duration)
  }

  // Efeito de confetti
  const runConfettiEffect = () => {
    const end = Date.now() + duration

    const colors = ["#8A2BE2", "#1E90FF", "#FFD700", "#FF6347", "#32CD32"]
    ;(function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }

  // Efeito Matrix
  const initMatrixEffect = () => {
    if (!canvasRef.current || !ctxRef.current) return

    const ctx = ctxRef.current
    const canvas = canvasRef.current

    // Limpar caracteres anteriores
    matrixCharsRef.current = []

    // Criar caracteres iniciais
    const charCount = Math.floor(canvas.width / 20) // Um caractere a cada 20px

    for (let i = 0; i < charCount; i++) {
      matrixCharsRef.current.push({
        x: i * 20,
        y: Math.random() * canvas.height,
        char: String.fromCharCode(0x30a0 + Math.random() * 96),
        speed: 3 + Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.5,
      })
    }

    const drawMatrix = () => {
      if (!ctx || !canvas) return

      // Criar um efeito de rastro
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = "#0F0" // Verde Matrix
      ctx.font = "15px monospace"

      matrixCharsRef.current.forEach((char) => {
        // Desenhar o caractere
        ctx.fillStyle = `rgba(0, 255, 0, ${char.opacity})`
        ctx.fillText(char.char, char.x, char.y)

        // Atualizar posição
        char.y += char.speed

        // Mudar o caractere aleatoriamente
        if (Math.random() > 0.98) {
          char.char = String.fromCharCode(0x30a0 + Math.random() * 96)
        }

        // Resetar quando sair da tela
        if (char.y > canvas.height) {
          char.y = 0
          char.x = Math.random() * canvas.width
          char.speed = 3 + Math.random() * 5
        }
      })

      if (isActive) {
        animationFrameRef.current = requestAnimationFrame(drawMatrix)
      }
    }

    drawMatrix()
  }

  // Efeito Burro (burros caindo)
  const initBurroEffect = () => {
    if (!canvasRef.current || !ctxRef.current) return

    const ctx = ctxRef.current
    const canvas = canvasRef.current

    // Limpar burros anteriores
    burrosRef.current = []

    // Criar burros iniciais
    const burroCount = 20

    for (let i = 0; i < burroCount; i++) {
      burrosRef.current.push({
        x: Math.random() * canvas.width,
        y: -100 - Math.random() * 500, // Começar acima da tela
        size: 30 + Math.random() * 50,
        speed: 2 + Math.random() * 5,
        rotation: Math.random() * 360,
      })
    }

    // Carregar a imagem do burro
    const burroImage = new Image()
    burroImage.src = "/jumento.png"
    burroImage.crossOrigin = "anonymous"

    burroImage.onload = () => {
      const drawBurros = () => {
        if (!ctx || !canvas) return

        // Limpar o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        burrosRef.current.forEach((burro) => {
          // Salvar o estado atual
          ctx.save()

          // Transladar para a posição do burro
          ctx.translate(burro.x, burro.y)

          // Rotacionar
          ctx.rotate((burro.rotation * Math.PI) / 180)

          // Desenhar o burro
          ctx.drawImage(burroImage, -burro.size / 2, -burro.size / 2, burro.size, burro.size)

          // Restaurar o estado
          ctx.restore()

          // Atualizar posição
          burro.y += burro.speed
          burro.rotation += 1

          // Resetar quando sair da tela
          if (burro.y > canvas.height + 100) {
            burro.y = -100
            burro.x = Math.random() * canvas.width
            burro.speed = 2 + Math.random() * 5
          }
        })

        if (isActive) {
          animationFrameRef.current = requestAnimationFrame(drawBurros)
        }
      }

      drawBurros()
    }
  }

  // Efeito Glitch
  const initGlitchEffect = () => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Função para aplicar um efeito de glitch
    const applyGlitch = () => {
      if (!isActive) return

      // Aplicar transformações CSS aleatórias
      const glitchTransform = `
        translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)
        skew(${Math.random() * 10 - 5}deg, ${Math.random() * 10 - 5}deg)
      `

      container.style.transform = glitchTransform

      // Aplicar filtros CSS aleatórios
      if (Math.random() > 0.7) {
        container.style.filter = `
          hue-rotate(${Math.random() * 360}deg)
          saturate(${Math.random() * 5 + 0.5})
          contrast(${Math.random() * 2 + 0.5})
        `
      } else {
        container.style.filter = ""
      }

      // Aplicar cores de fundo aleatórias
      if (Math.random() > 0.9) {
        document.body.style.backgroundColor = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`
      } else {
        document.body.style.backgroundColor = ""
      }

      // Agendar o próximo glitch
      if (isActive) {
        glitchTimeoutRef.current = setTimeout(applyGlitch, Math.random() * 200 + 50)
      }
    }

    applyGlitch()

    // Limpar o efeito quando terminar
    return () => {
      container.style.transform = ""
      container.style.filter = ""
      document.body.style.backgroundColor = ""

      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
      }
    }
  }

  // Efeito Rainbow
  const initRainbowEffect = () => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Adicionar classe para animação de arco-íris
    container.classList.add("rainbow-effect")

    // Limpar o efeito quando terminar
    return () => {
      container.classList.remove("rainbow-effect")
    }
  }

  // Efeito de Explosão
  const initExplosionEffect = () => {
    if (!canvasRef.current || !ctxRef.current) return

    const ctx = ctxRef.current
    const canvas = canvasRef.current

    // Limpar partículas anteriores
    explosionParticlesRef.current = []

    // Criar explosão no centro da tela
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Cores da explosão
    const colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"]

    // Criar partículas
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 10 + 2

      explosionParticlesRef.current.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0, // Vida da partícula (1.0 = 100%)
      })
    }

    const drawExplosion = () => {
      if (!ctx || !canvas) return

      // Limpar o canvas com um efeito de fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Desenhar e atualizar partículas
      explosionParticlesRef.current.forEach((particle, index) => {
        // Atualizar posição
        particle.x += particle.vx
        particle.y += particle.vy

        // Aplicar gravidade
        particle.vy += 0.1

        // Reduzir vida
        particle.life -= 0.01

        // Desenhar partícula
        if (particle.life > 0) {
          ctx.globalAlpha = particle.life
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1.0
        } else {
          // Remover partículas mortas
          explosionParticlesRef.current.splice(index, 1)
        }
      })

      if (isActive && explosionParticlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(drawExplosion)
      }
    }

    drawExplosion()
  }

  // Ativar o efeito quando o estado mudar
  useEffect(() => {
    if (isActive) {
      switch (currentEffect) {
        case "confetti":
          runConfettiEffect()
          break
        case "matrix":
          initMatrixEffect()
          break
        case "burro":
          initBurroEffect()
          break
        case "glitch":
          const cleanupGlitch = initGlitchEffect()
          return cleanupGlitch
        case "rainbow":
          const cleanupRainbow = initRainbowEffect()
          return cleanupRainbow
        case "explosion":
          initExplosionEffect()
          break
      }
    }

    return () => {
      // Limpar animações quando o efeito terminar
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
        glitchTimeoutRef.current = null
      }

      // Resetar estilos
      if (containerRef.current) {
        containerRef.current.style.transform = ""
        containerRef.current.style.filter = ""
        containerRef.current.classList.remove("rainbow-effect")
      }

      document.body.style.backgroundColor = ""
    }
  }, [isActive, currentEffect, duration])

  // Ativar o efeito automaticamente se o trigger for "auto"
  useEffect(() => {
    if (trigger === "auto") {
      activateEffect()
    }
  }, [trigger])

  // Eventos de interação
  const handleInteraction = (event: React.MouseEvent | React.TouchEvent) => {
    if (trigger === "click" && event.type === "click") {
      activateEffect()
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onClick={trigger === "click" ? handleInteraction : undefined}
      onMouseEnter={trigger === "hover" ? handleInteraction : undefined}
    >
      {children}

      <AnimatePresence>
        {isActive && (
          <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-40"
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .rainbow-effect {
          animation: rainbow-bg 3s linear infinite;
        }
        
        @keyframes rainbow-bg {
          0% { background-color: rgba(255, 0, 0, 0.1); }
          16.6% { background-color: rgba(255, 165, 0, 0.1); }
          33.3% { background-color: rgba(255, 255, 0, 0.1); }
          50% { background-color: rgba(0, 128, 0, 0.1); }
          66.6% { background-color: rgba(0, 0, 255, 0.1); }
          83.3% { background-color: rgba(75, 0, 130, 0.1); }
          100% { background-color: rgba(238, 130, 238, 0.1); }
        }
      `}</style>
    </div>
  )
}

