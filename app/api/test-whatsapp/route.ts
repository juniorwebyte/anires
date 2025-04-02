/**
 * Rota de teste para verificar se as notificações WhatsApp estão funcionando
 * Pode ser acessada via GET em /api/test-whatsapp
 */

import { type NextRequest, NextResponse } from "next/server"
import { sendDirectWhatsAppMessage } from "@/lib/direct-whatsapp"

export async function GET(req: NextRequest) {
  console.log("Iniciando teste de notificação WhatsApp")

  try {
    // Obter parâmetros da URL
    const searchParams = req.nextUrl.searchParams
    const phone = searchParams.get("phone") || "5511984801839" // Número padrão se não for fornecido
    const apiKey = searchParams.get("apikey") || "1782254" // Chave padrão se não for fornecida

    // Criar mensagem de teste
    const message = `🧪 TESTE DE NOTIFICAÇÃO ANIRES 🧪\n\nEsta é uma mensagem de teste enviada em: ${new Date().toLocaleString("pt-BR")}\n\nSe você está recebendo esta mensagem, o sistema de notificações está funcionando corretamente.`

    console.log(`Enviando mensagem de teste para ${phone} com apiKey ${apiKey}`)

    // Enviar mensagem de teste
    const result = await sendDirectWhatsAppMessage(phone, message, apiKey)

    // Retornar resultado
    return NextResponse.json({
      success: result.success,
      message: "Teste de notificação WhatsApp",
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro no teste de notificação:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar teste de notificação",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

