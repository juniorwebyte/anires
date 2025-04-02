import { type NextRequest, NextResponse } from "next/server"
import { logSecurityEvent } from "@/lib/security-utils"

export async function POST(request: NextRequest) {
  try {
    // Obter dados do relatório
    const data = await request.json()
    const { issueType, description, url, userAgent, contactEmail } = data

    // Validar dados
    if (!issueType || !description) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Registrar o problema de segurança
    logSecurityEvent("warning", `Problema de segurança reportado: ${issueType}`, {
      description,
      url,
      userAgent,
      contactEmail,
      reportedAt: new Date().toISOString(),
      ip: request.ip || "unknown",
    })

    // Em um ambiente real, você enviaria este relatório para um sistema de monitoramento
    // ou notificaria a equipe de segurança

    // Retornar confirmação
    return NextResponse.json({
      success: true,
      message: "Relatório de segurança recebido. Obrigado por ajudar a manter o AniRes seguro!",
      referenceId: `SEC-${Date.now().toString(36).toUpperCase()}`,
    })
  } catch (error) {
    console.error("Erro ao processar relatório de segurança:", error)
    return NextResponse.json(
      {
        error: "Falha ao processar relatório",
        message: "Ocorreu um erro ao processar a solicitação",
      },
      { status: 500 },
    )
  }
}

