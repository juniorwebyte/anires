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

  // Simular lista de claims
  const claims = [
    {
      id: "1",
      walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      walletType: "metamask",
      twitterUsername: "user1",
      telegramId: "user1_tg",
      amount: 1000,
      status: "completed",
      completedAt: "2023-06-01T10:15:30Z",
      transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    },
    {
      id: "2",
      walletAddress: "0x7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3",
      walletType: "walletconnect",
      twitterUsername: "user2",
      telegramId: "user2_tg",
      amount: 1000,
      status: "pending",
      completedAt: null,
      transactionHash: null,
    },
    {
      id: "3",
      walletAddress: "0x4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0",
      walletType: "coinbase",
      twitterUsername: "user3",
      telegramId: "user3_tg",
      amount: 1000,
      status: "completed",
      completedAt: "2023-05-31T14:22:45Z",
      transactionHash: "0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba",
    },
  ]

  return NextResponse.json({ claims })
}

export async function PUT(request: NextRequest) {
  // Verificar autenticação
  const authHeader = request.headers.get("authorization")

  // Obter o token de forma segura
  const { token } = await getTokenInfo()

  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: "ID e status são obrigatórios" }, { status: 400 })
    }

    // Simular atualização de status do claim
    console.log(`Atualizando claim ${id} para status ${status}`)

    return NextResponse.json({
      success: true,
      message: "Status do claim atualizado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao atualizar claim:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

