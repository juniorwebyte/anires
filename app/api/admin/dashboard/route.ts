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

  // Simular dados do dashboard
  const dashboardData = {
    totalClaims: 1245,
    pendingClaims: 87,
    totalUsers: 3567,
    activeUsers: 2890,
    tokensDistributed: 1245000,
    recentActivity: [
      {
        id: "1",
        type: "claim",
        user: "0x1a2b...3c4d",
        amount: 1000,
        date: "2023-06-01T10:15:30Z",
      },
      {
        id: "2",
        type: "registration",
        user: "0x5e6f...7g8h",
        date: "2023-06-01T09:45:12Z",
      },
      {
        id: "3",
        type: "claim",
        user: "0x9i0j...1k2l",
        amount: 1000,
        date: "2023-06-01T09:30:45Z",
      },
    ],
  }

  return NextResponse.json(dashboardData)
}

