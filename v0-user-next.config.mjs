/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
    ],
    unoptimized: process.env.NODE_ENV !== 'production', // Otimizar imagens em produção
  },
  // Otimizações para produção
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Configurações de segurança
  headers: async () => {
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
        ],
      },
    ]
  },
  // Configuração para melhorar o desempenho
  experimental: {
    optimizeCss: true, // Otimizar CSS
    scrollRestoration: true, // Melhorar a restauração de rolagem
  },
};

export default nextConfig;

