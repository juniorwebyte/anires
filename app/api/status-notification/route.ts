import { type NextRequest, NextResponse } from "next/server"
import { getClaimByWalletAddress } from "@/lib/storage-service"

export async function POST(request: NextRequest) {
  try {
    // Ler o corpo da requisição
    const data = await request.json()

    // Validar dados básicos
    if (!data.walletAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Endereço de carteira não fornecido",
        },
        { status: 400 },
      )
    }

    // Verificar se existe uma reivindicação para este endereço
    const claim = typeof window !== "undefined" ? getClaimByWalletAddress(data.walletAddress) : null
    const claimStatus = claim ? claim.status : "não encontrado"
    const claimDate = claim ? new Date(claim.createdAt).toLocaleString("pt-BR") : "N/A"
    const processedDate = claim && claim.processedAt ? new Date(claim.processedAt).toLocaleString("pt-BR") : "N/A"

    // Preparar a mensagem para o WhatsApp
    const message = `📢 Solicitação de Status ANIRES 📢\n\nCarteira: ${data.walletAddress}\nStatus: ${claimStatus}\nData de Criação: ${claimDate}\nData de Processamento: ${processedDate}\n\nUm usuário está solicitando uma atualização sobre o status da reivindicação. Por favor, verifique o painel de administração.`

    console.log(`Enviando notificação de status para a carteira ${data.walletAddress}`)
    console.log(`Mensagem: ${message}`)

    // Enviar para o primeiro número de administrador
    try {
      const firstNumberResponse = await fetch(
        `https://api.callmebot.com/whatsapp.php?phone=5511984801839&text=${encodeURIComponent(message)}&apikey=1782254`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "text/html,application/xhtml+xml,application/xml",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        },
      )

      const firstResponseText = await firstNumberResponse.text()
      console.log(`Resposta da API CallMeBot (primeiro número): ${firstResponseText}`)

      // Verificar se a notificação foi enviada com sucesso
      const firstSuccess = firstResponseText.includes("Message queued") || firstResponseText.includes("Message Sent")

      if (firstSuccess) {
        return NextResponse.json({
          success: true,
          message: "Solicitação de status enviada com sucesso",
          timestamp: new Date().toISOString(),
        })
      } else {
        console.error(`Resposta inesperada da API CallMeBot: ${firstResponseText}`)
        return NextResponse.json(
          {
            success: false,
            message: "Erro ao enviar solicitação de status: resposta inesperada da API",
            apiResponse: firstResponseText,
          },
          { status: 500 },
        )
      }
    } catch (whatsappError) {
      console.error("Erro ao enviar notificação WhatsApp de status:", whatsappError)
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao enviar notificação WhatsApp de status",
          error: whatsappError instanceof Error ? whatsappError.message : String(whatsappError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro ao processar solicitação de status:", error)
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

