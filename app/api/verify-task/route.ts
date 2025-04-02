import { type NextRequest, NextResponse } from "next/server"

// Função para simular verificação com APIs externas
const simulateExternalApiVerification = async (taskId: string, data: any): Promise<boolean> => {
  // Em um ambiente real, aqui você faria chamadas às APIs do Twitter/Telegram
  // Para fins de demonstração, estamos simulando com uma verificação básica

  // Adicionar um pequeno atraso para simular o tempo de resposta da API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  switch (taskId) {
    case "twitter-follow":
      // Verificar se o usuário segue a conta alvo
      return data.username && data.username.length >= 3

    case "twitter-retweet":
      // Verificar se o link do retweet é válido e contém o ID do tweet original
      return data.retweetLink && (data.retweetLink.includes("twitter.com") || data.retweetLink.includes("x.com"))

    case "twitter-like":
      // Verificar se o usuário curtiu o tweet
      // Na prática, isso seria verificado com a API do Twitter
      return true

    case "telegram-join":
      // Verificar se o ID do Telegram é válido e se o usuário está no grupo
      return data.telegramId && /^\d{6,15}$/.test(data.telegramId)

    default:
      return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ler o corpo da requisição apenas uma vez e armazenar em uma variável
    const data = await request.json()

    // Validar dados básicos
    if (!data.taskId || !data.walletAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados incompletos para verificação",
        },
        { status: 400 },
      )
    }

    // Registrar a tentativa de verificação (em um ambiente real, isso seria salvo em um banco de dados)
    console.log(`Verificando tarefa ${data.taskId} para carteira ${data.walletAddress}`)

    // Verificar a tarefa com a API externa simulada
    const isVerified = await simulateExternalApiVerification(data.taskId, data)

    // Simular uma pequena chance de falha (5%) para tornar mais realista
    const randomFailure = Math.random() < 0.05

    if (!isVerified || randomFailure) {
      let errorMessage = "Não foi possível verificar a tarefa."

      switch (data.taskId) {
        case "twitter-follow":
          errorMessage = "Não conseguimos verificar que você segue @aniresbank. Por favor, verifique e tente novamente."
          break
        case "twitter-retweet":
          errorMessage =
            "Não conseguimos verificar seu retweet. Certifique-se de que o link é válido e tente novamente."
          break
        case "twitter-like":
          errorMessage = "Não conseguimos verificar sua curtida. Por favor, tente novamente."
          break
        case "telegram-join":
          errorMessage =
            "Não conseguimos verificar que você entrou no grupo do Telegram. Por favor, verifique seu ID e tente novamente."
          break
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          taskId: data.taskId,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    // Gerar mensagem de sucesso personalizada
    let successMessage = "Verificação concluída com sucesso."

    switch (data.taskId) {
      case "twitter-follow":
        successMessage = `Verificamos que você segue @aniresbank. Obrigado pelo seu apoio!`
        break
      case "twitter-retweet":
        successMessage = "Seu retweet foi verificado com sucesso. Obrigado por compartilhar!"
        break
      case "twitter-like":
        successMessage = "Sua curtida foi verificada com sucesso. Obrigado pelo seu apoio!"
        break
      case "telegram-join":
        successMessage = "Verificamos que você entrou no grupo do Telegram. Bem-vindo à comunidade!"
        break
    }

    return NextResponse.json({
      success: true,
      message: successMessage,
      taskId: data.taskId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao verificar tarefa:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar a solicitação",
      },
      { status: 500 },
    )
  }
}

