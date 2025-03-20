"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

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
          onClick={() => setLanguage("pt")}
          className={`${language === "pt" ? "bg-purple-900/20 text-purple-300" : "text-gray-300"} hover:bg-purple-900/10 hover:text-purple-300`}
        >
          PT
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`${language === "en" ? "bg-purple-900/20 text-purple-300" : "text-gray-300"} hover:bg-purple-900/10 hover:text-purple-300`}
        >
          EN
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

