"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, X } from "lucide-react"

const cryptoFacts = [
  "O primeiro Bitcoin foi minerado em 2009 por Satoshi Nakamoto, que pode ser um burro disfarçado! 🐴",
  "Se você tivesse comprado $100 em Bitcoin em 2010, hoje você seria rico o suficiente para comprar uma fazenda de burros! 🏡",
  "Existem mais de 10.000 criptomoedas diferentes, mas apenas uma é dedicada aos burros astrais! ✨",
  "O termo 'HODL' surgiu de um erro de digitação em um fórum de Bitcoin em 2013. Até os burros cometem erros! 🤷‍♂️",
  "A blockchain do Ethereum processa mais transações diárias que todas as bolsas de valores do mundo juntas! 🌐",
  "O criador do Dogecoin nunca imaginou que sua 'piada' se tornaria uma criptomoeda bilionária. Quem é o burro agora? 😎",
  "O Bitcoin usa mais eletricidade que alguns países inteiros. Burros são mais ecológicos! 🌱",
  "NFTs são como fotos de burros digitais: todo mundo pode ver, mas só um pode ser o dono! 🖼️",
  "O termo 'whale' (baleia) em crypto se refere a alguém com muitas moedas. Em Anires, chamamos de 'burro gordo'! 🐋",
  "Stablecoins são como burros amarrados: não vão a lugar nenhum, mas pelo menos são estáveis! 🪢",
  "DeFi significa 'Decentralized Finance', ou como os burros chamam: 'Dinheiro Feito por Idiotas'! 💰",
  "O whitepaper do Bitcoin tem apenas 9 páginas. O do Anires tem 1, porque burros são eficientes! 📄",
  "A primeira compra com Bitcoin foi uma pizza que custaria milhões hoje. Burros preferem feno, mais barato! 🍕",
  "Existem apenas 21 milhões de Bitcoins possíveis, mas burros são infinitos no metaverso! ♾️",
  "O termo 'pump and dump' vem do movimento que os burros fazem quando estão felizes e depois tristes! 📈📉",
  "A menor unidade do Bitcoin é chamada 'satoshi'. A menor unidade do Anires é chamada 'zurro'! 🔊",
  "Mais de 20% de todos os Bitcoins estão perdidos para sempre. Burros nunca perdem suas moedas! 🧠",
  "O mercado cripto funciona 24/7, assim como os burros que nunca dormem pensando em seus investimentos! 😴",
  "O termo 'to the moon' surgiu porque os burros sempre sonharam em chegar à lua! 🌕",
  "Smart contracts são como burros bem treinados: fazem exatamente o que foram programados para fazer! 🤖",
]

export default function CryptoFacts() {
  const [showFact, setShowFact] = useState(false)
  const [currentFact, setCurrentFact] = useState("")

  useEffect(() => {
    // Mostrar um fato a cada 3-5 minutos
    const showRandomFact = () => {
      const randomFact = cryptoFacts[Math.floor(Math.random() * cryptoFacts.length)]
      setCurrentFact(randomFact)
      setShowFact(true)

      // Esconder após 10 segundos
      setTimeout(() => {
        setShowFact(false)
      }, 10000)
    }

    // Mostrar o primeiro fato após 60-120 segundos
    const initialTimeout = setTimeout(
      () => {
        showRandomFact()

        // Configurar o intervalo para mostrar fatos periodicamente
        const interval = setInterval(
          () => {
            showRandomFact()
          },
          Math.floor(Math.random() * 120000) + 180000,
        ) // 3-5 minutos

        return () => clearInterval(interval)
      },
      Math.floor(Math.random() * 60000) + 60000,
    ) // 1-2 minutos

    return () => clearTimeout(initialTimeout)
  }, [])

  return (
    <AnimatePresence>
      {showFact && (
        <motion.div
          className="fixed bottom-16 right-4 max-w-xs z-40"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="bg-blue-900/80 backdrop-blur-sm border border-blue-700 rounded-lg p-3 shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Info className="h-4 w-4 text-blue-300 mr-2" />
                </motion.div>
                <h3 className="text-sm font-bold text-blue-300">Fato Crypto Aleatório</h3>
              </div>
              <button onClick={() => setShowFact(false)} className="text-blue-400 hover:text-blue-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-white">{currentFact}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

