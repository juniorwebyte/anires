"use client"

import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"

export default function TermosDeServicoPage() {
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
              Termos de Serviço
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
              <h2 className="text-2xl font-bold text-blue-400">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o site e os serviços do Street Dog Coin, você concorda em cumprir e ficar vinculado a
                estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não poderá acessar o
                site ou usar nossos serviços.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">2. Descrição dos Serviços</h2>
              <p>
                O Street Dog Coin oferece uma plataforma baseada em blockchain que permite aos usuários adquirir,
                transferir e utilizar tokens $STDOG, participar de staking, governança e outras funcionalidades
                relacionadas ao ecossistema do Street Dog Coin.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">3. Elegibilidade</h2>
              <p>
                Para usar nossos serviços, você deve ter pelo menos 18 anos de idade e ter capacidade legal para
                celebrar contratos vinculativos. Ao usar nossos serviços, você declara e garante que atende a esses
                requisitos.
              </p>
              <p>
                Além disso, você não deve estar localizado em uma jurisdição onde a compra, venda ou uso de criptomoedas
                seja proibido ou restrito.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">4. Registro de Conta</h2>
              <p>
                Alguns de nossos serviços podem exigir que você crie uma conta. Você é responsável por manter a
                confidencialidade de suas credenciais de conta e por todas as atividades que ocorrem em sua conta. Você
                concorda em notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">5. Riscos Associados a Criptomoedas</h2>
              <p>Você reconhece e concorda que:</p>
              <ul>
                <li>
                  O valor dos tokens $STDOG pode flutuar significativamente e você pode perder parte ou todo o valor de
                  sua compra;
                </li>
                <li>
                  As transações de criptomoedas são irreversíveis e as perdas devido a transações fraudulentas ou
                  acidentais podem não ser recuperáveis;
                </li>
                <li>Você é o único responsável pela segurança de suas chaves privadas e carteiras;</li>
                <li>
                  Regulamentações e leis relacionadas a criptomoedas podem mudar, o que pode afetar negativamente o uso
                  ou valor dos tokens $STDOG.
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">6. Conduta do Usuário</h2>
              <p>Ao usar nossos serviços, você concorda em não:</p>
              <ul>
                <li>Violar qualquer lei, regulamento ou direitos de terceiros;</li>
                <li>
                  Usar nossos serviços para atividades ilegais, incluindo lavagem de dinheiro, financiamento do
                  terrorismo ou fraude;
                </li>
                <li>Interferir ou tentar interferir no funcionamento adequado dos serviços;</li>
                <li>Tentar acessar áreas ou recursos do site aos quais você não tem permissão;</li>
                <li>Usar bots, crawlers ou outros métodos automatizados para acessar ou coletar dados do site.</li>
              </ul>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">7. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo, design, gráficos, interfaces e código do site são de propriedade do Street Dog Coin e
                estão protegidos por leis de direitos autorais, marcas registradas e outras leis de propriedade
                intelectual.
              </p>
              <p>
                Você não pode reproduzir, modificar, distribuir ou criar trabalhos derivados baseados em nosso conteúdo
                sem nossa permissão expressa por escrito.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">8. Limitação de Responsabilidade</h2>
              <p>
                Em nenhuma circunstância o Street Dog Coin, seus diretores, funcionários, parceiros ou agentes serão
                responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos,
                incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis,
                resultantes de:
              </p>
              <ul>
                <li>Seu acesso ou uso ou incapacidade de acessar ou usar os serviços;</li>
                <li>Qualquer conduta ou conteúdo de terceiros nos serviços;</li>
                <li>Qualquer conteúdo obtido dos serviços;</li>
                <li>Acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo.</li>
              </ul>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">9. Indenização</h2>
              <p>
                Você concorda em indenizar, defender e isentar o Street Dog Coin e seus diretores, funcionários,
                parceiros e agentes de e contra quaisquer reclamações, responsabilidades, danos, perdas e despesas,
                incluindo, sem limitação, honorários advocatícios razoáveis, decorrentes de ou de qualquer forma
                relacionados com seu acesso ou uso dos serviços, sua violação destes Termos ou sua violação de quaisquer
                direitos de terceiros.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">10. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Se fizermos alterações,
                publicaremos os termos revisados nesta página e atualizaremos a data da "Última atualização". Seu uso
                continuado dos serviços após tais alterações constitui sua aceitação dos novos termos.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">11. Lei Aplicável</h2>
              <p>
                Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem considerar seus
                princípios de conflito de leis.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">12. Contato</h2>
              <p>
                Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo e-mail:
                legal@streetdogcoin.org
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

