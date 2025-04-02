// Utilitários para o sistema de referral

/**
 * Gera um código de referral baseado no endereço da carteira
 */
export function generateReferralCode(walletAddress: string): string {
  // Pegar os primeiros 8 caracteres do endereço e adicionar um timestamp para garantir unicidade
  const prefix = walletAddress.slice(2, 10).toLowerCase()
  const timestamp = Date.now().toString(36)
  return `${prefix}${timestamp}`
}

/**
 * Gera um link de referral completo
 */
export function generateReferralLink(walletAddress: string, baseUrl = ""): string {
  const code = generateReferralCode(walletAddress)
  // Se estamos no navegador, usar a URL atual como base
  const url = baseUrl || (typeof window !== "undefined" ? window.location.origin : "https://anires.com")
  return `${url}/claim?ref=${code}&wallet=${walletAddress}`
}

/**
 * Extrai o código de referral e o endereço da carteira de uma URL
 */
export function extractReferralInfo(url: string): { code: string | null; wallet: string | null } {
  try {
    const parsedUrl = new URL(url)
    const params = new URLSearchParams(parsedUrl.search)

    return {
      code: params.get("ref"),
      wallet: params.get("wallet"),
    }
  } catch (error) {
    console.error("Erro ao extrair informações de referral:", error)
    return { code: null, wallet: null }
  }
}

/**
 * Valida se um código de referral é válido
 */
export function isValidReferralCode(code: string): boolean {
  // Um código válido deve ter pelo menos 10 caracteres
  return code.length >= 10
}

/**
 * Armazena o referral no localStorage (para persistência no navegador)
 */
export function storeReferralInfo(code: string, wallet: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("referralCode", code)
    localStorage.setItem("referralWallet", wallet)
    localStorage.setItem("referralTimestamp", Date.now().toString())
  }
}

/**
 * Recupera informações de referral do localStorage
 */
export function getStoredReferralInfo(): { code: string | null; wallet: string | null; timestamp: number | null } {
  if (typeof window !== "undefined") {
    const code = localStorage.getItem("referralCode")
    const wallet = localStorage.getItem("referralWallet")
    const timestamp = localStorage.getItem("referralTimestamp")

    return {
      code,
      wallet,
      timestamp: timestamp ? Number.parseInt(timestamp) : null,
    }
  }

  return { code: null, wallet: null, timestamp: null }
}

/**
 * Limpa as informações de referral do localStorage
 */
export function clearReferralInfo(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("referralCode")
    localStorage.removeItem("referralWallet")
    localStorage.removeItem("referralTimestamp")
  }
}

