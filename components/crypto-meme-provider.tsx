"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import MemecoinFloater from "./memecoin-floater"
import MemePopup from "./meme-popup"

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

// Dicas de crypto
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

type MemeContextType = {
  showRandomMeme: () => void
  showRandomTip: () => void
  enableFloatingCoins: (enabled: boolean) => void
  isFloatingCoinsEnabled: boolean
}

const MemeContext = createContext<MemeContextType>({
  showRandomMeme: () => {},
  showRandomTip: () => {},
  enableFloatingCoins: () => {},
  isFloatingCoinsEnabled: false,
})

export const useMemeFeatures = () => useContext(MemeContext)

export default function CryptoMemeProvider({ children }: { children: React.ReactNode }) {
  const [showMemePopup, setShowMemePopup] = useState(false)
  const [showTipPopup, setShowTipPopup] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [floatingCoinsEnabled, setFloatingCoinsEnabled] = useState(true)

  // Mostrar meme aleatório
  const showRandomMeme = () => {
    const randomMeme = memecoinJokes[Math.floor(Math.random() * memecoinJokes.length)]
    setCurrentMessage(randomMeme)
    setShowMemePopup(true)
    setTimeout(() => setShowMemePopup(false), 8000)
  }

  // Mostrar dica aleatória
  const showRandomTip = () => {
    const randomTip = cryptoTips[Math.floor(Math.random() * cryptoTips.length)]
    setCurrentMessage(randomTip)
    setShowTipPopup(true)
    setTimeout(() => setShowTipPopup(false), 8000)
  }

  // Habilitar/desabilitar moedas flutuantes
  const enableFloatingCoins = (enabled: boolean) => {
    setFloatingCoinsEnabled(enabled)
  }

  // Mostrar dicas aleatórias periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% de chance de mostrar uma dica
      if (Math.random() < 0.1) {
        showRandomTip()
      }
    }, 120000) // A cada 2 minutos

    return () => clearInterval(interval)
  }, [])

  return (
    <MemeContext.Provider
      value={{
        showRandomMeme,
        showRandomTip,
        enableFloatingCoins,
        isFloatingCoinsEnabled: floatingCoinsEnabled,
      }}
    >
      {children}

      {/* Componente de moedas flutuantes */}
      <MemecoinFloater enabled={floatingCoinsEnabled} frequency={45} duration={8} />

      {/* Popups de memes */}
      <MemePopup
        isOpen={showMemePopup}
        onClose={() => setShowMemePopup(false)}
        message={currentMessage}
        title="🤣 Piada de Memecoin 🤣"
        variant="meme"
        showMascot={true}
        mascotVariant="dancing"
        autoClose={true}
        autoCloseTime={8000}
      />

      {/* Popups de dicas */}
      <MemePopup
        isOpen={showTipPopup}
        onClose={() => setShowTipPopup(false)}
        message={currentMessage}
        title="💡 Dica de Burro 💡"
        variant="crypto"
        showMascot={true}
        mascotVariant="default"
        autoClose={true}
        autoCloseTime={8000}
      />
    </MemeContext.Provider>
  )
}

