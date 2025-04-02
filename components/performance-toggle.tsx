"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Gauge } from "lucide-react"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

export default function PerformanceToggle() {
  const { isPerformanceMode, togglePerformanceMode } = usePerformanceMode()
  const [mounted, setMounted] = useState(false)

  // Evitar hidratação incorreta
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="bg-black/50 backdrop-blur-sm border-blue-800/30 hover:bg-blue-900/20 hover:text-blue-300"
        onClick={togglePerformanceMode}
        title="Alternar modo de performance"
      >
        <Gauge className="h-4 w-4 mr-2" />
        {isPerformanceMode ? "Modo Padrão" : "Modo Performance"}
      </Button>
    </div>
  )
}

