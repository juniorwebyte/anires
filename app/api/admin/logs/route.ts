import { type NextRequest, NextResponse } from "next/server"
import { getTokenInfo } from "@/app/actions/token-info"

export async function GET(request: NextRequest) {
  // Verificar autenticação
  const authHeader = request.headers.get("authorization")

  // Obter o token de forma segura
  const { token } = await getTokenInfo()

  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  // Simular logs do sistema
  const logs = [
    {
      id: "1",
      type: "info",
      message: "Usuário registrado: 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      timestamp: "2023-06-01T10:15:30Z",
    },
    {
      id: "2",
      type: "info",
      message: "Reivindicação solicitada: 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      timestamp: "2023-06-01T10:20:45Z",
    },
    {
      id: "3",
      type: "success",
      message: "Reivindicação aprovada: 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
      timestamp: "2023-06-01T10:25:12Z",
    },
    {
      id: "4",
      type: "error",
      message: "Falha ao enviar notificação: usuario2@exemplo.com",
      timestamp: "2023-06-01T10:35:12Z",
    },
    {
      id: "5",
      type: "warning",
      message: "Tentativa de acesso não autorizado: IP 192.168.1.100",
      timestamp: "2023-06-01T11:05:30Z",
    },
  ]

  return NextResponse.json({ logs })
}

