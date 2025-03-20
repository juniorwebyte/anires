"use client"

import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"

export default function CookiesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar isWalletConnected={false} />

      <section className="pt-24 pb-12 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
              Política de Cookies
            </h1>
            <p className="text-xl text-gray-300">Última atualização: 16 de março de 2025</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-8 backdrop-blur-sm"
          >
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-blue-400">1. O que são Cookies?</h2>
              <p>
                Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, tablet,
                smartphone) quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem
                de maneira mais eficiente, bem como fornecer informações aos proprietários do site.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">2. Como Usamos Cookies</h2>
              <p>O Street Dog Coin utiliza cookies e tecnologias semelhantes para diversos propósitos, incluindo:</p>
              <ul>
                <li>
                  <strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site. Eles permitem
                  que você navegue pelo site e use recursos essenciais, como áreas seguras e carteiras digitais.
                </li>
                <li>
                  <strong>Cookies de Preferências:</strong> Permitem que o site lembre informações que mudam a aparência
                  ou o comportamento do site, como seu idioma preferido ou a região em que você está.
                </li>
                <li>
                  <strong>Cookies Analíticos:</strong> Ajudam-nos a entender como os visitantes interagem com o site,
                  coletando e relatando informações anonimamente. Isso nos ajuda a melhorar nosso site com base no
                  comportamento do usuário.
                </li>
                <li>
                  <strong>Cookies de Marketing:</strong> Usados para rastrear visitantes em sites. A intenção é exibir
                  anúncios relevantes e envolventes para o usuário individual.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">3. Tipos de Cookies que Usamos</h2>
              <h3 className="text-xl font-semibold text-blue-300 mt-4">3.1 Cookies de Sessão</h3>
              <p>
                Estes cookies são temporários e são excluídos do seu dispositivo quando você fecha o navegador. Eles são
                usados para manter o estado da sua sessão enquanto você navega pelo site.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mt-4">3.2 Cookies Persistentes</h3>
              <p>
                Estes cookies permanecem no seu dispositivo por um período específico ou até que você os exclua
                manualmente. Eles são usados para lembrar suas preferências ou ações em nosso site.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mt-4">3.3 Cookies de Terceiros</h3>
              <p>
                Alguns cookies são colocados por serviços de terceiros que aparecem em nossas páginas, como ferramentas
                analíticas, widgets de mídia social e serviços de publicidade.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">4. Cookies Específicos que Usamos</h2>
              <table className="border-collapse w-full mt-4">
                <thead>
                  <tr className="bg-blue-900/30">
                    <th className="border border-blue-800 p-2 text-left">Nome do Cookie</th>
                    <th className="border border-blue-800 p-2 text-left">Propósito</th>
                    <th className="border border-blue-800 p-2 text-left">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-blue-800 p-2">_session</td>
                    <td className="border border-blue-800 p-2">Mantém o estado da sessão do usuário</td>
                    <td className="border border-blue-800 p-2">Sessão</td>
                  </tr>
                  <tr>
                    <td className="border border-blue-800 p-2">_preferences</td>
                    <td className="border border-blue-800 p-2">Armazena preferências do usuário</td>
                    <td className="border border-blue-800 p-2">1 ano</td>
                  </tr>
                  <tr>
                    <td className="border border-blue-800 p-2">_ga</td>
                    <td className="border border-blue-800 p-2">Google Analytics - Usado para distinguir usuários</td>
                    <td className="border border-blue-800 p-2">2 anos</td>
                  </tr>
                  <tr>
                    <td className="border border-blue-800 p-2">_gid</td>
                    <td className="border border-blue-800 p-2">Google Analytics - Usado para distinguir usuários</td>
                    <td className="border border-blue-800 p-2">24 horas</td>
                  </tr>
                  <tr>
                    <td className="border border-blue-800 p-2">_wallet_connected</td>
                    <td className="border border-blue-800 p-2">Lembra se o usuário conectou uma carteira</td>
                    <td className="border border-blue-800 p-2">30 dias</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">5. Como Gerenciar Cookies</h2>
              <p>
                A maioria dos navegadores permite que você controle cookies através das configurações de preferências.
                Você pode:
              </p>
              <ul>
                <li>Bloquear a instalação de cookies</li>
                <li>Excluir cookies existentes</li>
                <li>Navegar em modo privado/incógnito</li>
                <li>Instalar extensões que gerenciam cookies</li>
              </ul>
              <p>
                No entanto, observe que a desativação de certos cookies pode afetar a funcionalidade do nosso site e
                limitar sua capacidade de usar determinados recursos.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mt-4">
                Como Desativar Cookies nos Principais Navegadores:
              </h3>
              <ul>
                <li>
                  <strong>Google Chrome:</strong> Menu {"->"} Configurações {"->"} Avançado {"->"} Privacidade e
                  segurança {"->"} Configurações de conteúdo {"->"} Cookies
                </li>
                <li>
                  <strong>Mozilla Firefox:</strong> Menu {"->"} Opções {"->"} Privacidade e Segurança {"->"} Cookies e
                  dados do site
                </li>
                <li>
                  <strong>Safari:</strong> Preferências {"->"} Privacidade {"->"} Cookies e dados do site
                </li>
                <li>
                  <strong>Microsoft Edge:</strong> Menu {"->"} Configurações {"->"} Cookies e permissões do site {"->"}{" "}
                  Cookies
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">6. Cookies e Privacidade</h2>
              <p>
                Para mais informações sobre como tratamos seus dados pessoais, consulte nossa{" "}
                <a href="/politica-de-privacidade" className="text-blue-400 hover:underline">
                  Política de Privacidade
                </a>
                .
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">7. Alterações a Esta Política</h2>
              <p>
                Podemos atualizar esta Política de Cookies periodicamente. A versão mais recente estará sempre
                disponível em nosso site, e a data da "Última atualização" será revisada no topo desta página.
              </p>
              <p>
                Recomendamos que você revise esta Política de Cookies periodicamente para se manter informado sobre como
                usamos cookies.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">8. Contato</h2>
              <p>
                Se você tiver alguma dúvida sobre nossa Política de Cookies, entre em contato conosco pelo e-mail:
                privacy@streetdogcoin.org
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

