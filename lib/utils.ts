import type React from "react"
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

/**
 * Cria um deep link para o Twitter com fallback para versão web
 * @param username Nome de usuário do Twitter (sem @)
 * @param tweetText Texto opcional para compor um tweet
 * @param intent Ação a ser realizada (tweet, follow, etc)
 * @returns URL para abrir o Twitter
 */
export function createTwitterDeepLink(
  username: string,
  tweetText?: string,
  intent: "tweet" | "follow" = "follow",
): string {
  // Remove @ se estiver presente
  const cleanUsername = username.startsWith("@") ? username.substring(1) : username

  // Deep link para aplicativo nativo
  let nativeUrl = ""
  let webUrl = ""

  if (intent === "follow") {
    nativeUrl = `twitter://user?screen_name=${cleanUsername}`
    webUrl = `https://twitter.com/intent/follow?screen_name=${cleanUsername}`
  } else if (intent === "tweet") {
    const encodedText = tweetText ? encodeURIComponent(tweetText) : ""
    nativeUrl = `twitter://post?message=${encodedText}`
    webUrl = `https://twitter.com/intent/tweet?text=${encodedText}`
  }

  // Retorna uma função que tenta abrir o app nativo primeiro e depois faz fallback para web
  return `javascript:(function(){
    var appWindow = window.open('${nativeUrl}', '_blank');
    
    // Verifica se o app foi aberto após um pequeno delay
    setTimeout(function() {
      try {
        // Se o app não abriu, o foco ainda estará na janela atual
        if (document.hasFocus() || !appWindow || appWindow.closed) {
          window.location.href = '${webUrl}';
        }
      } catch (e) {
        window.location.href = '${webUrl}';
      }
    }, 500);
  })();`
}

/**
 * Cria um deep link para o Telegram com fallback para versão web
 * @param username Nome de usuário do Telegram (sem @)
 * @returns URL para abrir o Telegram
 */
export function createTelegramDeepLink(username: string): string {
  // Remove @ se estiver presente
  const cleanUsername = username.startsWith("@") ? username.substring(1) : username

  // Deep link para aplicativo nativo
  const nativeUrl = `tg://resolve?domain=${cleanUsername}`
  // Fallback para versão web
  const webUrl = `https://t.me/${cleanUsername}`

  // Retorna uma função que tenta abrir o app nativo primeiro e depois faz fallback para web
  return `javascript:(function(){
    var appWindow = window.open('${nativeUrl}', '_blank');
    
    // Verifica se o app foi aberto após um pequeno delay
    setTimeout(function() {
      try {
        // Se o app não abriu, o foco ainda estará na janela atual
        if (document.hasFocus() || !appWindow || appWindow.closed) {
          window.location.href = '${webUrl}';
        }
      } catch (e) {
        window.location.href = '${webUrl}';
      }
    }, 500);
  })();`
}

/**
 * Detecta se o dispositivo é móvel
 * @returns boolean indicando se é um dispositivo móvel
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Cria um link para abrir o Twitter com base no dispositivo
 * @param username Nome de usuário do Twitter
 * @returns URL apropriada para o dispositivo
 */
export function getTwitterLink(username: string): string {
  // Remove @ se estiver presente
  const cleanUsername = username.startsWith("@") ? username.substring(1) : username

  if (isMobileDevice()) {
    // Tenta deep link primeiro, com fallback para web
    return {
      href: `https://twitter.com/${cleanUsername}`,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        // Tenta abrir o app nativo
        window.location.href = `twitter://user?screen_name=${cleanUsername}`

        // Fallback para web após um pequeno delay
        setTimeout(() => {
          window.location.href = `https://twitter.com/${cleanUsername}`
        }, 2000)
      },
    }
  } else {
    // Em desktop, vai direto para a versão web
    return {
      href: `https://twitter.com/${cleanUsername}`,
      onClick: undefined,
    }
  }
}

/**
 * Cria um link para abrir o Telegram com base no dispositivo
 * @param username Nome de usuário do Telegram
 * @returns URL apropriada para o dispositivo
 */
export function getTelegramLink(username: string): string {
  // Remove @ se estiver presente
  const cleanUsername = username.startsWith("@") ? username.substring(1) : username

  if (isMobileDevice()) {
    // Tenta deep link primeiro, com fallback para web
    return {
      href: `https://t.me/${cleanUsername}`,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        // Tenta abrir o app nativo
        window.location.href = `tg://resolve?domain=${cleanUsername}`

        // Fallback para web após um pequeno delay
        setTimeout(() => {
          window.location.href = `https://t.me/${cleanUsername}`
        }, 2000)
      },
    }
  } else {
    // Em desktop, vai direto para a versão web
    return {
      href: `https://t.me/${cleanUsername}`,
      onClick: undefined,
    }
  }
}

