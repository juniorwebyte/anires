import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  console.log("Iniciando envio direto de WhatsApp (método de fallback)")

  try {
    // Obter parâmetros da URL
    const url = new URL(req.url)
    const walletAddress = url.searchParams.get("walletAddress")
    const customMessage = url.searchParams.get("message")

    // Validar parâmetros
    if (!walletAddress && !customMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "Parâmetros insuficientes. É necessário fornecer walletAddress ou message.",
        },
        { status: 400 },
      )
    }

    // Preparar mensagem
    const message =
      customMessage ||
      `🚨 Nova Reivindicação ANIRES (Fallback) 🚨\n\nCarteira: ${walletAddress}\nData: ${new Date().toLocaleString("pt-BR")}`

    // Configuração dos números e chaves API
    const targets = [
      { phone: "5511984801839", apiKey: "1782254", name: "admin1" },
      { phone: "5511947366820", apiKey: "7070864", name: "admin2" },
    ]

    // Selecionar API key com base no último dígito do endereço da carteira (para balanceamento)
    const lastChar = walletAddress ? walletAddress.slice(-1) : "0"
    const targetIndex = Number.parseInt(lastChar, 16) % targets.length
    const target = targets[targetIndex]

    console.log(`Usando API key de ${target.name} para envio de fallback`)

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message)

    // Construir URL da API
    const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${target.phone}&text=${encodedMessage}&apikey=${target.apiKey}`

    // Configurar timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    // Fazer a requisição
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeoutId)

    // Processar resposta
    const responseText = await response.text()
    console.log(`Resposta da API de fallback:`, responseText)

    // Verificar se a mensagem foi enviada com sucesso
    const isSuccess =
      responseText.includes("Message queued") ||
      responseText.includes("Message Sent") ||
      responseText.includes("WhatsApp message")

    return NextResponse.json({
      success: isSuccess,
      message: isSuccess ? "Mensagem de fallback enviada com sucesso" : "Falha ao enviar mensagem de fallback",
      response: responseText,
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem de fallback:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao enviar mensagem de fallback",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

