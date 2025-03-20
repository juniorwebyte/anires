"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import {
  ArrowDown,
  Coins,
  DogIcon,
  Globe2,
  Heart,
  Users,
  CheckCircle,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getTotalTokens } from "@/app/actions/token-info"

// Importações para lazy loading
import dynamic from "next/dynamic"

// Carregar o componente CountdownTimer de forma lazy
const CountdownTimer = dynamic(() => import("@/components/countdown-timer"), {
  loading: () => <div className="h-24 w-full animate-pulse bg-purple-900/20 rounded-lg"></div>,
  ssr: false,
})

// Adicionar o componente PerformanceToggle à página inicial
import PerformanceToggle from "@/components/performance-toggle"

// Componente para o contador de estatísticas
const StatCounter = ({ value, label, duration = 2 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = Number.parseInt(value.toString().replace(/,/g, ""))
    const incrementTime = (duration * 1000) / end

    // Não iniciar o contador se o valor for muito grande para evitar problemas de performance
    if (end > 10000) {
      setCount(end)
      return
    }

    const timer = setInterval(() => {
      start += 1
      setCount(Math.floor(start))
      if (start >= end) clearInterval(timer)
    }, incrementTime)

    return () => {
      clearInterval(timer)
    }
  }, [value, duration])

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-blue-400 mb-2">{count.toLocaleString()}</div>
      <div className="text-gray-300">{label}</div>
    </div>
  )
}

// Componente para o FAQ
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-blue-800/30 rounded-lg overflow-hidden mb-4">
      <button
        className="w-full p-4 text-left bg-blue-900/20 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-blue-300">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-blue-400" /> : <ChevronDown className="h-5 w-5 text-blue-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-blue-900/10"
          >
            <p className="text-gray-300">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente para o Roadmap
const RoadmapItem = ({ phase, title, items, isActive }) => {
  return (
    <div
      className={`relative p-6 rounded-xl border ${isActive ? "border-blue-500 bg-blue-900/30" : "border-blue-800/30 bg-blue-900/10"}`}
    >
      <div
        className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-sm font-medium ${isActive ? "bg-blue-500 text-white" : "bg-blue-900/50 text-blue-300"}`}
      >
        {phase}
      </div>
      <h3 className="text-xl font-semibold mt-3 mb-4 text-blue-300">{title}</h3>
      <ul className="space-y-2">
        {Array.isArray(items) &&
          items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className={`h-5 w-5 mt-0.5 ${isActive ? "text-blue-400" : "text-gray-500"}`} />
              <span
                className={`${item === "Concepção da ideia do Anires" ? "text-blue-200 font-medium" : "text-gray-300"}`}
              >
                {item}
              </span>
            </li>
          ))}
      </ul>
    </div>
  )
}

// Componente CryptoSymbol para símbolos orbitando
const CryptoSymbol = ({
  symbol,
  delay,
  distance,
  duration,
  size = 24,
  bgColor = "bg-blue-600",
  textColor = "text-white",
  borderColor = "border-blue-400",
}) => {
  return (
    <div
      className="absolute crypto-symbol"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: `orbit ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        className={`flex items-center justify-center w-full h-full rounded-full ${bgColor} border ${borderColor} ${textColor} font-bold animate-pulse-slow`}
        style={{ animationDuration: `${duration * 0.5}s` }}
      >
        {symbol}
      </div>
    </div>
  )
}

// Modificar a importação no topo do arquivo para incluir o hook de tradução
import { useLanguage } from "@/lib/i18n/language-context"

// Importar o componente DebugLanguage para depuração
import DebugLanguage from "@/components/debug-language"

// Dentro da função Home, adicionar o hook useLanguage
export default function Home() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [totalTokens, setTotalTokens] = useState<number>(0)
  const { t } = useLanguage() // Adicionar esta linha para obter a função de tradução

  // Carregar o valor total de tokens de forma segura
  useEffect(() => {
    async function loadTokenInfo() {
      try {
        const { totalTokens } = await getTotalTokens()
        setTotalTokens(totalTokens)
      } catch (error) {
        console.error("Erro ao carregar informações de tokens:", error)
        // Definir um valor padrão em caso de erro
        setTotalTokens(1000000)
      }
    }

    loadTokenInfo()
  }, [])

  // Função para processar itens de roadmap com segurança
  const processRoadmapItems = (key: string): string[] => {
    try {
      const items = t(key)
      if (typeof items === "string") {
        return items.split(",").map((item) => item.trim())
      }
      console.warn(`Tradução para "${key}" não é uma string:`, items)
      return []
    } catch (error) {
      console.error(`Erro ao processar itens do roadmap para "${key}":`, error)
      return []
    }
  }

  // Função para rolagem suave
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Função para o botão Conectar Carteira
  const handleConnectClick = () => {
    router.push("/claim")
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar onConnectClick={handleConnectClick} isWalletConnected={isWalletConnected} walletAddress={walletAddress} />

      {/* 1. Hero Section */}
      <section id="hero" className="relative pt-20 pb-16 md:pt-32 md:pb-24 fade-in">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center lg:text-left z-10">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600"
              >
                {t("home.hero.title")}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
              >
                {t("home.hero.subtitle")}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/claim">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 hover:scale-105 transition-transform"
                  >
                    {t("home.hero.airdropButton")}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:bg-blue-900/20 hover:scale-105 transition-transform"
                  onClick={() => scrollToSection("about")}
                >
                  {t("home.hero.learnMoreButton")}
                </Button>
              </motion.div>

              {/* Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8"
              >
                <CountdownTimer />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex-1 relative"
            >
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto animate-float">
                <Image
                  src="/anires.png"
                  alt="Anires Logo"
                  width={400}
                  height={400}
                  className="rounded-full animate-glow"
                  priority
                  loading="eager"
                />

                {/* Símbolos de criptomoedas orbitando o logo */}
                <div className="absolute inset-0 w-full h-full">
                  <CryptoSymbol
                    symbol="BTC"
                    delay={0}
                    distance={150}
                    duration={15}
                    size={32}
                    bgColor="bg-amber-500"
                    textColor="text-white"
                    borderColor="border-amber-300"
                  />
                  <CryptoSymbol
                    symbol="ETH"
                    delay={2}
                    distance={150}
                    duration={18}
                    size={32}
                    bgColor="bg-indigo-600"
                    textColor="text-white"
                    borderColor="border-indigo-400"
                  />
                  <CryptoSymbol
                    symbol="BNB"
                    delay={4}
                    distance={150}
                    duration={20}
                    size={30}
                    bgColor="bg-yellow-500"
                    textColor="text-black"
                    borderColor="border-yellow-300"
                  />
                  <CryptoSymbol
                    symbol="SOL"
                    delay={6}
                    distance={150}
                    duration={17}
                    size={30}
                    bgColor="bg-gradient-to-r from-purple-600 to-blue-500"
                    textColor="text-white"
                    borderColor="border-blue-300"
                  />
                  <CryptoSymbol
                    symbol="DOT"
                    delay={8}
                    distance={150}
                    duration={19}
                    size={28}
                    bgColor="bg-pink-600"
                    textColor="text-white"
                    borderColor="border-pink-400"
                  />
                  <CryptoSymbol
                    symbol="DOGE"
                    delay={10}
                    distance={150}
                    duration={16}
                    size={28}
                    bgColor="bg-yellow-400"
                    textColor="text-black"
                    borderColor="border-yellow-200"
                  />
                  <CryptoSymbol
                    symbol="AVAX"
                    delay={12}
                    distance={150}
                    duration={21}
                    size={26}
                    bgColor="bg-red-600"
                    textColor="text-white"
                    borderColor="border-red-400"
                  />
                  <CryptoSymbol
                    symbol="ANIRES"
                    delay={14}
                    distance={150}
                    duration={14}
                    size={36}
                    bgColor="bg-gradient-to-r from-blue-600 to-purple-600"
                    textColor="text-white"
                    borderColor="border-blue-300"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ArrowDown className="h-6 w-6 text-blue-400" />
        </motion.div>
      </section>

      {/* 2. Estatísticas Section */}
      <section id="stats" className="py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-800/30 backdrop-blur-sm"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCounter value={10000} label={t("home.stats.participants")} />
              <StatCounter value={100} label={t("home.stats.tokensPerAirdrop")} />
              <StatCounter value={5} label={t("home.stats.simpleTasks")} />
              <StatCounter value={10} label={t("home.stats.ngosBenefited")} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. About Section with Mascot */}
      <section id="about" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mascote.jpg-gQe3rOJGHCTIOITM0ffjL4dxDyvaen.jpeg"
                alt="Anires Mascot"
                width={500}
                height={500}
                className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-400">{t("home.about.title")}</h2>
              <p className="text-gray-300 text-lg mb-6">
                {t("home.about.subtitle")} {t("home.about.paragraph")}
              </p>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-blue-300 mb-2">{t("home.about.transparentTokenomics")}</h4>
                  <p className="text-gray-400">{t("home.about.transparentTokenomicsDesc")}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-blue-300 mb-2">{t("home.about.ongoingAirdrop")}</h4>
                  <p className="text-gray-400">{t("home.about.ongoingAirdropDesc")}</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-16 md:py-24 relative overflow-hidden fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-blue-400"
            >
              {t("home.features.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-2xl mx-auto"
            >
              {t("home.features.subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-800/30 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">{t("home.features.socialImpact")}</h3>
              <p className="text-gray-400">{t("home.features.socialImpactDesc")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-800/30 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Coins className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">{t("home.features.tokenomics")}</h3>
              <p className="text-gray-400">{t("home.features.tokenomicsDesc")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-800/30 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Globe2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-300">{t("home.features.globalCommunity")}</h3>
              <p className="text-gray-400">{t("home.features.globalCommunityDesc")}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Banner Section */}
      <section id="mission" className="py-16 relative overflow-hidden bg-gradient-to-b from-black to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner.jpg-suY3E7tuo3epVJqlAEWq5RFzUZHwjR.jpeg"
                alt="Anires Banner"
                width={600}
                height={600}
                className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-400">{t("home.mission.title")}</h2>
              <div className="space-y-4">
                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                    <DogIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-blue-300">{t("home.mission.realHelp")}</h3>
                    <p className="text-gray-400">{t("home.mission.realHelpDesc")}</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-blue-300">{t("home.mission.engagedCommunity")}</h3>
                    <p className="text-gray-400">{t("home.mission.engagedCommunityDesc")}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Tokenomics Section */}
      <section id="tokenomics" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">{t("home.tokenomics.title")}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-4">{t("home.tokenomics.subtitle")}</p>
            <Link href="/tokenomics">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-900/20 hover:scale-105 transition-transform mt-2"
              >
                {t("home.tokenomics.viewFullButton")}
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-800/30 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-semibold mb-6 text-blue-300">{t("home.tokenomics.distribution")}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{t("home.tokenomics.publicSale")}</span>
                  <span className="text-blue-400 font-medium">40%</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{ width: "40%" }}></div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-300">{t("home.tokenomics.rewards")}</span>
                  <span className="text-blue-400 font-medium">20%</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{ width: "20%" }}></div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-300">{t("home.tokenomics.factoryReserve")}</span>
                  <span className="text-blue-400 font-medium">20%</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{ width: "20%" }}></div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-300">{t("home.tokenomics.partnerships")}</span>
                  <span className="text-blue-400 font-medium">10%</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{ width: "10%" }}></div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-300">{t("home.tokenomics.teamOperations")}</span>
                  <span className="text-blue-400 font-medium">10%</span>
                </div>
                <div className="w-full bg-blue-900/30 rounded-full h-4">
                  <div className="bg-blue-500 h-4 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-6 rounded-xl border border-blue-800/30 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-semibold mb-6 text-blue-300">{t("home.tokenomics.tokenDetails")}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                    <Coins className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-blue-300">{t("home.tokenomics.totalSupply")}</h4>
                    <p className="text-gray-400">{t("home.tokenomics.totalSupplyValue")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-blue-300">{t("home.tokenomics.rewardsTitle")}</h4>
                    <p className="text-gray-400">{t("home.tokenomics.rewardsDesc")}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Roadmap Section */}
      <section id="roadmap" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">{t("home.roadmap.title")}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">{t("home.roadmap.subtitle")}</p>
            <Link href="/roadmap">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-900/20 hover:scale-105 transition-transform"
              >
                {t("home.roadmap.viewFullButton")}
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <RoadmapItem
                phase={t("home.roadmap.phaseZero")}
                title={t("home.roadmap.phaseZeroTitle")}
                items={processRoadmapItems("home.roadmap.phaseZeroItems")}
                isActive={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <RoadmapItem
                phase={t("home.roadmap.phaseOne")}
                title={t("home.roadmap.phaseOneTitle")}
                items={processRoadmapItems("home.roadmap.phaseOneItems")}
                isActive={false}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <RoadmapItem
                phase={t("home.roadmap.phaseTwo")}
                title={t("home.roadmap.phaseTwoTitle")}
                items={processRoadmapItems("home.roadmap.phaseZeroItems")}
                isActive={false}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">{t("home.faq.title")}</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">{t("home.faq.subtitle")}</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <FAQItem question={t("home.faq.whatIs.question")} answer={t("home.faq.whatIs.answer")} />
            <FAQItem question={t("home.faq.airdrop.question")} answer={t("home.faq.airdrop.answer")} />
            <FAQItem question={t("home.faq.listing.question")} answer={t("home.faq.listing.answer")} />
            <FAQItem question={t("home.faq.helping.question")} answer={t("home.faq.helping.answer")} />
            <FAQItem question={t("home.faq.participation.question")} answer={t("home.faq.participation.answer")} />
          </div>
        </div>
      </section>

      {/* 9. CTA Section */}
      <section id="cta" className="py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" }}
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 md:p-12 border border-blue-800/30 backdrop-blur-sm"
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">{t("home.cta.title")}</h2>
              <p className="text-gray-300 text-lg mb-8">{t("home.cta.subtitle")}</p>
              <Link href="/claim">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                    {t("home.cta.button")}
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Toaster />
      <PerformanceToggle />

      {/* Adicionar o componente DebugLanguage */}
      {process.env.NODE_ENV !== "production" && <DebugLanguage />}
    </main>
  )
}

