// @ts-check

/**
 * Script de verificação pré-implantação aprimorado
 * Execute com: node scripts/pre-deploy-check.js
 */

const fs = require("fs")
const path = require("path")

// Cores para console
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

console.log(`${colors.cyan}🚀 Iniciando verificações pré-implantação...${colors.reset}\n`)

// Verifica se os arquivos essenciais existem
const requiredFiles = [
  "next.config.mjs",
  "package.json",
  "app/layout.tsx",
  "app/page.tsx",
  "components/airdrop-tasks.tsx",
  "lib/storage-service.ts",
  "app/admin/dashboard/page.tsx",
]

console.log(`${colors.blue}🔍 Verificando arquivos essenciais...${colors.reset}`)
const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)))

if (missingFiles.length > 0) {
  console.error(`${colors.red}❌ Arquivos essenciais ausentes:${colors.reset}`, missingFiles.join(", "))
  process.exit(1)
}

console.log(`${colors.green}✅ Todos os arquivos essenciais estão presentes${colors.reset}`)

// Verifica se o package.json tem os scripts necessários
console.log(`${colors.blue}🔍 Verificando package.json...${colors.reset}`)
const packageJson = require("../package.json")

const requiredScripts = ["build", "start"]
const missingScripts = requiredScripts.filter((script) => !packageJson.scripts[script])

if (missingScripts.length > 0) {
  console.error(
    `${colors.red}❌ Scripts necessários ausentes no package.json:${colors.reset}`,
    missingScripts.join(", "),
  )
  process.exit(1)
}

console.log(`${colors.green}✅ package.json está configurado corretamente${colors.reset}`)

// Verifica se as dependências estão instaladas
console.log(`${colors.blue}🔍 Verificando dependências...${colors.reset}`)
const nodeModulesExists = fs.existsSync(path.join(process.cwd(), "node_modules"))

if (!nodeModulesExists) {
  console.error(
    `${colors.red}❌ Pasta node_modules não encontrada. Execute npm install antes de implantar.${colors.reset}`,
  )
  process.exit(1)
}

console.log(`${colors.green}✅ Dependências instaladas${colors.reset}`)

// Verifica se o .gitignore está configurado corretamente
console.log(`${colors.blue}🔍 Verificando .gitignore...${colors.reset}`)
const gitignorePath = path.join(process.cwd(), ".gitignore")
const gitignoreExists = fs.existsSync(gitignorePath)

if (!gitignoreExists) {
  console.error(`${colors.red}❌ Arquivo .gitignore não encontrado${colors.reset}`)
  process.exit(1)
}

const gitignoreContent = fs.readFileSync(gitignorePath, "utf8")
const requiredIgnores = [".env", ".env.local", "node_modules", ".next", "out"]
const missingIgnores = requiredIgnores.filter((ignore) => !gitignoreContent.includes(ignore))

if (missingIgnores.length > 0) {
  console.warn(`${colors.yellow}⚠️ Itens recomendados ausentes no .gitignore:${colors.reset}`, missingIgnores.join(", "))
}

console.log(`${colors.green}✅ .gitignore configurado${colors.reset}`)

// Verificação de exemplo de variáveis de ambiente
console.log(`${colors.blue}🔍 Verificando arquivo .env.example...${colors.reset}`)
const envExamplePath = path.join(process.cwd(), ".env.example")
const envExampleExists = fs.existsSync(envExamplePath)

if (!envExampleExists) {
  console.warn(
    `${colors.yellow}⚠️ Arquivo .env.example não encontrado. Recomendado para documentar variáveis de ambiente.${colors.reset}`,
  )
} else {
  console.log(`${colors.green}✅ Arquivo .env.example encontrado${colors.reset}`)
}

// Verificação final
console.log(
  `\n${colors.green}🎉 Todas as verificações passaram! A aplicação está pronta para implantação.${colors.reset}`,
)

