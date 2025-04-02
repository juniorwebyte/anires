"use client"

import { useRef, useEffect, useState } from "react"
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
  const { isLowPerformanceMode, isPerformanceMode } = usePerformanceMode()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Verificar se estamos em um dispositivo móvel
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  // Reduzir drasticamente a quantidade de elementos em dispositivos móveis
  // ou quando o modo de performance estiver ativado
  const shouldReduceEffects = isLowPerformanceMode || isPerformanceMode || isMobile

  // Ajustar contagens com base no modo de desempenho
  const adjustedStarCount = shouldReduceEffects ? Math.floor(starCount / 5) : Math.floor(starCount / 2)
  const adjustedNebulaCount = shouldReduceEffects ? 0 : Math.floor(nebulaCount / 2)
  const adjustedPlanetCount = shouldReduceEffects ? 0 : Math.floor(planetCount / 2)
  const adjustedShootingStarCount = shouldReduceEffects ? 0 : Math.floor(shootingStarCount / 2)
  const adjustedConstellationCount = shouldReduceEffects ? 0 : Math.floor(constellationCount / 2)
  const adjustedZodiacCount = shouldReduceEffects ? 0 : Math.floor(zodiacCount / 2)
  const adjustedMascotCount = shouldReduceEffects ? 0 : Math.floor(mascotCount / 2)

  // Atualizar dimensões ao redimensionar
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

    // Dimensões iniciais
    updateDimensions()

    // Adicionar listener de redimensionamento
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Gerar estrelas com menos animações
  const stars = Array.from({ length: adjustedStarCount }).map((_, i) => {
    const size = Math.random() * 2 + 1
    const opacity = Math.random() * 0.7 + 0.3

    // Remover animações para melhorar o desempenho
    return (
      <div
        key={`star-${i}`}
        className="star"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          opacity,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          position: "absolute",
          borderRadius: "50%",
          backgroundColor: "white",
        }}
      />
    )
  })

  // Gerar nebulosas com menos animações
  const nebulae = Array.from({ length: adjustedNebulaCount }).map((_, i) => {
    const size = Math.random() * 150 + 50
    const hue = Math.floor(Math.random() * 360)
    const opacity = Math.random() * 0.3 + 0.1

    return (
      <div
        key={`nebula-${i}`}
        className="nebula"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `hsla(${hue}, 70%, 60%, ${opacity})`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(20px)",
        }}
      />
    )
  })

  // Gerar planetas com menos animações
  const planets = Array.from({ length: adjustedPlanetCount }).map((_, i) => {
    const size = Math.random() * 30 + 10
    const hue = Math.floor(Math.random() * 360)

    return (
      <div
        key={`planet-${i}`}
        className="planet"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `hsl(${hue}, 70%, 50%)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          position: "absolute",
          borderRadius: "50%",
        }}
      />
    )
  })

  // Gerar estrelas cadentes com menos animações
  const shootingStars = Array.from({ length: adjustedShootingStarCount }).map((_, i) => {
    const top = Math.random() * 100
    const left = Math.random() * 100
    const angle = Math.random() * 45 - 45 // -45 a 0 graus (para baixo-direita)

    return (
      <div
        key={`shooting-star-${i}`}
        className="shooting-star"
        style={{
          position: "absolute",
          top: `${top}%`,
          left: `${left}%`,
          width: "40px",
          height: "2px",
          backgroundColor: "white",
          transform: `rotate(${angle}deg)`,
          opacity: 0.7,
        }}
      />
    )
  })

  // Gerar constelações com menos animações
  const constellations = Array.from({ length: adjustedConstellationCount }).map((_, i) => {
    const centerX = Math.random() * 80 + 10 // 10% a 90%
    const centerY = Math.random() * 80 + 10 // 10% a 90%
    const points = Math.floor(Math.random() * 5) + 3 // 3 a 7 pontos

    // Gerar pontos da constelação
    const constellationPoints = Array.from({ length: points }).map((_, j) => {
      const angle = (j / points) * Math.PI * 2
      const distance = Math.random() * 50 + 20
      const x = centerX + ((Math.cos(angle) * distance) / dimensions.width) * 100
      const y = centerY + ((Math.sin(angle) * distance) / dimensions.height) * 100

      return { x, y }
    })

    // Gerar linhas da constelação
    const constellationLines = constellationPoints.map((point, j) => {
      const nextPoint = constellationPoints[(j + 1) % points]
      const dx = nextPoint.x - point.x
      const dy = nextPoint.y - point.y
      const length = (Math.sqrt(dx * dx + dy * dy) * dimensions.width) / 100
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI

      return (
        <div
          key={`constellation-line-${i}-${j}`}
          className="constellation-line"
          style={{
            position: "absolute",
            width: `${length}px`,
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            left: `${point.x}%`,
            top: `${point.y}%`,
            transformOrigin: "left center",
            transform: `rotate(${angle}deg)`,
          }}
        />
      )
    })

    // Gerar estrelas da constelação
    const constellationStars = constellationPoints.map((point, j) => {
      return (
        <div
          key={`constellation-star-${i}-${j}`}
          className="constellation-star"
          style={{
            position: "absolute",
            width: "3px",
            height: "3px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            left: `${point.x}%`,
            top: `${point.y}%`,
          }}
        />
      )
    })

    return (
      <div key={`constellation-${i}`} className="constellation" style={{ position: "absolute", inset: 0 }}>
        {constellationLines}
        {constellationStars}
      </div>
    )
  })

  // Gerar símbolos do zodíaco com menos animações
  const zodiacSymbols = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"]
  const zodiacElements = Array.from({ length: adjustedZodiacCount }).map((_, i) => {
    const symbol = zodiacSymbols[i % zodiacSymbols.length]

    return (
      <div
        key={`zodiac-${i}`}
        className="zodiac-symbol"
        style={{
          position: "absolute",
          left: `${Math.random() * 80 + 10}%`,
          top: `${Math.random() * 80 + 10}%`,
          fontSize: "20px",
          color: "rgba(255, 255, 255, 0.5)",
        }}
      >
        {symbol}
      </div>
    )
  })

  // Gerar círculos astrais com menos animações
  const astralCircles = Array.from({ length: 3 }).map((_, i) => {
    const size = (i + 1) * 20

    return (
      <div
        key={`astral-circle-${i}`}
        className="astral-circle"
        style={{
          position: "absolute",
          width: `${size}%`,
          height: `${size}%`,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
        }}
      />
    )
  })

  // Gerar mascotes flutuantes com menos animações
  const mascots =
    showMascots && !shouldReduceEffects
      ? Array.from({ length: adjustedMascotCount }).map((_, i) => {
          const variants: ("default" | "dancing" | "flying" | "moon")[] = ["default", "dancing", "flying", "moon"]
          const variant = variants[i % variants.length]
          const size: ("sm" | "md")[] = ["sm", "md"]
          const mascotSize = size[Math.floor(Math.random() * size.length)]

          return (
            <div
              key={`mascot-${i}`}
              style={{
                position: "absolute",
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
                zIndex: 10,
              }}
            >
              <AniresMascot variant={variant} size={mascotSize} />
            </div>
          )
        })
      : []

  // Adicionar elementos de meme - emojis flutuantes
  const memeEmojis = ["🚀", "💎", "🌕", "🔥", "💰", "🤣", "👑", "✨"]
  const floatingEmojis = !shouldReduceEffects
    ? Array.from({ length: 8 }).map((_, i) => {
        const emoji = memeEmojis[i % memeEmojis.length]

        return (
          <div
            key={`emoji-${i}`}
            style={{
              position: "absolute",
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              opacity: 0.5,
              zIndex: 5,
            }}
          >
            {emoji}
          </div>
        )
      })
    : []

  return (
    <div
      ref={containerRef}
      className={`stars-container ${shouldReduceEffects ? "low-perf-mode" : ""} ${className}`}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "linear-gradient(to bottom, #0a0a1e, #05051a)",
        zIndex: -1,
      }}
    >
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

