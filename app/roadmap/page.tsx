"use client"

import GalaxyAnimation from "@/components/galaxy-animation"
import Navbar from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle, Clock, Rocket } from "lucide-react"
import { motion } from "framer-motion"

export default function RoadmapPage() {
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
              Roadmap
            </h1>
            <p className="text-xl text-gray-300">Nossa visão de futuro e os marcos que planejamos alcançar.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-8 backdrop-blur-sm mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-400">Visão Geral</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  O roadmap do Street Dog Coin foi cuidadosamente planejado para garantir o crescimento sustentável do
                  projeto e maximizar o impacto social positivo. Dividimos nosso plano em fases, cada uma com objetivos
                  específicos e marcos a serem alcançados.
                </p>
                <p className="text-gray-300 mt-4">
                  Este roadmap é dinâmico e pode ser ajustado com base no feedback da comunidade, oportunidades de
                  mercado e necessidades das organizações parceiras. Todas as atualizações significativas serão
                  comunicadas através de nossos canais oficiais.
                </p>
              </div>
            </motion.div>

            {/* Fase 0 - Concepção */}
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-green-400">Fase 0: Concepção (2021-2022)</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center mr-4 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">2021</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Concepção da ideia do Street Dog Coin</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Planejamento estratégico inicial</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Primeiro post oficial no Facebook</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Estabelecimento da presença inicial nas redes sociais</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center mr-4 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">2022</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Início do desenvolvimento do Whitepaper</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Definição da base do projeto</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Estruturação do whitepaper</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Primeiros conceitos do tokenomics</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Fase 1 - Estudos e Viabilidade */}
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-green-400">Fase 1: Estudos e Viabilidade (2023-2024)</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center mr-4 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">2023</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Desenvolvimento e auditoria do contrato inteligente</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Pesquisa para construção da fábrica de ração</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Planejamento do abrigo para cães de rua</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Lançamento do website e redes sociais</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center mr-4 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">2024</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Desenvolvimento de parcerias estratégicas</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Análise técnica e econômica das operações</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              <span>Preparação para o lançamento do token</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Fase 2 - Lançamento */}
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-blue-400">Fase 2: Lançamento (Q1 2025)</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-4 mt-1">
                          <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">Março 2025</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                              <span>Lançamento oficial do token STDOG</span>
                            </li>
                            <li className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                              <span>Início da distribuição do Airdrop</span>
                            </li>
                            <li className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                              <span>Lançamento da página de Airdrop</span>
                            </li>
                            <li className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                              <span>Listagem em exchanges descentralizadas</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-4 mt-1">
                          <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">Q2 2025</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                              <span>Listagem em exchanges centralizadas</span>
                            </li>
                            <li className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                              <span>Implementação do sistema de staking</span>
                            </li>
                            <li className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                              <span>Lançamento do programa de embaixadores</span>
                            </li>
                            <li className="flex items-center">
                              <Clock className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                              <span>Expansão das parcerias com ONGs</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Fase 3 - Expansão */}
            <div className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="flex items-center mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-purple-600/70 flex items-center justify-center mr-4">
                  <Circle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-purple-400">Fase 3: Expansão (S2 2025)</h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center mr-4 mt-1">
                          <Circle className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">Q3 2025</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <Circle className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                              <span>Novas integrações no ecossistema blockchain</span>
                            </li>
                            <li className="flex items-center">
                              <Circle className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                              <span>Ampliação das iniciativas sociais</span>
                            </li>
                            <li className="flex items-center">
                              <Circle className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                              <span>Primeira campanha global de castração e vacinação</span>
                            </li>
                            <li className="flex items-center">
                              <Circle className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                              <span>Desenvolvimento inicial da plataforma DeFi</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center mr-4 mt-1">
                          <Circle className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">Q4 2025</h3>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                              <Circle className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                              <span>Desenvolvimento da infraestrutura para a fábrica de ração</span>
                            </li>
                            <li className="flex items-center">
                              <Circle className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                              <span>Início da construção do abrigo para cães</span>
                            </li>
                            <li className="flex items-center">
                              <Circle className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                              <span>Lançamento da plataforma DeFi completa</span>
                            </li>
                            <li className="flex items-center">
                              <Circle className="h-4 w-4 text-purple-400 mr-2 flex-shrink-0" />
                              <span>Implementação da governança descentralizada</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Fase 4 - Futuro */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
                className="flex items-center mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-600/70 flex items-center justify-center mr-4">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-indigo-400">Fase 4: Futuro (2026 em diante)</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="ml-16"
              >
                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-2">Visão de Longo Prazo</h3>
                        <p className="text-gray-300">Nossa visão de longo prazo inclui os seguintes objetivos:</p>
                        <ul className="space-y-4 mt-4 text-gray-300">
                          <li className="flex items-start">
                            <Rocket className="h-5 w-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-indigo-300">
                                Desenvolvimento do ecossistema próprio
                              </span>
                              <p className="mt-1">
                                Criar uma blockchain própria focada em projetos de impacto social, com o $STDOG como
                                token nativo.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Rocket className="h-5 w-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-indigo-300">Expansão para outras causas sociais</span>
                              <p className="mt-1">
                                Ampliar o escopo do projeto para incluir outras causas relacionadas ao bem-estar animal
                                e ambiental.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Rocket className="h-5 w-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-indigo-300">
                                Criação de uma fundação descentralizada
                              </span>
                              <p className="mt-1">
                                Estabelecer uma fundação totalmente descentralizada e autônoma para gerenciar os
                                recursos e iniciativas do projeto.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Rocket className="h-5 w-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-indigo-300">Centros de resgate e reabilitação</span>
                              <p className="mt-1">
                                Financiar a construção e operação de centros de resgate e reabilitação para cães de rua
                                em regiões críticas ao redor do mundo.
                              </p>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Rocket className="h-5 w-5 text-indigo-400 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-indigo-300">
                                Lançamento do marketplace NFT beneficente
                              </span>
                              <p className="mt-1">
                                Criar um marketplace de NFTs onde parte dos lucros será destinada diretamente às
                                iniciativas de resgate e cuidado animal.
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

