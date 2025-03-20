"use client"

// Este hook será usado para acessar as funcionalidades de meme em toda a aplicação
export const useMemeFeatures = () => {
  // Aqui você pode adicionar lógica para acessar o contexto de memes
  // Por enquanto, vamos retornar algumas funções úteis

  const playBurroSound = () => {
    try {
      const audio = new Audio("/burro-sound.mp3")
      audio.volume = 0.3
      audio.play()
    } catch (error) {
      console.error("Erro ao reproduzir som:", error)
    }
  }

  const playLaughSound = () => {
    try {
      const audio = new Audio("/laugh-high-pitch.mp3")
      audio.volume = 0.3
      audio.play()
    } catch (error) {
      console.error("Erro ao reproduzir som:", error)
    }
  }

  // Frases engraçadas aleatórias
  const getRandomJoke = () => {
    const jokes = [
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

    return jokes[Math.floor(Math.random() * jokes.length)]
  }

  return {
    playBurroSound,
    playLaughSound,
    getRandomJoke,
  }
}

