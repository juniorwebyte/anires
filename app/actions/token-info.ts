"use server"

// Server Action para buscar informações sobre tokens de forma segura
export async function getTotalTokens() {
  // Acessar as variáveis de ambiente no servidor
  const totalTokens = process.env.TOTAL_TOKENS || "1000000"

  // Retornar apenas os valores necessários
  return {
    totalTokens: Number.parseInt(totalTokens, 10),
  }
}

export async function getTokenInfo() {
  // Acessar as variáveis de ambiente no servidor
  const totalTokens = process.env.TOTAL_TOKENS || "1000000"
  const token = process.env.TOKEN || ""

  // Retornar apenas os valores necessários
  return {
    totalTokens: Number.parseInt(totalTokens, 10),
    token: token,
  }
}

