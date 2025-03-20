"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { storeUserTasks } from "@/app/actions"
import { Twitter, Send, CheckCircle, AlertCircle, ExternalLink, RotateCcw } from "lucide-react"
import { isMobileDevice } from "@/lib/utils"
import { useMemeFeatures } from "@/hooks/use-meme-features"
import MemeButton from "./meme-button"
import MemePopup from "./meme-popup"

// Configurações do airdrop
const TWITTER_USERNAME = "AniresCoin"
const TELEGRAM_GROUP = "AniresCoin"
const TWITTER_FOLLOW_TEXT = "Estou participando do airdrop do @AniresCoin! 🚀 #AniresCoin #Airdrop #Crypto"

interface AirdropTasksProps {
  walletAddress: string
  walletType: string
}

export default function AirdropTasks({ walletAddress, walletType }: AirdropTasksProps) {
  const { toast } = useToast()
  const memeFeatures = useMemeFeatures()
  const [twitterUsername, setTwitterUsername] = useState("")
  const [telegramId, setTelegramId] = useState("")
  const [followTwitter, setFollowTwitter] = useState(false)
  const [joinTelegram, setJoinTelegram] = useState(false)
  const [tweetAboutUs, setTweetAboutUs] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showHelpPopup, setShowHelpPopup] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é dispositivo móvel
  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  // Calcular progresso
  useEffect(() => {
    let completedTasks = 0
    if (followTwitter) completedTasks++
    if (joinTelegram) completedTasks++
    if (tweetAboutUs) completedTasks++

    const totalTasks = 3
    const calculatedProgress = Math.round((completedTasks / totalTasks) * 100)
    setProgress(calculatedProgress)
  }, [followTwitter, joinTelegram, tweetAboutUs])

  // Função para abrir o Twitter com deep link
  const handleTwitterFollow = () => {
    if (isMobile) {
      // Mostrar popup com instruções para retornar
      toast({
        title: "Abrindo Twitter...",
        description: "Após seguir nossa conta, volte para este app para continuar o airdrop.",
        className: "bg-blue-950 border-blue-800 text-blue-100",
      })

      // Tentar abrir o app nativo primeiro
      window.location.href = `twitter://user?screen_name=${TWITTER_USERNAME}`

      // Fallback para web após um pequeno delay
      setTimeout(() => {
        if (document.hasFocus()) {
          // Se ainda estiver na mesma página
          window.location.href = `https://twitter.com/${TWITTER_USERNAME}`
        }
      }, 1500)
    } else {
      // Em desktop, abrir em nova aba
      window.open(`https://twitter.com/${TWITTER_USERNAME}`, "_blank")
    }
  }

  // Função para abrir o Telegram com deep link
  const handleTelegramJoin = () => {
    if (isMobile) {
      // Mostrar popup com instruções para retornar
      toast({
        title: "Abrindo Telegram...",
        description: "Após entrar no nosso grupo, volte para este app para continuar o airdrop.",
        className: "bg-blue-950 border-blue-800 text-blue-100",
      })

      // Tentar abrir o app nativo primeiro
      window.location.href = `tg://resolve?domain=${TELEGRAM_GROUP}`

      // Fallback para web após um pequeno delay
      setTimeout(() => {
        if (document.hasFocus()) {
          // Se ainda estiver na mesma página
          window.location.href = `https://t.me/${TELEGRAM_GROUP}`
        }
      }, 1500)
    } else {
      // Em desktop, abrir em nova aba
      window.open(`https://t.me/${TELEGRAM_GROUP}`, "_blank")
    }
  }

  // Função para criar um tweet
  const handleTweet = () => {
    const tweetText = TWITTER_FOLLOW_TEXT

    if (isMobile) {
      // Mostrar popup com instruções para retornar
      toast({
        title: "Abrindo Twitter para tweetar...",
        description: "Após publicar o tweet, volte para este app para continuar o airdrop.",
        className: "bg-blue-950 border-blue-800 text-blue-100",
      })

      // Tentar abrir o app nativo primeiro
      window.location.href = `twitter://post?message=${encodeURIComponent(tweetText)}`

      // Fallback para web após um pequeno delay
      setTimeout(() => {
        if (document.hasFocus()) {
          // Se ainda estiver na mesma página
          window.location.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
        }
      }, 1500)
    } else {
      // Em desktop, abrir em nova aba
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, "_blank")
    }
  }

  // Mostrar popup de ajuda
  const handleShowHelp = () => {
    setShowHelpPopup(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!twitterUsername || !telegramId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome de usuário do Twitter e ID do Telegram.",
        variant: "destructive",
      })
      return
    }

    if (!followTwitter || !joinTelegram || !tweetAboutUs) {
      toast({
        title: "Tarefas incompletas",
        description: "Por favor, complete todas as tarefas para participar do airdrop.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Tocar som de burro
      memeFeatures.playBurroSound()

      // Enviar dados para o servidor
      const result = await storeUserTasks({
        walletAddress,
        walletType,
        twitterUsername,
        telegramId,
        completedAt: new Date().toISOString(),
      })

      if (result.success) {
        // Mostrar popup de sucesso
        setShowSuccessPopup(true)

        toast({
          title: "Tarefas concluídas! 🎉",
          description: "Suas tarefas foram registradas com sucesso. Aguarde a distribuição dos tokens.",
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } else {
        toast({
          title: "Erro ao registrar tarefas",
          description: result.message || "Ocorreu um erro ao registrar suas tarefas. Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao enviar tarefas:", error)
      toast({
        title: "Erro ao registrar tarefas",
        description: "Ocorreu um erro ao registrar suas tarefas. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
      <CardHeader className="border-b border-purple-900/20 bg-black/50">
        <CardTitle className="text-xl text-purple-400">Tarefas do Airdrop</CardTitle>
        <CardDescription className="text-gray-400">
          Complete as tarefas abaixo para participar do airdrop do Anires
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="progress" className="text-sm text-gray-400">
                Progresso das tarefas
              </Label>
              <span className="text-xs font-medium text-purple-400">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-purple-950/30"
              indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-500"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-sm text-gray-300">
                  Nome de usuário do Twitter
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-purple-800/30 bg-black/50 text-gray-400">
                    @
                  </span>
                  <Input
                    id="twitter"
                    placeholder="seu_usuario"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    className="rounded-l-none border-purple-800/30 bg-black/50 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram" className="text-sm text-gray-300">
                  Nome de usuário do Telegram
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-purple-800/30 bg-black/50 text-gray-400">
                    @
                  </span>
                  <Input
                    id="telegram"
                    placeholder="seu_usuario"
                    value={telegramId}
                    onChange={(e) => setTelegramId(e.target.value)}
                    className="rounded-l-none border-purple-800/30 bg-black/50 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="followTwitter"
                  checked={followTwitter}
                  onCheckedChange={(checked) => setFollowTwitter(checked as boolean)}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <label
                      htmlFor="followTwitter"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                    >
                      Seguir no Twitter
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 ml-2"
                      onClick={handleTwitterFollow}
                    >
                      <Twitter className="h-4 w-4 mr-1" />
                      <span className="text-xs">Seguir</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Siga nossa conta oficial no Twitter para receber atualizações.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="joinTelegram"
                  checked={joinTelegram}
                  onCheckedChange={(checked) => setJoinTelegram(checked as boolean)}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <label
                      htmlFor="joinTelegram"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                    >
                      Entrar no grupo do Telegram
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 ml-2"
                      onClick={handleTelegramJoin}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      <span className="text-xs">Entrar</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Junte-se ao nosso grupo do Telegram para discussões e suporte.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="tweetAboutUs"
                  checked={tweetAboutUs}
                  onCheckedChange={(checked) => setTweetAboutUs(checked as boolean)}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <div className="grid gap-1.5 leading-none">
                  <div className="flex items-center">
                    <label
                      htmlFor="tweetAboutUs"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                    >
                      Tweetar sobre o Anires
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 ml-2"
                      onClick={handleTweet}
                    >
                      <Twitter className="h-4 w-4 mr-1" />
                      <span className="text-xs">Tweetar</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">Compartilhe sobre o Anires no Twitter para ajudar a divulgar.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-blue-800/30 hover:bg-blue-900/20 hover:text-blue-300 text-blue-400"
                onClick={handleShowHelp}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Precisa de ajuda?
              </Button>

              <MemeButton
                type="submit"
                disabled={
                  isSubmitting || !twitterUsername || !telegramId || !followTwitter || !joinTelegram || !tweetAboutUs
                }
                loading={isSubmitting}
                variant="astral"
                showMascot={true}
                mascotVariant="dancing"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Enviando..." : "Completar tarefas"}
                </div>
              </MemeButton>
            </div>
          </form>
        </div>
      </CardContent>

      {/* Popup de sucesso */}
      <MemePopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="🎉 Tarefas Concluídas! 🎉"
        message="Parabéns! Você completou todas as tarefas do airdrop. Seus tokens $ANIRES serão distribuídos em breve."
        variant="success"
        showMascot={true}
        mascotVariant="dancing"
        autoClose={false}
      >
        <div className="mt-4 bg-green-900/30 p-3 rounded-lg border border-green-500/30">
          <h4 className="font-bold text-green-300 mb-2">Próximos passos:</h4>
          <ul className="list-disc list-inside text-white/90 space-y-1 text-sm">
            <li>Fique de olho no seu e-mail e redes sociais para atualizações</li>
            <li>Convide seus amigos para participar do airdrop</li>
            <li>Prepare-se para o lançamento oficial do token $ANIRES</li>
          </ul>
        </div>
      </MemePopup>

      {/* Popup de ajuda */}
      <MemePopup
        isOpen={showHelpPopup}
        onClose={() => setShowHelpPopup(false)}
        title="❓ Precisa de ajuda? ❓"
        message="Aqui estão algumas dicas para completar as tarefas do airdrop:"
        variant="info"
        showMascot={true}
        mascotVariant="default"
        autoClose={false}
      >
        <div className="mt-4 space-y-4">
          <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
            <h4 className="font-bold text-blue-300 mb-2">Como completar as tarefas:</h4>
            <ul className="list-disc list-inside text-white/90 space-y-2 text-sm">
              <li>
                <strong>Twitter:</strong> Clique no botão "Seguir" e siga nossa conta oficial. Depois, volte para esta
                página.
                {isMobile && (
                  <p className="text-xs text-blue-200 mt-1 ml-5">
                    Em dispositivos móveis, o app do Twitter será aberto automaticamente se estiver instalado.
                  </p>
                )}
              </li>
              <li>
                <strong>Telegram:</strong> Clique no botão "Entrar" para acessar nosso grupo oficial. Depois, volte para
                esta página.
                {isMobile && (
                  <p className="text-xs text-blue-200 mt-1 ml-5">
                    Em dispositivos móveis, o app do Telegram será aberto automaticamente se estiver instalado.
                  </p>
                )}
              </li>
              <li>
                <strong>Tweet:</strong> Clique no botão "Tweetar" para compartilhar sobre o Anires. Depois, volte para
                esta página.
              </li>
            </ul>
          </div>

          {isMobile && (
            <div className="bg-purple-900/30 p-3 rounded-lg border border-purple-500/30">
              <h4 className="font-bold text-purple-300 mb-2">Dicas para dispositivos móveis:</h4>
              <ul className="list-disc list-inside text-white/90 space-y-1 text-sm">
                <li>Após completar uma tarefa em outro app, use o botão de voltar do seu dispositivo para retornar</li>
                <li>Se você for redirecionado para o navegador, use o botão de voltar ou reabra este app</li>
                <li>Certifique-se de marcar as caixas de seleção após completar cada tarefa</li>
              </ul>
            </div>
          )}

          <div className="flex justify-center mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-purple-800/30 hover:bg-purple-900/20 hover:text-purple-300"
              onClick={() => setShowHelpPopup(false)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Voltar para as tarefas
            </Button>
          </div>
        </div>
      </MemePopup>
    </Card>
  )
}

