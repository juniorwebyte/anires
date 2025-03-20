"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Zap, DollarSign, Laugh, Star, PartyPopper, Gift } from "lucide-react"
import AniresMascot from "@/components/anires-mascot"

type PopupVariant = "success" | "error" | "warning" | "info" | "meme" | "crypto" | "party" | "airdrop"

interface MemePopupProps {
  message: string
  isOpen: boolean
  onClose: () => void
  variant?: PopupVariant
  autoClose?: boolean
  autoCloseTime?: number
  title?: string
  showMascot?: boolean
  mascotVariant?: "default" | "dancing" | "flying" | "moon" | "rocket"
  children?: React.ReactNode
}

export default function MemePopup({
  message,
  isOpen,
  onClose,
  variant = "meme",
  autoClose = false,
  autoCloseTime = 5000,
  title = "Anires Meme Alert",
  showMascot = true,
  mascotVariant = "dancing",
  children,
}: MemePopupProps) {
  const [progress, setProgress] = useState(100)
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; x: number; delay: number }[]>([])
  const [isButtonMoving, setIsButtonMoving] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const [showJoke, setShowJoke] = useState(false)
  const [currentJoke, setCurrentJoke] = useState("")
  const [confetti, setConfetti] = useState(false)

  const cryptoJokes = [
    "Por que o Bitcoin foi ao médico? Porque estava sofrendo de quedas repentinas!",
    "O que o burro disse para o Bitcoin? 'Você sobe e desce mais que eu no morro!'",
    "Como se chama um burro que minera Bitcoin? Proof of Burro!",
    "Por que o ETH está sempre cansado? Porque está sempre fazendo proof of stake!",
    "O que o burro astral disse quando viu o preço do Bitcoin? 'Até eu chego mais rápido na lua!'",
    "Qual é o animal favorito dos traders? O touro... mas o burro vem logo em seguida!",
    "Como você sabe que um burro é trader de criptomoedas? Ele compra no topo e vende no fundo!",
    "O que o burro disse quando ganhou um airdrop? 'Finalmente algo caiu do céu além de chuva!'",
  ]

  // Resetar o progresso quando o popup abrir
  useEffect(() => {
    if (isOpen) {
      setProgress(100)
      setShowJoke(false)
      setIsButtonMoving(false)
      setButtonPosition({ x: 0, y: 0 })

      // Adicionar emojis flutuantes para variantes específicas
      if (variant === "crypto" || variant === "party" || variant === "airdrop") {
        const emojiOptions =
          variant === "crypto"
            ? ["💰", "🚀", "🌕", "💎", "🐴", "🔥", "💸", "🤑"]
            : variant === "party"
              ? ["🎉", "🎊", "🎈", "🥳", "🎁", "✨", "🎯", "🎪"]
              : ["🪂", "💸", "🎁", "🚀", "🌟", "💰", "🔥", "🎯"]

        const newEmojis = Array.from({ length: 12 }).map((_, i) => ({
          id: Date.now() + i,
          emoji: emojiOptions[Math.floor(Math.random() * emojiOptions.length)],
          x: Math.random() * 100,
          delay: Math.random() * 0.5,
        }))
        setFloatingEmojis(newEmojis)
      }

      // Mostrar confetti para variante party
      if (variant === "party" || variant === "airdrop") {
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3000)
      }
    } else {
      setFloatingEmojis([])
      setConfetti(false)
    }
  }, [isOpen, variant])

  // Auto-fechar o popup após o tempo definido
  useEffect(() => {
    if (!isOpen || !autoClose) return

    const startTime = Date.now()
    const endTime = startTime + autoCloseTime

    const updateProgress = () => {
      const now = Date.now()
      const remaining = Math.max(0, endTime - now)
      const newProgress = (remaining / autoCloseTime) * 100

      setProgress(newProgress)

      if (remaining > 0) {
        requestAnimationFrame(updateProgress)
      } else {
        onClose()
      }
    }

    const animationId = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isOpen, autoClose, autoCloseTime, onClose])

  // Determinar a cor do popup com base na variante
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-green-900/90 border-green-500"
      case "error":
        return "bg-red-900/90 border-red-500"
      case "warning":
        return "bg-yellow-900/90 border-yellow-500"
      case "info":
        return "bg-blue-900/90 border-blue-500"
      case "crypto":
        return "bg-gradient-to-r from-purple-900/95 to-blue-900/95 border-yellow-500"
      case "party":
        return "bg-gradient-to-r from-pink-900/95 to-purple-900/95 border-pink-500"
      case "airdrop":
        return "bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-blue-900/95 border-indigo-400"
      case "meme":
      default:
        return "bg-purple-900/90 border-purple-500"
    }
  }

  // Ícone baseado na variante
  const getVariantIcon = () => {
    switch (variant) {
      case "success":
        return <Zap className="h-6 w-6 text-green-300" />
      case "error":
        return <X className="h-6 w-6 text-red-300" />
      case "warning":
        return <Zap className="h-6 w-6 text-yellow-300" />
      case "info":
        return <Sparkles className="h-6 w-6 text-blue-300" />
      case "crypto":
        return <DollarSign className="h-6 w-6 text-yellow-300" />
      case "party":
        return <PartyPopper className="h-6 w-6 text-pink-300" />
      case "airdrop":
        return <Gift className="h-6 w-6 text-indigo-300" />
      case "meme":
      default:
        return <Laugh className="h-6 w-6 text-purple-300" />
    }
  }

  const handleCloseButtonHover = () => {
    // 30% de chance do botão fugir quando o mouse passar por cima
    if (Math.random() < 0.3 && !isButtonMoving) {
      setIsButtonMoving(true)
      setButtonPosition({
        x: (Math.random() * 2 - 1) * 100,
        y: (Math.random() * 2 - 1) * 50,
      })

      // Voltar à posição original após um tempo
      setTimeout(() => {
        setIsButtonMoving(false)
        setButtonPosition({ x: 0, y: 0 })
      }, 1000)
    }
  }

  const showRandomJoke = () => {
    if (!showJoke) {
      const randomJoke = cryptoJokes[Math.floor(Math.random() * cryptoJokes.length)]
      setCurrentJoke(randomJoke)
      setShowJoke(true)

      // Reproduzir som de risada
      try {
        const audio = new Audio("/laugh-high-pitch.mp3")
        audio.volume = 0.2
        audio.play()
      } catch (error) {
        console.error("Erro ao reproduzir som:", error)
      }

      // Esconder a piada após alguns segundos
      setTimeout(() => {
        setShowJoke(false)
      }, 6000)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            className="w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.9, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
          >
            <div
              className={`rounded-xl border-2 ${getVariantStyles()} backdrop-blur-md p-6 shadow-2xl relative overflow-hidden`}
            >
              {/* Confetti effect */}
              {confetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={`confetti-${i}`}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: [
                          "#FF5733",
                          "#33FF57",
                          "#3357FF",
                          "#F3FF33",
                          "#FF33F3",
                          "#33FFF3",
                          "#FF9933",
                          "#33FF99",
                          "#9933FF",
                          "#99FF33",
                          "#FF3399",
                          "#3399FF",
                        ][Math.floor(Math.random() * 12)],
                        top: `-5%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: ["0vh", "100vh"],
                        x: [0, Math.random() * 200 - 100],
                        rotate: [0, Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1)],
                        opacity: [1, 0.8, 0],
                      }}
                      transition={{
                        duration: Math.random() * 2 + 2,
                        delay: Math.random() * 0.5,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Floating emojis */}
              {floatingEmojis.map((item) => (
                <motion.div
                  key={item.id}
                  className="absolute text-2xl pointer-events-none"
                  initial={{ y: 100, x: `${item.x}%`, opacity: 0 }}
                  animate={{ y: -20, opacity: [0, 1, 0] }}
                  transition={{
                    duration: 3,
                    delay: item.delay,
                    ease: "easeOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: Math.random() * 2,
                  }}
                >
                  {item.emoji}
                </motion.div>
              ))}

              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  {showMascot ? (
                    <div className="mr-3">
                      <AniresMascot variant={mascotVariant} size="md" />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-3"
                    >
                      {getVariantIcon()}
                    </motion.div>
                  )}
                  <motion.div initial={{ x: -5 }} animate={{ x: 0 }} transition={{ duration: 0.3 }}>
                    <h3 className="text-white font-bold text-xl">{title}</h3>
                    {variant === "airdrop" && (
                      <p className="text-indigo-200 text-sm">Seu burro astral tem uma mensagem para você!</p>
                    )}
                  </motion.div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Fechar"
                  whileHover={{ scale: 1.2, rotate: isButtonMoving ? 0 : 90 }}
                  whileTap={{ scale: 0.9 }}
                  animate={isButtonMoving ? { x: buttonPosition.x, y: buttonPosition.y } : {}}
                  onMouseEnter={handleCloseButtonHover}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Divider with stars */}
              <div className="flex items-center justify-center my-3">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-grow"></div>
                <Star className="h-4 w-4 text-yellow-400 mx-2" />
                <Star className="h-5 w-5 text-yellow-400 mx-2" />
                <Star className="h-4 w-4 text-yellow-400 mx-2" />
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent flex-grow"></div>
              </div>

              {/* Content */}
              <div className="py-3">
                <motion.div
                  className="text-white text-center font-medium text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {message}
                </motion.div>

                {/* Joke section */}
                <AnimatePresence>
                  {showJoke && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 bg-black/30 p-3 rounded-lg border border-purple-500/30"
                    >
                      <p className="text-yellow-200 text-center italic">"{currentJoke}"</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Children content */}
                {children && <div className="mt-4">{children}</div>}

                {/* Joke button - REMOVIDO */}
                {/* Burro image - REMOVIDO */}
              </div>

              {/* Progress bar */}
              {autoClose && (
                <div className="mt-4 bg-black/20 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "100%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

