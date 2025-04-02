"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "./translations"

type Language = "pt" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const defaultLanguage: Language = "pt"

// Criar o contexto com valores padrão
const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: () => "",
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Estado para armazenar o idioma atual
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  // Efeito para carregar o idioma salvo no localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Função para alterar o idioma e salvar no localStorage
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  // Função melhorada para buscar traduções
  const translate = (key: string): string => {
    // Dividir a chave em partes (por exemplo, "home.hero.title" => ["home", "hero", "title"])
    const parts = key.split(".")

    // Iniciar com as traduções do idioma atual
    let result: any = translations[language]

    // Se não encontrar o idioma atual, tentar o idioma alternativo
    if (!result) {
      const alternativeLanguage: Language = language === "pt" ? "en" : "pt"
      result = translations[alternativeLanguage]
      console.warn(`Idioma ${language} não encontrado, usando ${alternativeLanguage} como fallback`)
    }

    // Navegar pela estrutura de objetos seguindo as partes da chave
    try {
      for (const part of parts) {
        if (result && typeof result === "object" && part in result) {
          result = result[part]
        } else {
          // Se a parte não existir, verificar no idioma alternativo
          const alternativeLanguage: Language = language === "pt" ? "en" : "pt"
          let altResult = translations[alternativeLanguage]

          // Tentar navegar no idioma alternativo
          let found = true
          for (const p of parts) {
            if (altResult && typeof altResult === "object" && p in altResult) {
              altResult = altResult[p]
            } else {
              found = false
              break
            }
          }

          // Se encontrou no idioma alternativo, usar como fallback
          if (found) {
            console.warn(
              `Chave "${key}" não encontrada no idioma ${language}, usando ${alternativeLanguage} como fallback`,
            )
            return String(altResult)
          }

          // Se não encontrou em nenhum idioma, retornar a chave
          console.warn(`Chave de tradução não encontrada: ${key}`)
          return key
        }
      }

      // Garantir que o resultado seja uma string
      return String(result)
    } catch (error) {
      console.error(`Erro ao buscar tradução para a chave "${key}":`, error)
      return key
    }
  }

  // Valor do contexto
  const contextValue: LanguageContextType = {
    language,
    setLanguage: changeLanguage,
    t: translate,
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

// Hook personalizado para usar o contexto de idioma
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider")
  }
  return context
}

