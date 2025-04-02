"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Calendar, Rocket } from "lucide-react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [loading, setLoading] = useState(true)
  const [launchDate, setLaunchDate] = useState<Date | null>(null)

  // Usar useCallback para evitar recriação da função em cada renderização
  const calculateTimeLeft = useCallback((targetDate: Date) => {
    const difference = targetDate.getTime() - new Date().getTime()

    if (difference <= 0) {
      // O lançamento já ocorreu
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }, [])

  useEffect(() => {
    // CONFIGURAÇÃO DA DATA DE LANÇAMENTO
    // Para alterar a data de lançamento, modifique a linha abaixo
    // Formato: new Date(ano, mês-1, dia, hora, minuto, segundo)
    // Observação: O mês é 0-indexed (0=janeiro, 1=fevereiro, ..., 11=dezembro)

    // Data configurada para: 28 de abril de 2025, às 02:59 UTC
    const targetDate = new Date(Date.UTC(2025, 3, 28, 2, 59, 0))

    // IMPORTANTE: Esta é a data fixa que será usada se não houver uma data armazenada
    // Para alterar a data no futuro, modifique apenas esta linha acima

    // Definir a data de lançamento diretamente, ignorando o armazenamento
    setLaunchDate(targetDate)

    // Calcular imediatamente
    setTimeLeft(calculateTimeLeft(targetDate))
    setLoading(false)

    // Verificar se o usuário prefere reduzir animações
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Atualizar a cada segundo apenas se não preferir reduzir animações
    const updateInterval = prefersReducedMotion ? 10000 : 1000 // 10 segundos ou 1 segundo

    // Atualizar a cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, updateInterval)

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  // Memoizar a formatação da data para evitar recálculos desnecessários
  const formattedDate = useMemo(() => {
    if (!launchDate) return "Em breve"

    // Formatação específica para mostrar a data em formato brasileiro com UTC
    const day = launchDate.getUTCDate().toString().padStart(2, "0")
    const month = (launchDate.getUTCMonth() + 1).toString().padStart(2, "0")
    const year = launchDate.getUTCFullYear()
    const hours = launchDate.getUTCHours().toString().padStart(2, "0")
    const minutes = launchDate.getUTCMinutes().toString().padStart(2, "0")

    return `${day}/${month}/${year}, ${hours}:${minutes} UTC`
  }, [launchDate])

  if (loading) {
    return (
      <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden w-full">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="h-12 w-12 bg-purple-900/50 rounded-full"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-purple-900/50 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-purple-900/50 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden w-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-purple-400 mr-2" />
          <h3 className="text-xl font-bold text-purple-400">Lançamento Oficial do ANIRES</h3>
        </div>

        <div className="flex items-center justify-center mb-2">
          <Rocket className="h-8 w-8 text-purple-500 animate-pulse" />
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-300">
            Data de lançamento: <span className="text-purple-300">{formattedDate}</span>
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-300">{timeLeft.days}</div>
            <div className="text-xs text-gray-400">Dias</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-300">{timeLeft.hours}</div>
            <div className="text-xs text-gray-400">Horas</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-300">{timeLeft.minutes}</div>
            <div className="text-xs text-gray-400">Minutos</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-300">{timeLeft.seconds}</div>
            <div className="text-xs text-gray-400">Segundos</div>
          </div>
        </div>

        <div className="text-center text-gray-300 text-sm">
          <Clock className="h-4 w-4 inline-block mr-1 text-purple-400" />
          Participe agora do pré-registro para garantir seus tokens no lançamento oficial!
        </div>
      </CardContent>
    </Card>
  )
}

