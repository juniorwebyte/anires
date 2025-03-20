import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função utilitária para formatar o número do WhatsApp
export function formatWhatsAppNumber(phoneNumber: string): string {
  // Remover todos os caracteres não numéricos
  const cleanNumber = phoneNumber.replace(/\D/g, "")

  // Garantir que o número tenha o formato internacional
  if (cleanNumber.startsWith("55")) {
    return cleanNumber
  } else {
    return `55${cleanNumber}`
  }
}

// Função para criar um link direto para o WhatsApp
export function createWhatsAppLink(phoneNumber: string, message: string): string {
  const formattedNumber = formatWhatsAppNumber(phoneNumber)
  const encodedMessage = encodeURIComponent(message)

  return `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodedMessage}`
}

