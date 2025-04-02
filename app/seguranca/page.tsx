import type { Metadata } from "next"
import { Shield, Lock, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Segurança | AniRes",
  description: "Informações de segurança e melhores práticas para usuários do AniRes",
}

export default function SecurityPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Shield className="h-8 w-8 mr-3 text-purple-500" />
          <h1 className="text-3xl font-bold">Centro de Segurança AniRes</h1>
        </div>

        <Alert className="mb-8 border-purple-800 bg-purple-950/50">
          <CheckCircle className="h-5 w-5 text-purple-400" />
          <AlertTitle className="text-purple-300">Site Oficial AniRes</AlertTitle>
          <AlertDescription className="text-purple-200">
            Você está no site oficial do AniRes. Sempre verifique se está acessando https://anires.org ou seus
            subdomínios oficiais.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="border-b border-purple-900/20 bg-black/50">
              <CardTitle className="text-xl text-purple-400">Como Verificar a Autenticidade</CardTitle>
              <CardDescription className="text-gray-400">
                Certifique-se de que está no site oficial do AniRes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <p>
                    Verifique se o URL é <strong>https://anires.org</strong> ou um subdomínio oficial como{" "}
                    <strong>app.anires.org</strong>
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <p>Confirme que há um cadeado na barra de endereço do seu navegador</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <p>Nossos contratos oficiais estão verificados no Etherscan/BSCScan</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                  <p>Sempre acesse o site através de nossos canais oficiais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="border-b border-purple-900/20 bg-black/50">
              <CardTitle className="text-xl text-purple-400">Alertas de Segurança</CardTitle>
              <CardDescription className="text-gray-400">Fique atento a estas ameaças comuns</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                  <p>Nunca compartilhe sua frase de recuperação ou chaves privadas com ninguém</p>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                  <p>Desconfie de ofertas que parecem boas demais para ser verdade</p>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                  <p>Cuidado com sites falsos que imitam o AniRes</p>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                  <p>Verifique sempre as transações antes de confirmá-las em sua carteira</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-purple-400">Melhores Práticas de Segurança</h2>

        <div className="space-y-6 mb-12">
          <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="border-b border-purple-900/20 bg-black/50">
              <CardTitle className="text-xl text-purple-400">Proteja sua Carteira</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Lock className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span>Use uma carteira de hardware para armazenar grandes quantidades de tokens</span>
                </li>
                <li className="flex items-start">
                  <Lock className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span>Ative a autenticação de dois fatores (2FA) em todas as suas contas</span>
                </li>
                <li className="flex items-start">
                  <Lock className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span>Mantenha seu software de carteira e navegador sempre atualizados</span>
                </li>
                <li className="flex items-start">
                  <Lock className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span>Faça backup da sua frase de recuperação em um local seguro offline</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="border-b border-purple-900/20 bg-black/50">
              <CardTitle className="text-xl text-purple-400">Transações Seguras</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Lock className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span>Sempre verifique o endereço do destinatário antes de enviar tokens</span>
                </li>
                <li className="flex items-start">
                  <Lock className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span>Comece com pequenas transações de teste antes de enviar grandes quantidades</span>
                </li>
                <li className="flex items-start">
                  <Lock className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span>Verifique os detalhes do contrato inteligente antes de interagir com ele</span>
                </li>
                <li className="flex items-start">
                  <Lock className="h-5 w-5 mr-2 text-purple-400 mt-0.5" />
                  <span>Tenha cuidado com solicitações de aprovação de gastos ilimitados</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Contratos Oficiais AniRes</h2>
          <p className="mb-4 text-gray-300">Sempre verifique se está interagindo com nossos contratos oficiais:</p>

          <div className="space-y-3">
            <div className="bg-black/30 p-3 rounded-md border border-purple-800/20">
              <p className="text-sm text-gray-400">Token AniRes (ANIRES)</p>
              <div className="flex items-center justify-between">
                <code className="text-purple-300 font-mono text-sm">0x65B7ed11edE43cD2be4414aABdc7Cc7911847203</code>
                <a
                  href="https://bscscan.com/address/0x65b7ed11ede43cd2be4414aabdc7cc7911847203"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
                >
                  Ver na BscScan <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded-md border border-purple-800/20">
              <p className="text-sm text-gray-400">Contrato de Staking</p>
              <div className="flex items-center justify-between">
                <code className="text-purple-300 font-mono text-sm">0x0987654321098765432109876543210987654321</code>
                <a
                  href="https://etherscan.io/address/0x0987654321098765432109876543210987654321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
                >
                  Ver na BscScan <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded-md border border-purple-800/20">
              <p className="text-sm text-gray-400">Contrato de Presale</p>
              <div className="flex items-center justify-between">
                <code className="text-purple-300 font-mono text-sm">0xc008Da18Be69e3D77863d665b6F5278B9105e4b8</code>
                <a
                  href="https://bscscan.com/address/0xc008da18be69e3d77863d665b6f5278b9105e4b8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
                >
                  Ver na BscScan <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">Reportar um Problema de Segurança</h2>
          <p className="mb-6 text-gray-300">
            Encontrou um problema de segurança ou um site falso do AniRes? Informe nossa equipe imediatamente.
          </p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/seguranca/reportar">Reportar Problema de Segurança</Link>
          </Button>
        </div>

        <Alert className="border-yellow-800 bg-yellow-950/50">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <AlertTitle className="text-yellow-300">Lembre-se</AlertTitle>
          <AlertDescription className="text-yellow-200">
            A equipe do AniRes nunca solicitará sua frase de recuperação, chaves privadas ou que você envie tokens para
            "verificar" sua carteira. Nunca compartilhe essas informações com ninguém.
          </AlertDescription>
        </Alert>
      </div>
    </main>
  )
}

