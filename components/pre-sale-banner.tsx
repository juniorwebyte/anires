"use client"

import { useState, useEffect } from "react"
import { Coins, ExternalLink, X, ArrowRight, Sparkles, Flame, Clock } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "@/lib/i18n/use-translations"

export default function PreSaleBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState("🚀")
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)
  const t = useTranslations()

  // Efeito de animação ao carregar
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Função para fechar o banner
  const closeBanner = () => {
    setIsVisible(false)
    // Opcional: salvar no localStorage para não mostrar novamente na sessão
    localStorage.setItem("presaleBannerClosed", "true")
  }

  // Verificar se o banner já foi fechado anteriormente
  useEffect(() => {
    const isClosed = localStorage.getItem("presaleBannerClosed") === "true"
    if (isClosed) {
      setIsVisible(false)
    }
  }, [])

  // Efeito de shake a cada 8 segundos para chamar atenção
  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 1000)
    }, 8000)

    return () => clearInterval(shakeInterval)
  }, [])

  // Efeito de emojis flutuantes
  useEffect(() => {
    const emojis = ["🚀", "💰", "🤑", "💎", "🔥", "🌙", "🌟", "🤩"]
    const emojiInterval = setInterval(() => {
      setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)])
      setShowEmoji(true)
      setTimeout(() => setShowEmoji(false), 2000)
    }, 3000)

    return () => clearInterval(emojiInterval)
  }, [])

  // Contador regressivo para a data de encerramento
  useEffect(() => {
    // ===== CONFIGURAÇÃO DA DATA DE ENCERRAMENTO =====
    // Para alterar a data de encerramento no futuro, modifique a linha abaixo
    // Formato: new Date(ano, mês-1, dia, hora, minuto, segundo)
    // Obs: O mês começa em 0 (janeiro = 0, fevereiro = 1, etc.)
    const endDate = new Date(Date.UTC(2025, 3, 28, 2, 59, 0)) // 28 de abril de 2025, às 02:59 UTC
    // ================================================

    const updateCountdown = () => {
      const now = new Date()
      const difference = endDate.getTime() - now.getTime()

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true) // Marca como expirado quando o tempo acabar
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  // Não exibir o banner se estiver expirado ou não visível
  if (!isVisible || isExpired) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 
        ${isAnimating ? "translate-y-full" : "translate-y-0"}
        ${isShaking ? "animate-shake" : ""}`}
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 flex items-center justify-between relative overflow-hidden">
        {/* Partículas de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float-particle"
              style={{
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2 animate-pulse-fast">
          <Flame className="h-5 w-5 text-yellow-300 animate-bounce" />
          <span className="font-bold relative">
            {t.preSaleBanner?.title || "Pré-venda em andamento!"}
            {showEmoji && <span className="absolute -top-4 -right-4 animate-float-up">{currentEmoji}</span>}
          </span>
          <Sparkles className="h-5 w-5 text-yellow-300 animate-spin-slow" />
        </div>

        {/* Contador regressivo */}
        <div className="flex items-center space-x-2 text-sm bg-black/20 px-3 py-1 rounded-full mx-2">
          <Clock className="h-4 w-4 text-yellow-300 animate-pulse" />
          <span className="font-mono">
            {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
          </span>
        </div>

        <div className="flex items-center">
          <Link
            href="https://presale.anires.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center bg-white text-red-600 hover:bg-red-100 px-4 py-1.5 rounded-full font-bold text-sm 
              transition-all hover:scale-110 mr-4 relative overflow-hidden animate-pulse-slow"
          >
            {/* Efeito de brilho no hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-300 to-white opacity-0 group-hover:opacity-30 transition-opacity"></span>

            {/* Seta animada para induzir clique */}
            <span className="absolute -left-4 opacity-0 group-hover:opacity-100 group-hover:left-1 transition-all duration-300">
              <ArrowRight className="h-4 w-4 text-red-600" />
            </span>

            <span className="relative flex items-center">
              <Coins className="mr-2 h-5 w-5 animate-wiggle text-red-600" />
              <span className="group-hover:translate-x-2 transition-transform">
                {t.preSaleBanner?.buyButton || "Comprar com desconto"}
              </span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </span>

            {/* Indicador de destaque */}
            <span className="absolute -right-1 -top-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-500 text-[10px] font-bold flex items-center justify-center">
                🔥
              </span>
            </span>
          </Link>

          <button
            onClick={closeBanner}
            className="text-white hover:text-red-200 transition-colors"
            aria-label={t.preSaleBanner?.close || "Fechar"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

