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

  // Simular estatísticas
  const stats = {
    totalUsers: 3567,
    newUsersToday: 124,
    newUsersWeek: 876,
    totalClaims: 1245,
    completedClaims: 1158,
    pendingClaims: 87,
    tokensDistributed: 1245000,
    twitterFollowers: 12500,
    telegramMembers: 8750,
    dailyActiveUsers: 1250,
    weeklyActiveUsers: 2890,
    monthlyActiveUsers: 3200,
  }

  return NextResponse.json({ stats })
}

