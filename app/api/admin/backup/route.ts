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

  // Simular backup de dados
  const backupData = {
    timestamp: new Date().toISOString(),
    users: [
      {
        id: "1",
        walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
        twitterUsername: "user1",
        telegramId: "user1_tg",
      },
      {
        id: "2",
        walletAddress: "0x7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3",
        twitterUsername: "user2",
        telegramId: "user2_tg",
      },
    ],
    claims: [
      {
        id: "1",
        walletAddress: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
        amount: 1000,
        status: "completed",
      },
      {
        id: "2",
        walletAddress: "0x7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3",
        amount: 1000,
        status: "pending",
      },
    ],
    settings: {
      airdropEnabled: true,
      tokensPerClaim: 1000,
      requireTwitter: true,
      requireTelegram: true,
    },
  }

  return NextResponse.json({ backup: backupData })
}

