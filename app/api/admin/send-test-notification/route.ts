import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Ler o corpo da requisição
    const data = await request.json()

    // Validar dados básicos
    if (!data.phoneNumber || !data.message || !data.apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados incompletos para envio de mensagem",
        },
        { status: 400 },
      )
    }

    // Registrar a tentativa de envio
    console.log(`Enviando mensagem de teste para ${data.phoneNumber}`)
    console.log(`Mensagem: ${data.message}`)
    console.log(`API Key: ${data.apiKey}`)

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(data.message)

    // Construir a URL da API CallMeBot
    const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${data.phoneNumber}&text=${encodedMessage}&apikey=${data.apiKey}`

    console.log(`URL da API: ${callMeBotUrl}`)

    // Fazer a chamada real à API CallMeBot com cabeçalhos específicos
    const response = await fetch(callMeBotUrl, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    const responseText = await response.text()
    console.log("Resposta da API CallMeBot:", responseText)

    // Verificar se a resposta contém indicação de sucesso
    if (responseText.includes("Message queued") || responseText.includes("Message Sent")) {
      return NextResponse.json({
        success: true,
        message: "Mensagem de teste enviada com sucesso",
        timestamp: new Date().toISOString(),
        apiResponse: responseText,
      })
    } else {
      console.error(`Resposta inesperada da API CallMeBot: ${responseText}`)
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao enviar mensagem: ${responseText}`,
          apiResponse: responseText,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem de teste:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar a solicitação",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

