// Vamos otimizar a animação galáctica para melhorar a performance e garantir que funcione bem em todas as páginas

"use client"

import { useEffect, useRef, useState } from "react"

export default function GalaxyAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [isLowPerfMode, setIsLowPerfMode] = useState(false)

  // Detectar dispositivos de baixa performance
  useEffect(() => {
    // Verificar se é um dispositivo móvel ou tem GPU fraca
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isLowEndDevice = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false

    // Verificar se o usuário prefere reduzir animações
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Verificar se o modo de baixa performance está ativado manualmente
    const manualLowPerfMode = localStorage.getItem("lowPerfMode") === "true"

    setIsLowPerfMode(isMobile || isLowEndDevice || prefersReducedMotion || manualLowPerfMode)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Reduzir a quantidade de elementos com base no modo de performance
    const starCount = isLowPerfMode
      ? Math.floor((window.innerWidth * window.innerHeight) / 15000) // Muito menos estrelas
      : Math.floor((window.innerWidth * window.innerHeight) / 3000) // Menos estrelas que antes

    // Create stars - versão simplificada
    const stars = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        pulse: Math.random(),
        pulseSpeed: Math.random() * 0.01 + 0.005, // Velocidade reduzida
        color: getSimplifiedColor(),
      })
    }

    // Remover planetas e buracos negros em dispositivos de baixa performance
    const planets = isLowPerfMode ? [] : createSimplifiedPlanets(canvas.width, canvas.height)

    // Remover constelações e nebulosas em dispositivos de baixa performance
    const nebulaPoints = isLowPerfMode ? [] : createSimplifiedNebulaPoints(canvas.width, canvas.height)

    // Animation function - simplificada
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient - simplificado
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width,
      )
      gradient.addColorStop(0, "rgba(20, 10, 30, 1)")
      gradient.addColorStop(1, "rgba(10, 5, 20, 1)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebulas - apenas se não estiver em modo de baixa performance
      if (!isLowPerfMode && nebulaPoints.length > 0) {
        drawSimplifiedNebulas(ctx, nebulaPoints)
      }

      // Draw stars - versão simplificada
      stars.forEach((star) => {
        star.pulse += star.pulseSpeed
        if (star.pulse > 1) star.pulse = 0

        const pulseFactor = Math.sin(star.pulse * Math.PI * 2) * 0.2 + 0.8

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = star.opacity * pulseFactor
        ctx.fill()

        // Remover efeito de brilho para melhorar performance
      })

      // Draw planets - apenas se não estiver em modo de baixa performance
      if (!isLowPerfMode && planets.length > 0) {
        planets.forEach((planet) => {
          planet.angle += planet.orbitSpeed
          planet.x = planets[0].orbitRadius * 2 + planet.orbitRadius * Math.cos(planet.angle)
          planet.y = planets[0].orbitRadius + planet.orbitRadius * Math.sin(planet.angle)

          // Desenhar planeta sem órbita para melhorar performance
          ctx.beginPath()
          ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2)
          ctx.fillStyle = planet.color
          ctx.globalAlpha = 1
          ctx.fill()
        })
      }

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [isLowPerfMode])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}

// Funções auxiliares simplificadas
function getSimplifiedColor(): string {
  const colors = [
    "rgb(138, 43, 226)", // Roxo
    "rgb(255, 215, 0)", // Amarelo
    "rgb(30, 144, 255)", // Azul
    "rgb(255, 255, 255)", // Branco
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

function createSimplifiedPlanets(width: number, height: number) {
  const planets = []
  const planetCount = 3 // Reduzido de 7 para 3

  for (let i = 0; i < planetCount; i++) {
    const centerX = width * 0.7
    const centerY = height * 0.3

    planets.push({
      x: 0,
      y: 0,
      size: Math.random() * 6 + 3, // Tamanho reduzido
      orbitRadius: (i + 1) * 50,
      orbitSpeed: 0.001 / (i + 1),
      angle: Math.random() * Math.PI * 2,
      color: getSimplifiedColor(),
    })
  }

  return planets
}

function createSimplifiedNebulaPoints(width: number, height: number) {
  const points = []
  const nebulaCount = 2 // Reduzido de 5 para 2

  for (let n = 0; n < nebulaCount; n++) {
    const centerX = Math.random() * width
    const centerY = Math.random() * height
    const radius = Math.random() * 200 + 100 // Raio reduzido
    const pointCount = 20 // Reduzido de 80 para 20

    for (let i = 0; i < pointCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * radius
      points.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: Math.random() * 50 + 30, // Tamanho reduzido
        opacity: Math.random() * 0.1, // Opacidade reduzida
        color: getSimplifiedColor(),
      })
    }
  }

  return points
}

function drawSimplifiedNebulas(ctx: CanvasRenderingContext2D, points: any[]): void {
  points.forEach((point) => {
    ctx.beginPath()
    ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.size)
    gradient.addColorStop(0, point.color.replace("rgb", "rgba").replace(")", `, ${point.opacity * 0.5})`))
    gradient.addColorStop(1, point.color.replace("rgb", "rgba").replace(")", ", 0)"))
    ctx.fillStyle = gradient
    ctx.fill()
  })
}

