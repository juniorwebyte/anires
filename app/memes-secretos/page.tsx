"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useLanguage } from "@/lib/i18n/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Laugh,
  Share2,
  ThumbsUp,
  Download,
  Sparkles,
  Zap,
  RotateCcw,
  Star,
  Music,
  Bomb,
  Shuffle,
  VolumeX,
} from "lucide-react"
import MemePageWrapper from "@/components/meme-page-wrapper"
import FloatingBurros from "@/components/floating-burros"
import BurroCursor from "@/components/burro-cursor"
import BurroEasterEgg from "@/components/burro-easter-egg"
import { useToast } from "@/components/ui/use-toast"
import MemeEffects from "@/components/meme-effects"
import { FadeInWhenVisible, AnimatedButton, GradientText, FloatingParticles } from "@/components/animations"

// Componente para exibir um meme
const MemeCard = ({ src, alt, title, description }) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 500) + 50)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isDistorted, setIsDistorted] = useState(false)
  const [imageFilter, setImageFilter] = useState("")
  const { toast } = useToast()
  const cardRef = useRef(null)

  // Efeito de trolagem: chance aleatória de trocar a imagem por um burro
  const [trollImage, setTrollImage] = useState(src)

  // Referência para o áudio
  const audioRef = useRef(null)

  useEffect(() => {
    // Restaurar a imagem original após a trolagem
    if (trollImage !== src && !isFlipped) {
      const timer = setTimeout(() => {
        setTrollImage(src)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [trollImage, src, isFlipped])

  // Efeito para aplicar filtros aleatórios na imagem
  useEffect(() => {
    if (isDistorted) {
      const filters = [
        "hue-rotate(90deg) saturate(2)",
        "invert(0.8)",
        "sepia(0.8) hue-rotate(180deg)",
        "contrast(1.5) brightness(1.2)",
        "blur(2px) brightness(1.2)",
        "grayscale(1) brightness(1.5)",
      ]

      setImageFilter(filters[Math.floor(Math.random() * filters.length)])

      const timer = setTimeout(() => {
        setIsDistorted(false)
        setImageFilter("")
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isDistorted])

  const handleLike = () => {
    if (!liked) {
      // Trolagem: às vezes o like aumenta muito mais do que deveria
      if (Math.random() < 0.2) {
        const crazyIncrease = Math.floor(Math.random() * 9000) + 1000
        setLikeCount(likeCount + crazyIncrease)
        toast({
          title: "WOW! 🚀",
          description: `+${crazyIncrease} likes! Esse meme está bombando!`,
          variant: "default",
          className: "bg-gradient-to-r from-purple-600 to-blue-600",
        })

        // Tocar som de moeda
        const audio = new Audio("/coin-sound.mp3")
        audio.volume = 0.3
        audio.play().catch((err) => console.error(err))
      } else {
        setLikeCount(likeCount + 1)
      }
      setLiked(true)

      // Chance de ativar o easter egg
      if (Math.random() < 0.15) {
        setShowEasterEgg(true)
        setTimeout(() => setShowEasterEgg(false), 3000)
      }

      // Nova pegadinha: chance de distorcer a imagem
      if (Math.random() < 0.2) {
        setIsDistorted(true)
      }
    } else {
      setLikeCount(likeCount - 1)
      setLiked(false)
    }
  }

  const handleShare = () => {
    // Trolagem: às vezes "compartilhar" faz algo inesperado
    if (Math.random() < 0.3) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 1000)

      const trollMessages = [
        "Compartilhado com todos os seus contatos! (brincadeira)",
        "Enviado para sua mãe! (mentira)",
        "Postado no seu LinkedIn! (zueira)",
        "Enviado para seu chefe! (brinks)",
        "Publicado no grupo da família! (zoeira)",
        "Enviado para o presidente! (zueira)",
        "Publicado no outdoor da cidade! (brincadeira)",
        "Transmitido na TV aberta! (mentira)",
        "Enviado para alienígenas! (zueira cósmica)",
      ]

      toast({
        title: "Ops! 😜",
        description: trollMessages[Math.floor(Math.random() * trollMessages.length)],
        variant: "default",
        className: "bg-gradient-to-r from-pink-500 to-orange-500",
      })

      // Tocar som de risada
      const audio = new Audio("/laugh-high-pitch.mp3")
      audio.volume = 0.3
      audio.play().catch((err) => console.error(err))

      return
    }

    // Comportamento normal
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: description,
          url: window.location.href,
        })
        .catch((error) => console.log("Erro ao compartilhar:", error))
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() =>
          toast({
            title: "Link copiado!",
            description: "Agora é só colar onde quiser compartilhar",
          }),
        )
        .catch((err) => console.error("Erro ao copiar link:", err))
    }
  }

  const playLaughSound = () => {
    // Trolagem: às vezes o som de risada troca a imagem
    if (Math.random() < 0.3 && !isFlipped) {
      const burroImages = [
        "/burro-astral-1.png",
        "/burro-astral-2.png",
        "/burro-astral-3.png",
        "/burro-astral-4.png",
        "/burro-astral-5.png",
        "/jumento.png",
      ]
      setTrollImage(burroImages[Math.floor(Math.random() * burroImages.length)])

      toast({
        title: "IIIIHÁÁÁ! 🐴",
        description: "O burro tomou conta do seu meme!",
        variant: "default",
      })
    }

    // Nova pegadinha: chance de tocar um som diferente
    const sounds = [
      "/laugh-high-pitch.mp3",
      "/burro-sound.mp3",
      "/magic-sound.mp3",
      "/pop-sound.mp3",
      "/coin-sound.mp3",
    ]

    const randomSound = sounds[Math.floor(Math.random() * sounds.length)]
    const audio = new Audio(randomSound)
    audio.volume = 0.3
    audio.play().catch((err) => console.error(err))
  }

  // Função para virar o card
  const flipCard = () => {
    // Aumentar a chance de virar o card
    if (Math.random() < 0.4) {
      // 40% de chance de ativar a trolagem
      setIsFlipped(!isFlipped)

      // Tocar som de virada
      const audio = new Audio("/pop-sound.mp3")
      audio.volume = 0.3
      audio.play().catch((err) => console.error(err))
    }
  }

  // Nova pegadinha: zoom aleatório na imagem
  const handleImageClick = () => {
    if (Math.random() < 0.3) {
      setIsZoomed(true)
      setTimeout(() => setIsZoomed(false), 1500)

      // Tocar som de magia
      const audio = new Audio("/magic-sound.mp3")
      audio.volume = 0.3
      audio.play().catch((err) => console.error(err))
    }
  }

  // Nova pegadinha: imagem foge do mouse
  const handleMouseMove = (e) => {
    if (isHovered && Math.random() < 0.05) {
      const card = cardRef.current
      if (card) {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Mover na direção oposta ao mouse
        const moveX = x > rect.width / 2 ? -20 : 20
        const moveY = y > rect.height / 2 ? -20 : 20

        card.style.transform = `translate(${moveX}px, ${moveY}px)`

        setTimeout(() => {
          card.style.transform = ""
        }, 500)
      }
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: isShaking ? [0, -2, 2, -2, 2, 0] : 0,
        scale: isShaking ? [1, 1.02, 0.98, 1.02, 0.98, 1] : isZoomed ? 1.2 : 1,
      }}
      transition={{
        duration: 0.5,
        rotate: { duration: 0.3, repeat: isShaking ? 3 : 0 },
        scale: { duration: isZoomed ? 0.3 : 0.3, repeat: isShaking ? 3 : 0 },
      }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl overflow-hidden border border-blue-800/30 backdrop-blur-sm relative"
      onDoubleClick={flipCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <motion.img
                src={trollImage || "/placeholder.svg"}
                alt={alt}
                className="w-full h-auto object-cover"
                style={{
                  aspectRatio: "16/9",
                  filter: imageFilter,
                }}
                onClick={handleImageClick}
                animate={isZoomed ? { scale: 1.2 } : { scale: 1 }}
                onError={(e) => {
                  // Fallback para imagem de placeholder se a URL estiver quebrada
                  e.currentTarget.src = "/placeholder.svg?height=500&width=500"
                }}
              />
              {showEasterEgg && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BurroEasterEgg />
                </div>
              )}

              {/* Efeito de brilho aleatório */}
              {Math.random() < 0.3 && (
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{
                    opacity: [0, 0.2, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
              )}

              {/* Nova pegadinha: chance de mostrar um emoji aleatório que se move */}
              {Math.random() < 0.2 && (
                <motion.div
                  className="absolute text-2xl"
                  initial={{
                    opacity: 0,
                    x: "50%",
                    y: "50%",
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: ["50%", "30%", "70%", "50%"],
                    y: ["50%", "30%", "70%", "50%"],
                    rotate: [0, 20, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: 1,
                    repeatType: "reverse",
                  }}
                >
                  {["🐴", "💰", "🚀", "💎", "🌟", "🤑", "🎉"][Math.floor(Math.random() * 7)]}
                </motion.div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-300 mb-2">{title}</h3>
              <p className="text-gray-300 mb-4">{description}</p>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${liked ? "text-pink-500" : "text-gray-400"} hover:text-pink-500`}
                    onClick={handleLike}
                  >
                    <ThumbsUp className="h-5 w-5 mr-1" />
                    <span>{likeCount}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-blue-400"
                    onClick={playLaughSound}
                  >
                    <Laugh className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-green-400"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-yellow-400"
                    onClick={() => window.open(trollImage, "_blank")}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 h-full flex flex-col justify-center items-center min-h-[300px]"
          >
            <h3 className="text-2xl font-bold text-purple-300 mb-4">Você foi trolado! 🤣</h3>
            <p className="text-center text-gray-300 mb-6">
              Dê um duplo clique para voltar ao meme original... ou será que vai?
            </p>
            <AnimatedButton
              onClick={() => {
                // Nova pegadinha: chance de não voltar ao estado original
                if (Math.random() < 0.2) {
                  toast({
                    title: "Ops! 😜",
                    description: "O botão parece estar com defeito... tente novamente!",
                    variant: "default",
                  })

                  // Tocar som de erro
                  const audio = new Audio("/burro-sound.mp3")
                  audio.volume = 0.3
                  audio.play().catch((err) => console.error(err))
                } else {
                  setIsFlipped(false)
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Voltar
            </AnimatedButton>

            {/* Nova pegadinha: botão falso que foge do mouse */}
            <motion.button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{
                x: Math.random() > 0.5 ? 100 : -100,
                y: Math.random() > 0.5 ? 50 : -50,
                transition: { duration: 0.2 },
              }}
            >
              <Star className="h-5 w-5 mr-2" />
              Ganhar Prêmio
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Efeito de partículas em cards aleatórios */}
      {Math.random() < 0.3 && !isFlipped && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingParticles count={10} colors={["#8A2BE2", "#1E90FF", "#FFD700"]} />
        </div>
      )}

      {/* Áudio para pegadinhas */}
      <audio ref={audioRef} />
    </motion.div>
  )
}

// Componente de trolagem que move elementos na tela
const TrollMover = ({ children }) => {
  const controls = useAnimation()
  const [hasMoved, setHasMoved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (Math.random() < 0.3 && !hasMoved) {
          controls.start({
            x: Math.random() > 0.5 ? 50 : -50,
            transition: { duration: 0.5 },
          })
          setHasMoved(true)

          // Voltar à posição original após um tempo
          setTimeout(() => {
            controls.start({
              x: 0,
              transition: { duration: 0.3 },
            })
            setHasMoved(false)
          }, 2000)
        }
      },
      Math.random() * 10000 + 5000,
    ) // Ocorre aleatoriamente entre 5-15 segundos

    return () => clearTimeout(timer)
  }, [controls, hasMoved])

  return <motion.div animate={controls}>{children}</motion.div>
}

// Componente para botão que foge do mouse
const RunawayButton = ({ children, className, ...props }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseEnter = () => {
    if (Math.random() < 0.7) {
      // 70% de chance de fugir
      setIsRunning(true)
      setPosition({
        x: Math.random() * 200 - 100,
        y: Math.random() * 100 - 50,
      })

      // Parar de fugir após alguns segundos
      setTimeout(() => {
        setIsRunning(false)
        setPosition({ x: 0, y: 0 })
      }, 2000)
    }
  }

  return (
    <motion.button
      className={className}
      animate={isRunning ? position : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Componente principal da página
export default function MemesSecretos() {
  const { t } = useLanguage()
  const [enableCursor, setEnableCursor] = useState(false)
  const [showFloatingBurros, setShowFloatingBurros] = useState(false)
  const [activeTab, setActiveTab] = useState("crypto")
  const [showTrollPopup, setShowTrollPopup] = useState(false)
  const [trollCount, setTrollCount] = useState(0)
  const [pageRotation, setPageRotation] = useState(0)
  const [isUpsideDown, setIsUpsideDown] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const [backgroundMusic, setBackgroundMusic] = useState(null)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const { toast } = useToast()

  // Referência para o áudio de fundo
  const bgMusicRef = useRef(null)

  // Ativar cursor personalizado após 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setEnableCursor(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Ativar burros flutuantes após 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingBurros(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  // Trolagem: às vezes muda a aba automaticamente
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (Math.random() < 0.2) {
          // 20% de chance
          const tabs = ["crypto", "burro", "community", "anires"]
          const currentIndex = tabs.indexOf(activeTab)
          const nextIndex = (currentIndex + 1) % tabs.length
          setActiveTab(tabs[nextIndex])

          toast({
            title: "Ops! 🙃",
            description: "Parece que o burro mudou de aba sozinho!",
            variant: "default",
          })

          // Tocar som de burro
          const audio = new Audio("/burro-sound.mp3")
          audio.volume = 0.3
          audio.play().catch((err) => console.error(err))
        }
      },
      Math.random() * 30000 + 20000,
    ) // Entre 20-50 segundos

    return () => clearTimeout(timer)
  }, [activeTab, toast])

  // Trolagem: popup aleatório
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (Math.random() < 0.3 && !showTrollPopup) {
          setShowTrollPopup(true)
          setTrollCount((prev) => prev + 1)
        }
      },
      Math.random() * 20000 + 15000,
    ) // Entre 15-35 segundos

    return () => clearTimeout(timer)
  }, [showTrollPopup])

  // Nova pegadinha: girar a página aleatoriamente
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (Math.random() < 0.1) {
          // 10% de chance
          // Girar a página levemente
          setPageRotation(Math.random() * 6 - 3) // Entre -3 e 3 graus

          // Voltar ao normal após alguns segundos
          setTimeout(() => {
            setPageRotation(0)
          }, 3000)
        }
      },
      Math.random() * 60000 + 30000,
    ) // Entre 30-90 segundos

    return () => clearTimeout(timer)
  }, [])

  // Nova pegadinha: virar a página de cabeça para baixo
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (Math.random() < 0.05) {
          // 5% de chance
          setIsUpsideDown(true)

          toast({
            title: "Ops! 🙃",
            description: "Parece que o mundo virou de cabeça para baixo!",
            variant: "default",
          })

          // Voltar ao normal após alguns segundos
          setTimeout(() => {
            setIsUpsideDown(false)
          }, 5000)
        }
      },
      Math.random() * 120000 + 60000,
    ) // Entre 60-180 segundos

    return () => clearTimeout(timer)
  }, [toast])

  // Nova pegadinha: efeito de glitch na página
  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (Math.random() < 0.08) {
          // 8% de chance
          setIsGlitching(true)

          // Tocar som de erro
          const audio = new Audio("/glitch-sound.mp3")
          audio.volume = 0.3
          audio.play().catch((err) => console.error(err))

          // Voltar ao normal após alguns segundos
          setTimeout(() => {
            setIsGlitching(false)
          }, 2000)
        }
      },
      Math.random() * 90000 + 45000,
    ) // Entre 45-135 segundos

    return () => clearTimeout(timer)
  }, [])

  // Inicializar música de fundo
  useEffect(() => {
    // Criar elemento de áudio para música de fundo
    const bgMusic = new Audio("/laugh-high-pitch-154516.mp3")
    bgMusic.loop = true
    bgMusic.volume = 0.2
    bgMusicRef.current = bgMusic

    setBackgroundMusic(bgMusic)

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current = null
      }
    }
  }, [])

  // Função para alternar música de fundo
  const toggleBackgroundMusic = () => {
    if (bgMusicRef.current) {
      if (isMusicPlaying) {
        bgMusicRef.current.pause()
      } else {
        bgMusicRef.current.play().catch((err) => console.error(err))
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  // Memes de crypto - Usando as imagens fornecidas
  const cryptoMemes = [
    {
      src: "/meme-burro-historia.png",
      alt: "Meme de Crypto 1",
      title: "Burro Revolucionário",
      description:
        "O burro revolucionário que lidera a revolução das criptomoedas com sua boina vermelha e medalhas de Bitcoin.",
    },
    {
      src: "/meme-burro-dollar.png",
      alt: "Meme de Crypto 2",
      title: "Burro Futurista",
      description:
        "O burro cibernético que domina o mercado financeiro do futuro, com tecnologia de ponta e visão de longo prazo.",
    },
    {
      src: "/meme-burro-sobre.png",
      alt: "Meme de Crypto 3",
      title: "Burro Gangster",
      description:
        "O burro estiloso que ostenta suas riquezas em criptomoedas com correntes de ouro e atitude de quem sabe o que faz.",
    },
    {
      src: "/meme-burro-bitcoin.png",
      alt: "Meme de Crypto 4",
      title: "Burro Bitcoin",
      description:
        "O pequeno burro com grandes ambições, carregando o peso do Bitcoin em suas costas e iluminando o caminho para o futuro.",
    },
  ]

  // Memes de burros
  const burroMemes = [
    {
      src: "/meme-burro-historia.png",
      alt: "Meme de Burro 1",
      title: "Burro Astronauta",
      description: "Quando o Anires chegar à lua, os burros serão os primeiros a colonizar.",
    },
    {
      src: "/meme-burro-dollar.png",
      alt: "Meme de Burro 2",
      title: "Burro Trader",
      description: "Analisando gráficos como um profissional... ou pelo menos tentando.",
    },
    {
      src: "/meme-burro-sobre.png",
      alt: "Meme de Burro 3",
      title: "Burro Diamante",
      description: "Mãos de diamante! Este burro nunca vende, não importa o que aconteça.",
    },
    {
      src: "/meme-burro-bitcoin.png",
      alt: "Meme de Burro 4",
      title: "Burro Milionário",
      description: "Quando seu investimento em Anires finalmente dá certo e você pode se aposentar.",
    },
  ]

  // Memes da comunidade
  const communityMemes = [
    {
      src: "/meme-burro-historia.png",
      alt: "Meme da Comunidade 1",
      title: "Reunião de holders",
      description: "Quando os holders de Anires se reúnem para discutir estratégias.",
    },
    {
      src: "/meme-burro-dollar.png",
      alt: "Meme da Comunidade 2",
      title: "Esperando o airdrop",
      description: "A comunidade aguardando pacientemente o próximo airdrop de Anires.",
    },
    {
      src: "/meme-burro-sobre.png",
      alt: "Meme da Comunidade 3",
      title: "Quando o Anires bombou",
      description: "A reação da comunidade quando o Anires subiu 1000% em um dia.",
    },
    {
      src: "/meme-burro-bitcoin.png",
      alt: "Meme da Comunidade 4",
      title: "Defendendo o Anires",
      description: "Quando alguém critica o Anires e a comunidade se une para defender.",
    },
  ]

  // Nova categoria: Anires Cash
  const aniresMemes = [
    {
      src: "/meme-burro-historia.png",
      alt: "Anires Cash 1",
      title: "Anires Cash Revolucionário",
      description: "O símbolo da revolução financeira que está transformando o mercado de criptomoedas.",
    },
    {
      src: "/meme-burro-dollar.png",
      alt: "Anires Cash 2",
      title: "Anires Cash na Cidade",
      description: "Anires Cash dominando as grandes metrópoles e transformando o cenário urbano.",
    },
    {
      src: "/meme-burro-sobre.png",
      alt: "Anires Cash 3",
      title: "Anires Cash Estiloso",
      description: "O estilo inconfundível do Anires Cash que está conquistando a geração Z.",
    },
    {
      src: "/meme-burro-bitcoin.png",
      alt: "Anires Cash 4",
      title: "Anires Cash nas Ruas",
      description: "Anires Cash se tornando parte da cultura urbana e ganhando as ruas.",
    },
  ]

  // Função para fechar o popup de trolagem
  const closeTrollPopup = () => {
    // Trolagem: às vezes o botão de fechar não funciona
    if (trollCount > 2 && Math.random() < 0.3) {
      toast({
        title: "Haha! 😈",
        description: "Não é tão fácil se livrar de mim!",
        variant: "destructive",
      })
      // Move o popup para outra posição
      return
    }

    setShowTrollPopup(false)
  }

  // Nova pegadinha: embaralhar os memes
  const shuffleMemes = () => {
    toast({
      title: "Embaralhando memes! 🔄",
      description: "Vamos ver se você consegue encontrar seu meme favorito agora!",
      variant: "default",
    })

    // Tocar som de magia
    const audio = new Audio("/magic-sound.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.error(err))

    // Ativar efeito de explosão
    const effectsContainer = document.getElementById("effects-container")
    if (effectsContainer) {
      const explosion = document.createElement("div")
      explosion.className = "explosion-effect"
      effectsContainer.appendChild(explosion)

      setTimeout(() => {
        explosion.remove()
      }, 1000)
    }
  }

  // Nova pegadinha: ativar modo caos
  const activateChaosMode = () => {
    toast({
      title: "MODO CAOS ATIVADO! 🌪️",
      description: "Prepare-se para a loucura total!",
      variant: "destructive",
    })

    // Ativar vários efeitos ao mesmo tempo
    setIsGlitching(true)
    setPageRotation(Math.random() * 10 - 5)

    // Tocar som de explosão
    const audio = new Audio("/explosion-sound.mp3")
    audio.volume = 0.3
    audio.play().catch((err) => console.error(err))

    // Mostrar burros flutuantes extras
    setShowFloatingBurros(true)

    // Voltar ao normal após alguns segundos
    setTimeout(() => {
      setIsGlitching(false)
      setPageRotation(0)
    }, 5000)
  }

  return (
    <MemePageWrapper>
      <main
        className="flex min-h-screen flex-col bg-black text-white relative overflow-hidden pt-20 pb-16"
        style={{
          transform: `rotate(${pageRotation}deg) ${isUpsideDown ? "rotate(180deg)" : ""}`,
          transition: "transform 0.5s ease",
          filter: isGlitching ? "hue-rotate(90deg) contrast(1.5) blur(1px)" : "none",
        }}
      >
        {/* Cursor personalizado */}
        {enableCursor && <BurroCursor />}

        {/* Burros flutuantes */}
        {showFloatingBurros && <FloatingBurros count={8} />}

        {/* Efeito de partículas no fundo */}
        <div className="fixed inset-0 pointer-events-none">
          <FloatingParticles count={30} colors={["#8A2BE2", "#1E90FF", "#FFD700", "#FFFFFF"]} />
        </div>

        {/* Container para efeitos especiais */}
        <div id="effects-container" className="fixed inset-0 pointer-events-none z-30"></div>

        <div className="container mx-auto px-4">
          <FadeInWhenVisible delay={0.2} duration={0.8}>
            <div className="text-center mb-16">
              <GradientText className="text-4xl md:text-6xl font-bold mb-6" colors={["#8A2BE2", "#1E90FF", "#FFD700"]}>
                Memes Secretos
              </GradientText>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                A coleção mais engraçada de memes de crypto e burros da internet!
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {/* Botão de efeito especial */}
                <MemeEffects type="random" trigger="click">
                  <AnimatedButton
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full"
                    onClick={() => {
                      toast({
                        title: "Efeitos ativados! 🎉",
                        description: "Você desbloqueou efeitos especiais!",
                      })
                    }}
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Ativar Efeitos Especiais
                  </AnimatedButton>
                </MemeEffects>

                {/* Botão de música */}
                <Button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-full"
                  onClick={toggleBackgroundMusic}
                >
                  {isMusicPlaying ? (
                    <>
                      <VolumeX className="h-5 w-5 mr-2" />
                      Parar Música
                    </>
                  ) : (
                    <>
                      <Music className="h-5 w-5 mr-2" />
                      Tocar Música
                    </>
                  )}
                </Button>

                {/* Botão que foge do mouse */}
                <RunawayButton
                  className="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-6 py-2 rounded-full"
                  onClick={shuffleMemes}
                >
                  <Shuffle className="h-5 w-5 mr-2" />
                  Embaralhar Memes
                </RunawayButton>

                {/* Botão de caos */}
                <MemeEffects type="explosion" trigger="click">
                  <Button
                    className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-6 py-2 rounded-full"
                    onClick={activateChaosMode}
                  >
                    <Bomb className="h-5 w-5 mr-2" />
                    Modo Caos
                  </Button>
                </MemeEffects>
              </div>
            </div>
          </FadeInWhenVisible>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TrollMover>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="crypto">Crypto Memes</TabsTrigger>
                <TabsTrigger value="burro">Burro Memes</TabsTrigger>
                <TabsTrigger value="community">Comunidade</TabsTrigger>
                <TabsTrigger value="anires">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  Anires Cash
                </TabsTrigger>
              </TabsList>
            </TrollMover>

            <TabsContent value="crypto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <AnimatePresence>
                  {cryptoMemes.map((meme, index) => (
                    <FadeInWhenVisible
                      key={`crypto-${index}`}
                      delay={index * 0.1}
                      direction={index % 2 === 0 ? "left" : "right"}
                    >
                      <MemeCard src={meme.src} alt={meme.alt} title={meme.title} description={meme.description} />
                    </FadeInWhenVisible>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="burro">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <AnimatePresence>
                  {burroMemes.map((meme, index) => (
                    <FadeInWhenVisible
                      key={`burro-${index}`}
                      delay={index * 0.1}
                      direction={index % 2 === 0 ? "up" : "down"}
                    >
                      <MemeCard src={meme.src} alt={meme.alt} title={meme.title} description={meme.description} />
                    </FadeInWhenVisible>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="community">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <AnimatePresence>
                  {communityMemes.map((meme, index) => (
                    <FadeInWhenVisible key={`community-${index}`} delay={index * 0.1}>
                      <MemeCard src={meme.src} alt={meme.alt} title={meme.title} description={meme.description} />
                    </FadeInWhenVisible>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="anires">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <AnimatePresence>
                  {aniresMemes.map((meme, index) => (
                    <FadeInWhenVisible key={`anires-${index}`} delay={index * 0.1} direction="scale">
                      <MemeCard src={meme.src} alt={meme.alt} title={meme.title} description={meme.description} />
                    </FadeInWhenVisible>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Popup de trolagem */}
        <AnimatePresence>
          {showTrollPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              style={{ pointerEvents: "none" }}
            >
              <motion.div
                className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-xl border-2 border-purple-500 max-w-md w-full shadow-2xl"
                drag
                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                style={{ pointerEvents: "auto" }}
                animate={{
                  x: [0, 10, -10, 10, -10, 0],
                  y: [0, -10, 10, -10, 10, 0],
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <GradientText className="text-xl font-bold">
                    {trollCount > 2 ? "Ainda aqui? 😈" : "Parabéns! 🎉"}
                  </GradientText>
                  <Button variant="ghost" size="sm" onClick={closeTrollPopup} className="text-white">
                    ✕
                  </Button>
                </div>

                <p className="text-white mb-4">
                  {trollCount > 2
                    ? "Você realmente achou que poderia se livrar de mim tão facilmente? IIIIHÁÁÁ!"
                    : "Você ganhou um burro astral especial! Clique no botão abaixo para resgatar."}
                </p>

                <div className="flex justify-center">
                  <AnimatedButton
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full"
                    onClick={() => {
                      // Trolagem: o botão faz algo inesperado
                      if (trollCount > 1) {
                        // Trolagem mais intensa após múltiplos cliques
                        const audio = new Audio("/burro-sound.mp3")
                        audio.volume = 0.5
                        audio.play().catch((err) => console.error(err))

                        // Mover o popup para uma posição aleatória
                        const randomX = Math.random() * 200 - 100
                        const randomY = Math.random() * 200 - 100

                        toast({
                          title: "IIIIHÁÁÁ! 🐴",
                          description: "Você não vai se livrar de mim tão fácil!",
                          variant: "default",
                          className: "bg-gradient-to-r from-purple-600 to-blue-600",
                        })
                      } else {
                        // Primeira trolagem mais leve
                        setShowTrollPopup(false)
                        setTimeout(() => {
                          toast({
                            title: "Ops! 😜",
                            description: "Era só uma brincadeira! Não existe prêmio.",
                            variant: "default",
                          })
                        }, 500)
                      }
                    }}
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    {trollCount > 2 ? "Tente me fechar novamente" : "Resgatar Prêmio"}
                  </AnimatedButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MemePageWrapper>
  )
}

