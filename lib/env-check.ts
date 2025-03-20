/**
 * Verifica se todas as variáveis de ambiente necessárias estão definidas
 */
export function checkRequiredEnvVars() {
  // Apenas execute no servidor
  if (typeof window !== "undefined") return

  // Lista de variáveis de ambiente obrigatórias
  const requiredEnvVars = ["NEXT_PUBLIC_ADMIN_USERNAME", "NEXT_PUBLIC_ADMIN_PASSWORD", "TOKEN"]

  // Verificar cada variável
  const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])

  // Se houver variáveis faltando, registre um aviso
  if (missingEnvVars.length > 0) {
    console.warn(`⚠️ Variáveis de ambiente faltando: ${missingEnvVars.join(", ")}`)

    // Em produção, isso pode ser um erro crítico
    if (process.env.NODE_ENV === "production") {
      console.error("❌ Variáveis de ambiente obrigatórias estão faltando em produção!")
    }
  }
}

