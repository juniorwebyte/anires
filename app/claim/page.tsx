"use client"

import { useState, useEffect, useCallback } from "react"
import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import dynamic from "next/dynamic"
import PerformanceToggle from "@/components/performance-toggle"
import { motion } from "framer-motion"
import SecurityCheck from "@/components/security-check"
import MemePopup from "@/components/meme-popup"

// Lazy load the AirdropClaim component
const LazyAirdropClaim = dynamic(() => import("@/components/lazy-airdrop-claim"), {
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-t-purple-500 border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
  ),
})

export default function ClaimPage() {
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isDomainOfficial, setIsDomainOfficial] = useState(true)
  const [showWelcomePopup, setShowWelcomePopup] = useState(true)
  const [showMemePopup, setShowMemePopup] = useState(false)
  const [memeMessage, setMemeMessage] = useState("")

  // Memes para quando a carteira é conectada
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

  // Conteúdo do popup de boas-vindas
  const welcomeContent = {
    title: "Bem-vindo ao Airdrop Astral! 🌠",
    message:
      "Prepare-se para uma jornada cósmica com nosso Burro Astral! Complete as tarefas e reivindique seus tokens $ANIRES gratuitamente.",
    tips: [
      "Conecte sua carteira para começar",
      "Complete todas as tarefas para maximizar seus tokens",
      "Compartilhe com amigos para ganhar bônus",
      "Fique atento às atualizações do projeto",
    ],
    jokes: [
      "Por que o Bitcoin foi ao médico? Porque estava sofrendo de quedas repentinas!",
      "O que o burro disse para o Bitcoin? 'Você sobe e desce mais que eu no morro!'",
      "Como se chama um burro que minera Bitcoin? Proof of Burro!",
      "Por que o ETH está sempre cansado? Porque está sempre fazendo proof of stake!",
    ],
  }

  // Verificar domínio
  const verifyDomain = useCallback(() => {
    const trustedDomains = ["anires.com", "www.anires.com", "airdrop.anires.com", "localhost", "vercel.app"]
    const currentDomain = window.location.hostname
    return trustedDomains.some((domain) => currentDomain === domain || currentDomain.endsWith(`.${domain}`))
  }, [])

  useEffect(() => {
    const isOfficial = verifyDomain()
    setIsDomainOfficial(isOfficial)

    // Mostrar popup de boas-vindas apenas na primeira visita
    const hasVisitedBefore = localStorage.getItem("hasVisitedClaimPage")
    if (!hasVisitedBefore) {
      setShowWelcomePopup(true)
      localStorage.setItem("hasVisitedClaimPage", "true")
    } else {
      setShowWelcomePopup(false)
    }
  }, [verifyDomain])

  const handleWalletUpdate = (address: string | null, connected: boolean) => {
    setWalletAddress(address || "")
    setIsWalletConnected(connected)

    // Se a carteira foi conectada, mostrar um meme aleatório
    if (connected) {
      const randomMeme = walletConnectedMemes[Math.floor(Math.random() * walletConnectedMemes.length)]
      setMemeMessage(randomMeme)
      setShowMemePopup(true)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar isWalletConnected={isWalletConnected} walletAddress={walletAddress} />

      {/* Componente de verificação de segurança */}
      <SecurityCheck />

      {/* Alerta de segurança para domínios não oficiais */}
      {!isDomainOfficial && (
        <motion.div
          className="w-full max-w-3xl mx-auto mb-6 rounded-lg border border-red-500 bg-red-900/20 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-300">Alerta de Segurança</h3>
              <div className="mt-2 text-sm text-red-200">
                <p>Detectamos um problema de segurança:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Este não é o domínio oficial do Anires Coin!</li>
                  <li>
                    Verifique se você está no site correto:{" "}
                    <span className="font-mono bg-black/30 px-1 rounded">anires.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-3xl w-full z-10 mt-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
            Airdrop Astral
          </h1>
          <p className="text-gray-300">
            Conecte sua carteira e complete as tarefas para receber tokens $ANIRES gratuitamente
          </p>

          {/* Astral theme decorative elements */}
          <div className="relative h-8 mt-4">
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 text-purple-400 text-2xl"
              animate={{
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              ✧ ⋆ ˚ ⋆ ✧ ⋆ ˚
            </motion.div>
          </div>
        </motion.div>

        <LazyAirdropClaim onWalletUpdate={handleWalletUpdate} />
      </div>

      {/* Popup de boas-vindas - Simplificado e centralizado */}
      <MemePopup
        title={welcomeContent.title}
        message={welcomeContent.message}
        isOpen={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
        variant="airdrop"
        autoClose={false}
        showMascot={true}
        mascotVariant="rocket"
      >
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="bg-indigo-900/50 p-3 rounded-lg border border-indigo-500/30">
            <h4 className="font-bold text-indigo-200 mb-2 flex items-center">
              <span className="mr-2">✨</span> Dicas para Maximizar seus Tokens
            </h4>
            <ul className="list-disc list-inside text-white/90 space-y-1 text-sm">
              {welcomeContent.tips.map((tip, index) => (
                <li key={`tip-${index}`}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </MemePopup>

      {/* Popup de meme quando a carteira é conectada */}
      <MemePopup
        message={memeMessage}
        isOpen={showMemePopup}
        onClose={() => setShowMemePopup(false)}
        variant="success"
        autoClose={true}
        autoCloseTime={8000}
        title="Carteira Conectada! 🎉"
        showMascot={true}
        mascotVariant="dancing"
      />

      <Toaster />
      <PerformanceToggle />
    </main>
  )
}

