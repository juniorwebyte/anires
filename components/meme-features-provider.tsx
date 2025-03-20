"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import StandaloneMemePopup from "./standalone-meme-popup"
import { usePerformanceMode } from "@/hooks/use-performance-mode"
import BurroCursor from "./burro-cursor"
import FloatingBurros from "./floating-burros"
import BurroEasterEgg from "./burro-easter-egg"

export type MemeFeature = "popup" | "cursor" | "floatingBurros" | "easterEgg"

interface MemeContextType {
  enabledFeatures: MemeFeature[]
  toggleFeature: (feature: MemeFeature) => void
  isFeatureEnabled: (feature: MemeFeature) => boolean
  triggerPopup: () => void
}

const MemeContext = createContext<MemeContextType | undefined>(undefined)

export const useMemeFeatures = () => {
  const context = useContext(MemeContext)
  if (!context) {
    throw new Error("useMemeFeatures must be used within a MemeProvider")
  }
  return context
}

export const MemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabledFeatures, setEnabledFeatures] = useState<MemeFeature[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const { isPerformanceMode } = usePerformanceMode()

  useEffect(() => {
    // Carregar preferências do usuário do localStorage
    const savedFeatures = localStorage.getItem("memeFeatures")
    if (savedFeatures) {
      try {
        setEnabledFeatures(JSON.parse(savedFeatures))
      } catch (e) {
        console.error("Erro ao carregar preferências de memes:", e)
      }
    }
  }, [])

  useEffect(() => {
    // Salvar preferências no localStorage quando mudar
    localStorage.setItem("memeFeatures", JSON.stringify(enabledFeatures))
  }, [enabledFeatures])

  const toggleFeature = (feature: MemeFeature) => {
    setEnabledFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const isFeatureEnabled = (feature: MemeFeature) => {
    return enabledFeatures.includes(feature) && !isPerformanceMode
  }

  const triggerPopup = () => {
    if (isFeatureEnabled("popup") && !isPerformanceMode) {
      setShowPopup(true)
    }
  }

  return (
    <MemeContext.Provider value={{ enabledFeatures, toggleFeature, isFeatureEnabled, triggerPopup }}>
      {children}

      {/* Remover o MemePopup antigo e manter apenas o StandaloneMemePopup */}
      {isFeatureEnabled("popup") && <StandaloneMemePopup show={showPopup} onClose={() => setShowPopup(false)} />}

      {isFeatureEnabled("cursor") && <BurroCursor />}
      {isFeatureEnabled("floatingBurros") && <FloatingBurros />}
      {isFeatureEnabled("easterEgg") && <BurroEasterEgg />}
    </MemeContext.Provider>
  )
}

