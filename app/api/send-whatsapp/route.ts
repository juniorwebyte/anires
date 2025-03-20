import { type NextRequest, NextResponse } from "next/server"
import { getTokenInfo } from "@/app/actions/token-info"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar dados
    if (!data.phoneNumber || !data.message) {
      return NextResponse.json({ error: "Número de telefone e mensagem são obrigatórios" }, { status: 400 })
    }

    // Verificar token se fornecido
    if (data.token) {
      // Obter o token de forma segura
      const { token } = await getTokenInfo()

      if (data.token !== token) {
        return NextResponse.json({ error: "Token inválido" }, { status: 401 })
      }
    }

    // Simular envio de mensagem WhatsApp
    console.log("Enviando WhatsApp para:", data.phoneNumber, "Mensagem:", data.message)

    // Simular resposta de sucesso
    return NextResponse.json({
      success: true,
      message: "Mensagem de WhatsApp enviada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem de WhatsApp:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

