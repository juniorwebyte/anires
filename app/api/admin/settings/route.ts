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

  // Simular configurações
  const settings = {
    airdropEnabled: process.env.NEXT_PUBLIC_AIRDROP_ENABLED === "true",
    tokensPerClaim: Number.parseInt(process.env.NEXT_PUBLIC_TOKENS_PER_CLAIM || "1000"),
    requireTwitter: process.env.NEXT_PUBLIC_REQUIRE_TWITTER === "true",
    requireTelegram: process.env.NEXT_PUBLIC_REQUIRE_TELEGRAM === "true",
  }

  return NextResponse.json({ settings })
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
    const settings = await request.json()

    // Simular atualização de configurações
    console.log("Atualizando configurações:", settings)

    return NextResponse.json({
      success: true,
      message: "Configurações atualizadas com sucesso",
    })
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 })
  }
}

