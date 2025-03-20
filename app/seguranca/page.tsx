import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, CheckCircle, AlertTriangle } from "lucide-react"

export default function SecurityPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar />

      <div className="max-w-4xl w-full z-10 mt-20 pb-16">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-purple-400">Segurança do Airdrop Street Dog Coin</h1>
          <p className="text-gray-300">Entenda como protegemos suas transações e mantemos seu airdrop seguro</p>
        </div>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden mb-8">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-xl text-purple-400">Nosso Compromisso com Segurança</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              Como protegemos suas transações e garantimos a segurança do seu airdrop
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-gray-300">
              No airdrop do Street Dog Coin, a segurança é nossa prioridade número um. Implementamos várias camadas de
              proteção para garantir que suas transações sejam seguras e que seu airdrop esteja protegido contra
              ameaças.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-purple-300">Conexão Segura</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Todas as conexões com nosso site são protegidas por HTTPS, garantindo que seus dados sejam
                  criptografados durante a transmissão.
                </p>
              </div>

              <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-purple-300">Verificação de Contratos</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Nossos contratos inteligentes são verificados e auditados por empresas de segurança respeitadas no
                  setor.
                </p>
              </div>

              <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-purple-300">Proteção contra Phishing</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Implementamos medidas para proteger nossos usuários contra sites de phishing e tentativas de fraude.
                </p>
              </div>

              <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-purple-400" />
                  <h3 className="font-medium text-purple-300">Alertas de Segurança</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Nosso sistema monitora constantemente atividades suspeitas e alerta os usuários sobre possíveis
                  riscos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden mb-8">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Segurança do Airdrop</CardTitle>
            <CardDescription className="text-gray-400">
              Medidas específicas para garantir a segurança do processo de airdrop
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-300">
                Para garantir que o processo de airdrop seja seguro e justo, implementamos as seguintes medidas:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-300">Verificação de carteira</h4>
                    <p className="text-gray-300 text-sm">
                      Cada carteira passa por um processo de verificação para garantir que seja legítima e não esteja
                      participando de múltiplos airdrops.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-300">Contratos inteligentes auditados</h4>
                    <p className="text-gray-300 text-sm">
                      Nossos contratos de distribuição de tokens foram auditados por empresas de segurança para garantir
                      que não haja vulnerabilidades.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-300">Proteção contra bots</h4>
                    <p className="text-gray-300 text-sm">
                      Implementamos medidas para detectar e bloquear bots que tentam participar do airdrop de forma
                      automatizada.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-300">Distribuição transparente</h4>
                    <p className="text-gray-300 text-sm">
                      Todo o processo de distribuição de tokens é transparente e pode ser verificado na blockchain.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Contato de Segurança</CardTitle>
            <CardDescription className="text-gray-400">
              Como reportar problemas de segurança ou atividades suspeitas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-300 mb-4">
              Se você identificar qualquer problema de segurança, atividade suspeita ou acreditar que sua conta foi
              comprometida, entre em contato conosco imediatamente:
            </p>

            <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
              <p className="text-blue-300 font-medium">Email de Segurança:</p>
              <p className="text-blue-100">seguranca@streetdogcoin.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

