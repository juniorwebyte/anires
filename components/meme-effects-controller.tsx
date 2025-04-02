"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useToast } from "@/components/ui/use-toast"

// Tipos de efeitos disponíveis
export type EffectType =
  | "explosion"
  | "rainbow"
  | "matrix"
  | "earthquake"
  | "burroRain"
  | "colorCycle"
  | "glitch"
  | "disco"
  | "none"

// Interface do contexto
interface MemeEffectsContextType {
  activeEffect: EffectType
  activateEffect: (effect: EffectType) => void
  isEffectsEnabled: boolean
  enableEffects: () => void
  disableEffects: () => void
}

// Criar o contexto
const MemeEffectsContext = createContext<MemeEffectsContextType>({
  activeEffect: "none",
  activateEffect: () => {},
  isEffectsEnabled: false,
  enableEffects: () => {},
  disableEffects: () => {},
})

// Hook para usar o contexto
export const useMemeEffects = () => useContext(MemeEffectsContext)

// Nomes amigáveis para os efeitos
const effectNames: Record<EffectType, string> = {
  explosion: "Explosão Cósmica",
  rainbow: "Arco-Íris Mágico",
  matrix: "Matrix Burro",
  earthquake: "Terremoto Meme",
  burroRain: "Chuva de Burros",
  colorCycle: "Ciclo Psicodélico",
  glitch: "Glitch na Matrix",
  disco: "Festa Disco",
  none: "Nenhum",
}

// Componente provedor
export const MemeEffectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeEffect, setActiveEffect] = useState<EffectType>("none")
  const [isEffectsEnabled, setIsEffectsEnabled] = useState(false)
  const [effectTimeout, setEffectTimeout] = useState<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Limpar timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (effectTimeout) {
        clearTimeout(effectTimeout)
      }
    }
  }, [effectTimeout])

  // Função para ativar um efeito
  const activateEffect = (effect: EffectType) => {
    if (!isEffectsEnabled && effect !== "none") {
      toast({
        title: "Efeitos Desativados",
        description: "Ative os efeitos especiais primeiro!",
        variant: "default",
      })
      return
    }

    // Limpar timeout anterior se existir
    if (effectTimeout) {
      clearTimeout(effectTimeout)
    }

    // Ativar o novo efeito
    setActiveEffect(effect)

    // Mostrar toast com o nome do efeito
    if (effect !== "none") {
      toast({
        title: `Efeito Ativado: ${effectNames[effect]}`,
        description: "Aproveite a loucura!",
        variant: "default",
        className: "bg-gradient-to-r from-purple-600 to-blue-600",
      })
    }

    // Desativar o efeito após 5 segundos
    if (effect !== "none") {
      const timeout = setTimeout(() => {
        setActiveEffect("none")
      }, 5000)
      setEffectTimeout(timeout)
    }
  }

  // Função para ativar os efeitos
  const enableEffects = () => {
    setIsEffectsEnabled(true)
    toast({
      title: "Efeitos Especiais Ativados!",
      description: "Agora você pode usar todos os efeitos malucos!",
      variant: "default",
      className: "bg-gradient-to-r from-green-500 to-blue-500",
    })
  }

  // Função para desativar os efeitos
  const disableEffects = () => {
    setIsEffectsEnabled(false)
    setActiveEffect("none")
    toast({
      title: "Efeitos Especiais Desativados",
      description: "Os efeitos foram desativados.",
      variant: "default",
    })
  }

  return (
    <MemeEffectsContext.Provider
      value={{
        activeEffect,
        activateEffect,
        isEffectsEnabled,
        enableEffects,
        disableEffects,
      }}
    >
      {children}

      {/* Renderizar efeitos ativos */}
      {activeEffect === "earthquake" && <div className="fixed inset-0 pointer-events-none z-50 earthquake-effect" />}

      {activeEffect === "rainbow" && (
        <div
          className="fixed inset-0 pointer-events-none z-50 rainbow-overlay"
          style={{
            background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
            opacity: "0.3",
            animation: "rainbow-move 3s ease-in-out",
          }}
        />
      )}

      {activeEffect === "colorCycle" && <div className="fixed inset-0 pointer-events-none z-50 color-cycle-effect" />}

      {/* Outros efeitos são renderizados diretamente no componente MemeEffects */}
    </MemeEffectsContext.Provider>
  )
}

