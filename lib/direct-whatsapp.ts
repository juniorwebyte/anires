/**
 * Utilitário para enviar mensagens WhatsApp diretamente
 * Implementação alternativa caso a API principal falhe
 */

export async function sendDirectWhatsAppMessage(
  phone: string,
  message: string,
  apiKey: string,
): Promise<{ success: boolean; response: string }> {
  try {
    console.log(`Enviando mensagem WhatsApp direta para ${phone}...`)

    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message)

    // Construir a URL da API
    const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`

    // Fazer a requisição com timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

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

    // Obter o texto da resposta
    const responseText = await response.text()
    console.log(`Resposta da API CallMeBot para ${phone}:`, responseText)

    // Verificar se a mensagem foi enviada com sucesso
    const isSuccess =
      responseText.includes("Message queued") ||
      responseText.includes("Message Sent") ||
      responseText.includes("WhatsApp message")

    return {
      success: isSuccess,
      response: responseText,
    }
  } catch (error) {
    console.error(`Erro ao enviar mensagem WhatsApp para ${phone}:`, error)
    return {
      success: false,
      response: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Envia mensagem para múltiplos números com retry
 */
export async function sendWhatsAppToMultipleNumbers(
  message: string,
  targets: Array<{ phone: string; apiKey: string; name?: string }>,
): Promise<Record<string, any>> {
  const results: Record<string, any> = {}

  for (const target of targets) {
    const targetName = target.name || target.phone
    console.log(`Enviando para ${targetName}...`)

    // Primeira tentativa
    let result = await sendDirectWhatsAppMessage(target.phone, message, target.apiKey)

    // Se falhar, tentar novamente após um breve atraso
    if (!result.success) {
      console.log(`Primeira tentativa falhou para ${targetName}, tentando novamente...`)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      result = await sendDirectWhatsAppMessage(target.phone, message, target.apiKey)
    }

    results[targetName] = result

    // Adicionar delay entre envios para diferentes números
    if (targets.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  return results
}

