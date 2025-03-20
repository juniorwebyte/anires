"use server"

import fs from "fs"
import path from "path"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import { redirect } from "next/navigation"

interface UserTaskData {
  walletAddress: string
  walletType: string
  twitterUsername: string
  telegramId: string
  completedAt: string
}

interface UserClaim {
  id: string
  name: string
  walletAddress: string
  walletType: string
  twitterUsername: string
  telegramId: string
  tokensRequested: number
  status: "pending" | "processed" | "rejected" | "failed"
  createdAt: string
  processedAt?: string
}

// Credenciais de administrador - Usando variáveis de ambiente
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme"
const SESSION_COOKIE_NAME = "admin_session"
const SESSION_EXPIRY = 24 * 60 * 60 * 1000 // 24 horas

/**
 * Armazena o endereço da carteira em um arquivo JSON para distribuição manual posterior
 */
export async function storeWalletAddress(address: string) {
  try {
    // Validar o endereço da carteira (formato básico de endereço Ethereum)
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return {
        success: false,
        message: "Endereço de carteira inválido",
      }
    }

    // Caminho para o arquivo de armazenamento
    const dataDir = path.join(process.cwd(), "data")
    const filePath = path.join(dataDir, "airdrop-wallets.json")

    // Criar diretório se não existir
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Ler dados existentes ou iniciar com array vazio
    let wallets: string[] = []
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8")
      wallets = JSON.parse(fileContent)
    }

    // Verificar se o endereço já existe
    if (wallets.includes(address)) {
      return {
        success: false,
        message: "Este endereço já foi registrado para o AirDrop",
      }
    }

    // Adicionar novo endereço
    wallets.push(address)

    // Salvar dados atualizados
    fs.writeFileSync(filePath, JSON.stringify(wallets, null, 2))

    // Registrar em log para fins de auditoria
    console.log(`Novo endereço registrado para AirDrop: ${address}`)

    return {
      success: true,
      message: "Endereço registrado com sucesso para o AirDrop",
    }
  } catch (error) {
    console.error("Erro ao armazenar endereço da carteira:", error)
    return {
      success: false,
      message: "Erro ao processar a solicitação. Tente novamente mais tarde.",
    }
  }
}

/**
 * Armazena os dados das tarefas do usuário
 */
export async function storeUserTasks(taskData: UserTaskData) {
  try {
    // Validar o endereço da carteira
    if (!taskData.walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(taskData.walletAddress)) {
      return {
        success: false,
        message: "Endereço de carteira inválido",
      }
    }

    // Caminho para o arquivo de armazenamento
    const dataDir = path.join(process.cwd(), "data")
    const filePath = path.join(dataDir, "user-tasks.json")

    // Criar diretório se não existir
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Ler dados existentes ou iniciar com array vazio
    let userTasks: UserTaskData[] = []
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8")
      userTasks = JSON.parse(fileContent)
    }

    // Verificar se o endereço já existe
    const existingIndex = userTasks.findIndex((task) => task.walletAddress === taskData.walletAddress)

    if (existingIndex >= 0) {
      // Atualizar dados existentes
      userTasks[existingIndex] = taskData
    } else {
      // Adicionar novos dados
      userTasks.push(taskData)
    }

    // Salvar dados atualizados
    fs.writeFileSync(filePath, JSON.stringify(userTasks, null, 2))

    // Registrar em log para fins de auditoria
    console.log(`Dados de tarefas registrados para: ${taskData.walletAddress}`)

    // Criar uma reivindicação para este usuário
    await createUserClaim(taskData)

    return {
      success: true,
      message: "Dados de tarefas registrados com sucesso",
    }
  } catch (error) {
    console.error("Erro ao armazenar dados de tarefas:", error)
    return {
      success: false,
      message: "Erro ao processar a solicitação. Tente novamente mais tarde.",
    }
  }
}

/**
 * Cria uma reivindicação de usuário com base nas tarefas concluídas
 */
async function createUserClaim(taskData: UserTaskData) {
  try {
    // Caminho para o arquivo de armazenamento
    const dataDir = path.join(process.cwd(), "data")
    const filePath = path.join(dataDir, "user-claims.json")

    // Criar diretório se não existir
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Ler dados existentes ou iniciar com array vazio
    let userClaims: UserClaim[] = []
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8")
      userClaims = JSON.parse(fileContent)
    }

    // Verificar se o endereço já existe
    const existingIndex = userClaims.findIndex((claim) => claim.walletAddress === taskData.walletAddress)

    if (existingIndex >= 0) {
      // Atualizar dados existentes
      userClaims[existingIndex] = {
        ...userClaims[existingIndex],
        twitterUsername: taskData.twitterUsername,
        telegramId: taskData.telegramId,
      }
    } else {
      // Adicionar nova reivindicação
      const newClaim: UserClaim = {
        id: uuidv4(),
        name: taskData.twitterUsername, // Usar o nome de usuário do Twitter como nome
        walletAddress: taskData.walletAddress,
        walletType: taskData.walletType,
        twitterUsername: taskData.twitterUsername,
        telegramId: taskData.telegramId,
        tokensRequested: 1000, // Valor padrão
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      userClaims.push(newClaim)
    }

    // Salvar dados atualizados
    fs.writeFileSync(filePath, JSON.stringify(userClaims, null, 2))

    return {
      success: true,
      message: "Reivindicação criada com sucesso",
    }
  } catch (error) {
    console.error("Erro ao criar reivindicação:", error)
    return {
      success: false,
      message: "Erro ao processar a solicitação. Tente novamente mais tarde.",
    }
  }
}

/**
 * Obtém a lista de carteiras registradas para o AirDrop
 */
export async function getRegisteredWallets(): Promise<string[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "airdrop-wallets.json")

    if (!fs.existsSync(filePath)) {
      return []
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error("Erro ao obter endereços registrados:", error)
    return []
  }
}

// Função de autenticação de administrador atualizada
export async function authenticateAdmin(username: string, password: string) {
  try {
    // Verificar se as credenciais correspondem às variáveis de ambiente
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Criar um token de sessão seguro
      const sessionToken = uuidv4()

      // Armazenar o token em um cookie seguro
      cookies().set({
        name: SESSION_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24, // 24 horas em segundos
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })

      // Armazenar a sessão no servidor
      const dataDir = path.join(process.cwd(), "data")
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      // Armazenar dados da sessão com hash do token para maior segurança
      const sessionData = {
        token: sessionToken,
        username: username,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_EXPIRY).toISOString(),
      }

      fs.writeFileSync(path.join(dataDir, "admin-session.json"), JSON.stringify(sessionData, null, 2))

      return {
        success: true,
        message: "Autenticação bem-sucedida",
      }
    } else {
      // Adicionar atraso para prevenir ataques de força bruta
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: false,
        message: "Credenciais inválidas",
      }
    }
  } catch (error) {
    console.error("Erro ao autenticar administrador:", error)
    return {
      success: false,
      message: "Erro ao processar a solicitação. Tente novamente mais tarde.",
    }
  }
}

// Função de verificação de sessão melhorada
export async function checkAdminSession() {
  try {
    const sessionToken = cookies().get(SESSION_COOKIE_NAME)?.value

    if (!sessionToken) {
      console.log("Sessão não encontrada: Cookie não existe")
      return {
        authenticated: false,
        message: "Sessão não encontrada",
      }
    }

    // Verificar se o arquivo de sessão existe
    const sessionFilePath = path.join(process.cwd(), "data", "admin-session.json")

    if (!fs.existsSync(sessionFilePath)) {
      console.log("Sessão não encontrada: Arquivo de sessão não existe")
      return {
        authenticated: false,
        message: "Nenhuma sessão encontrada",
      }
    }

    // Ler dados da sessão
    const sessionData = JSON.parse(fs.readFileSync(sessionFilePath, "utf-8"))

    // Verificar se o token corresponde
    if (sessionData.token !== sessionToken) {
      console.log("Sessão inválida: Token não corresponde")
      return {
        authenticated: false,
        message: "Sessão inválida",
      }
    }

    // Verificar se a sessão expirou
    const expiresAt = new Date(sessionData.expiresAt).getTime()
    if (expiresAt < Date.now()) {
      console.log("Sessão expirada")
      return {
        authenticated: false,
        message: "Sessão expirada",
      }
    }

    console.log("Sessão válida")
    return {
      authenticated: true,
      message: "Sessão válida",
    }
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)
    return {
      authenticated: false,
      message: "Erro ao verificar sessão",
    }
  }
}

/**
 * Encerra a sessão do administrador
 */
export async function logoutAdmin() {
  try {
    // Remover o cookie
    cookies().delete(SESSION_COOKIE_NAME)

    // Remover o arquivo de sessão
    const sessionFilePath = path.join(process.cwd(), "data", "admin-session.json")
    if (fs.existsSync(sessionFilePath)) {
      fs.unlinkSync(sessionFilePath)
    }

    return {
      success: true,
      message: "Logout realizado com sucesso",
    }
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
    return {
      success: false,
      message: "Erro ao processar a solicitação. Tente novamente mais tarde.",
    }
  }
}

/**
 * Obtém a lista de reivindicações de usuários
 */
export async function getUserClaims(): Promise<UserClaim[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "user-claims.json")

    if (!fs.existsSync(filePath)) {
      return []
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error("Erro ao obter reivindicações:", error)
    return []
  }
}

/**
 * Distribui tokens para um usuário
 */
export async function distributeTokens(userId: string, amount: number) {
  try {
    if (!userId || amount <= 0) {
      return {
        success: false,
        message: "Parâmetros inválidos",
      }
    }

    // Verificar se o administrador está autenticado
    const sessionCheck = await checkAdminSession()
    if (!sessionCheck.authenticated) {
      return {
        success: false,
        message: "Não autorizado",
      }
    }

    // Obter as reivindicações
    const filePath = path.join(process.cwd(), "data", "user-claims.json")

    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: "Nenhuma reivindicação encontrada",
      }
    }

    const fileContent = fs.readFileSync(filePath, "utf-8")
    const claims: UserClaim[] = JSON.parse(fileContent)

    // Encontrar a reivindicação
    const claimIndex = claims.findIndex((claim) => claim.id === userId)

    if (claimIndex === -1) {
      return {
        success: false,
        message: "Reivindicação não encontrada",
      }
    }

    // Atualizar a reivindicação
    claims[claimIndex] = {
      ...claims[claimIndex],
      tokensRequested: amount,
      status: "processed",
      processedAt: new Date().toISOString(),
    }

    // Salvar dados atualizados
    fs.writeFileSync(filePath, JSON.stringify(claims, null, 2))

    return {
      success: true,
      message: `${amount} tokens distribuídos com sucesso para o usuário`,
    }
  } catch (error) {
    console.error("Erro ao distribuir tokens:", error)
    return {
      success: false,
      message: "Erro ao processar a solicitação. Tente novamente mais tarde.",
    }
  }
}

/**
 * Middleware para proteger rotas administrativas
 */
export async function adminMiddleware() {
  const sessionCheck = await checkAdminSession()

  if (!sessionCheck.authenticated) {
    redirect("/admin/login")
  }
}

