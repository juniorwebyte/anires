import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Função para obter o caminho do arquivo de notificações
function getNotificationsFilePath() {
  const dataDir = path.join(process.cwd(), "data")
  return path.join(dataDir, "whatsapp-notifications.json")
}

// Função para ler as notificações
function readNotifications() {
  const filePath = getNotificationsFilePath()

  if (!fs.existsSync(filePath)) {
    return []
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error("Erro ao ler notificações:", error)
    return []
  }
}

// Função para salvar as notificações
function saveNotifications(notifications: any[]) {
  const dataDir = path.join(process.cwd(), "data")
  const filePath = getNotificationsFilePath()

  // Criar diretório se não existir
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(notifications, null, 2))
    return true
  } catch (error) {
    console.error("Erro ao salvar notificações:", error)
    return false
  }
}

// Rota GET para listar notificações
export async function GET(request: Request) {
  try {
    const notifications = readNotifications()

    // Ordenar por data de criação (mais recente primeiro)
    notifications.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error("Erro ao obter notificações:", error)
    return NextResponse.json({ success: false, message: "Erro ao obter notificações" }, { status: 500 })
  }
}

// Rota PUT para atualizar o status de uma notificação
export async function PUT(request: Request) {
  try {
    const { index, sent } = await request.json()

    if (index === undefined || sent === undefined) {
      return NextResponse.json({ success: false, message: "Índice e status são obrigatórios" }, { status: 400 })
    }

    const notifications = readNotifications()

    if (index < 0 || index >= notifications.length) {
      return NextResponse.json({ success: false, message: "Notificação não encontrada" }, { status: 404 })
    }

    // Atualizar o status da notificação
    notifications[index].sent = sent

    // Salvar as alterações
    const saved = saveNotifications(notifications)

    if (!saved) {
      throw new Error("Erro ao salvar notificações")
    }

    return NextResponse.json({
      success: true,
      message: "Notificação atualizada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao atualizar notificação:", error)
    return NextResponse.json({ success: false, message: "Erro ao atualizar notificação" }, { status: 500 })
  }
}

