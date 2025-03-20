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
    const { claimId, reason } = await request.json()

    if (!claimId) {
      return NextResponse.json({ error: "ID do claim é obrigatório" }, { status: 400 })
    }

    // Simular rejeição de claim
    console.log(`Rejeitando claim ${claimId}${reason ? ` por motivo: ${reason}` : ""}`)

    return NextResponse.json({
      success: true,
      message: "Claim rejeitado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao rejeitar claim:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

