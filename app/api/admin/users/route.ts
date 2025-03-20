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

  // Simular lista de usuários
  const users = [
    {
      id: "1",
      walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      twitterUsername: "user1",
      telegramId: "user1_tg",
      claimStatus: "completed",
      tokensReceived: 1000,
      registeredAt: "2023-05-15T08:30:45Z",
      lastActive: "2023-06-01T14:22:10Z",
    },
    {
      id: "2",
      walletAddress: "0x7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3",
      twitterUsername: "user2",
      telegramId: "user2_tg",
      claimStatus: "pending",
      tokensReceived: 0,
      registeredAt: "2023-05-20T11:15:30Z",
      lastActive: "2023-05-31T09:45:22Z",
    },
    {
      id: "3",
      walletAddress: "0x4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0",
      twitterUsername: "user3",
      telegramId: "user3_tg",
      claimStatus: "completed",
      tokensReceived: 1000,
      registeredAt: "2023-05-25T15:40:12Z",
      lastActive: "2023-06-01T10:33:18Z",
    },
  ]

  return NextResponse.json({ users })
}

