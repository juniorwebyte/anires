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

  // Mover o burro para uma posição aleatória
  const moveBurro = () => {
    if (!gameAreaRef.current) return

    const gameArea = gameAreaRef.current.getBoundingClientRect()
    const maxX = gameArea.width - 60
    const maxY = gameArea.height - 60

    const newX = Math.floor(Math.random() * maxX)
    const newY = Math.floor(Math.random() * maxY)

    setBurroPosition({ x: newX, y: newY })
  }

  // Clicar no burro
  const clickBurro = () => {
    // Adicionar pontos
    setScore((prev) => prev + 1)

    // Tocar som de ponto
    const pointSound = new Audio("/burro-sound.mp3")
    pointSound.volume = 0.2
    pointSound.play().catch((e) => console.error("Erro ao tocar áudio:", e))

    // Mover o burro
    moveBurro()
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
            <p className="text-xl text-yellow-300 mb-6">Sua pontuação: {score} pontos</p>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

