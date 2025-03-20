import { type NextRequest, NextResponse } from "next/server"
import { getTokenInfo } from "@/app/actions/token-info"

// Admin WhatsApp - Números para notificação
const ADMIN_WHATSAPP_NUMBERS = [
  {
    name: "Admin 1",
    number: "5511984801839",
    apiKey: "1782254",
  },
  {
    name: "Admin 2",
    number: "5511947366820",
    apiKey: "7070864",
  },
]

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar dados
    if (!data.walletAddress) {
      return NextResponse.json({ error: "Endereço da carteira é obrigatório" }, { status: 400 })
    }

    // Verificar token se fornecido
    if (data.token) {
      // Obter o token de forma segura
      const { token } = await getTokenInfo()

      if (data.token !== token) {
        return NextResponse.json({ error: "Token inválido" }, { status: 401 })
      }
    }

    // Simular notificação de claim
    console.log("Notificando claim para carteira:", data.walletAddress)

    // Simular resposta de sucesso
    return NextResponse.json({
      success: true,
      message: "Notificação de claim registrada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao processar notificação de claim:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

