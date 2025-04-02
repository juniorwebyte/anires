import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import SecurityReportForm from "@/components/security-report-form"

export const metadata: Metadata = {
  title: "Reportar Problema de Segurança | AniRes",
  description: "Reporte problemas de segurança, sites falsos ou atividades suspeitas relacionadas ao AniRes",
}

export default function ReportSecurityIssuePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <AlertTriangle className="h-8 w-8 mr-3 text-yellow-500" />
          <h1 className="text-3xl font-bold">Reportar Problema de Segurança</h1>
        </div>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden mb-8">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Formulário de Relatório</CardTitle>
            <CardDescription className="text-gray-400">
              Ajude-nos a manter o AniRes seguro reportando problemas de segurança
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <SecurityReportForm />
          </CardContent>
        </Card>

        <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-300">Outros Canais de Contato</h2>
          <p className="mb-4 text-gray-300">
            Para problemas urgentes de segurança, você também pode entrar em contato conosco através dos seguintes
            canais:
          </p>

          <ul className="space-y-3 text-gray-300">
            <li>
              <strong className="text-purple-300">E-mail de Segurança:</strong> security@anires.org
            </li>
            <li>
              <strong className="text-purple-300">Telegram:</strong> @AniResSecurity
            </li>
            <li>
              <strong className="text-purple-300">Discord:</strong> Canal #security no servidor oficial do AniRes
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}

