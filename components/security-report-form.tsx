"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react"

export default function SecurityReportForm() {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    url: "",
    contactEmail: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [referenceId, setReferenceId] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.issueType || !formData.description) {
      setSubmitStatus("error")
      setErrorMessage("Por favor, preencha o tipo de problema e a descrição.")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitStatus("idle")

      const response = await fetch("/api/security/report-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userAgent: navigator.userAgent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar relatório")
      }

      setSubmitStatus("success")
      setReferenceId(data.referenceId || "")

      // Limpar formulário após envio bem-sucedido
      setFormData({
        issueType: "",
        description: "",
        url: "",
        contactEmail: "",
      })
    } catch (error) {
      console.error("Erro ao enviar relatório:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro ao enviar o relatório")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === "success" && (
        <Alert className="bg-green-950/50 border-green-800 text-green-200">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription>
            Seu relatório foi enviado com sucesso. Obrigado por ajudar a manter o AniRes seguro!
            {referenceId && (
              <p className="mt-2 font-medium">
                ID de referência: <span className="font-mono">{referenceId}</span>
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert className="bg-red-950/50 border-red-800 text-red-200">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="issueType" className="text-gray-300">
          Tipo de Problema
        </Label>
        <Select value={formData.issueType} onValueChange={(value) => handleSelectChange("issueType", value)}>
          <SelectTrigger id="issueType" className="bg-black/50 border-purple-800/30 text-white">
            <SelectValue placeholder="Selecione o tipo de problema" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-purple-800/30 text-white">
            <SelectItem value="phishing">Site de Phishing</SelectItem>
            <SelectItem value="scam">Golpe ou Fraude</SelectItem>
            <SelectItem value="fake-token">Token Falso</SelectItem>
            <SelectItem value="vulnerability">Vulnerabilidade de Segurança</SelectItem>
            <SelectItem value="impersonation">Perfil Falso (Impersonation)</SelectItem>
            <SelectItem value="other">Outro Problema</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-300">
          Descrição do Problema
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o problema de segurança em detalhes"
          className="bg-black/50 border-purple-800/30 text-white min-h-[120px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url" className="text-gray-300">
          URL Relacionada (se aplicável)
        </Label>
        <Input
          id="url"
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://exemplo.com"
          className="bg-black/50 border-purple-800/30 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail" className="text-gray-300">
          Seu Email (opcional)
        </Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleChange}
          placeholder="seu@email.com"
          className="bg-black/50 border-purple-800/30 text-white"
        />
        <p className="text-xs text-gray-400">Forneça seu email se desejar receber atualizações sobre este relatório</p>
      </div>

      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Relatório"
        )}
      </Button>
    </form>
  )
}

