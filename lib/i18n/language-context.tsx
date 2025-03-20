"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations } from "./translations"

type Language = "pt" | "en"
type TranslationKey = string

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt")

  useEffect(() => {
    // Carregar preferência de idioma do localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "pt" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    } else {
      // Detectar idioma do navegador como fallback
      const browserLang = navigator.language.split("-")[0]
      setLanguageState(browserLang === "en" ? "en" : "pt")
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Função para obter traduções
  const t = (key: TranslationKey): string => {
    // Dividir a chave por pontos para acessar objetos aninhados
    const keys = key.split(".")
    let value: any = translations[language]

    // Navegar pela estrutura de objetos
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key // Retornar a chave como fallback
      }
    }

    return value
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

