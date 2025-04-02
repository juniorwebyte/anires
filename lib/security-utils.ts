// Função para verificar se o domínio é seguro
export function verifyDomain(): boolean {
  if (typeof window === "undefined") return true

  const trustedDomains = [
    "anires.org",
    "www.anires.org",
    "airdrop.anires.org",
    "app.anires.org",
    "presale.anires.org",
    "staking.anires.org",
    "docs.anires.org",
    "localhost",
    "vercel.app",
  ]

  const currentDomain = window.location.hostname
  return trustedDomains.some((domain) => currentDomain === domain || currentDomain.endsWith(`.${domain}`))
}

// Função para verificar se a conexão é segura (HTTPS)
export function verifySecureConnection(): boolean {
  if (typeof window === "undefined") return true

  return window.location.protocol === "https:" || window.location.hostname === "localhost"
}

// Função para verificar se o contrato é seguro
export async function verifyContract(contractAddress: string): Promise<{
  verified: boolean
  securityIssues: string[]
  message: string
}> {
  try {
    // Lista de contratos verificados do AniRes
    const verifiedContracts = [
      "0x1234567890123456789012345678901234567890", // Contrato principal AniRes
      "0x0987654321098765432109876543210987654321", // Contrato de staking AniRes
      "0xabcdef1234567890abcdef1234567890abcdef12", // Contrato de presale AniRes
    ]

    if (verifiedContracts.includes(contractAddress)) {
      return {
        verified: true,
        securityIssues: [],
        message: "Contrato verificado e seguro",
      }
    } else {
      return {
        verified: false,
        securityIssues: ["Contrato não verificado"],
        message: "Este contrato não está na lista de contratos verificados do AniRes",
      }
    }
  } catch (error) {
    console.error("Erro ao verificar contrato:", error)
    return {
      verified: false,
      securityIssues: ["Não foi possível verificar o contrato"],
      message: "Falha na verificação do contrato",
    }
  }
}

// Função para verificar se o site está em uma lista de phishing
export async function checkPhishingStatus(): Promise<boolean> {
  try {
    // Em um ambiente real, você consultaria uma API de verificação de phishing
    // como a API do MetaMask Phishing Detection ou similar

    // Simulação de verificação bem-sucedida
    return true
  } catch (error) {
    console.error("Erro ao verificar status de phishing:", error)
    return false
  }
}

// Função para verificar a segurança da transação
export async function verifyTransactionSecurity(transactionData: any): Promise<{
  secure: boolean
  warnings: string[]
  message: string
}> {
  try {
    // Verificações de segurança para transações
    const warnings: string[] = []

    // Verificar se o valor da transação é razoável
    if (transactionData.value && Number.parseFloat(transactionData.value) > 1) {
      warnings.push("Valor da transação é alto")
    }

    // Verificar se o destinatário é conhecido
    const knownRecipients = [
      "0x1234567890123456789012345678901234567890", // Carteira oficial AniRes
      "0x0987654321098765432109876543210987654321", // Contrato de staking AniRes
      "0xabcdef1234567890abcdef1234567890abcdef12", // Contrato de presale AniRes
    ]

    if (transactionData.to && !knownRecipients.includes(transactionData.to)) {
      warnings.push("Destinatário não reconhecido")
    }

    return {
      secure: warnings.length === 0,
      warnings,
      message: warnings.length === 0 ? "Transação segura" : "Transação possui alertas de segurança",
    }
  } catch (error) {
    console.error("Erro ao verificar segurança da transação:", error)
    return {
      secure: false,
      warnings: ["Erro ao verificar segurança"],
      message: "Não foi possível verificar a segurança da transação",
    }
  }
}

// Função para registrar eventos de segurança
export function logSecurityEvent(eventType: "warning" | "error" | "info", message: string, data?: any): void {
  // Em um ambiente real, você enviaria esses logs para um serviço de monitoramento
  console[eventType](`[Segurança ${new Date().toISOString()}] ${message}`, data || "")

  // Se for um erro ou alerta grave, você poderia notificar a equipe de segurança
  if (eventType === "error") {
    // Enviar notificação para a equipe de segurança
    // Exemplo: sendSecurityAlert(message, data);
  }
}

// Função para verificar se um endereço de carteira é válido
export function isValidWalletAddress(address: string): boolean {
  // Verificar se o endereço tem o formato correto para Ethereum (0x seguido por 40 caracteres hexadecimais)
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Função para sanitizar entradas de usuário
export function sanitizeInput(input: string): string {
  // Remover tags HTML e caracteres especiais
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

// Função para detectar atividades suspeitas
export function detectSuspiciousActivity(activity: {
  ip: string
  userAgent: string
  action: string
  timestamp: number
}): boolean {
  // Lista de padrões suspeitos
  const suspiciousPatterns = [
    // Bots maliciosos conhecidos
    /bot|crawler|spider|crawl|wget/i,
    // Ferramentas de hacking conhecidas
    /burpsuite|owasp|zap|sqlmap|nmap|nikto/i,
  ]

  // Verificar se o user agent corresponde a algum padrão suspeito
  if (suspiciousPatterns.some((pattern) => pattern.test(activity.userAgent))) {
    logSecurityEvent("warning", "User agent suspeito detectado", activity)
    return true
  }

  // Verificar ações em alta frequência (mais de 100 ações em 1 minuto)
  const recentActivities = [] // Em uma implementação real, isso seria buscado de um banco de dados
  if (recentActivities.length > 100) {
    logSecurityEvent("warning", "Alta frequência de ações detectada", activity)
    return true
  }

  return false
}

