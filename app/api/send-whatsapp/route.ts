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

// Função para enviar mensagem diretamente para o WhatsApp usando a API do WhatsApp
export async function POST(request: Request) {
  try {
    const { phoneNumber, message, adminIndex } = await request.json()

    if ((!phoneNumber && adminIndex === undefined) || !message) {
      return NextResponse.json(
        { success: false, message: "Número de telefone/índice de admin e mensagem são obrigatórios" },
        { status: 400 },
      )
    }

    // Determinar para qual número enviar
    let targetNumber, apiKey

    if (adminIndex !== undefined) {
      // Enviar para um admin específico
      if (adminIndex < 0 || adminIndex >= ADMIN_WHATSAPP_NUMBERS.length) {
        return NextResponse.json({ success: false, message: "Índice de administrador inválido" }, { status: 400 })
      }

      targetNumber = ADMIN_WHATSAPP_NUMBERS[adminIndex].number
      apiKey = ADMIN_WHATSAPP_NUMBERS[adminIndex].apiKey
    } else {
      // Enviar para um número personalizado
      // Remover caracteres não numéricos do número de telefone
      targetNumber = phoneNumber.replace(/\D/g, "")

      // Usar a API key do primeiro admin por padrão
      apiKey = ADMIN_WHATSAPP_NUMBERS[0].apiKey
    }

    // Usar a API CallMeBot para enviar a mensagem
    const encodedMessage = encodeURIComponent(message)
    const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${targetNumber}&text=${encodedMessage}&apikey=${apiKey}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`Erro ao enviar mensagem: ${await response.text()}`)
    }

    return NextResponse.json({
      success: true,
      message: "Mensagem enviada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem WhatsApp:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 },
    )
  }
}

