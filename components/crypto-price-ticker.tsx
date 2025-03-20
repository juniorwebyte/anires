"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Zap } from "lucide-react"

interface CryptoPriceTicker {
  showMemes?: boolean
}

type CryptoPrice = {
  name: string
  symbol: string
  price: number
  change: number
  isMeme?: boolean
}

export default function CryptoPriceTicker({ showMemes = true }: CryptoPriceTicker) {
  const [prices, setPrices] = useState<CryptoPrice[]>([
    { name: "Bitcoin", symbol: "BTC", price: 69420, change: 4.2 },
    { name: "Ethereum", symbol: "ETH", price: 4200, change: 6.9 },
    { name: "Anires", symbol: "BURRO", price: 0.00042069, change: 420.69, isMeme: true },
    { name: "Dogecoin", symbol: "DOGE", price: 0.42, change: -2.1, isMeme: true },
    { name: "Shiba Inu", symbol: "SHIB", price: 0.000069, change: 13.37, isMeme: true },
    { name: "Solana", symbol: "SOL", price: 169.42, change: 7.3 },
    { name: "Cardano", symbol: "ADA", price: 2.1, change: -1.4 },
    { name: "Zurro Coin", symbol: "ZURR", price: 0.0000001337, change: 1337.42, isMeme: true },
    { name: "Polkadot", symbol: "DOT", price: 42.0, change: 3.14 },
    { name: "Avalanche", symbol: "AVAX", price: 89.99, change: 5.5 },
  ])

  const [visiblePrices, setVisiblePrices] = useState<CryptoPrice[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filtrar preços com base na opção de mostrar memes
  useEffect(() => {
    const filteredPrices = showMemes ? prices : prices.filter((p) => !p.isMeme)

    setVisiblePrices(filteredPrices)
  }, [prices, showMemes])

  // Atualizar preços aleatoriamente
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((currentPrices) =>
        currentPrices.map((crypto) => {
          // 70% de chance de mudar o preço
          if (Math.random() > 0.3) {
            const changePercent = (Math.random() * 2 - 1) * (crypto.isMeme ? 10 : 2)
            const newPrice = crypto.price * (1 + changePercent / 100)
            return {
              ...crypto,
              price: Number(newPrice.toFixed(newPrice < 1 ? 8 : 2)),
              change: Number((crypto.change + changePercent / 10).toFixed(2)),
            }
          }
          return crypto
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Rotacionar os preços visíveis
  useEffect(() => {
    if (visiblePrices.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % visiblePrices.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [visiblePrices])

  if (visiblePrices.length === 0) return null

  const currentCrypto = visiblePrices[currentIndex]

  return (
    <div className="fixed bottom-0 left-0 z-40 p-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCrypto.symbol}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center space-x-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg ${
            currentCrypto.isMeme
              ? "bg-gradient-to-r from-purple-900/90 to-blue-900/90 text-white border border-yellow-500/50"
              : "bg-gray-900/90 text-white border border-gray-700/50"
          }`}
        >
          {currentCrypto.isMeme && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
            >
              <Zap className="h-3 w-3 text-yellow-400" />
            </motion.div>
          )}
          <span className="font-bold">{currentCrypto.symbol}</span>
          <span>
            ${currentCrypto.price < 1 ? currentCrypto.price.toFixed(8) : currentCrypto.price.toLocaleString()}
          </span>
          <span className={`flex items-center ${currentCrypto.change >= 0 ? "text-green-400" : "text-red-400"}`}>
            {currentCrypto.change >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-0.5" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-0.5" />
            )}
            {Math.abs(currentCrypto.change)}%
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

