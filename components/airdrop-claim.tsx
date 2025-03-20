"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import WalletConnector from "./wallet-connector"
import AirdropTasks from "./airdrop-tasks"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import { Wallet, LogOut, Stars, Rocket, Sparkles, Zap } from "lucide-react"
import { motion } from "framer-motion"
import AniresMascot from "@/components/anires-mascot"
import MemeButton from "./meme-button"
import MemeEffects from "./meme-effects"
import MemePopup from "./meme-popup"

// Adicionar importação para o hook de meme features
import { useMemeFeatures } from "@/hooks/use-meme-features"

// Adicionar a interface de props no início do arquivo, logo após as importações
interface AirdropClaimProps {
  onWalletUpdate?: (address: string | null, connected: boolean) => void
}

type WalletType = "metamask" | "walletconnect" | "coinbase"

// Frases engraçadas sobre memecoins
const memecoinJokes = [
  "Por que o DOGE atravessou a blockchain? Para chegar ao outro lado da lua! 🌕",
  "Como se chama um burro que investe em memecoins? Inteligente! 🧠",
  "Memecoins são como burros: teimosos, imprevisíveis e às vezes te dão um coice! 🐴",
  "Investi todas as minhas economias em memecoins e agora só me resta rir para não chorar! 😂💸",
  "Minha estratégia de investimento? Comprar alto, vender baixo e reclamar no Twitter! 📉",
  "Se você acha que entende de memecoins, parabéns! Você é oficialmente um especialista em nada! 🏆",
  "Memecoins são como relacionamentos: você nunca sabe quando vão te deixar no chão! 💔",
  "O que um burro disse para o outro sobre memecoins? HODL firme, amigo! 💎🙌",
  "Investi em Anires e agora meu saldo bancário zurra de dor! 🐴💸",
  "Memecoins: porque jogar na loteria era muito mainstream! 🎯",
]

// Atualizar a definição da função para aceitar as props
export default function AirdropClaim({ onWalletUpdate }: AirdropClaimProps) {
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [showMascot, setShowMascot] = useState(false)
  const [mascotVariant, setMascotVariant] = useState<"default" | "dancing" | "flying" | "moon" | "rocket">("default")
  const { locale } = useLanguage()

  // Estados para memes e popups
  const [showMemePopup, setShowMemePopup] = useState(false)
  const [currentMeme, setCurrentMeme] = useState("")
  const [showRandomTip, setShowRandomTip] = useState(false)
  const [randomTip, setRandomTip] = useState("")
  const [showCryptoJoke, setShowCryptoJoke] = useState(false)

  // Dentro da função AirdropClaim, adicionar:
  const memeFeatures = useMemeFeatures()

  // Estado para modo de performance
  const [isPerformanceMode, setIsPerformanceMode] = useState(false)

  // Efeito para mostrar dicas aleatórias periodicamente
  useEffect(() => {
    if (isConnected) {
      let intervalId: NodeJS.Timeout | null = null

      intervalId = setInterval(() => {
        const shouldShowTip = Math.random() > 0.7 // 30% de chance
        if (shouldShowTip) {
          const randomJoke = memecoinJokes[Math.floor(Math.random() * memecoinJokes.length)]
          setRandomTip(randomJoke)
          setShowRandomTip(true)

          // Fechar após alguns segundos
          setTimeout(() => {
            setShowRandomTip(false)
          }, 6000)
        }
      }, 45000) // A cada 45 segundos

      return () => {
        if (intervalId) {
          clearInterval(intervalId)
        }
      }
    }
  }, [isConnected])

  // Adicionar array de memes para carteira conectada
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

  // Novas frases para dicas de crypto
  const cryptoTips = [
    "Dica de Burro #1: Nunca invista mais do que você pode perder em zurros! 🐴",
    "Dica de Burro #2: Diversifique seus memes, não coloque todos os burros na mesma estrebaria! 🏠",
    "Dica de Burro #3: Quando o mercado cair, feche os olhos e zurre mais alto! 📉",
    "Dica de Burro #4: A melhor estratégia é comprar quando os outros estão com medo e vender quando você estiver com medo! 😱",
    "Dica de Burro #5: Se você não entende o whitepaper, provavelmente é porque foi escrito por outro burro! 📝",
    "Dica de Burro #6: Lembre-se que 1 BURRO = 1 BURRO, não importa o preço em dólares! 💰",
    "Dica de Burro #7: A lua é apenas o começo, burros astutos miram em Júpiter! 🪐",
    "Dica de Burro #8: Não confie em nenhum projeto que prometa mais de 10.000% de APY, a menos que seja o Anires! 🚀",
    "Dica de Burro #9: Sempre verifique se o contrato é auditado, ou pelo menos se o desenvolvedor sabe soletrar 'smart contract'! 🔍",
    "Dica de Burro #10: Se você está lendo estas dicas, já está à frente de 99% dos investidores de memecoins! 🧠",
  ]

  // Modificar a função handleWalletConnect para adicionar som:
  const handleWalletConnect = (address: string, type: WalletType) => {
    setWalletAddress(address)
    setWalletType(type)
    setIsConnected(true)

    // Tocar som de burro
    memeFeatures.playBurroSound()

    // Show celebration mascot
    setMascotVariant("dancing")
    setShowMascot(true)

    const mascotTimer = setTimeout(() => setShowMascot(false), 5000)

    // Notificar o componente pai sobre a conexão da carteira
    if (onWalletUpdate) {
      onWalletUpdate(address, true)
    }

    // Mostrar meme aleatório
    const randomMeme = walletConnectedMemes[Math.floor(Math.random() * walletConnectedMemes.length)]
    setCurrentMeme(randomMeme)
    setShowMemePopup(true)

    const memeTimer = setTimeout(() => setShowMemePopup(false), 8000)

    // Limpar timers quando o componente for desmontado
    return () => {
      clearTimeout(mascotTimer)
      clearTimeout(memeTimer)
    }
  }

  // Adicionar função para desconectar a carteira
  const handleDisconnect = () => {
    // Show sad mascot
    setMascotVariant("default")
    setShowMascot(true)
    setTimeout(() => setShowMascot(false), 3000)

    setWalletAddress(null)
    setWalletType(null)
    setIsConnected(false)

    // Notificar o componente pai sobre a desconexão da carteira
    if (onWalletUpdate) {
      onWalletUpdate("", false)
    }

    toast({
      title: "Carteira desconectada",
      description: "Sua carteira foi desconectada com sucesso. Nosso burro está triste!",
      variant: "default",
    })
  }

  // Modificar a função handleRocketToMoon para adicionar som:
  const handleRocketToMoon = () => {
    setMascotVariant("rocket")
    setShowMascot(true)
    setTimeout(() => setShowMascot(false), 3000)

    // Tocar som de risada
    memeFeatures.playLaughSound()

    toast({
      title: "To the moon! 🚀",
      description: "Anires está decolando para a lua! HODL firme!",
      className: "bg-blue-950 border-blue-800 text-blue-100",
    })
  }

  // Mostrar piada de crypto
  const handleShowCryptoJoke = () => {
    const randomJoke = memecoinJokes[Math.floor(Math.random() * memecoinJokes.length)]
    setRandomTip(randomJoke)
    setShowCryptoJoke(true)
    setTimeout(() => setShowCryptoJoke(false), 8000)
  }

  // Animações flutuantes para ícones
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  return (
    <div className="space-y-6 fade-in">
      {!isConnected ? (
        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <div className="flex items-center">
              <motion.div animate={floatingAnimation}>
                <Stars className="h-5 w-5 text-purple-400 mr-2" />
              </motion.div>
              <CardTitle className="text-xl text-purple-400">Conecte sua Carteira</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Conecte sua carteira para participar do Airdrop Astral do Anires
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Astral theme decorative elements */}
            <div className="relative mb-6">
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="flex justify-center space-x-2 text-purple-400/60 text-xs">
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0,
                    }}
                  >
                    ✧
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.3,
                    }}
                  >
                    ⋆
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.6,
                    }}
                  >
                    ˚
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.9,
                    }}
                  >
                    ⋆
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 1.2,
                    }}
                  >
                    ✧
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 1.5,
                    }}
                  >
                    ⋆
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 1.8,
                    }}
                  >
                    ˚
                  </motion.span>
                </div>
              </motion.div>
            </div>

            {/* Anires mascot */}
            <div className="flex justify-center mb-6">
              <AniresMascot variant="default" size="md" showText={true} />
            </div>

            <WalletConnector onConnect={handleWalletConnect} />

            {/* Astral theme decorative elements */}
            <div className="relative mt-6">
              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="flex justify-center space-x-2 text-purple-400/60 text-xs">
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0,
                    }}
                  >
                    ✧
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.3,
                    }}
                  >
                    ⋆
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.6,
                    }}
                  >
                    ˚
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.9,
                    }}
                  >
                    ⋆
                  </motion.span>
                  <motion.span
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 1.2,
                    }}
                  >
                    ✧
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="border-b border-purple-900/20 bg-black/50">
              <div className="flex items-center">
                <motion.div animate={floatingAnimation}>
                  <Stars className="h-5 w-5 text-purple-400 mr-2" />
                </motion.div>
                <CardTitle className="text-xl text-purple-400">Carteira Conectada</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Sua carteira está conectada e pronta para participar do Airdrop Astral
              </CardDescription>
            </CardHeader>
            {/* Modificar o Card de carteira conectada para incluir o botão de desconexão */}
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Wallet className="h-5 w-5 text-purple-300" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-gray-400">Endereço da carteira:</p>
                    <p className="font-mono text-purple-300">
                      {walletAddress
                        ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MemeButton variant="astral" onClick={handleRocketToMoon} showMascot={true} mascotVariant="rocket">
                    <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                      <motion.span
                        animate={{
                          y: [0, -3, 0],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <Rocket className="h-4 w-4 mr-1" />
                      </motion.span>
                      To the moon!
                    </motion.div>
                  </MemeButton>

                  <MemeEffects type="confetti" trigger="click">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisconnect}
                      className="border-red-800/30 hover:bg-red-900/20 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Desconectar
                    </Button>
                  </MemeEffects>
                </div>
              </div>

              {/* Show mascot when triggered */}
              {showMascot && (
                <div className="flex justify-center mt-4">
                  <AniresMascot variant={mascotVariant} size="md" showText={true} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adicionar após o Card de carteira conectada */}
          {isConnected && (
            <div className="mt-4">
              <Card className="border-yellow-500/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
                <CardHeader className="border-b border-yellow-600/20 bg-black/50">
                  <div className="flex items-center">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Sparkles className="h-5 w-5 text-yellow-400 mr-2" />
                    </motion.div>
                    <CardTitle className="text-xl text-yellow-400">Dica de Burro</CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    Mantenha sua carteira segura e nunca compartilhe sua frase secreta!
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <AniresMascot variant="default" size="sm" />
                    <div className="text-sm text-gray-300">
                      <p>
                        Lembre-se: em crypto, até os burros podem ficar ricos, mas só os burros espertos mantêm a
                        riqueza!
                      </p>
                      <p className="mt-2 text-yellow-300 font-semibold">HODL como um verdadeiro burro! 💎🙌</p>

                      <motion.button
                        className="mt-3 text-xs text-blue-400 hover:text-blue-300 flex items-center"
                        onClick={handleShowCryptoJoke}
                        whileHover={{ scale: 1.05, x: 3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Mostrar outra dica de burro
                      </motion.button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <AirdropTasks walletAddress={walletAddress || ""} walletType={walletType || ""} />
        </>
      )}

      {/* Popup de meme após conexão - Agora usando o componente MemePopup */}
      <MemePopup
        isOpen={showMemePopup}
        onClose={() => setShowMemePopup(false)}
        message={currentMeme}
        title="🎉 Burro Conectado! 🎉"
        variant="crypto"
        showMascot={true}
        mascotVariant="dancing"
        autoClose={true}
        autoCloseTime={8000}
      />

      {/* Popup para dicas aleatórias */}
      <MemePopup
        isOpen={showRandomTip}
        onClose={() => setShowRandomTip(false)}
        message={randomTip}
        title="💡 Dica Aleatória de Burro 💡"
        variant="info"
        showMascot={true}
        mascotVariant="default"
        autoClose={true}
        autoCloseTime={6000}
      />

      {/* Popup para piadas de crypto */}
      <MemePopup
        isOpen={showCryptoJoke}
        onClose={() => setShowCryptoJoke(false)}
        message={randomTip}
        title="🤣 Piada de Memecoin 🤣"
        variant="meme"
        showMascot={true}
        mascotVariant="dancing"
        autoClose={true}
        autoCloseTime={8000}
      />
    </div>
  )
}

