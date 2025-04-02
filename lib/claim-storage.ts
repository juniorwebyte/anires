// Sistema de armazenamento de reivindicações
// Em um ambiente de produção, isso seria armazenado em um banco de dados

interface ClaimRecord {
  walletAddress: string
  timestamp: string
  tokenAmount: number
  transactionHash?: string
  referredBy?: string
}

// Simulação de armazenamento em memória (em produção seria um banco de dados)
const claimRecords: ClaimRecord[] = []

// Simulação de armazenamento de referrals
const referralRecords: Record<string, string[]> = {}

export function recordClaim(
  walletAddress: string,
  tokenAmount: number,
  transactionHash?: string,
  referredBy?: string,
): ClaimRecord {
  const record: ClaimRecord = {
    walletAddress: walletAddress.toLowerCase(),
    timestamp: new Date().toISOString(),
    tokenAmount,
    transactionHash,
    referredBy,
  }

  claimRecords.push(record)

  // Se foi referido por alguém, registrar no sistema de referrals
  if (referredBy) {
    if (!referralRecords[referredBy]) {
      referralRecords[referredBy] = []
    }
    referralRecords[referredBy].push(walletAddress.toLowerCase())
  }

  return record
}

export function hasClaimedTokens(walletAddress: string): boolean {
  return claimRecords.some((record) => record.walletAddress.toLowerCase() === walletAddress.toLowerCase())
}

export function getClaimRecord(walletAddress: string): ClaimRecord | null {
  const record = claimRecords.find((record) => record.walletAddress.toLowerCase() === walletAddress.toLowerCase())

  return record || null
}

export function getAllClaims(): ClaimRecord[] {
  return [...claimRecords]
}

export function getReferrals(walletAddress: string): string[] {
  return referralRecords[walletAddress.toLowerCase()] || []
}

export function getReferralBonus(walletAddress: string): number {
  const referrals = getReferrals(walletAddress.toLowerCase())
  // 10% de bônus por referral (10 tokens por referral)
  return referrals.length * 10
}

// Para testes e desenvolvimento, adicionamos algumas reivindicações de exemplo
// Em produção, isso seria carregado do banco de dados
export function initializeWithSampleData() {
  // Adicionar algumas reivindicações de exemplo para testes
  if (claimRecords.length === 0) {
    recordClaim("0x1234567890123456789012345678901234567890", 100, "0xabcdef1234567890")
    recordClaim("0x2345678901234567890123456789012345678901", 100, "0xbcdef1234567890a")
    recordClaim(
      "0x3456789012345678901234567890123456789012",
      110,
      "0xcdef1234567890ab",
      "0x1234567890123456789012345678901234567890",
    )

    // Registrar referrals
    if (!referralRecords["0x1234567890123456789012345678901234567890"]) {
      referralRecords["0x1234567890123456789012345678901234567890"] = []
    }
    referralRecords["0x1234567890123456789012345678901234567890"].push("0x3456789012345678901234567890123456789012")
  }
}

// Inicializar com dados de exemplo
initializeWithSampleData()

