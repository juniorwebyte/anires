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

  // Simular notificações de e-mail
  const notifications = [
    {
      id: "1",
      email: "usuario1@exemplo.com",
      subject: "Sua reivindicação do AniRes foi aprovada!",
      message: "Parabéns! Sua reivindicação do AniRes foi aprovada e você recebeu 100 tokens.",
      status: "sent",
      sentAt: "2023-06-01T10:30:45Z",
    },
    {
      id: "2",
      email: "usuario2@exemplo.com",
      subject: "Sua reivindicação do AniRes foi aprovada!",
      message: "Parabéns! Sua reivindicação do AniRes foi aprovada e você recebeu 100 tokens.",
      status: "failed",
      sentAt: "2023-06-01T10:35:12Z",
      error: "E-mail inválido",
    },
    {
      id: "3",
      email: "usuario3@exemplo.com",
      subject: "Sua reivindicação do AniRes foi aprovada!",
      message: "Parabéns! Sua reivindicação do AniRes foi aprovada e você recebeu 100 tokens.",
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
    const { email, subject, message } = await request.json()

    if (!email || !subject || !message) {
      return NextResponse.json({ error: "E-mail, assunto e mensagem são obrigatórios" }, { status: 400 })
    }

    // Simular envio de notificação de e-mail
    console.log(`Enviando e-mail para ${email}: ${subject}`)

    return NextResponse.json({
      success: true,
      message: "Notificação de e-mail enviada com sucesso",
      notification: {
        id: Math.random().toString(36).substring(7),
        email,
        subject,
        message,
        status: "sent",
        sentAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Erro ao enviar notificação de e-mail:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

