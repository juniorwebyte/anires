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
    const { claimId, walletAddress } = await request.json()

    if (!claimId || !walletAddress) {
      return NextResponse.json({ error: "ID do claim e endereço da carteira são obrigatórios" }, { status: 400 })
    }

    // Simular aprovação de claim
    console.log(`Aprovando claim ${claimId} para carteira ${walletAddress}`)

    // Simular transação na blockchain
    const transactionHash = "0x" + Math.random().toString(16).substring(2, 66)

    return NextResponse.json({
      success: true,
      message: "Claim aprovado com sucesso",
      transactionHash,
    })
  } catch (error) {
    console.error("Erro ao aprovar claim:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

