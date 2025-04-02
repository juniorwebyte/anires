import { type NextRequest, NextResponse } from "next/server"
import { getTokenInfo } from "@/app/actions/token-info"

export async function POST(request: NextRequest) {
  try {
    const { token: providedToken } = await request.json()

    if (!providedToken) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 400 })
    }

    // Obter o token correto do servidor
    const { token } = await getTokenInfo()

    // Verificar se o token fornecido corresponde ao token correto
    const isValid = providedToken === token

    return NextResponse.json({
      success: true,
      isValid,
    })
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

