"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import AniresMascot from "@/components/anires-mascot"

interface EasterEggGameProps {
  onComplete: (score: number) => void
  onClose: () => void
}

export default function EasterEggGame({ onComplete, onClose }: EasterEggGameProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [burroPosition, setBurroPosition] = useState({ x: 50, y: 50 })
  const [gameOver, setGameOver] = useState(false)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Adicionar estas variáveis após as variáveis de estado existentes
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const [comboText, setComboText] = useState("")
  const [powerUpActive, setPowerUpActive] = useState(false)
  const [powerUpType, setPowerUpType] = useState<"slow" | "double" | "freeze">("slow")

  // Iniciar o jogo
  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTimeLeft(30)
    setGameOver(false)

    // Tocar som de início
    const startSound = new Audio(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laugh-high-pitch-154516-SBTkx0oZ2O2b33NWPw2nDgGtRuH9NI.mp3",
    )
    startSound.volume = 0.3
    startSound.play().catch((e) => console.error("Erro ao tocar áudio:", e))

    toast({
      title: "🎮 Jogo iniciado!",
      description: "Clique no burro para ganhar pontos! Você tem 30 segundos.",
      className: "bg-purple-900 border-purple-600",
    })
  }

  // Modificar a função moveBurro para considerar o power-up de lentidão
  const moveBurro = () => {
    if (!gameAreaRef.current) return

    const gameArea = gameAreaRef.current.getBoundingClientRect()
    const maxX = gameArea.width - 60
    const maxY = gameArea.height - 60

    // Se o power-up de lentidão estiver ativo, mover menos
    const movementFactor = powerUpActive && powerUpType === "slow" ? 0.5 : 1

    const currentX = burroPosition.x
    const currentY = burroPosition.y

    // Calcular nova posição com base na posição atual
    let newX = Math.floor(Math.random() * maxX)
    let newY = Math.floor(Math.random() * maxY)

    // Se o power-up de lentidão estiver ativo, mover menos distante da posição atual
    if (powerUpActive && powerUpType === "slow") {
      const maxDistance = 100 // Distância máxima que o burro pode se mover com o power-up ativo

      // Limitar a distância do movimento
      newX = currentX + (Math.random() * 2 - 1) * maxDistance
      newY = currentY + (Math.random() * 2 - 1) * maxDistance

      // Garantir que a nova posição esteja dentro dos limites
      newX = Math.max(0, Math.min(maxX, newX))
      newY = Math.max(0, Math.min(maxY, newY))
    }

    setBurroPosition({ x: newX, y: newY })
  }

  // Melhorar a função clickBurro para adicionar sistema de combo
  const clickBurro = () => {
    // Verificar se é um clique rápido (combo)
    const now = Date.now()
    const timeDiff = now - lastClickTime
    setLastClickTime(now)

    // Se o clique for em menos de 1 segundo, aumentar o multiplicador de combo
    if (timeDiff < 1000) {
      setComboMultiplier((prev) => {
        const newMultiplier = Math.min(prev + 0.5, 5) // Máximo de 5x

        // Mostrar texto de combo
        setComboText(`COMBO ${newMultiplier.toFixed(1)}x!`)
        setShowCombo(true)
        setTimeout(() => setShowCombo(false), 1000)

        return newMultiplier
      })
    } else {
      // Resetar o multiplicador se demorar muito
      setComboMultiplier(1)
    }

    // Calcular pontos com o multiplicador
    const pointsToAdd = powerUpActive && powerUpType === "double" ? 2 * comboMultiplier : 1 * comboMultiplier

    // Adicionar pontos
    setScore((prev) => prev + pointsToAdd)

    // Tocar som de ponto
    const pointSound = new Audio("/burro-sound.mp3")
    pointSound.volume = 0.2
    pointSound.play().catch((e) => console.error("Erro ao tocar áudio:", e))

    // Chance de ativar power-up (10%)
    if (Math.random() < 0.1 && !powerUpActive) {
      activatePowerUp()
    }

    // Mover o burro
    moveBurro()
  }

  // Adicionar função para ativar power-ups
  const activatePowerUp = () => {
    // Escolher um power-up aleatório
    const powerUps: Array<"slow" | "double" | "freeze"> = ["slow", "double", "freeze"]
    const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)]

    setPowerUpType(randomPowerUp)
    setPowerUpActive(true)

    // Mostrar mensagem de power-up
    const powerUpMessages = {
      slow: "POWER-UP: Burro Lento!",
      double: "POWER-UP: Pontos Duplos!",
      freeze: "POWER-UP: Tempo Congelado!",
    }

    toast({
      title: "🌟 Power-Up Ativado!",
      description: powerUpMessages[randomPowerUp],
      className: "bg-gradient-to-r from-purple-600 to-blue-600",
    })

    // Se for o power-up de congelar tempo, pausar o temporizador
    if (randomPowerUp === "freeze") {
      // O temporizador será pausado por 5 segundos
      setTimeLeft((prev) => prev + 5)
    }

    // Desativar o power-up após 5 segundos
    setTimeout(() => {
      setPowerUpActive(false)
    }, 5000)
  }

  // Temporizador do jogo
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameOver(true)
          onComplete(score)

          toast({
            title: "🎮 Fim de jogo!",
            description: `Você conseguiu ${score} pontos! Parabéns!`,
            className: "bg-green-900 border-green-600",
          })

          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, gameOver, score, onComplete, toast])

  // Mover o burro a cada 2 segundos se não for clicado
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const moveInterval = setInterval(() => {
      moveBurro()
    }, 2000)

    return () => clearInterval(moveInterval)
  }, [gameStarted, gameOver])

  // Mover o burro no início do jogo
  useEffect(() => {
    if (gameStarted) {
      moveBurro()
    }
  }, [gameStarted])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gradient-to-r from-purple-900/90 to-blue-900/90 p-6 rounded-xl border-2 border-purple-500 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Caça ao Burro Astral</h2>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-purple-800/50">
            Fechar
          </Button>
        </div>

        {!gameStarted && !gameOver ? (
          <div className="text-center py-8">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="mb-4"
            >
              <AniresMascot variant="dancing" size="xl" />
            </motion.div>
            <h3 className="text-xl text-white mb-4">Pronto para caçar o burro astral?</h3>
            <p className="text-gray-300 mb-6">Clique no burro o máximo de vezes que conseguir em 30 segundos!</p>
            <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
              Iniciar Jogo
            </Button>
          </div>
        ) : gameOver ? (
          <div className="text-center py-8">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: 2 }}
              className="mb-4"
            >
              <AniresMascot variant={score > 10 ? "flying" : "dancing"} size="xl" />
            </motion.div>
            <h3 className="text-2xl text-white mb-2">Fim de jogo!</h3>
            <p className="text-xl text-yellow-300 mb-2">Sua pontuação: {score} pontos</p>

            {/* Mensagem personalizada baseada na pontuação */}
            <p className="text-sm text-blue-300 mb-6">
              {score < 5 && "Hmm, o Burro Astral acha que você pode fazer melhor!"}
              {score >= 5 && score < 10 && "Não está mal! O Burro Astral está impressionado!"}
              {score >= 10 && score < 15 && "Uau! Você tem reflexos rápidos! O Burro Astral aprova!"}
              {score >= 15 && "INCRÍVEL! Você é o mestre caçador de Burros Astrais!"}
            </p>

            <div className="flex justify-center gap-4">
              <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
                Jogar Novamente
              </Button>
              <Button onClick={onClose} variant="outline" className="border-purple-500 text-purple-300">
                Sair
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[60vh]">
            <div className="flex justify-between mb-4">
              <div className="bg-purple-800/50 px-4 py-2 rounded-lg">
                <span className="text-white">Pontuação: </span>
                <span className="text-yellow-300 font-bold">{score}</span>
              </div>
              <div className="bg-purple-800/50 px-4 py-2 rounded-lg">
                <span className="text-white">Tempo: </span>
                <span className={`font-bold ${timeLeft <= 10 ? "text-red-400" : "text-green-300"}`}>{timeLeft}s</span>
              </div>
            </div>

            <div
              ref={gameAreaRef}
              className="flex-1 relative bg-gradient-to-b from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-800/50 overflow-hidden"
            >
              <AnimatePresence>
                <motion.div
                  style={{
                    position: "absolute",
                    left: `${burroPosition.x}px`,
                    top: `${burroPosition.y}px`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={clickBurro}
                  className="cursor-pointer"
                >
                  <AniresMascot variant={Math.random() > 0.7 ? "flying" : "dancing"} size="md" />
                </motion.div>
              </AnimatePresence>
              {/* Indicador de Combo */}
              <AnimatePresence>
                {showCombo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: 1, scale: 1.5, y: -50 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300 font-bold text-2xl z-10"
                  >
                    {comboText}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicador de Power-Up */}
              {powerUpActive && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 rounded-full text-white text-sm animate-pulse">
                  {powerUpType === "slow" && "Burro Lento"}
                  {powerUpType === "double" && "Pontos Duplos"}
                  {powerUpType === "freeze" && "Tempo +5s"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

