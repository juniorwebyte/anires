"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Zap, ZapOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"

export default function PerformanceToggle() {
  const [isLowPerfMode, setIsLowPerfMode] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    // Verificar se já existe uma preferência salva
    const savedPref = localStorage.getItem("lowPerfMode")
    if (savedPref) {
      setIsLowPerfMode(savedPref === "true")
    }
  }, [])

  const togglePerformanceMode = () => {
    const newMode = !isLowPerfMode
    setIsLowPerfMode(newMode)

    // Salvar a preferência
    localStorage.setItem("lowPerfMode", newMode ? "true" : "false")

    // Adicionar ou remover a classe do body
    if (newMode) {
      document.body.classList.add("low-perf-mode")
    } else {
      document.body.classList.remove("low-perf-mode")
    }

    // Mostrar toast
    toast({
      title: newMode ? t("performance.lowMode") : t("performance.highMode"),
      description: newMode ? t("performance.lowModeDesc") : t("performance.highModeDesc"),
      duration: 3000,
    })

    // Recarregar a página para aplicar as mudanças
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 z-50 bg-black/50 border-purple-800/30 hover:bg-purple-900/20"
      onClick={togglePerformanceMode}
      title={isLowPerfMode ? t("performance.enableHighMode") : t("performance.enableLowMode")}
    >
      {isLowPerfMode ? (
        <>
          <Zap className="h-4 w-4 mr-2 text-yellow-400" />
          <span className="text-xs">{t("performance.lightMode")}</span>
        </>
      ) : (
        <>
          <ZapOff className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-xs">{t("performance.lightMode")}</span>
        </>
      )}
    </Button>
  )
}

