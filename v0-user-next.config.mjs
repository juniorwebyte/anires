/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false, // Remove o cabeçalho X-Powered-By para segurança
  images: {
    domains: ['v0.blob.com', 'hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    unoptimized: process.env.NODE_ENV !== 'production', // Otimizar imagens em produção
  },
  // Configuração para melhorar a segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; connect-src 'self' https://*.infura.io https://*.alchemyapi.io https://*.coinbase.com https://api.coingecko.com https://api.coinmarketcap.com; img-src 'self' data: https://v0.blob.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src 'self' https://*.walletconnect.com https://*.coinbase.com;",
          },
        ],
      },
    ];
  },
  // Configuração para otimização de produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Configuração para melhorar o desempenho
  experimental: {
    optimizeCss: true, // Otimizar CSS
    scrollRestoration: true, // Melhorar a restauração de rolagem
  },
};

export default nextConfig;

