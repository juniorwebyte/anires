"use server"

import { getTokenInfo } from "./token-info"

// Server Action para verificar um token fornecido pelo cliente
export async function verifyToken(providedToken: string) {
  try {
    // Obter o token correto do servidor
    const { token } = await getTokenInfo()

    // Verificar se o token fornecido corresponde ao token correto
    const isValid = providedToken === token

    // Retornar apenas o resultado da verificação, não o token em si
    return {
      isValid,
    }
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return {
      isValid: false,
    }
  }
}

