"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Twitter, Send, CheckCircle, XCircle, ExternalLink, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { getTokenInfo } from "@/app/actions/token-info"
import MobileReturnHelp from "./mobile-return-help"
import { useMediaQuery } from "@/hooks/use-media-query"

interface AirdropTasksProps {
  walletAddress: string
  walletType: string
}

export default function AirdropTasks({ walletAddress, walletType }: AirdropTasksProps) {
  const { toast } = useToast()
  const [twitterFollowed, setTwitterFollowed] = useState(false)
  const [telegramJoined, setTelegramJoined] = useState(false)
  const [tweetShared, setTweetShared] = useState(false)
  const [progress, setProgress] = useState(0)
  const [token, setToken] = useState("")
  const [showMobileHelp, setShowMobileHelp] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Carregar o token de forma segura
  useEffect(() => {
    async function loadTokenInfo() {
      try {
        const { token } = await getTokenInfo()
        setToken(token)
      } catch (error) {
        console.error("Erro ao carregar informações do token:", error)
      }
    }

    loadTokenInfo()
  }, [])

  // Otimizar o código para melhor performance e corrigir possíveis bugs
  useEffect(() => {
    // Calcular o progresso com base nas tarefas concluídas
    const calculateProgress = () => {
      let newProgress = 0
      if (twitterFollowed) newProgress += 33
      if (telegramJoined) newProgress += 33
      if (tweetShared) newProgress += 34
      setProgress(newProgress)
    }

    calculateProgress()
  }, [twitterFollowed, telegramJoined, tweetShared]) // Adicionado dependências corretas

  const updateProgress = () => {
    let newProgress = 0
    if (twitterFollowed) newProgress += 33
    if (telegramJoined) newProgress += 33
    if (tweetShared) newProgress += 34
    setProgress(newProgress)
  }

  // Função para abrir o Twitter com deep link
  const handleTwitterFollow = () => {
    // Usar o token carregado de forma segura
    const twitterUrl = `https://twitter.com/intent/follow?screen_name=AniresToken&token=${token}`

    // Lógica para abrir o Twitter
    if (isMobile) {
      // Tentar abrir o app nativo primeiro
      window.location.href = `twitter://user?screen_name=AniresToken`

      // Mostrar ajuda para retornar
      setShowMobileHelp(true)

      // Fallback para abrir no navegador após um pequeno delay
      setTimeout(() => {
        window.open(twitterUrl, "_blank")
      }, 500)
    } else {
      window.open(twitterUrl, "_blank")
    }

    // Marcar a tarefa como concluída
    setTwitterFollowed(true)
    updateProgress()

    toast({
      title: "Ótimo trabalho! 🎉",
      description: "Siga-nos no Twitter para ficar por dentro das novidades!",
    })
  }

  // Função para abrir o Telegram com deep link
  const handleTelegramJoin = () => {
    // Usar o token carregado de forma segura
    const telegramUrl = `https://t.me/AniresToken?token=${token}`

    // Lógica para abrir o Telegram
    if (isMobile) {
      // Tentar abrir o app nativo primeiro
      window.location.href = `tg://resolve?domain=AniresToken`

      // Mostrar ajuda para retornar
      setShowMobileHelp(true)

      // Fallback para abrir no navegador após um pequeno delay
      setTimeout(() => {
        window.open(telegramUrl, "_blank")
      }, 500)
    } else {
      window.open(telegramUrl, "_blank")
    }

    // Marcar a tarefa como concluída
    setTelegramJoined(true)
    updateProgress()

    toast({
      title: "Excelente! 🚀",
      description: "Junte-se ao nosso grupo do Telegram para discussões e atualizações!",
    })
  }

  // Função para compartilhar um tweet
  const handleShareTweet = () => {
    // Usar o token carregado de forma segura
    const tweetText = encodeURIComponent(
      `Acabei de descobrir o $ANIRES, um token com propósito que ajuda animais de rua! 🐕 Participe do airdrop agora: https://anires.org/ #Anires #Crypto #Airdrop #MemeWithPurpose`,
    )
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&token=${token}`

    // Lógica para abrir o Twitter para tweetar
    if (isMobile) {
      // Tentar abrir o app nativo primeiro
      window.location.href = `twitter://post?message=${tweetText}`

      // Mostrar ajuda para retornar
      setShowMobileHelp(true)

      // Fallback para abrir no navegador após um pequeno delay
      setTimeout(() => {
        window.open(tweetUrl, "_blank")
      }, 500)
    } else {
      window.open(tweetUrl, "_blank")
    }

    // Marcar a tarefa como concluída
    setTweetShared(true)
    updateProgress()

    toast({
      title: "Incrível! 💫",
      description: "Obrigado por compartilhar sobre o Anires com sua rede!",
    })
  }

  const handleCloseHelp = () => {
    setShowMobileHelp(false)
  }

  return (
    <>
      <Card className="border-blue-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
        <CardHeader className="border-b border-blue-900/20 bg-black/50">
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
              <Sparkles className="h-5 w-5 text-blue-400 mr-2" />
            </motion.div>
            <CardTitle className="text-xl text-blue-400">Tarefas do Airdrop</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Complete as tarefas abaixo para participar do airdrop do Anires
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progresso</span>
              <span className="text-blue-400 font-medium">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-blue-950"
              indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>

          <div className="space-y-6">
            {/* Twitter Follow Task */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Checkbox
                  id="twitter-task"
                  checked={twitterFollowed}
                  className={`${twitterFollowed ? "bg-blue-600 border-blue-600" : "border-blue-800"}`}
                  disabled
                />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="twitter-task"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-gray-200">Seguir no Twitter</span>
                  </label>
                  {twitterFollowed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Siga nossa conta oficial no Twitter para ficar por dentro das novidades.
                </p>
                <Button
                  variant={twitterFollowed ? "outline" : "default"}
                  size="sm"
                  className={`mt-2 ${
                    twitterFollowed
                      ? "border-green-800/30 text-green-400 hover:bg-green-900/20"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handleTwitterFollow}
                >
                  {twitterFollowed ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Seguido
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Seguir no Twitter
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Telegram Join Task */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Checkbox
                  id="telegram-task"
                  checked={telegramJoined}
                  className={`${telegramJoined ? "bg-blue-600 border-blue-600" : "border-blue-800"}`}
                  disabled
                />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="telegram-task"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-gray-200">Entrar no Telegram</span>
                  </label>
                  {telegramJoined ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Junte-se ao nosso grupo do Telegram para discussões e atualizações.
                </p>
                <Button
                  variant={telegramJoined ? "outline" : "default"}
                  size="sm"
                  className={`mt-2 ${
                    telegramJoined
                      ? "border-green-800/30 text-green-400 hover:bg-green-900/20"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handleTelegramJoin}
                >
                  {telegramJoined ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Entrou
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Entrar no Telegram
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Tweet Share Task */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Checkbox
                  id="tweet-task"
                  checked={tweetShared}
                  className={`${tweetShared ? "bg-blue-600 border-blue-600" : "border-blue-800"}`}
                  disabled
                />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="tweet-task"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-gray-200">Compartilhar no Twitter</span>
                  </label>
                  {tweetShared ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <p className="text-sm text-gray-400">Compartilhe sobre o Anires com sua rede no Twitter.</p>
                <Button
                  variant={tweetShared ? "outline" : "default"}
                  size="sm"
                  className={`mt-2 ${
                    tweetShared
                      ? "border-green-800/30 text-green-400 hover:bg-green-900/20"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handleShareTweet}
                >
                  {tweetShared ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Compartilhado
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Compartilhar Tweet
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <div className="mt-8">
            <Button
              className={`w-full ${
                progress === 100
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
              disabled={progress !== 100}
            >
              {progress === 100 ? "Reivindicar Tokens" : "Complete todas as tarefas"}
            </Button>
            {progress !== 100 && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Complete todas as tarefas acima para desbloquear a reivindicação de tokens.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Help Dialog */}
      {showMobileHelp && <MobileReturnHelp onClose={handleCloseHelp} />}
    </>
  )
}

