"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const cryptoQuotes = [
  {
    text: "HODL não é apenas uma estratégia, é um estilo de vida para burros teimosos.",
    author: "Anônimo Zurrador",
  },
  {
    text: "Compre na baixa, venda na alta. Ou seja um burro e apenas zurre na alta e na baixa.",
    author: "Warren Burroett",
  },
  {
    text: "O mercado pode permanecer irracional mais tempo do que você pode permanecer solvente. Burros são naturalmente irracionais.",
    author: "John Maynard Zurros",
  },
  {
    text: "Não é sobre timing do mercado, é sobre tempo no mercado. Burros são pacientes.",
    author: "Burro Graham",
  },
  {
    text: "Seja ganancioso quando os outros estiverem com medo, e teimoso quando os outros forem gananciosos.",
    author: "Warren Burroett",
  },
  {
    text: "Memecoins são como burros: ninguém sabe para onde vão, mas a jornada é divertida.",
    author: "Satoshi Zurromoto",
  },
  {
    text: "A blockchain é imutável, assim como a teimosia de um burro.",
    author: "Vitalik Burrorin",
  },
  {
    text: "Diversificação é colocar seus zurros em cestas diferentes.",
    author: "Burro Markowitz",
  },
  {
    text: "Não invista em algo que você não entende. É por isso que burros só investem em feno.",
    author: "Burro Munger",
  },
  {
    text: "O risco vem de não saber o que você está fazendo. Burros nunca sabem o que estão fazendo, então estão sempre em risco.",
    author: "Warren Burroett",
  },
]

export default function CryptoQuotes() {
  const [quote, setQuote] = useState(cryptoQuotes[0])

  useEffect(() => {
    // Mudar a citação a cada 30 segundos
    const interval = setInterval(() => {
      const randomQuote = cryptoQuotes[Math.floor(Math.random() * cryptoQuotes.length)]
      setQuote(randomQuote)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="my-6 px-4 py-3 bg-blue-950/30 border border-blue-800/30 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 5,
          }}
          className="mt-1 mr-3 text-blue-400"
        >
          <Quote className="h-5 w-5" />
        </motion.div>
        <div>
          <motion.p
            className="text-gray-300 italic mb-2"
            key={quote.text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            "{quote.text}"
          </motion.p>
          <motion.p
            className="text-sm text-blue-400 text-right"
            key={quote.author}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            — {quote.author}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

