import { NextResponse } from "next/server"

// Admin WhatsApp - Números para notificação
const ADMIN_WHATSAPP_NUMBERS = [
  {
    name: "Admin 1",
    number: "5511984801839",
    apiKey: "1782254",
  },
  {
    name: "Admin 2",
    number: "5511947366820",
    apiKey: "7070864",
  },
]

export async function POST(request: Request) {
  try {
    // Array para armazenar resultados de envio
    const sendResults = []

    // Enviar mensagem de teste para todos os administradores
    for (const admin of ADMIN_WHATSAPP_NUMBERS) {
      try {
        // Formatar a mensagem de teste
        const message =
          `🧪 *Teste de Notificação* 🧪

` +
          `Esta é uma mensagem de teste do sistema de notificações do Street Dog Coin.

` +
          `Enviado para: ${admin.name} (${admin.number})

` +
          `Se você está recebendo esta mensagem, o sistema está funcionando corretamente!

` +
          `*Data e Hora:* ${new Date().toLocaleString("pt-BR")}`

        // Enviar a mensagem usando a API CallMeBot
        const encodedMessage = encodeURIComponent(message)
        const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${admin.number}&text=${encodedMessage}&apikey=${admin.apiKey}`

        const response = await fetch(apiUrl)

        if (!response.ok) {
          console.error(`Erro ao enviar mensagem de teste para ${admin.name}:`, await response.text())
          sendResults.push({ admin: admin.name, success: false })
        } else {
          console.log(`Mensagem de teste enviada com sucesso para: ${admin.name} (${admin.number})`)
          sendResults.push({ admin: admin.name, success: true })
        }
      } catch (error) {
        console.error(`Erro ao enviar teste para ${admin.name}:`, error)
        sendResults.push({ admin: admin.name, success: false })
      }
    }

    // Se pelo menos uma mensagem foi enviada com sucesso, consideramos sucesso
    const anySuccess = sendResults.some((r) => r.success)

    return NextResponse.json({
      success: anySuccess,
      message: anySuccess
        ? "Mensagem(ns) de teste enviada(s) com sucesso"
        : "Falha ao enviar mensagens de teste para todos os administradores",
      details: sendResults,
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem de teste:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

