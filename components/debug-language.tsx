"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Componente para depuração de traduções
 * Este componente é útil durante o desenvolvimento para testar traduções
 * Não deve ser usado em produção
 */
export default function DebugLanguage() {
  const { language, setLanguage, t } = useLanguage()
  const [key, setKey] = useState("home.hero.title")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  const testTranslation = () => {
    try {
      const translation = t(key)
      setResult(translation)
      setError("")
    } catch (err) {
      setError(`Erro: ${err instanceof Error ? err.message : String(err)}`)
      setResult("")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-black/80 border border-blue-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-400">Depurador de Traduções</CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Idioma atual: <span className="font-bold text-blue-300">{language}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={language === "pt" ? "default" : "outline"}
              onClick={() => setLanguage("pt")}
              className="text-xs flex-1"
            >
              Português
            </Button>
            <Button
              size="sm"
              variant={language === "en" ? "default" : "outline"}
              onClick={() => setLanguage("en")}
              className="text-xs flex-1"
            >
              English
            </Button>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Chave de tradução:</label>
            <div className="flex space-x-2">
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="h-8 text-xs bg-gray-900 border-gray-700"
              />
              <Button size="sm" onClick={testTranslation} className="h-8 text-xs">
                Testar
              </Button>
            </div>
          </div>
          {result && (
            <div className="space-y-1">
              <label className="text-xs text-gray-400">Resultado:</label>
              <div className="p-2 bg-gray-900 rounded text-xs break-words border border-gray-700">{result}</div>
            </div>
          )}
          {error && <div className="p-2 bg-red-900/50 rounded text-xs text-red-300 border border-red-700">{error}</div>}
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-gray-500">Este componente é apenas para desenvolvimento</p>
        </CardFooter>
      </Card>
    </div>
  )
}

