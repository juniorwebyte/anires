import { type NextRequest, NextResponse } from "next/server"
import { getTokenInfo } from "@/app/actions/token-info"

export async function GET(request: NextRequest) {
  // Verificar autenticação
  const authHeader = request.headers.get("authorization")

  // Obter o token de forma segura
  const { token } = await getTokenInfo()

  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  // Simular notificações de WhatsApp
  const notifications = [
    {
      id: "1",
      phoneNumber: "5511987654321",
      message: "Sua reivindicação do AniRes foi aprovado! Você recebeu 1000 tokens.",
      status: "sent",
      sentAt: "2023-06-01T10:30:45Z",
    },
    {
      id: "2",
      phoneNumber: "5511976543210",
      message: "Sua reivindicação do AniRes foi aprovado! Você recebeu 1000 tokens.",
      status: "failed",
      sentAt: "2023-06-01T10:35:12Z",
      error: "Número inválido",
    },
    {
      id: "3",
      phoneNumber: "5511965432109",
      message: "Sua reivindicação do AniRes foi aprovado! Você recebeu 1000 tokens.",
      status: "pending",
      sentAt: null,
    },
  ]

  return NextResponse.json({ notifications })
}

export async function POST(request: NextRequest) {
  // Verificar autenticação
  const authHeader = request.headers.get("authorization")

  // Obter o token de forma segura
  const { token } = await getTokenInfo()

  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const { phoneNumber, message } = await request.json()

    if (!phoneNumber || !message) {
      return NextResponse.json({ error: "Número de telefone e mensagem são obrigatórios" }, { status: 400 })
    }

    // Simular envio de notificação de WhatsApp
    console.log(`Enviando WhatsApp para ${phoneNumber}: ${message}`)

    return NextResponse.json({
      success: true,
      message: "Notificação de WhatsApp enviada com sucesso",
      notification: {
        id: Math.random().toString(36).substring(7),
        phoneNumber,
        message,
        status: "sent",
        sentAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Erro ao enviar notificação de WhatsApp:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

