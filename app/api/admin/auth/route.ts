import { type NextRequest, NextResponse } from "next/server"
import { getTokenInfo } from "@/app/actions/token-info"

export async function POST(request: NextRequest) {
  try {
    const { username, password, token: providedToken } = await request.json()

    // Verificar credenciais de administrador
    const isAdminValid = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD

    if (!isAdminValid) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar token
    const { token } = await getTokenInfo()

    if (providedToken !== token) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Autenticação bem-sucedida
    return NextResponse.json({
      success: true,
      message: "Autenticação bem-sucedida",
    })
  } catch (error) {
    console.error("Erro na autenticação:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

