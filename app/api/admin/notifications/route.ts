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

  // Simular busca de notificações do banco de dados
  const notifications = [
    {
      id: "1",
      title: "Airdrop iniciado!",
      message: "O airdrop do AniRes começou! Participe agora e ganhe tokens.",
      date: "2023-06-01T10:00:00Z",
      sent: true,
    },
    {
      id: "2",
      title: "Listagem em exchange",
      message: "O token $ANIRES será listado na exchange XYZ em breve!",
      date: "2023-06-15T14:30:00Z",
      sent: true,
    },
    {
      id: "3",
      title: "Nova parceria",
      message: "Anunciamos uma nova parceria com a ONG de proteção animal XYZ.",
      date: "2023-07-01T09:15:00Z",
      sent: false,
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
    const data = await request.json()

    // Validar dados
    if (!data.title || !data.message) {
      return NextResponse.json({ error: "Título e mensagem são obrigatórios" }, { status: 400 })
    }

    // Simular envio de notificação
    // Em um ambiente real, você enviaria para um serviço de notificações

    // Simular resposta de sucesso
    return NextResponse.json({
      success: true,
      notification: {
        id: Math.random().toString(36).substring(7),
        title: data.title,
        message: data.message,
        date: new Date().toISOString(),
        sent: true,
      },
    })
  } catch (error) {
    console.error("Erro ao processar notificação:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

