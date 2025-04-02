"use client"

import { useState, useEffect } from "react"
import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Coins, Heart, Rocket, Shield, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "@/lib/i18n/use-translations"
import { getTotalTokens } from "@/app/actions/token-info"

export default function TokenomicsPage() {
  const { t } = useTranslations()
  const [totalTokens, setTotalTokens] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTokenInfo() {
      try {
        const { totalTokens } = await getTotalTokens()
        setTotalTokens(totalTokens)
      } catch (error) {
        console.error("Erro ao carregar informações de tokens:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTokenInfo()
  }, [])

  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative overflow-hidden">
      <GalaxyAnimation />
      <Navbar isWalletConnected={false} />

      <section className="pt-24 pb-12 relative" id="hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
              {t("tokenomics.hero.title", "Tokenomics")}
            </h1>
            <p className="text-xl text-gray-300">
              {t("tokenomics.hero.subtitle", "Entenda a economia, distribuição e utilidade do token $ANIRES.")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Visão Geral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-8 backdrop-blur-sm mb-12"
              id="overview"
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-400">{t("tokenomics.overview.title", "Visão Geral")}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  {t(
                    "tokenomics.overview.paragraph1",
                    "O Anires ($ANIRES) é um token ERC-20 com um fornecimento total de 5 bilhões de tokens. O design econômico do token foi cuidadosamente planejado para garantir a sustentabilidade do projeto a longo prazo e maximizar o impacto social positivo.",
                  )}
                </p>
                <p className="text-gray-300 mt-4">
                  {t(
                    "tokenomics.overview.paragraph2",
                    "Uma característica fundamental do $ANIRES é o mecanismo de taxas de transação, que direciona automaticamente uma porcentagem de cada transferência para um fundo de caridade descentralizado, criando um fluxo contínuo de recursos para organizações que cuidam de animais resgatados.",
                  )}
                </p>
              </div>
            </motion.div>

            {/* Fornecimento e Taxas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12" id="supply-fees">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold mb-6 text-blue-400">
                  {t("tokenomics.supply.title", "Fornecimento de Tokens")}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t("tokenomics.supply.totalSupply", "Fornecimento Total:")}</span>
                    <span className="text-blue-300 font-semibold">5.000.000.000 ANIRES</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {t("tokenomics.supply.circulatingSupply", "Fornecimento Circulante:")}
                    </span>
                    <span className="text-blue-300 font-semibold">1.500.000.000 ANIRES</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t("tokenomics.supply.lockedTokens", "Tokens Bloqueados:")}</span>
                    <span className="text-blue-300 font-semibold">3.500.000.000 ANIRES</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {t("tokenomics.supply.burningMechanism", "Mecanismo de Queima:")}
                    </span>
                    <span className="text-blue-300 font-semibold">
                      {t("tokenomics.supply.burningStatus", "Não (Em Desenvolvimento)")}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-2xl font-bold mb-6 text-blue-400">
                  {t("tokenomics.fees.title", "Taxas de Transação")}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t("tokenomics.fees.totalFee", "Taxa Total:")}</span>
                    <span className="text-blue-300 font-semibold">2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{t("tokenomics.fees.charityFund", "Fundo de Caridade:")}</span>
                    <span className="text-blue-300 font-semibold">1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {t("tokenomics.fees.developmentMarketing", "Desenvolvimento e Marketing:")}
                    </span>
                    <span className="text-blue-300 font-semibold">1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      {t("tokenomics.fees.partnerExemptions", "Isenções para Parceiros:")}
                    </span>
                    <span className="text-blue-300 font-semibold">
                      {t("tokenomics.fees.exemptionsStatus", "Disponíveis")}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Distribuição de Tokens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-12"
              id="distribution"
            >
              <h2 className="text-3xl font-bold mb-8 text-blue-400 text-center">
                {t("tokenomics.distribution.title", "Distribuição de Tokens")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center mb-4">
                        <Coins className="h-8 w-8 text-blue-300" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-400 mb-2">
                        {t("tokenomics.distribution.publicSale", "40%")}
                      </h3>
                      <p className="text-gray-300">
                        {t("tokenomics.distribution.publicSaleLabel", "Venda Pública & AirDrop")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center mb-4">
                        <Heart className="h-8 w-8 text-blue-300" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-400 mb-2">
                        {t("tokenomics.distribution.rewards", "20%")}
                      </h3>
                      <p className="text-gray-300">
                        {t("tokenomics.distribution.rewardsLabel", "Recompensas e Incentivos")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center mb-4">
                        <Rocket className="h-8 w-8 text-blue-300" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-400 mb-2">
                        {t("tokenomics.distribution.factoryReserve", "20%")}
                      </h3>
                      <p className="text-gray-300">
                        {t("tokenomics.distribution.factoryReserveLabel", "Reserva para Construção da Fábrica")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-blue-300" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-400 mb-2">
                        {t("tokenomics.distribution.partnerships", "10%")}
                      </h3>
                      <p className="text-gray-300">
                        {t("tokenomics.distribution.partnershipsLabel", "Parcerias e Doações")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-600/30 flex items-center justify-center mb-4">
                        <Shield className="h-8 w-8 text-blue-300" />
                      </div>
                      <h3 className="text-xl font-bold text-blue-400 mb-2">
                        {t("tokenomics.distribution.team", "10%")}
                      </h3>
                      <p className="text-gray-300">{t("tokenomics.distribution.teamLabel", "Equipe e Operações")}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Utilidade do Token */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-8 backdrop-blur-sm mb-12"
              id="utility"
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-400">
                {t("tokenomics.utility.title", "Utilidade do Token")}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.utility.governance", "Governança")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.utility.governanceDesc",
                      "Os detentores de $ANIRES podem votar em propostas importantes, incluindo a alocação de recursos do fundo de caridade, atualizações do protocolo e novas parcerias.",
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.utility.staking", "Staking e Recompensas")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.utility.stakingDesc",
                      "Os usuários poderão fazer staking de seus tokens $ANIRES para receber recompensas passivas, com taxas de APY variando de 5% a 20% dependendo do período de bloqueio.",
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.utility.exclusiveAccess", "Acesso a Recursos Exclusivos")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.utility.exclusiveAccessDesc",
                      "Detentores de $ANIRES têm acesso a recursos exclusivos, incluindo NFTs beneficentes, eventos especiais e oportunidades de networking com parceiros e organizações de proteção animal.",
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.utility.payments", "Pagamentos e Doações")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.utility.paymentsDesc",
                      "O $ANIRES pode ser utilizado para fazer doações diretas a abrigos e ONGs parceiras, com 0% de taxa de transação para este tipo de transferência, maximizando o impacto da sua contribuição.",
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.utility.marketplace", "Marketplace")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.utility.marketplaceDesc",
                      "No futuro, o $ANIRES será a moeda principal do nosso marketplace, onde os usuários poderão comprar produtos e serviços relacionados a pets, com parte dos lucros sendo direcionada para o fundo de caridade.",
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mecanismos de Segurança */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-8 backdrop-blur-sm"
              id="security"
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-400">
                {t("tokenomics.security.title", "Mecanismos de Segurança")}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.security.antiWhale", "Anti-Whale")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.security.antiWhaleDesc",
                      "Para prevenir manipulação de mercado, implementamos um mecanismo anti-whale que limita a quantidade de tokens que podem ser comprados ou vendidos em uma única transação a 1% do fornecimento total.",
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.security.liquidityLock", "Bloqueio de Liquidez")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.security.liquidityLockDesc",
                      "50% dos tokens alocados para liquidez estão bloqueados por 2 anos, garantindo estabilidade e confiança no projeto a longo prazo.",
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.security.securityAudit", "Auditoria de Segurança")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.security.securityAuditDesc",
                      "O contrato inteligente do $ANIRES foi auditado por empresas de segurança renomadas como CertiK e Hacken, garantindo a segurança dos fundos e a integridade do projeto.",
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">
                    {t("tokenomics.security.multisig", "Multisig")}
                  </h3>
                  <p className="text-gray-300">
                    {t(
                      "tokenomics.security.multisigDesc",
                      "O fundo de caridade é gerenciado por uma carteira multisig que requer a aprovação de múltiplos signatários para qualquer transação, incluindo membros da equipe e representantes de ONGs parceiras.",
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

