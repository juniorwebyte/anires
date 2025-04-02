import { type NextRequest, NextResponse } from "next/server"
import { verifyDomain, verifySecureConnection, checkPhishingStatus } from "@/lib/security-utils"

export async function GET(request: NextRequest) {
  try {
    // Obter o domínio da solicitação
    const domain = request.headers.get("host") || ""

    // Verificações de segurança
    const isDomainValid = verifyDomain()
    const isConnectionSecure = verifySecureConnection()
    const isNotPhishing = await checkPhishingStatus()

    // Coletar problemas de segurança
    const securityIssues = []

    if (!isDomainValid) {
      securityIssues.push("Domínio não oficial")
    }

    if (!isConnectionSecure) {
      securityIssues.push("Conexão não segura")
    }

    if (!isNotPhishing) {
      securityIssues.push("Possível site de phishing")
    }

    // Determinar o status de segurança geral
    const isSecure = securityIssues.length === 0

    // Retornar resultado
    return NextResponse.json({
      isSecure,
      securityIssues,
      domain,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao verificar segurança do site:", error)
    return NextResponse.json(
      {
        error: "Falha ao verificar segurança",
        message: "Ocorreu um erro ao processar a solicitação",
      },
      { status: 500 },
    )
  }
}

