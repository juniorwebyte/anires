import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Ler o corpo da requisição apenas uma vez e armazenar em uma variável
    const data = await request.json()

    // Validar dados básicos
    if (!data.tasks || !data.walletAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Dados incompletos para verificação",
        },
        { status: 400 },
      )
    }

    // Verificar se todas as tarefas estão marcadas como concluídas
    const allTasksCompleted = data.tasks.every((task) => task.completed)

    if (!allTasksCompleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Nem todas as tarefas foram concluídas",
        },
        { status: 400 },
      )
    }

    // Registrar a verificação (em um ambiente real, isso seria salvo em um banco de dados)
    console.log(`Verificando todas as tarefas para carteira ${data.walletAddress}`)

    // Simular um pequeno atraso para tornar mais realista
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular uma pequena chance de falha (5%) para tornar mais realista
    const randomFailure = Math.random() < 0.05

    if (randomFailure) {
      // Escolher uma tarefa aleatória para falhar
      const taskIds = ["twitter-follow", "twitter-retweet", "twitter-like", "telegram-join"]
      const randomTaskId = taskIds[Math.floor(Math.random() * taskIds.length)]

      return NextResponse.json(
        {
          success: false,
          message: "Detectamos um problema com uma das tarefas. Por favor, verifique e tente novamente.",
          taskId: randomTaskId,
          timestamp: new Date().toISOString(),
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Todas as tarefas foram verificadas com sucesso",
      timestamp: new Date().toISOString(),
      verificationId: `verify-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    })
  } catch (error) {
    console.error("Erro ao verificar todas as tarefas:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar a solicitação",
      },
      { status: 500 },
    )
  }
}

