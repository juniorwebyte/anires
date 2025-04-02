"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  // Melhorar o componente LanguageSwitcher para garantir uma transição mais suave entre idiomas
  // e evitar problemas de renderização

  // Modificar a função handleLanguageChange para ser mais robusta
  const handleLanguageChange = (lang: "pt" | "en") => {
    try {
      // Salvar o idioma no localStorage antes de atualizar o estado
      localStorage.setItem("language", lang)

      // Atualizar o estado
      setLanguage(lang)

      // Adicionar um pequeno atraso antes de recarregar a página
      // para garantir que o localStorage seja atualizado
      setTimeout(() => {
        if (typeof window !== "undefined") {
          // Usar location.reload(true) para forçar um recarregamento completo
          window.location.reload()
        }
      }, 100)
    } catch (error) {
      console.error("Error changing language:", error)
      // Tentar uma abordagem alternativa se o método principal falhar
      if (typeof window !== "undefined") {
        window.location.href = window.location.pathname + "?lang=" + lang
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-12 px-1 text-gray-300 hover:text-purple-300 hover:bg-purple-900/10"
          aria-label={t("common.language")}
        >
          <Globe className="h-4 w-4 mr-1" />
          <span>{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border-purple-900/30 backdrop-blur-md">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("pt")}
          className={`${language === "pt" ? "bg-purple-900/20 text-purple-300" : "text-gray-300"} hover:bg-purple-900/10 hover:text-purple-300`}
        >
          PT
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`${language === "en" ? "bg-purple-900/20 text-purple-300" : "text-gray-300"} hover:bg-purple-900/10 hover:text-purple-300`}
        >
          EN
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

