"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Star, Volume2, VolumeX } from "lucide-react"

export default function BurroEasterEgg() {
  const [visible, setVisible] = useState(true)
  const [message, setMessage] = useState("")
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isRainbow, setIsRainbow] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const { toast } = useToast()

  // Mensagens aleatórias que o burro pode dizer
  const messages = [
    "IIIIHÁÁÁ! Você me encontrou!",
    "Olá humano! Sou o Burro Astral!",
    "Toque em mim para ganhar poderes astrais!",
    "Burro to the moon! 🚀",
    "Hodl Anires Cash! Não venda!",
    "Você sabia que burros são excelentes investidores?",
    "Compre na baixa, venda na alta! Ou melhor, nunca venda!",
    "Sou o mascote oficial do Anires Cash!",
    "Clique em mim 3 vezes para um super poder!",
    "Burros são os novos unicórnios da crypto!",
    "Você foi abençoado pelo Burro da Sorte!",
    "Anires Cash vai explodir! Confia no burro!",
    "Sou um burro, mas não sou burro com investimentos!",
    "Quem tem Anires Cash tem um amigo!",
    "Segredo: os desenvolvedores são todos burros disfarçados!",
    "Você está vendo coisas... eu não existo!",
    "Psiu! Quer uma dica quente? Compre mais Anires!",
    "Eu sou o burro mais rico do metaverso!",
    "Não conte para ninguém, mas... IIIIHÁÁÁ!",
    "Você acaba de ganhar 1000 Burro Coins! (Não existem ainda)",
  ]

  // Efeitos sonoros
  const sounds = {
    burro: "/burro-sound.mp3",
    magic: "/magic-sound.mp3",
    pop: "/pop-sound.mp3",
    laugh: "/laugh-high-pitch.mp3",
    coin: "/coin-sound.mp3",
  }

  // Contador de cliques para easter eggs
  const [clickCount, setClickCount] = useState(0)

  // Escolher uma mensagem aleatória quando o componente montar
  useEffect(() => {
    setMessage(messages[Math.floor(Math.random() * messages.length)])

    // Desaparecer após alguns segundos
    const timer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    // Tocar som de burro
    if (isSoundOn) {
      const audio = new Audio(sounds.burro)
      audio.volume = 0.3
      audio.play().catch((err) => console.error(err))
    }

    return () => clearTimeout(timer)
  }, [])

  // Função para lidar com cliques no burro
  const handleClick = () => {
    // Incrementar contador de cliques
    setClickCount((prev) => prev + 1)

    // Escolher uma nova mensagem aleatória
    setMessage(messages[Math.floor(Math.random() * messages.length)])

    // Resetar o timer de visibilidade
    setVisible(true)

    // Efeito de escala ao clicar
    setScale(1.2)
    setTimeout(() => setScale(1), 200)

    // Tocar som aleatório
    if (isSoundOn) {
      const soundKeys = Object.keys(sounds)
      const randomSound = sounds[soundKeys[Math.floor(Math.random() * soundKeys.length)]]
      const audio = new Audio(randomSound)
      audio.volume = 0.3
      audio.play().catch((err) => console.error(err))
    }

    // Easter eggs baseados no número de cliques
    if (clickCount === 2) {
      // No terceiro clique, fazer o burro girar
      setIsSpinning(true)
      setRotation(rotation + 360 * 3)

      toast({
        title: "Burro Giratório Ativado! 🌀",
        description: "Você desbloqueou o poder do giro infinito!",
        variant: "default",
      })

      // Parar de girar após alguns segundos
      setTimeout(() => {
        setIsSpinning(false)
      }, 3000)
    }

    if (clickCount === 4) {
      // No quinto clique, ativar modo arco-íris
      setIsRainbow(true)

      toast({
        title: "Modo Arco-Íris Ativado! 🌈",
        description: "Você desbloqueou o poder das cores!",
        variant: "default",
      })

      // Desativar após alguns segundos
      setTimeout(() => {
        setIsRainbow(false)
      }, 5000)
    }

    if (clickCount === 9) {
      // No décimo clique, super easter egg
      toast({
        title: "SUPER EASTER EGG! 🎉",
        description: "Você é realmente persistente! Aqui está seu prêmio secreto!",
        variant: "default",
        className: "bg-gradient-to-r from-purple-600 to-blue-600",
      })

      // Ativar confetti
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      })

      // Resetar contador
      setClickCount(0)
    }
  }

  // Alternar som
  const toggleSound = (e) => {
    e.stopPropagation() // Evitar que o clique propague para o burro
    setIsSoundOn(!isSoundOn)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: scale,
            rotate: rotation,
            filter: isRainbow ? "hue-rotate(360deg)" : "none",
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{
            duration: 0.5,
            rotate: { duration: isSpinning ? 3 : 0.5, ease: "linear" },
            filter: {
              duration: isRainbow ? 2 : 0,
              repeat: isRainbow ? Number.POSITIVE_INFINITY : 0,
              repeatType: "reverse",
            },
          }}
          className="flex flex-col items-center justify-center p-4"
          onClick={handleClick}
        >
          <div className="relative">
            <motion.img
              src="/jumento.png"
              alt="Burro Astral"
              className="w-32 h-32 object-contain"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />

            {/* Estrelas ao redor do burro */}
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -left-4"
              animate={{
                rotate: [0, -360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <Star className="h-5 w-5 text-purple-400 fill-purple-400" />
            </motion.div>

            {/* Botão de som */}
            <motion.button
              className="absolute -bottom-2 -right-2 bg-black/50 rounded-full p-1"
              onClick={toggleSound}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSoundOn ? <Volume2 className="h-4 w-4 text-white" /> : <VolumeX className="h-4 w-4 text-white" />}
            </motion.button>
          </div>

          <motion.div
            className="mt-4 bg-black/70 text-white p-3 rounded-xl max-w-xs text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

