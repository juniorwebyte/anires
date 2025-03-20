/**
 * Script para verificar a consistência das traduções
 *
 * Este script verifica se todas as chaves de tradução existem em todos os idiomas
 * e se há chaves ausentes ou inconsistentes.
 *
 * Para executar: npx ts-node scripts/check-translations.ts
 */

import { translations } from "../lib/i18n/translations"

// Função para obter todas as chaves de um objeto aninhado
function getAllKeys(obj: any, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) {
    return [prefix]
  }

  return Object.entries(obj).flatMap(([key, value]) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return getAllKeys(value, newPrefix)
    }
    return [newPrefix]
  })
}

// Função para verificar se uma chave existe em um objeto aninhado
function keyExists(obj: any, path: string): boolean {
  const parts = path.split(".")
  let current = obj

  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== "object") {
      return false
    }
    current = current[part]
  }

  return current !== undefined
}

// Função para obter o valor de uma chave em um objeto aninhado
function getValue(obj: any, path: string): any {
  const parts = path.split(".")
  let current = obj

  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== "object") {
      return undefined
    }
    current = current[part]
  }

  return current
}

// Verificar traduções
function checkTranslations() {
  console.log("Verificando consistência das traduções...\n")

  // Obter todos os idiomas disponíveis
  const languages = Object.keys(translations)
  console.log(`Idiomas disponíveis: ${languages.join(", ")}\n`)

  // Obter todas as chaves para cada idioma
  const keysByLanguage: Record<string, string[]> = {}
  languages.forEach((lang) => {
    keysByLanguage[lang] = getAllKeys(translations[lang])
  })

  // Verificar chaves ausentes em cada idioma
  let hasErrors = false
  languages.forEach((lang) => {
    console.log(`\n=== Verificando chaves para o idioma: ${lang} ===`)

    // Verificar chaves ausentes em comparação com outros idiomas
    const otherLanguages = languages.filter((l) => l !== lang)
    otherLanguages.forEach((otherLang) => {
      const missingKeys = keysByLanguage[otherLang].filter((key) => !keyExists(translations[lang], key))

      if (missingKeys.length > 0) {
        hasErrors = true
        console.log(`\nChaves presentes em "${otherLang}" mas ausentes em "${lang}" (${missingKeys.length}):`)
        missingKeys.forEach((key) => {
          const value = getValue(translations[otherLang], key)
          console.log(`  - ${key}: "${value}"`)
        })
      }
    })

    // Verificar chaves que existem apenas neste idioma
    const uniqueKeys = keysByLanguage[lang].filter((key) =>
      otherLanguages.every((otherLang) => !keyExists(translations[otherLang], key)),
    )

    if (uniqueKeys.length > 0) {
      console.log(`\nChaves exclusivas do idioma "${lang}" (${uniqueKeys.length}):`)
      uniqueKeys.forEach((key) => {
        const value = getValue(translations[lang], key)
        console.log(`  - ${key}: "${value}"`)
      })
    }
  })

  // Verificar tipos inconsistentes
  console.log("\n=== Verificando tipos inconsistentes ===")
  const allKeys = new Set<string>()
  Object.values(keysByLanguage).forEach((keys) => keys.forEach((key) => allKeys.add(key)))

  const inconsistentTypes: Record<string, Record<string, string>> = {}

  Array.from(allKeys).forEach((key) => {
    const types: Record<string, string> = {}

    languages.forEach((lang) => {
      if (keyExists(translations[lang], key)) {
        const value = getValue(translations[lang], key)
        types[lang] = Array.isArray(value) ? "array" : typeof value
      }
    })

    const uniqueTypes = new Set(Object.values(types))
    if (uniqueTypes.size > 1) {
      inconsistentTypes[key] = types
    }
  })

  if (Object.keys(inconsistentTypes).length > 0) {
    hasErrors = true
    console.log("\nChaves com tipos inconsistentes entre idiomas:")
    Object.entries(inconsistentTypes).forEach(([key, types]) => {
      console.log(`  - ${key}:`)
      Object.entries(types).forEach(([lang, type]) => {
        console.log(`    - ${lang}: ${type}`)
      })
    })
  } else {
    console.log("Nenhum tipo inconsistente encontrado.")
  }

  // Resumo
  console.log("\n=== Resumo ===")
  languages.forEach((lang) => {
    console.log(`${lang}: ${keysByLanguage[lang].length} chaves`)
  })

  if (hasErrors) {
    console.log("\n⚠️ Foram encontrados problemas nas traduções. Por favor, corrija-os antes de prosseguir.")
  } else {
    console.log("\n✅ Todas as traduções estão consistentes!")
  }
}

// Executar a verificação
checkTranslations()

