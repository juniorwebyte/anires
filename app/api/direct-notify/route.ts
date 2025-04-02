import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  console.log("Iniciando notificação direta alternativa")

  try {
    // Obter os dados da URL como parâmetros de consulta (método mais confiável)
    const url = new URL(req.url)
    console.log("URL completa (alternativa):", req.url)
    console.log("Todos os parâmetros (alternativa):", Object.fromEntries(url.searchParams.entries()))

    const walletAddress = url.searchParams.get("walletAddress")
    const twitterUsername = url.searchParams.get("twitterUsername")
    const telegramId = url.searchParams.get("telegramId")
    const tokenAmount = url.searchParams.get("tokenAmount")
    const referredBy = url.searchParams.get("referredBy")
    const transactionHash = url.searchParams.get("transactionHash")

    console.log("walletAddress (alternativa):", walletAddress)
    console.log("twitterUsername (alternativa):", twitterUsername)
    console.log("telegramId (alternativa):", telegramId)
    console.log("tokenAmount (alternativa):", tokenAmount)
    console.log("referredBy (alternativa):", referredBy)
    console.log("transactionHash (alternativa):", transactionHash)

    // Verificar se temos pelo menos o endereço da carteira
    if (!walletAddress) {
      console.error("Dados incompletos (alternativa). Nenhum endereço de carteira encontrado.")

      // Retornar erro 400 com detalhes
      return NextResponse.json(
        {
          success: false,
          message: "Dados incompletos. Endereço de carteira é obrigatório.",
          receivedParams: Object.fromEntries(url.searchParams.entries()),
          url: req.url,
        },
        { status: 400 },
      )
    }

    // Preparar a mensagem para WhatsApp
    const message = `🚨 Nova Reivindicação ANIRES (Método Alternativo) 🚨\n\nCarteira: ${walletAddress}\nTwitter: ${twitterUsername || "Não informado"}\nTelegram: ${telegramId || "Não informado"}\nTokens: ${tokenAmount || 100}\n${referredBy ? `Referido por: ${referredBy}` : "Sem referral"}\nData: ${new Date().toLocaleString("pt-BR")}\n\nVerifique o painel de administração para mais detalhes.`

    // Enviar notificação WhatsApp
    const notificationResult = await sendDirectWhatsApp(message)

    // Retornar resposta de sucesso
    return NextResponse.json({
      success: true,
      message: "Notificação alternativa processada com sucesso",
      data: {
        walletAddress,
        twitterUsername,
        telegramId,
        tokenAmount,
        referredBy,
        transactionHash,
      },
      notificationResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro geral na notificação alternativa:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar notificação alternativa",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Função para enviar WhatsApp usando método direto
async function sendDirectWhatsApp(message: string) {
  const results = {
    admin1: { success: false, response: "", error: null },
    admin2: { success: false, response: "", error: null },
  }

  try {
    // Configuração dos números e chaves API
    const targets = [
      { phone: "5511984801839", apiKey: "1782254", name: "admin1" },
      { phone: "5511947366820", apiKey: "7070864", name: "admin2" },
    ]

    // Enviar para cada número em sequência
    for (const target of targets) {
      try {
        console.log(`Enviando notificação direta para ${target.name} (${target.phone})...`)

        // Codificar a mensagem para URL
        const encodedMessage = encodeURIComponent(message)

        // Construir URL da API
        const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${target.phone}&text=${encodedMessage}&apikey=${target.apiKey}`

        // Configurar timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

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
        console.log(`Resposta da API direta para ${target.name}:`, responseText)

        // Verificar se a mensagem foi enviada com sucesso
        const isSuccess =
          responseText.includes("Message queued") ||
          responseText.includes("Message Sent") ||
          responseText.includes("WhatsApp message")

        results[target.name] = {
          success: isSuccess,
          response: responseText,
          error: null,
        }

        // Adicionar delay entre envios
        if (targets.indexOf(target) < targets.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      } catch (notifyError) {
        console.error(`Erro ao enviar diretamente para ${target.name}:`, notifyError)
        results[target.name] = {
          success: false,
          response: "",
          error: notifyError instanceof Error ? notifyError.message : String(notifyError),
        }
      }
    }

    return results
  } catch (error) {
    console.error("Erro geral ao enviar notificações diretas:", error)
    return {
      error: error instanceof Error ? error.message : String(error),
      results,
    }
  }
}

