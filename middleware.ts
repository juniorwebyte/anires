import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lista de domínios permitidos para fazer solicitações ao nosso site
const allowedOrigins = [
  "https://anires.org",
  "https://www.anires.org",
  "https://airdrop.anires.org",
  "https://app.anires.org",
  "https://presale.anires.org",
  "https://staking.anires.org",
  "https://docs.anires.org",
  "https://vercel.app",
  "https://vercel.com",
]

// Lista de IPs suspeitos (exemplo)
// Em produção, isso poderia ser carregado de uma API ou banco de dados
const suspiciousIPs: string[] = []

// Limite de taxa para solicitações de API (requisições por minuto)
const RATE_LIMIT = 60
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minuto em milissegundos

// Armazenamento em memória para controle de taxa (em produção, use Redis ou similar)
const ipRequestCounts: Record<string, { count: number; resetTime: number }> = {}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const ip = request.ip || "unknown"
  const path = request.nextUrl.pathname
  const origin = request.headers.get("origin")

  // Verificar limite de taxa para APIs
  if (path.startsWith("/api/")) {
    // Verificar se é hora de redefinir o contador
    if (!ipRequestCounts[ip] || Date.now() > ipRequestCounts[ip].resetTime) {
      ipRequestCounts[ip] = {
        count: 1,
        resetTime: Date.now() + RATE_LIMIT_WINDOW,
      }
    } else {
      // Incrementar contador
      ipRequestCounts[ip].count++

      // Verificar se excedeu o limite
      if (ipRequestCounts[ip].count > RATE_LIMIT) {
        console.warn(`Limite de taxa excedido para IP: ${ip}`)
        return new NextResponse("Muitas solicitações. Tente novamente mais tarde.", {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        })
      }
    }
  }

  // Verificar se a solicitação é HTTP e redirecionar para HTTPS
  if (request.nextUrl.protocol === "http:") {
    const httpsUrl = `https://${request.nextUrl.host}${request.nextUrl.pathname}${request.nextUrl.search}`
    return NextResponse.redirect(httpsUrl, 301)
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Verificar origem da solicitação
  if (origin) {
    const isAllowed = allowedOrigins.some(
      (allowedOrigin) =>
        origin === allowedOrigin ||
        origin.endsWith(allowedOrigin) ||
        // Permitir localhost e domínios de desenvolvimento em ambiente não-produção
        (process.env.NODE_ENV !== "production" &&
          (origin.startsWith("http://localhost:") || origin.includes(".vercel.app"))),
    )

    if (!isAllowed) {
      // Registrar tentativa suspeita
      console.warn(`Tentativa de acesso de origem não permitida: ${origin}`)

      // Em produção, poderíamos bloquear completamente
      if (process.env.NODE_ENV === "production" && (path.startsWith("/api/") || path.startsWith("/admin/"))) {
        return new NextResponse("Acesso negado", { status: 403 })
      }
    }
  }

  // Verificar IP suspeito
  if (suspiciousIPs.includes(ip)) {
    // Registrar tentativa suspeita
    console.warn(`Tentativa de acesso de IP suspeito: ${ip}`)
    return new NextResponse("Acesso negado", { status: 403 })
  }

  // Adicionar cabeçalhos de segurança
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")

  // Adicionar cabeçalho de segurança para prevenir clickjacking e melhorar a segurança geral
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
      "connect-src 'self' https://*.infura.io https://*.alchemyapi.io https://*.coinbase.com " +
      "https://api.coingecko.com https://api.coinmarketcap.com wss://*.walletconnect.org; " +
      "img-src 'self' data: https://v0.blob.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com; " +
      "style-src 'self' 'unsafe-inline'; font-src 'self' data:; " +
      "frame-src 'self' https://*.walletconnect.com https://*.coinbase.com; " +
      "object-src 'none'; base-uri 'self'; form-action 'self'; " +
      "frame-ancestors 'none'; upgrade-insecure-requests;",
  )

  // Adicionar cabeçalho de permissões
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")

  return response
}

export const config = {
  matcher: [
    // Aplicar a todas as rotas exceto recursos estáticos
    "/((?!_next/static|_next/image|favicon.ico|images|assets|fonts).*)",
  ],
}

