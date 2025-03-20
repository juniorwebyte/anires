import { type NextRequest, NextResponse } from "next/server"
import { getTokenInfo } from "@/app/actions/token-info"

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

    // Simular envio de notificação de teste
    console.log("Enviando notificação de teste:", data)

    // Simular resposta de sucesso
    return NextResponse.json({
      success: true,
      message: "Notificação de teste enviada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao enviar notificação de teste:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

