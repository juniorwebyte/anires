"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useMemeEffects, type EffectType } from "@/components/meme-effects-controller"
import { Sparkles, Zap, Rainbow, Code, Waves, CloudRain, Palette, Tv2, Music, X } from "lucide-react"

const EffectsPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { activateEffect, isEffectsEnabled, enableEffects, disableEffects } = useMemeEffects()

  // Lista de efeitos disponíveis
  const effects: { type: EffectType; icon: React.ReactNode; label: string }[] = [
    { type: "explosion", icon: <Zap className="h-5 w-5" />, label: "Explosão" },
    { type: "rainbow", icon: <Rainbow className="h-5 w-5" />, label: "Arco-Íris" },
    { type: "matrix", icon: <Code className="h-5 w-5" />, label: "Matrix" },
    { type: "earthquake", icon: <Waves className="h-5 w-5" />, label: "Terremoto" },
    { type: "burroRain", icon: <CloudRain className="h-5 w-5" />, label: "Chuva de Burros" },
    { type: "colorCycle", icon: <Palette className="h-5 w-5" />, label: "Psicodélico" },
    { type: "glitch", icon: <Tv2 className="h-5 w-5" />, label: "Glitch" },
    { type: "disco", icon: <Music className="h-5 w-5" />, label: "Disco" },
  ]

  return (
    <>
      {/* Botão flutuante para abrir o painel */}
      <motion.div className="fixed bottom-6 right-6 z-40" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Painel de efeitos */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-md p-4 rounded-xl border border-gray-700 shadow-xl w-72"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white mb-2">Efeitos Especiais</h3>
              <p className="text-sm text-gray-300 mb-3">Clique em um efeito para ativá-lo!</p>

              {/* Botão para ativar/desativar todos os efeitos */}
              <Button
                onClick={isEffectsEnabled ? disableEffects : enableEffects}
                className={`w-full mb-3 ${
                  isEffectsEnabled ? "bg-red-600 hover:bg-red-700" : "bg-gradient-to-r from-green-600 to-blue-600"
                }`}
              >
                {isEffectsEnabled ? "Desativar Efeitos" : "Ativar Efeitos"}
              </Button>
            </div>

            {/* Grade de efeitos */}
            <div className="grid grid-cols-2 gap-2">
              {effects.map((effect) => (
                <Button
                  key={effect.type}
                  onClick={() => activateEffect(effect.type)}
                  disabled={!isEffectsEnabled}
                  className={`flex flex-col items-center justify-center py-3 ${
                    !isEffectsEnabled
                      ? "bg-gray-700 opacity-50"
                      : "bg-gradient-to-br from-purple-800/80 to-blue-900/80 hover:from-purple-700 hover:to-blue-800"
                  }`}
                >
                  {effect.icon}
                  <span className="text-xs mt-1">{effect.label}</span>
                </Button>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-400 text-center">Dica: Combine efeitos para mais diversão!</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EffectsPanel

