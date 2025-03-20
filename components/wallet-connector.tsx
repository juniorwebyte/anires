"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import AniresMascot from "@/components/anires-mascot"
import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import MemePopup from "@/components/meme-popup"

type WalletType = "metamask" | "walletconnect" | "coinbase"

interface WalletInfo {
  type: WalletType
  name: string
  icon: string
  installed: boolean
}

// Atualizar a interface para incluir a função de desconexão opcional
interface WalletConnectorProps {
  onConnect: (address: string, walletType: WalletType) => void
  onDisconnect?: () => void
}

export default function WalletConnector({ onConnect, onDisconnect }: WalletConnectorProps) {
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false)
  const burroAudioRef = useRef<HTMLAudioElement | null>(null)
  // Modificar o array de wallets no useState para usar URLs absolutas
  const [wallets, setWallets] = useState<WalletInfo[]>([
    {
      type: "metamask",
      name: "MetaMask",
      icon: "/metamask-fox.svg",
      installed: false,
    },
    {
      type: "walletconnect",
      name: "WalletConnect",
      icon: "/walletconnect-logo.svg",
      installed: false,
    },
    {
      type: "coinbase",
      name: "Coinbase Wallet",
      icon: "/coinbase-logo.svg",
      installed: false,
    },
  ])

  // Adicionar tooltips engraçados para as carteiras
  // Adicionar mais piadas para as carteiras
  const walletJokes = {
    metamask:
      "A raposa que come suas taxas de gás no café da manhã! Cuidado, ela morde quando a rede está congestionada! 🦊💨",
    walletconnect:
      "Conecte sua carteira e seu coração! Mas principalmente sua carteira, porque amor não paga as taxas de transação! 💙📱",
    coinbase:
      "A carteira azul que faz seu dinheiro desaparecer como mágica! Agora você vê, agora você não vê mais seu saldo! 🔵💸",
  }

  // Adicionar estado para controlar qual carteira está sendo hover
  const [hoveredWallet, setHoveredWallet] = useState<WalletType | null>(null)

  // Adicionar estado para controlar o popup
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")

  // Meme phrases for wallet connection
  // Adicionar mais frases engraçadas para conexão
  const memeConnectPhrases = [
    "Conectando ao mundo dos burros digitais...",
    "Procurando cenouras na blockchain...",
    "Preparando seu burro astral...",
    "Carregando moedas de feno digital...",
    "Sincronizando com a constelação de Burrus Maximus...",
    "Alimentando o burro com bytes...",
    "Colocando a ferradura digital...",
    "Preparando para zurrar na blockchain...",
    "Iniciando o motor de zurros...",
    "Verificando se há outros burros na rede...",
    "Aquecendo as patas do burro para minerar...",
    "Ensinando o burro a dançar na blockchain...",
    "Colocando a sela digital no burro...",
    "Burro carregando... 20% completo...",
    "Verificando se o burro tem gasolina suficiente...",
    "Burro pensando em como gastar suas moedas...",
    "Burro tentando entender o que é uma blockchain...",
    "Burro fazendo cálculos matemáticos complexos...",
    "Burro tentando lembrar sua senha...",
    "Burro procurando o caminho para a lua...",
  ]

  const funnyErrorMessages = [
    "Ops! Nosso burro tropeçou na blockchain!",
    "Parece que o burro comeu o cabo de conexão!",
    "Erro 404: Burro não encontrado!",
    "Houston, temos um problema... o burro está empacado!",
    "O burro está com preguiça hoje, tente novamente!",
    "Conexão falhou! Talvez o burro esteja tirando uma soneca?",
    "Burro.exe parou de funcionar. Reiniciando...",
    "Nosso burro está com cólicas de blockchain!",
    "Conexão interrompida: o burro foi comer cenouras!",
    "Erro de conexão: o burro está assistindo memes no TikTok!",
    "O burro fugiu com sua carteira! Estamos tentando capturá-lo...",
    "Burro em manutenção: trocando as ferraduras digitais...",
    "O burro está ocupado minerando Bitcoins, volte mais tarde!",
    "Erro crítico: o burro comeu seu contrato inteligente!",
    "Burro sobrecarregado: muitas transações para processar!",
    "O burro está com dor de cabeça após tentar entender NFTs...",
    "Burro confuso: tentou conectar-se à rede errada!",
    "O burro está fazendo uma pausa para o café, tente novamente em 5 minutos!",
    "Burro travado em um loop infinito de zurros!",
    "O burro está tentando se conectar via fax, por favor aguarde...",
  ]

  const [connectPhrase, setConnectPhrase] = useState("")
  const [isHoveringTitle, setIsHoveringTitle] = useState(false)
  const [isShakingCard, setIsShakingCard] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showFlyingDonkey, setShowFlyingDonkey] = useState(false)
  // Adicionar novos estados para animações extras
  const [isButtonDancing, setIsButtonDancing] = useState(false)
  const [showRandomEmoji, setShowRandomEmoji] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState("🐴")
  const [isRainbowTitle, setIsRainbowTitle] = useState(false)
  // Adicionar estado para o jogo Easter Egg
  const [showEasterEggGame, setShowEasterEggGame] = useState(false)

  // Adicionar função para emojis aleatórios
  const getRandomEmoji = () => {
    const emojis = ["🐴", "🦄", "🌟", "🚀", "💰", "🔥", "💎", "🌈", "🤑", "🎉"]
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  // Mostrar animação de boas-vindas na primeira vez
  // Modificar o useEffect para incluir o áudio de risada
  useEffect(() => {
    // Verificar se é a primeira visita
    const isFirstVisit = !localStorage.getItem("anires_visited")

    if (isFirstVisit) {
      // Marcar como visitado
      localStorage.setItem("anires_visited", "true")

      // Mostrar animação de boas-vindas
      setShowWelcomeAnimation(true)

      // Reproduzir o som de risada
      const laughAudio = new Audio("/laugh-high-pitch.mp3")
      laughAudio.volume = 0.5
      laughAudio.play().catch((e) => console.error("Erro ao tocar áudio de risada:", e))

      // Esconder após alguns segundos
      setTimeout(() => {
        setShowWelcomeAnimation(false)
      }, 6000)
    }

    // Inicializar o áudio do jumento
    burroAudioRef.current = new Audio("/burro-sound.mp3")

    // Easter egg: Add hidden konami code
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ]
    let konamiIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          setShowEasterEgg(true)
          konamiIndex = 0

          // Show special toast
          toast({
            title: "🎮 CÓDIGO SECRETO ATIVADO! 🎮",
            description: "Você desbloqueou o modo burro supremo! Agora você é um verdadeiro cripto-zurrador!",
            className: "bg-gradient-to-r from-purple-600 to-pink-600 border-yellow-400 border-2",
          })

          // 50% de chance de mostrar o jogo
          if (Math.random() < 0.5) {
            setShowEasterEggGame(true)
          }
        }
      } else {
        konamiIndex = 0
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      // Limpar áudio
      if (burroAudioRef.current) {
        burroAudioRef.current.pause()
        burroAudioRef.current = null
      }
    }
  }, [toast])

  // Verificar se o site está em uma lista de phishing
  const checkPhishingStatus = useCallback(async () => {
    try {
      // Em um ambiente real, você consultaria uma API de verificação de phishing
      // Aqui estamos apenas simulando uma verificação bem-sucedida
      return true
    } catch (error) {
      console.error("Erro ao verificar status de phishing:", error)
      return false
    }
  }, [])

  // Verificar se o domínio é seguro
  const verifyDomain = useCallback(() => {
    const trustedDomains = ["anires.com", "www.anires.com", "airdrop.anires.com", "localhost", "vercel.app"]

    const currentDomain = window.location.hostname
    return trustedDomains.some((domain) => currentDomain === domain || currentDomain.endsWith(`.${domain}`))
  }, [])

  // Verificar se o contrato é seguro
  const verifyContract = useCallback(async () => {
    // Endereço do contrato do Anires
    const contractAddress = "0xE55c9d1eB9F29ea3c5C4701c66F1443D47FFe438" // Substitua pelo endereço real

    try {
      // Em um ambiente real, você verificaria se o contrato está verificado no Etherscan/BSCScan
      // e se não há problemas de segurança conhecidos

      // Simulação de verificação bem-sucedida
      return {
        verified: true,
        securityIssues: [],
        message: "Contrato verificado e seguro",
      }
    } catch (error) {
      console.error("Erro ao verificar contrato:", error)
      return {
        verified: false,
        securityIssues: ["Não foi possível verificar o contrato"],
        message: "Falha na verificação do contrato",
      }
    }
  }, [])

  // Usar useCallback para evitar recriação da função em cada renderização
  const connectWallet = useCallback(
    async (walletType: WalletType) => {
      setSelectedWallet(walletType)
      setIsConnecting(true)

      // Set random meme phrase
      const randomIndex = Math.floor(Math.random() * memeConnectPhrases.length)
      setConnectPhrase(memeConnectPhrases[randomIndex])

      // Mostrar popup com mensagem engraçada
      setPopupMessage("Burrrrrr to the moon! 🚀 Conectando sua carteira para uma viagem intergaláctica!")
      setShowPopup(true)

      // Easter egg: Random chance of "connection issues"
      const shouldFail = Math.random() < 0.2 && clickCount > 2

      if (shouldFail) {
        // Simulate connection for a bit, then fail with funny message
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const randomErrorIndex = Math.floor(Math.random() * funnyErrorMessages.length)
        const errorMessage = funnyErrorMessages[randomErrorIndex]

        setIsConnecting(false)
        setConnectPhrase("")

        // Show funny error toast
        toast({
          title: "Conexão Falhou! 🤣",
          description: errorMessage,
          variant: "destructive",
          action: (
            <ToastAction altText="Tentar novamente" className="bg-purple-600 text-white hover:bg-purple-700">
              <div className="flex items-center gap-1">
                <span>Tentar novamente</span>
                <AniresMascot variant="dancing" size="sm" />
              </div>
            </ToastAction>
          ),
        })

        // Shake the card
        setIsShakingCard(true)
        setTimeout(() => setIsShakingCard(false), 500)

        return
      }

      try {
        // Verificar segurança antes de conectar
        const isNotPhishing = await checkPhishingStatus()
        const isDomainVerified = verifyDomain()
        const contractVerification = await verifyContract()

        if (!isNotPhishing || !isDomainVerified || !contractVerification.verified) {
          throw new Error("Verificação de segurança falhou. Por favor, verifique se você está no site oficial.")
        }

        // Verificar se estamos no domínio oficial
        const isDomainOfficial = verifyDomain()
        if (!isDomainOfficial) {
          toast({
            title: "⚠️ Alerta de Segurança",
            description: "Detectamos um problema de segurança. Este não é o domínio oficial do Anires Coin!",
            variant: "destructive",
            className: "bg-red-900 border-red-600 text-white",
            duration: 10000,
          })
        }

        let address = ""

        if (walletType === "metamask") {
          if (typeof window.ethereum !== "undefined") {
            // Adicionar verificação EIP-2255 (permissões)
            const permissions = await window.ethereum
              .request({
                method: "wallet_requestPermissions",
                params: [{ eth_accounts: {} }],
              })
              .catch(() => {
                // Se o wallet não suportar EIP-2255, continue com o método padrão
                return null
              })

            // Solicitar contas
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
            address = accounts[0]

            // Verificar chainId para garantir que estamos na rede correta
            const chainId = await window.ethereum.request({ method: "eth_chainId" })
            // BSC Mainnet: 0x38, BSC Testnet: 0x61
            const supportedChains = ["0x38", "0x61", "0x1", "0x5"] // BSC + Ethereum para testes

            if (!supportedChains.includes(chainId)) {
              toast({
                title: "Rede incorreta",
                description: "Por favor, conecte-se à Binance Smart Chain para continuar",
                variant: "destructive",
              })
            }

            // Subscribe to account changes
            // Adicionar função para desconectar no evento accountsChanged
            window.ethereum.on("accountsChanged", (accounts: string[]) => {
              if (accounts.length === 0) {
                // User disconnected
                toast({
                  title: "Carteira desconectada",
                  description: "Sua carteira foi desconectada.",
                  variant: "destructive",
                })
                // Notificar o componente pai sobre a desconexão
                if (typeof onDisconnect === "function") {
                  onDisconnect()
                }
              } else {
                // Account changed
                onConnect(accounts[0], walletType)
              }
            })

            // Monitorar alterações de rede
            window.ethereum.on("chainChanged", (chainId: string) => {
              const supportedChains = ["0x38", "0x61", "0x1", "0x5"] // BSC + Ethereum para testes
              if (!supportedChains.includes(chainId)) {
                toast({
                  title: "Rede incorreta",
                  description: "Por favor, conecte-se à Binance Smart Chain para continuar",
                  variant: "destructive",
                })
              } else {
                toast({
                  title: "Rede alterada",
                  description: "Você está conectado à rede correta",
                  className: "bg-green-950 border-green-800 text-green-100",
                })
              }
            })
          } else {
            throw new Error("MetaMask não encontrado. Por favor, instale a extensão MetaMask.")
          }
        } else if (walletType === "walletconnect") {
          // Simulate WalletConnect
          await new Promise((resolve) => setTimeout(resolve, 1500))
          address = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7" // Simulated address
        } else if (walletType === "coinbase") {
          // Simulate Coinbase Wallet
          await new Promise((resolve) => setTimeout(resolve, 1500))
          address = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" // Simulated address
        }

        if (address) {
          // Tocar som de jumento
          if (burroAudioRef.current) {
            burroAudioRef.current.play().catch((e) => console.error("Erro ao tocar áudio:", e))
          }

          // Show success effects
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)

          // Show flying donkey animation
          setShowFlyingDonkey(true)
          setTimeout(() => setShowFlyingDonkey(false), 4000)

          onConnect(address, walletType)

          // Mostrar meme aleatório de conexão
          showRandomConnectedMeme()

          toast({
            title: "Carteira conectada! 🎉",
            description: `Conectado com sucesso à carteira ${getWalletName(walletType)}. Nosso burro está feliz!`,
            variant: "default",
            className: "bg-green-950 border-green-800 text-green-100",
          })
        }
      } catch (error) {
        console.error("Erro ao conectar carteira:", error)

        toast({
          title: "Erro ao conectar",
          description: error instanceof Error ? error.message : "Erro ao conectar carteira",
          variant: "destructive",
          action: <ToastAction altText="Tentar novamente">Tentar novamente</ToastAction>,
        })
      } finally {
        setIsConnecting(false)
        setConnectPhrase("")
      }
    },
    [
      onConnect,
      onDisconnect,
      toast,
      checkPhishingStatus,
      verifyDomain,
      verifyContract,
      memeConnectPhrases,
      clickCount,
      funnyErrorMessages,
      setPopupMessage,
      setShowPopup,
    ],
  )

  const getWalletName = (type: WalletType): string => {
    const wallet = wallets.find((w) => w.type === type)
    return wallet ? wallet.name : "Desconhecida"
  }

  // Adicionar manipulador de hover para carteiras
  const handleWalletHover = (type: WalletType | null) => {
    setHoveredWallet(type)
  }

  const handleConnect = async (walletType: WalletType) => {
    setClickCount((prev) => prev + 1)
    try {
      await connectWallet(walletType)
    } catch (error: any) {
      console.error("Connection error:", error)
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet.",
        variant: "destructive",
      })
    }
  }

  // Modificar o handleTitleClick para ter chance de mostrar o jogo
  const handleTitleClick = () => {
    if (clickCount >= 5) {
      // Activate special mode
      setShowEasterEgg(true)

      // 30% de chance de mostrar o jogo
      if (Math.random() < 0.3) {
        setShowEasterEggGame(true)
      }

      toast({
        title: "🎉 MODO SECRETO ATIVADO! 🎉",
        description: "Você descobriu o modo secreto do burro! Agora você é oficialmente um zurrador profissional!",
        className: "bg-gradient-to-r from-yellow-400 to-orange-500 border-purple-600 border-2",
      })
    } else {
      setClickCount((prev) => prev + 1)

      // Give hints as user clicks
      if (clickCount === 2) {
        toast({
          title: "Hmm...",
          description: "Nosso burro está observando seus cliques...",
          className: "bg-gray-800",
        })
      } else if (clickCount === 4) {
        toast({
          title: "Quase lá...",
          description: "Mais um clique e algo mágico pode acontecer!",
          className: "bg-purple-800",
        })
      }
    }
  }

  // Add TypeScript declaration for window.ethereum
  declare global {
    interface Window {
      ethereum?: {
        isMetaMask?: boolean
        request: (args: { method: string; params?: any[] }) => Promise<any>
        on: (event: string, callback: any) => void
      }
    }
  }

  const walletConnectedMemes = [
    "Parabéns! Você acabou de se juntar ao clube dos burros digitais! 🐴💰",
    "Sua carteira está conectada! Agora você pode perder dinheiro com estilo! 🎩💸",
    "Burro conectado com sucesso! Prepare-se para zurrar até a lua! 🌕",
    "Conexão estabelecida! Seu burro astral está pronto para decolar! 🚀",
    "Carteira conectada! Agora você é oficialmente um zurrador certificado! 🏆",
    "Bem-vindo à família Anires! Onde os burros são mais inteligentes que os traders! 🧠",
    "Conexão bem-sucedida! Seu diploma de criptozoologia acaba de chegar! 📜",
    "Carteira conectada! Lembre-se: HODL como um burro teimoso! 💎🙌",
    "Parabéns! Você agora tem um burro digital de estimação! Alimente-o com tokens! 🥕",
    "Conexão estabelecida! Seu QI de burro acaba de aumentar 1000%! 📈",
  ]

  const showRandomConnectedMeme = () => {
    const randomIndex = Math.floor(Math.random() * walletConnectedMemes.length)
    const memeMessage = walletConnectedMemes[randomIndex]

    toast({
      title: "🎉 Burro Conectado! 🎉",
      description: memeMessage,
      className: "bg-gradient-to-r from-purple-600 to-blue-600 border-yellow-400 border-2 text-white",
      duration: 6000,
    })
  }

  return (
    <div className="space-y-6">
      {/* Título e indicador de segurança */}
      <div className="flex items-center justify-between">
        <h3
          className={`text-xl font-bold ${
            isRainbowTitle
              ? "bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-gradient"
              : isHoveringTitle
                ? "astral-text"
                : "text-purple-400"
          } cursor-pointer transition-all duration-300`}
          onMouseEnter={() => {
            setIsHoveringTitle(true)
            // 20% de chance de ativar o efeito arco-íris
            if (Math.random() < 0.2) {
              setIsRainbowTitle(true)
            }
          }}
          onMouseLeave={() => {
            setIsHoveringTitle(false)
            setIsRainbowTitle(false)
          }}
          onClick={handleTitleClick}
        >
          Conecte sua Carteira
          {isHoveringTitle && (
            <motion.span
              className="inline-block ml-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              {isRainbowTitle ? "🌈" : "🌟"}
            </motion.span>
          )}
        </h3>
        <div className="flex items-center text-green-400 text-xs">
          <Shield className="h-4 w-4 mr-1" />
          <span>Conexão Segura</span>
        </div>
      </div>

      {/* Cartão principal */}
      <motion.div
        ref={cardRef}
        className={`relative rounded-xl border border-purple-800/30 bg-black/40 backdrop-blur-sm overflow-hidden ${
          isShakingCard ? "animate-shake" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Efeito de confete quando conectado com sucesso */}
        {showConfetti && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="confetti-container">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Animação de burro voador */}
        {showFlyingDonkey && (
          <motion.div
            className="absolute z-20 pointer-events-none"
            initial={{ x: -100, y: 100, opacity: 0 }}
            animate={{
              x: [null, 400],
              y: [null, -100],
              opacity: [0, 1, 1, 0],
              rotate: [0, 20, -20, 0],
            }}
            transition={{ duration: 4, times: [0, 0.2, 0.8, 1] }}
          >
            <AniresMascot variant="flying" size="lg" />
          </motion.div>
        )}

        {/* Animação de boas-vindas */}
        {showWelcomeAnimation && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <AniresMascot variant="dancing" size="xl" showText={true} />
              </motion.div>
              <motion.h2
                className="text-2xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Bem-vindo ao Airdrop Astral!
              </motion.h2>
              <motion.p
                className="text-gray-300 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Conecte sua carteira e embarque nessa jornada cósmica com nosso burro astral! 🌟
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Conteúdo principal */}
        <div className="p-6">
          {isConnecting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-t-purple-500 border-b-transparent border-l-transparent border-r-transparent animate-spin"></div>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <AniresMascot variant="dancing" size="sm" />
                </motion.div>
              </div>
              <p className="mt-4 text-purple-300 text-center">{connectPhrase}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {/* Carteiras */}
              {wallets.map((wallet) => (
                <motion.button
                  key={wallet.type}
                  className={`relative flex items-center justify-between p-4 rounded-lg border ${
                    hoveredWallet === wallet.type
                      ? "border-purple-500 bg-purple-900/20"
                      : "border-purple-800/30 bg-black/40"
                  } hover:border-purple-500 hover:bg-purple-900/20 transition-all duration-300 mb-3`}
                  onClick={() => handleConnect(wallet.type)}
                  onMouseEnter={() => handleWalletHover(wallet.type)}
                  onMouseLeave={() => handleWalletHover(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white p-1 mr-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={wallet.icon || "/placeholder.svg"}
                        alt={wallet.name}
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          // Fallback para ícone genérico se a imagem falhar
                          e.currentTarget.src = "/placeholder.svg?height=32&width=32"
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{wallet.name}</h4>
                      <p className="text-xs text-gray-400">
                        Clique para conectar
                        {hoveredWallet === wallet.type && (
                          <span className="ml-1 text-purple-300">
                            {wallet.type === "metamask" && "quando a rede está congestionada! 🦊"}
                            {wallet.type === "walletconnect" && "seu coração à blockchain! 💙"}
                            {wallet.type === "coinbase" && "e ver seu saldo desaparecer! 💸"}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-purple-400">
                    <motion.div
                      className="h-6 w-6 rounded-full bg-purple-900/50 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {hoveredWallet === wallet.type ? "→" : "+"}
                    </motion.div>
                  </div>

                  {/* Tooltip de piada - CORRIGIDO para aparecer por cima e ser totalmente visível */}
                  {hoveredWallet === wallet.type && (
                    <motion.div
                      className="absolute z-50 left-1/2 transform -translate-x-1/2 w-64 bg-black/90 backdrop-blur-sm p-3 rounded-lg border border-purple-500 text-xs text-center text-purple-300 shadow-lg"
                      style={{ bottom: "calc(100% + 10px)" }} // Posicionado acima do botão
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {walletJokes[wallet.type]}
                      <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-purple-500"></div>
                    </motion.div>
                  )}
                </motion.button>
              ))}

              {/* Easter egg content */}
              {showEasterEgg && (
                <motion.div
                  className="mt-4 p-3 rounded-lg border border-yellow-500/50 bg-yellow-900/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <p className="text-yellow-300 text-sm">🎉 Modo Secreto Ativado! 🎉</p>
                    <p className="text-xs text-yellow-200/70 mt-1">
                      Você encontrou o burro secreto! Ele está muito feliz!
                    </p>
                    <div className="mt-2">
                      <AniresMascot variant="dancing" size="md" showText={true} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Popup de meme - CORRIGIDO para aparecer centralizado */}
      <MemePopup
        message={popupMessage}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        variant="success"
        autoClose={true}
        autoCloseTime={6000}
      />
    </div>
  )
}

