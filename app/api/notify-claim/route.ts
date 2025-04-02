import { type NextRequest, NextResponse } from "next/server"

// Suportar tanto GET quanto POST para maior flexibilidade
export async function GET(req: NextRequest) {
  console.log("Notify-claim chamado via GET")
  return handleNotification(req)
}

export async function POST(req: NextRequest) {
  console.log("Notify-claim chamado via POST")
  return handleNotification(req)
}

async function handleNotification(req: NextRequest) {
  console.log("Iniciando notificação de reivindicação")
  console.log("Método da requisição:", req.method)
  console.log("Headers:", Object.fromEntries(req.headers.entries()))

  try {
    // Obter dados da URL como parâmetros de consulta
    const url = new URL(req.url)
    console.log("URL completa:", req.url)
    console.log("Todos os parâmetros:", Object.fromEntries(url.searchParams.entries()))

    // Extrair parâmetros da URL
    let walletAddress = url.searchParams.get("walletAddress")
    let twitterUsername = url.searchParams.get("twitterUsername")
    let telegramId = url.searchParams.get("telegramId")
    let tokenAmount = url.searchParams.get("tokenAmount")
    let referredBy = url.searchParams.get("referredBy")
    let transactionHash = url.searchParams.get("transactionHash")

    console.log("Parâmetros da URL:", {
      walletAddress,
      twitterUsername,
      telegramId,
      tokenAmount,
      referredBy,
      transactionHash,
    })

    // Se não encontrarmos na URL, tentar obter do corpo da requisição (para POST)
    if (req.method === "POST" && !walletAddress) {
      try {
        const contentType = req.headers.get("content-type") || ""
        console.log("Content-Type:", contentType)

        if (contentType.includes("application/json")) {
          const requestData = await req.json()
          console.log("Dados do corpo JSON:", requestData)

          walletAddress = requestData.walletAddress || null
          twitterUsername = requestData.twitterUsername || twitterUsername
          telegramId = requestData.telegramId || telegramId
          tokenAmount = requestData.tokenAmount || tokenAmount
          referredBy = requestData.referredBy || referredBy
          transactionHash = requestData.transactionHash || transactionHash
        }
      } catch (bodyError) {
        console.error("Erro ao tentar ler o corpo da requisição:", bodyError)
      }
    }

    // Verificar se temos pelo menos o endereço da carteira
    if (!walletAddress) {
      console.error("Dados incompletos. Nenhum endereço de carteira encontrado.")
      console.error("Parâmetros recebidos:", Object.fromEntries(url.searchParams.entries()))

      // Retornar erro 400 com detalhes
      return NextResponse.json(
        {
          success: false,
          message: "Dados incompletos. Endereço de carteira é obrigatório.",
          receivedParams: Object.fromEntries(url.searchParams.entries()),
          method: req.method,
          url: req.url,
        },
        { status: 400 },
      )
    }

    // Verificar se temos o hash da transação (apenas para notificações de pagamento)
    if (!transactionHash && !url.searchParams.get("event")) {
      console.warn("Aviso: Hash da transação não fornecido. Esta pode ser uma notificação de evento, não de pagamento.")
    }

    // Preparar a mensagem para WhatsApp
    const message = `🚨 Nova Reivindicação ANIRES 🚨\n\nCarteira: ${walletAddress}\nTwitter: ${twitterUsername || "Não informado"}\nTelegram: ${telegramId || "Não informado"}\nTokens: ${tokenAmount || 100}\n${referredBy ? `Referido por: ${referredBy}` : "Sem referral"}\n${transactionHash ? `Transação: ${transactionHash}` : ""}\nData: ${new Date().toLocaleString("pt-BR")}\n\nVerifique o painel de administração para mais detalhes.`

    // Enviar notificação WhatsApp
    const notificationResult = await sendWhatsAppNotifications(message)

    // Retornar resposta de sucesso
    return NextResponse.json({
      success: true,
      message: "Notificação processada com sucesso",
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
    console.error("Erro geral na notificação:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar notificação",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Função para enviar notificações WhatsApp
async function sendWhatsAppNotifications(message: string) {
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
        console.log(`Enviando notificação para ${target.name} (${target.phone})...`)

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
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
          signal: controller.signal,
          cache: "no-store",
        })

        clearTimeout(timeoutId)

        // Processar resposta
        const responseText = await response.text()
        console.log(`Resposta da API para ${target.name}:`, responseText)

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
        console.error(`Erro ao enviar para ${target.name}:`, notifyError)
        results[target.name] = {
          success: false,
          response: "",
          error: notifyError instanceof Error ? notifyError.message : String(notifyError),
        }
      }
    }

    // Verificar se pelo menos uma notificação foi enviada com sucesso
    const anySuccess = Object.values(results).some((r) => r.success)

    // Se nenhuma notificação foi enviada com sucesso, tentar método alternativo
    if (!anySuccess) {
      console.log("Nenhuma notificação enviada com sucesso, tentando método alternativo...")

      try {
        // Tentar enviar via API alternativa
        const fallbackUrl = `/api/send-whatsapp?message=${encodeURIComponent(message)}`
        const fallbackResponse = await fetch(fallbackUrl, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        })

        const fallbackData = await fallbackResponse.json()
        results["fallback"] = {
          success: fallbackData.success,
          response: JSON.stringify(fallbackData),
        }
      } catch (fallbackError) {
        console.error("Erro no método alternativo:", fallbackError)
        results["fallback"] = {
          success: false,
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        }
      }
    }

    return {
      anySuccess: anySuccess || (results["fallback"] && results["fallback"].success),
      results,
    }
  } catch (error) {
    console.error("Erro geral ao enviar notificações:", error)
    return {
      error: error instanceof Error ? error.message : String(error),
      results,
    }
  }
}

