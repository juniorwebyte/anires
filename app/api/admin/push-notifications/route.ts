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

  // Simular notificações push
  const notifications = [
    {
      id: "1",
      title: "Airdrop iniciado!",
      message: "O airdrop do AniRes começou! Participe agora e ganhe tokens.",
      target: "all",
      status: "sent",
      sentAt: "2023-06-01T10:30:45Z",
      deliveredCount: 2500,
    },
    {
      id: "2",
      title: "Listagem em exchange",
      message: "O token $ANIRES será listado na exchange XYZ em breve!",
      target: "all",
      status: "sent",
      sentAt: "2023-06-15T14:30:00Z",
      deliveredCount: 3000,
    },
    {
      id: "3",
      title: "Nova parceria",
      message: "Anunciamos uma nova parceria com a ONG de proteção animal XYZ.",
      target: "all",
      status: "scheduled",
      scheduledFor: "2023-07-01T09:00:00Z",
      sentAt: null,
      deliveredCount: 0,
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
    const { title, message, target, scheduledFor } = await request.json()

    if (!title || !message) {
      return NextResponse.json({ error: "Título e mensagem são obrigatórios" }, { status: 400 })
    }

    // Simular envio ou agendamento de notificação push
    if (scheduledFor) {
      console.log(`Agendando notificação push para ${scheduledFor}: ${title}`)

      return NextResponse.json({
        success: true,
        message: "Notificação push agendada com sucesso",
        notification: {
          id: Math.random().toString(36).substring(7),
          title,
          message,
          target: target || "all",
          status: "scheduled",
          scheduledFor,
          sentAt: null,
          deliveredCount: 0,
        },
      })
    } else {
      console.log(`Enviando notificação push: ${title}`)

      return NextResponse.json({
        success: true,
        message: "Notificação push enviada com sucesso",
        notification: {
          id: Math.random().toString(36).substring(7),
          title,
          message,
          target: target || "all",
          status: "sent",
          sentAt: new Date().toISOString(),
          deliveredCount: Math.floor(Math.random() * 3000) + 1000,
        },
      })
    }
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

