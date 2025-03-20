"use client"

import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { motion } from "framer-motion"

export default function PoliticaDePrivacidadePage() {
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
              Política de Privacidade
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
              <h2 className="text-2xl font-bold text-blue-400">1. Introdução</h2>
              <p>
                O Street Dog Coin ("nós", "nosso" ou "nos") está comprometido em proteger sua privacidade. Esta Política
                de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando
                você usa nosso site e serviços.
              </p>
              <p>
                Ao usar nosso site e serviços, você concorda com a coleta e uso de informações de acordo com esta
                política.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">2. Informações que Coletamos</h2>
              <p>Podemos coletar os seguintes tipos de informações:</p>
              <h3 className="text-xl font-semibold text-blue-300 mt-4">2.1 Informações Pessoais</h3>
              <p>Quando você se registra em nossa plataforma, podemos coletar:</p>
              <ul>
                <li>Endereço de e-mail</li>
                <li>Nome de usuário</li>
                <li>Endereço de carteira blockchain</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mt-4">2.2 Informações de Transação</h3>
              <p>
                Quando você realiza transações usando nossos serviços, coletamos informações sobre essas transações,
                incluindo:
              </p>
              <ul>
                <li>Endereços de carteira de origem e destino</li>
                <li>Valores de transação</li>
                <li>Carimbos de data/hora</li>
                <li>Hashes de transação</li>
              </ul>
              <p>
                Observe que essas informações são inerentemente públicas na blockchain e não são consideradas privadas.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mt-4">2.3 Informações de Uso</h3>
              <p>Coletamos informações sobre como você interage com nosso site e serviços, incluindo:</p>
              <ul>
                <li>Endereço IP</li>
                <li>Tipo de navegador</li>
                <li>Sistema operacional</li>
                <li>Páginas visitadas</li>
                <li>Tempo gasto no site</li>
                <li>Links clicados</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mt-4">2.4 Cookies e Tecnologias Semelhantes</h3>
              <p>
                Usamos cookies e tecnologias semelhantes para coletar informações sobre suas atividades em nosso site.
                Para mais informações, consulte nossa Política de Cookies.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">3. Como Usamos Suas Informações</h2>
              <p>Usamos as informações que coletamos para:</p>
              <ul>
                <li>Fornecer, manter e melhorar nossos serviços</li>
                <li>Processar transações e enviar notificações relacionadas</li>
                <li>Verificar sua identidade e prevenir fraudes</li>
                <li>Personalizar sua experiência</li>
                <li>Comunicar-se com você sobre atualizações, promoções e eventos</li>
                <li>Responder a suas solicitações e fornecer suporte ao cliente</li>
                <li>Cumprir obrigações legais</li>
                <li>Analisar tendências e monitorar o uso de nossos serviços</li>
              </ul>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">4. Compartilhamento de Informações</h2>
              <p>Podemos compartilhar suas informações nas seguintes circunstâncias:</p>
              <h3 className="text-xl font-semibold text-blue-300 mt-4">4.1 Com Provedores de Serviços</h3>
              <p>
                Podemos compartilhar suas informações com provedores de serviços terceirizados que realizam serviços em
                nosso nome, como processamento de pagamentos, análise de dados, hospedagem de sites e suporte ao
                cliente.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mt-4">4.2 Para Conformidade Legal</h3>
              <p>Podemos divulgar suas informações se acreditarmos de boa fé que tal divulgação é necessária para:</p>
              <ul>
                <li>Cumprir com a lei, regulamentos ou processos legais</li>
                <li>Proteger os direitos, propriedade ou segurança do Street Dog Coin, nossos usuários ou o público</li>
                <li>Detectar, prevenir ou abordar fraude, segurança ou problemas técnicos</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mt-4">4.3 Com Seu Consentimento</h3>
              <p>Podemos compartilhar suas informações com terceiros quando você nos der consentimento para fazê-lo.</p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">5. Segurança de Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas, administrativas e físicas projetadas para proteger suas
                informações pessoais contra acesso não autorizado, divulgação, alteração e destruição. No entanto,
                nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro, e não
                podemos garantir sua segurança absoluta.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">6. Seus Direitos</h2>
              <p>
                Dependendo da sua localização, você pode ter certos direitos em relação às suas informações pessoais,
                incluindo:
              </p>
              <ul>
                <li>Direito de acessar suas informações pessoais</li>
                <li>Direito de corrigir informações imprecisas</li>
                <li>Direito de excluir suas informações pessoais</li>
                <li>Direito de restringir ou se opor ao processamento</li>
                <li>Direito à portabilidade de dados</li>
                <li>Direito de retirar o consentimento</li>
              </ul>
              <p>
                Para exercer esses direitos, entre em contato conosco usando as informações fornecidas na seção
                "Contato" abaixo.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">7. Retenção de Dados</h2>
              <p>
                Retemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta
                Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por
                lei.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">8. Transferências Internacionais</h2>
              <p>
                Suas informações podem ser transferidas e processadas em países diferentes do seu país de residência.
                Esses países podem ter leis de proteção de dados diferentes das leis do seu país.
              </p>
              <p>
                Quando transferimos suas informações para outros países, tomaremos medidas para garantir que suas
                informações continuem protegidas de acordo com esta Política de Privacidade e as leis aplicáveis.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">9. Crianças</h2>
              <p>
                Nossos serviços não são direcionados a pessoas com menos de 18 anos, e não coletamos intencionalmente
                informações pessoais de crianças. Se você é pai ou responsável e acredita que seu filho nos forneceu
                informações pessoais, entre em contato conosco para que possamos tomar as medidas apropriadas.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">10. Alterações a Esta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre
                disponível em nosso site, e a data da "Última atualização" será revisada no topo desta página.
              </p>
              <p>
                Recomendamos que você revise esta Política de Privacidade periodicamente para se manter informado sobre
                como estamos protegendo suas informações.
              </p>

              <h2 className="text-2xl font-bold text-blue-400 mt-8">11. Contato</h2>
              <p>
                Se você tiver alguma dúvida, preocupação ou solicitação relacionada a esta Política de Privacidade,
                entre em contato conosco pelo e-mail: privacy@streetdogcoin.org
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

