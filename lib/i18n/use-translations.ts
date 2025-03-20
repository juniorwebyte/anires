"use client"

import { useCallback, useEffect, useState } from "react"

// Definição de tipos para as traduções
type TranslationDictionary = {
  [key: string]: string
}

// Dicionários de tradução
const translations: Record<string, TranslationDictionary> = {
  pt: {
    // Navbar
    "navbar.home": "Início",
    "navbar.about": "Sobre",
    "navbar.claim": "Airdrop",
    "navbar.verify": "Verificar",
    "navbar.status": "Status",
    "navbar.roadmap": "Roadmap",
    "navbar.security": "Segurança",
    "navbar.connect": "Conectar Carteira",
    "navbar.language": "Idioma",

    // Footer
    "footer.about.title": "Anires",
    "footer.about.description":
      "Anires é dedicada ao resgate e bem-estar animal. Nós nos esforçamos para fazer um impacto positivo na vida dos animais necessitados. E também adoramos",
    "footer.about.memes": "memes!",
    "footer.about.inspector": "Se você está lendo isto, você oficialmente se qualifica como um inspetor de memes!",

    "footer.quickLinks.title": "Links Rápidos",
    "footer.quickLinks.home": "Início",
    "footer.quickLinks.about": "Sobre Nós",
    "footer.quickLinks.airdrop": "Airdrop",
    "footer.quickLinks.status": "Status",
    "footer.quickLinks.verify": "Verificar",

    "footer.resources.title": "Recursos",
    "footer.resources.security": "Segurança",
    "footer.resources.tokenomics": "Tokenomics",
    "footer.resources.roadmap": "Roadmap",
    "footer.resources.status": "Status",
    "footer.resources.secretMemes": "Memes Secretos",

    "footer.contact.title": "Contato",
    "footer.contact.donate": "Doar Agora",
    "footer.contact.investQuote":
      '"Investir em memecoins é como apostar em qual meme vai viralizar... mas com seu dinheiro!"',

    "footer.legal.rights": "Todos os direitos reservados.",
    "footer.legal.terms": "Termos de Serviço",
    "footer.legal.privacy": "Política de Privacidade",
    "footer.legal.cookies": "Cookies",

    "footer.footerText": "Powered by memes e zurros de burro!",
    "footer.memeInspector": "Se você está lendo isto, você oficialmente se qualifica como um inspetor de memes!",

    "footer.iconQuotes.twitter": "Zurros em 280 caracteres ou menos!",
    "footer.iconQuotes.facebook": "Onde até os burros têm perfil social!",
    "footer.iconQuotes.instagram": "Filtrando fotos de burros desde 2010!",
    "footer.iconQuotes.github": "Commits de burro são os melhores commits!",
    "footer.iconQuotes.heart": "Doando para burros desde sempre!",

    // Airdrop
    "airdrop.title": "Airdrop Astral",
    "airdrop.subtitle": "Conecte sua carteira para verificar se você é elegível para o airdrop",
    "airdrop.connect": "Conectar Carteira",
    "airdrop.eligible": "Parabéns! Você é elegível para o airdrop",
    "airdrop.notEligible": "Você não é elegível para o airdrop",
    "airdrop.claim": "Resgatar Tokens",
    "airdrop.claimed": "Tokens resgatados com sucesso!",
    "airdrop.error": "Erro ao resgatar tokens",
    "airdrop.loading": "Carregando...",
    "airdrop.connectFirst": "Conecte sua carteira primeiro",
    "airdrop.tasks.title": "Complete as tarefas para aumentar seu airdrop",
    "airdrop.tasks.twitter": "Seguir no Twitter",
    "airdrop.tasks.telegram": "Entrar no Telegram",
    "airdrop.tasks.discord": "Entrar no Discord",
    "airdrop.tasks.refer": "Convidar amigos",
    "airdrop.tasks.completed": "Tarefa concluída!",
    "airdrop.tasks.pending": "Pendente",
    "airdrop.tasks.reward": "Recompensa: {0} tokens",

    // Verify
    "verify.title": "Verificar Airdrop",
    "verify.subtitle": "Verifique o status do seu airdrop",
    "verify.address": "Endereço da carteira",
    "verify.check": "Verificar",
    "verify.result.eligible": "Elegível para {0} tokens",
    "verify.result.notEligible": "Não elegível",
    "verify.result.claimed": "Resgatado: {0} tokens",
    "verify.result.notClaimed": "Não resgatado",
    "verify.loading": "Verificando...",
    "verify.error": "Erro ao verificar",

    // Status
    "status.title": "Status do Airdrop",
    "status.subtitle": "Estatísticas em tempo real do airdrop",
    "status.totalClaimed": "Total resgatado",
    "status.totalParticipants": "Total de participantes",
    "status.remainingTokens": "Tokens restantes",
    "status.timeRemaining": "Tempo restante",
    "status.days": "dias",
    "status.hours": "horas",
    "status.minutes": "minutos",
    "status.seconds": "segundos",
    "status.loading": "Carregando estatísticas...",
    "status.error": "Erro ao carregar estatísticas",

    // Roadmap
    "roadmap.title": "Roadmap",
    "roadmap.subtitle": "Nossa jornada para o futuro",
    "roadmap.phase1.title": "Fase 1: Lançamento",
    "roadmap.phase1.description": "Lançamento do token, airdrop e listagem em DEXs",
    "roadmap.phase2.title": "Fase 2: Expansão",
    "roadmap.phase2.description": "Listagem em CEXs, parcerias e expansão da comunidade",
    "roadmap.phase3.title": "Fase 3: Utilidade",
    "roadmap.phase3.description": "Desenvolvimento de utilidades para o token e ecossistema",
    "roadmap.phase4.title": "Fase 4: Futuro",
    "roadmap.phase4.description": "Expansão global e novas integrações",

    // Security
    "security.title": "Segurança",
    "security.subtitle": "Mantendo seus ativos seguros",
    "security.tip1.title": "Use carteiras seguras",
    "security.tip1.description": "Recomendamos o uso de carteiras como MetaMask, Trust Wallet ou hardware wallets",
    "security.tip2.title": "Verifique os contratos",
    "security.tip2.description": "Sempre verifique o endereço do contrato antes de interagir",
    "security.tip3.title": "Cuidado com scams",
    "security.tip3.description": "Nunca compartilhe sua frase de recuperação ou chaves privadas",
    "security.tip4.title": "Verifique as URLs",
    "security.tip4.description": "Certifique-se de que está no site oficial antes de conectar sua carteira",

    // Common
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.success": "Sucesso",
    "common.warning": "Aviso",
    "common.info": "Informação",
    "common.close": "Fechar",
    "common.confirm": "Confirmar",
    "common.cancel": "Cancelar",
    "common.submit": "Enviar",
    "common.back": "Voltar",
    "common.next": "Próximo",
    "common.yes": "Sim",
    "common.no": "Não",
  },
  en: {
    // Navbar
    "navbar.home": "Home",
    "navbar.about": "About",
    "navbar.claim": "Airdrop",
    "navbar.verify": "Verify",
    "navbar.status": "Status",
    "navbar.roadmap": "Roadmap",
    "navbar.security": "Security",
    "navbar.connect": "Connect Wallet",
    "navbar.language": "Language",

    // Footer
    "footer.about.title": "Anires",
    "footer.about.description":
      "Anires is dedicated to animal rescue and welfare. We strive to make a positive impact on the lives of animals in need. And we also love",
    "footer.about.memes": "memes!",
    "footer.about.inspector": "If you're reading this, you officially qualify as a meme inspector!",

    "footer.quickLinks.title": "Quick Links",
    "footer.quickLinks.home": "Home",
    "footer.quickLinks.about": "About Us",
    "footer.quickLinks.airdrop": "Airdrop",
    "footer.quickLinks.status": "Status",
    "footer.quickLinks.verify": "Verify",

    "footer.resources.title": "Resources",
    "footer.resources.security": "Security",
    "footer.resources.tokenomics": "Tokenomics",
    "footer.resources.roadmap": "Roadmap",
    "footer.resources.status": "Status",
    "footer.resources.secretMemes": "Secret Memes",

    "footer.contact.title": "Contact",
    "footer.contact.donate": "Donate Now",
    "footer.contact.investQuote":
      '"Investing in memecoins is like betting on which meme will go viral... but with your money!"',

    "footer.legal.rights": "All rights reserved.",
    "footer.legal.terms": "Terms of Service",
    "footer.legal.privacy": "Privacy Policy",
    "footer.legal.cookies": "Cookies",

    "footer.footerText": "Powered by memes and donkey brays!",
    "footer.memeInspector": "If you're reading this, you officially qualify as a meme inspector!",

    "footer.iconQuotes.twitter": "Brays in 280 characters or less!",
    "footer.iconQuotes.facebook": "Where even donkeys have social profiles!",
    "footer.iconQuotes.instagram": "Filtering donkey photos since 2010!",
    "footer.iconQuotes.github": "Donkey commits are the best commits!",
    "footer.iconQuotes.heart": "Donating to donkeys since forever!",

    // Airdrop
    "airdrop.title": "Astral Airdrop",
    "airdrop.subtitle": "Connect your wallet to check if you're eligible for the airdrop",
    "airdrop.connect": "Connect Wallet",
    "airdrop.eligible": "Congratulations! You are eligible for the airdrop",
    "airdrop.notEligible": "You are not eligible for the airdrop",
    "airdrop.claim": "Claim Tokens",
    "airdrop.claimed": "Tokens claimed successfully!",
    "airdrop.error": "Error claiming tokens",
    "airdrop.loading": "Loading...",
    "airdrop.connectFirst": "Connect your wallet first",
    "airdrop.tasks.title": "Complete tasks to increase your airdrop",
    "airdrop.tasks.twitter": "Follow on Twitter",
    "airdrop.tasks.telegram": "Join Telegram",
    "airdrop.tasks.discord": "Join Discord",
    "airdrop.tasks.refer": "Refer friends",
    "airdrop.tasks.completed": "Task completed!",
    "airdrop.tasks.pending": "Pending",
    "airdrop.tasks.reward": "Reward: {0} tokens",

    // Verify
    "verify.title": "Verify Airdrop",
    "verify.subtitle": "Check your airdrop status",
    "verify.address": "Wallet address",
    "verify.check": "Check",
    "verify.result.eligible": "Eligible for {0} tokens",
    "verify.result.notEligible": "Not eligible",
    "verify.result.claimed": "Claimed: {0} tokens",
    "verify.result.notClaimed": "Not claimed",
    "verify.loading": "Verifying...",
    "verify.error": "Error verifying",

    // Status
    "status.title": "Airdrop Status",
    "status.subtitle": "Real-time airdrop statistics",
    "status.totalClaimed": "Total claimed",
    "status.totalParticipants": "Total participants",
    "status.remainingTokens": "Remaining tokens",
    "status.timeRemaining": "Time remaining",
    "status.days": "days",
    "status.hours": "hours",
    "status.minutes": "minutes",
    "status.seconds": "seconds",
    "status.loading": "Loading statistics...",
    "status.error": "Error loading statistics",

    // Roadmap
    "roadmap.title": "Roadmap",
    "roadmap.subtitle": "Our journey to the future",
    "roadmap.phase1.title": "Phase 1: Launch",
    "roadmap.phase1.description": "Token launch, airdrop, and DEX listings",
    "roadmap.phase2.title": "Phase 2: Expansion",
    "roadmap.phase2.description": "CEX listings, partnerships, and community expansion",
    "roadmap.phase3.title": "Phase 3: Utility",
    "roadmap.phase3.description": "Development of token utilities and ecosystem",
    "roadmap.phase4.title": "Phase 4: Future",
    "roadmap.phase4.description": "Global expansion and new integrations",

    // Security
    "security.title": "Security",
    "security.subtitle": "Keeping your assets safe",
    "security.tip1.title": "Use secure wallets",
    "security.tip1.description": "We recommend using wallets like MetaMask, Trust Wallet, or hardware wallets",
    "security.tip2.title": "Verify contracts",
    "security.tip2.description": "Always verify the contract address before interacting",
    "security.tip3.title": "Beware of scams",
    "security.tip3.description": "Never share your recovery phrase or private keys",
    "security.tip4.title": "Check URLs",
    "security.tip4.description": "Make sure you're on the official website before connecting your wallet",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Information",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.back": "Back",
    "common.next": "Next",
    "common.yes": "Yes",
    "common.no": "No",
  },
  es: {
    // Navbar
    "navbar.home": "Inicio",
    "navbar.about": "Acerca de",
    "navbar.claim": "Airdrop",
    "navbar.verify": "Verificar",
    "navbar.status": "Estado",
    "navbar.roadmap": "Hoja de Ruta",
    "navbar.security": "Seguridad",
    "navbar.connect": "Conectar Billetera",
    "navbar.language": "Idioma",

    // Footer
    "footer.about.title": "Anires",
    "footer.about.description":
      "Anires está dedicada al rescate y bienestar animal. Nos esforzamos por hacer un impacto positivo en la vida de los animales necesitados. Y también nos encantan",
    "footer.about.memes": "los memes!",
    "footer.about.inspector": "Si estás leyendo esto, ¡oficialmente calificas como inspector de memes!",

    "footer.quickLinks.title": "Enlaces Rápidos",
    "footer.quickLinks.home": "Inicio",
    "footer.quickLinks.about": "Sobre Nosotros",
    "footer.quickLinks.airdrop": "Airdrop",
    "footer.quickLinks.status": "Estado",
    "footer.quickLinks.verify": "Verificar",

    "footer.resources.title": "Recursos",
    "footer.resources.security": "Seguridad",
    "footer.resources.tokenomics": "Tokenomics",
    "footer.resources.roadmap": "Hoja de Ruta",
    "footer.resources.status": "Estado",
    "footer.resources.secretMemes": "Memes Secretos",

    "footer.contact.title": "Contacto",
    "footer.contact.donate": "Donar Ahora",
    "footer.contact.investQuote":
      '"¡Invertir en memecoins es como apostar a qué meme se volverá viral... pero con tu dinero!"',

    "footer.legal.rights": "Todos los derechos reservados.",
    "footer.legal.terms": "Términos de Servicio",
    "footer.legal.privacy": "Política de Privacidad",
    "footer.legal.cookies": "Cookies",

    "footer.footerText": "¡Impulsado por memes y rebuznos de burro!",
    "footer.memeInspector": "Si estás leyendo esto, ¡oficialmente calificas como inspector de memes!",

    "footer.iconQuotes.twitter": "¡Rebuznos en 280 caracteres o menos!",
    "footer.iconQuotes.facebook": "¡Donde hasta los burros tienen perfiles sociales!",
    "footer.iconQuotes.instagram": "¡Filtrando fotos de burros desde 2010!",
    "footer.iconQuotes.github": "¡Los commits de burro son los mejores commits!",
    "footer.iconQuotes.heart": "¡Donando a burros desde siempre!",

    // Airdrop
    "airdrop.title": "Airdrop Astral",
    "airdrop.subtitle": "Conecta tu billetera para verificar si eres elegible para el airdrop",
    "airdrop.connect": "Conectar Billetera",
    "airdrop.eligible": "¡Felicidades! Eres elegible para el airdrop",
    "airdrop.notEligible": "No eres elegible para el airdrop",
    "airdrop.claim": "Reclamar Tokens",
    "airdrop.claimed": "¡Tokens reclamados con éxito!",
    "airdrop.error": "Error al reclamar tokens",
    "airdrop.loading": "Cargando...",
    "airdrop.connectFirst": "Conecta tu billetera primero",
    "airdrop.tasks.title": "Completa tareas para aumentar tu airdrop",
    "airdrop.tasks.twitter": "Seguir en Twitter",
    "airdrop.tasks.telegram": "Unirse a Telegram",
    "airdrop.tasks.discord": "Unirse a Discord",
    "airdrop.tasks.refer": "Invitar amigos",
    "airdrop.tasks.completed": "¡Tarea completada!",
    "airdrop.tasks.pending": "Pendiente",
    "airdrop.tasks.reward": "Recompensa: {0} tokens",

    // Verify
    "verify.title": "Verificar Airdrop",
    "verify.subtitle": "Verifica el estado de tu airdrop",
    "verify.address": "Dirección de billetera",
    "verify.check": "Verificar",
    "verify.result.eligible": "Elegible para {0} tokens",
    "verify.result.notEligible": "No elegible",
    "verify.result.claimed": "Reclamado: {0} tokens",
    "verify.result.notClaimed": "No reclamado",
    "verify.loading": "Verificando...",
    "verify.error": "Error al verificar",

    // Status
    "status.title": "Estado del Airdrop",
    "status.subtitle": "Estadísticas del airdrop en tiempo real",
    "status.totalClaimed": "Total reclamado",
    "status.totalParticipants": "Total de participantes",
    "status.remainingTokens": "Tokens restantes",
    "status.timeRemaining": "Tiempo restante",
    "status.days": "días",
    "status.hours": "horas",
    "status.minutes": "minutos",
    "status.seconds": "segundos",
    "status.loading": "Cargando estadísticas...",
    "status.error": "Error al cargar estadísticas",

    // Roadmap
    "roadmap.title": "Hoja de Ruta",
    "roadmap.subtitle": "Nuestro viaje hacia el futuro",
    "roadmap.phase1.title": "Fase 1: Lanzamiento",
    "roadmap.phase1.description": "Lanzamiento del token, airdrop y listados en DEX",
    "roadmap.phase2.title": "Fase 2: Expansión",
    "roadmap.phase2.description": "Listados en CEX, asociaciones y expansión de la comunidad",
    "roadmap.phase3.title": "Fase 3: Utilidad",
    "roadmap.phase3.description": "Desarrollo de utilidades para el token y ecosistema",
    "roadmap.phase4.title": "Fase 4: Futuro",
    "roadmap.phase4.description": "Expansión global y nuevas integraciones",

    // Security
    "security.title": "Seguridad",
    "security.subtitle": "Manteniendo tus activos seguros",
    "security.tip1.title": "Usa billeteras seguras",
    "security.tip1.description": "Recomendamos usar billeteras como MetaMask, Trust Wallet o hardware wallets",
    "security.tip2.title": "Verifica los contratos",
    "security.tip2.description": "Siempre verifica la dirección del contrato antes de interactuar",
    "security.tip3.title": "Cuidado con las estafas",
    "security.tip3.description": "Nunca compartas tu frase de recuperación o claves privadas",
    "security.tip4.title": "Verifica las URLs",
    "security.tip4.description": "Asegúrate de estar en el sitio web oficial antes de conectar tu billetera",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.warning": "Advertencia",
    "common.info": "Información",
    "common.close": "Cerrar",
    "common.confirm": "Confirmar",
    "common.cancel": "Cancelar",
    "common.submit": "Enviar",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.yes": "Sí",
    "common.no": "No",
  },
}

// Função para substituir placeholders em uma string
const replacePlaceholders = (str: string, ...args: any[]): string => {
  try {
    return str.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] !== "undefined" ? String(args[number]) : match
    })
  } catch (error) {
    console.error("Error replacing placeholders:", error)
    return str
  }
}

// Hook para usar traduções
export function useTranslations() {
  const [language, setLanguage] = useState<string>("pt")

  // Carregar idioma do localStorage ao inicializar
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Função para alterar o idioma
  const changeLanguage = useCallback((newLanguage: string) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage)
      localStorage.setItem("language", newLanguage)
    }
  }, [])

  // Função para traduzir uma chave
  const translate = useCallback(
    (key: string, defaultValue?: string, ...args: any[]): string => {
      try {
        const dict = translations[language] || translations.pt
        const translation = dict[key] || defaultValue || key

        if (args.length > 0) {
          return replacePlaceholders(translation, ...args)
        }

        return translation
      } catch (error) {
        console.error(`Erro ao processar tradução para a chave "${key}":`, error)
        return defaultValue || key
      }
    },
    [language],
  )

  return {
    t: translate,
    language,
    changeLanguage,
    availableLanguages: Object.keys(translations),
  }
}

