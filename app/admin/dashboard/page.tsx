"use client"

// Corrigir importações
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  LogOut,
  Download,
  Search,
  RefreshCw,
  Send,
  Loader2,
  Settings,
  Users,
  Wallet,
  BarChart3,
  FileText,
  Bell,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  getAllClaims,
  getAirdropStats,
  updateClaim,
  exportClaimsToCSV,
  getSystemConfig,
  updateSystemConfig,
  checkAdminAuthentication,
  logoutAdmin,
} from "@/lib/storage-service"

// Adicionar o botão de toggle de performance no painel admin
import PerformanceToggle from "@/components/performance-toggle"

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [claims, setClaims] = useState<any[]>([])
  const [filteredClaims, setFilteredClaims] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>(
    tabParam === "distribution"
      ? "distribution"
      : tabParam === "settings"
        ? "settings"
        : tabParam === "stats"
          ? "stats"
          : "claims",
  )

  // Distribuição de tokens
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [tokenAmount, setTokenAmount] = useState<number>(100) // Alterado de 1000 para 100
  const [isDistributing, setIsDistributing] = useState(false)

  // Configurações
  const [config, setConfig] = useState<any>({
    airdropEnabled: true,
    totalTokensAllocated: 1000000,
    tokensPerClaim: 1000,
    claimDeadline: "",
    requireTwitter: true,
    requireTelegram: true,
  })

  // Estatísticas
  const [stats, setStats] = useState<any>(null)

  // Verificar autenticação e inicializar armazenamento
  useEffect(() => {
    // Verificar autenticação
    try {
      const checkAuth = () => {
        try {
          const isAuthenticated = checkAdminAuthentication()

          if (!isAuthenticated) {
            toast({
              title: "Acesso não autorizado",
              description: "Faça login para acessar o painel administrativo",
              variant: "destructive",
            })
            router.push("/admin/login")
          } else {
            loadData()
          }
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error)
          toast({
            title: "Erro de autenticação",
            description: "Ocorreu um erro ao verificar sua autenticação",
            variant: "destructive",
          })
          router.push("/admin/login")
        }

        setIsCheckingAuth(false)
      }

      checkAuth()
    } catch (error) {
      console.error("Erro ao inicializar:", error)
      setIsCheckingAuth(false)
      toast({
        title: "Erro de inicialização",
        description: "Ocorreu um erro ao inicializar o painel administrativo",
        variant: "destructive",
      })
    }
  }, [router, toast])

  // Atualizar a aba ativa quando o parâmetro de URL mudar
  useEffect(() => {
    if (tabParam === "distribution") {
      setActiveTab("distribution")
    } else if (tabParam === "settings") {
      setActiveTab("settings")
    } else if (tabParam === "stats") {
      setActiveTab("stats")
    } else {
      setActiveTab("claims")
    }
  }, [tabParam])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Carregar reivindicações
      const claimsData = getAllClaims()
      setClaims(claimsData)
      setFilteredClaims(claimsData)

      // Carregar configurações
      const configData = getSystemConfig()
      setConfig(configData)

      // Carregar estatísticas
      const statsData = getAirdropStats()
      setStats(statsData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao carregar os dados do sistema",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logoutAdmin()

    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    })

    router.push("/admin/login")
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterClaims(term, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterClaims(searchTerm, status)
  }

  const filterClaims = (term: string, status: string) => {
    let filtered = claims

    // Filtrar por termo de busca
    if (term) {
      const lowerTerm = term.toLowerCase()
      filtered = filtered.filter(
        (claim) =>
          (claim.name?.toLowerCase() || "").includes(lowerTerm) ||
          claim.walletAddress.toLowerCase().includes(lowerTerm) ||
          (claim.twitterUsername?.toLowerCase() || "").includes(lowerTerm),
      )
    }

    // Filtrar por status
    if (status !== "all") {
      filtered = filtered.filter((claim) => claim.status === status)
    }

    setFilteredClaims(filtered)
  }

  const handleDistributeTokens = async () => {
    if (!selectedUser || tokenAmount <= 0) {
      toast({
        title: "Erro",
        description: "Selecione um usuário e defina uma quantidade válida de tokens",
        variant: "destructive",
      })
      return
    }

    setIsDistributing(true)

    try {
      // Atualizar o status da reivindicação
      updateClaim(selectedUser, {
        tokensRequested: tokenAmount,
        status: "processed",
        processedAt: new Date().toISOString(),
      })

      // Recarregar dados
      loadData()

      toast({
        title: "Tokens distribuídos",
        description: `${tokenAmount} tokens foram distribuídos com sucesso para o usuário`,
        className: "bg-green-950 border-green-800 text-green-100",
      })

      // Limpar o formulário
      setSelectedUser("")
      setTokenAmount(1000)
    } catch (error) {
      console.error("Erro ao distribuir tokens:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar distribuir os tokens",
        variant: "destructive",
      })
    } finally {
      setIsDistributing(false)
    }
  }

  const handleUpdateConfig = () => {
    try {
      updateSystemConfig(config)

      toast({
        title: "Configurações atualizadas",
        description: "As configurações do sistema foram atualizadas com sucesso",
        className: "bg-green-950 border-green-800 text-green-100",
      })
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar atualizar as configurações",
        variant: "destructive",
      })
    }
  }

  const handleRejectClaim = (id: string) => {
    try {
      updateClaim(id, {
        status: "rejected",
        processedAt: new Date().toISOString(),
      })

      // Recarregar dados
      loadData()

      toast({
        title: "Reivindicação rejeitada",
        description: "A reivindicação foi rejeitada com sucesso",
        className: "bg-yellow-950 border-yellow-800 text-yellow-100",
      })
    } catch (error) {
      console.error("Erro ao rejeitar reivindicação:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar rejeitar a reivindicação",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-900/20 text-yellow-300 border-yellow-500/30">
            Pendente
          </Badge>
        )
      case "processed":
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-500/30">
            Processado
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-500/30">
            Rejeitado
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-orange-900/20 text-orange-300 border-orange-500/30">
            Falhou
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-900/20 text-gray-300 border-gray-500/30">
            Desconhecido
          </Badge>
        )
    }
  }

  const handleExportCSV = () => {
    const csvData = exportClaimsToCSV()

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `airdrop-claims-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/admin/dashboard${value !== "claims" ? `?tab=${value}` : ""}`)
  }

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-radial from-purple-500/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-radial from-blue-500/10 to-transparent"></div>

          {/* Estrelas estáticas */}
          <div className="stars-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `pulse ${Math.random() * 3 + 2}s infinite ease-in-out`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="z-10 flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
          <p className="text-purple-300 text-lg">Verificando autenticação...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black"></div>
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-radial from-purple-500/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-radial from-blue-500/10 to-transparent"></div>

        {/* Estrelas estáticas */}
        <div className="stars-container">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `pulse ${Math.random() * 3 + 2}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        {/* Nebulosas */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-purple-900/20">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-white">Admin AniRes</span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleTabChange("claims")}
              className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                activeTab === "claims"
                  ? "text-purple-300 bg-purple-900/20"
                  : "text-gray-300 hover:text-purple-300 hover:bg-purple-900/10"
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Reivindicações
            </button>
            <Button
              onClick={() => router.push("/admin/notifications")}
              className="px-3 py-2 text-sm rounded-md transition-colors flex items-center text-gray-300 hover:text-purple-300 hover:bg-purple-900/10"
              variant="ghost"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
            <button
              onClick={() => handleTabChange("distribution")}
              className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                activeTab === "distribution"
                  ? "text-purple-300 bg-purple-900/20"
                  : "text-gray-300 hover:text-purple-300 hover:bg-purple-900/10"
              }`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Distribuição
            </button>
            <button
              onClick={() => handleTabChange("stats")}
              className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                activeTab === "stats"
                  ? "text-purple-300 bg-purple-900/20"
                  : "text-gray-300 hover:text-purple-300 hover:bg-purple-900/10"
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Estatísticas
            </button>
            <button
              onClick={() => handleTabChange("settings")}
              className={`px-3 py-2 text-sm rounded-md transition-colors flex items-center ${
                activeTab === "settings"
                  ? "text-purple-300 bg-purple-900/20"
                  : "text-gray-300 hover:text-purple-300 hover:bg-purple-900/10"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </button>
          </nav>

          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6 z-10 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-400">Painel Administrativo</h1>
          <Button
            variant="outline"
            className="border-red-800/30 hover:bg-red-900/20 hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-black/50 border border-purple-800/30">
            <TabsTrigger value="claims" className="data-[state=active]:bg-purple-900/30">
              <Users className="h-4 w-4 mr-2" />
              Reivindicações
            </TabsTrigger>
            <TabsTrigger value="distribution" className="data-[state=active]:bg-purple-900/30">
              <Wallet className="h-4 w-4 mr-2" />
              Distribuição
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-900/30">
              <BarChart3 className="h-4 w-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-900/30">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Aba de Reivindicações */}
          <TabsContent value="claims" className="space-y-6">
            <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="border-b border-purple-900/20 bg-black/50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl text-purple-400">Reivindicações de AirDrop</CardTitle>
                    <CardDescription className="text-gray-400">
                      Gerencie as reivindicações de tokens dos usuários
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-800/30 hover:bg-purple-900/20"
                      onClick={loadData}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Atualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-800/30 hover:bg-green-900/20 hover:text-green-300"
                      onClick={handleExportCSV}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, carteira ou Twitter..."
                      className="pl-10 bg-black/50 border-purple-800/30 text-white"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-black/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-purple-800/30 text-white">
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="processed">Processado</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                      <SelectItem value="failed">Falhou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  </div>
                ) : filteredClaims.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-purple-900/30">
                    <Table>
                      <TableCaption>Lista de reivindicações de AirDrop</TableCaption>
                      <TableHeader className="bg-purple-900/10">
                        <TableRow className="border-b border-purple-900/30 hover:bg-purple-900/20">
                          <TableHead className="text-purple-300">Nome</TableHead>
                          <TableHead className="text-purple-300">Carteira</TableHead>
                          <TableHead className="text-purple-300">Twitter</TableHead>
                          <TableHead className="text-purple-300">Telegram</TableHead>
                          <TableHead className="text-purple-300">Tokens</TableHead>
                          <TableHead className="text-purple-300">Status</TableHead>
                          <TableHead className="text-purple-300">Data</TableHead>
                          <TableHead className="text-purple-300">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClaims.map((claim) => (
                          <TableRow key={claim.id} className="border-b border-purple-900/20 hover:bg-purple-900/10">
                            <TableCell className="font-medium text-gray-300">{claim.name || "N/A"}</TableCell>
                            <TableCell className="font-mono text-xs text-gray-300">
                              {claim.walletAddress.substring(0, 6)}...
                              {claim.walletAddress.substring(claim.walletAddress.length - 4)}
                            </TableCell>
                            <TableCell className="text-gray-300">@{claim.twitterUsername || "N/A"}</TableCell>
                            <TableCell className="text-gray-300">{claim.telegramId || "N/A"}</TableCell>
                            <TableCell className="text-gray-300">{claim.tokensRequested}</TableCell>
                            <TableCell>{getStatusBadge(claim.status)}</TableCell>
                            <TableCell className="text-gray-300 text-xs">
                              {new Date(claim.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {claim.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2 py-0 bg-green-900/20 border-green-800/30 hover:bg-green-800/30"
                                      onClick={() => {
                                        setSelectedUser(claim.id)
                                        setTokenAmount(config.tokensPerClaim)
                                        handleTabChange("distribution")
                                      }}
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 px-2 py-0 bg-red-900/20 border-red-800/30 hover:bg-red-800/30"
                                      onClick={() => handleRejectClaim(claim.id)}
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/20 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-purple-400" />
                    </div>
                    <p className="text-lg font-medium text-purple-300">Nenhuma reivindicação encontrada</p>
                    <p className="mt-2 text-sm">Não há reivindicações que correspondam aos critérios de busca</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="border-b border-purple-900/20 bg-black/50">
                <CardTitle className="text-xl text-purple-400">Estatísticas</CardTitle>
                <CardDescription className="text-gray-400">Resumo das reivindicações de AirDrop</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Total de Reivindicações</p>
                    <p className="text-2xl font-bold text-purple-300">{claims.length}</p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-300">
                      {claims.filter((c) => c.status === "pending").length}
                    </p>
                  </div>
                  <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Processadas</p>
                    <p className="text-2xl font-bold text-green-300">
                      {claims.filter((c) => c.status === "processed").length}
                    </p>
                  </div>
                  <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                    <p className="text-sm text-gray-400">Rejeitadas/Falhas</p>
                    <p className="text-2xl font-bold text-red-300">
                      {claims.filter((c) => c.status === "rejected" || c.status === "failed").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Distribuição */}
          <TabsContent value="distribution" className="space-y-6">
            <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="border-b border-purple-900/20 bg-black/50">
                <CardTitle className="text-xl text-purple-400">Distribuição Manual de Tokens</CardTitle>
                <CardDescription className="text-gray-400">
                  Distribua tokens manualmente para os usuários que fizeram reivindicações
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user" className="text-gray-300">
                        Selecionar Usuário
                      </Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger id="user" className="bg-black/50 border-purple-800/30 text-white">
                          <SelectValue placeholder="Selecione um usuário" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-800/30 text-white max-h-[300px]">
                          {claims
                            .filter((claim) => claim.status === "pending")
                            .map((claim) => (
                              <SelectItem key={claim.id} value={claim.id}>
                                {claim.name || claim.twitterUsername || claim.walletAddress.substring(0, 10) + "..."}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-gray-300">
                        Quantidade de Tokens
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(Number(e.target.value))}
                        className="bg-black/50 border-purple-800/30 text-white"
                        min={1}
                      />
                    </div>

                    <Button
                      onClick={handleDistributeTokens}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isDistributing || !selectedUser || tokenAmount <= 0}
                    >
                      {isDistributing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Distribuindo...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Distribuir Tokens
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-300 mb-4">Informações do Usuário Selecionado</h3>

                    {selectedUser ? (
                      (() => {
                        const user = claims.find((c) => c.id === selectedUser)
                        if (!user) return <p className="text-gray-400">Usuário não encontrado</p>

                        return (
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-400">Nome</p>
                              <p className="text-purple-300">{user.name || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Endereço da Carteira</p>
                              <p className="text-purple-300 font-mono text-xs break-all">{user.walletAddress}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Twitter</p>
                              <p className="text-purple-300">@{user.twitterUsername || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Telegram</p>
                              <p className="text-purple-300">{user.telegramId || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Tokens Solicitados</p>
                              <p className="text-purple-300">{user.tokensRequested}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Status</p>
                              <div>{getStatusBadge(user.status)}</div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Data da Solicitação</p>
                              <p className="text-purple-300">{new Date(user.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        )
                      })()
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-purple-400 opacity-50" />
                        <p>Selecione um usuário para ver suas informações</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="border-b border-purple-900/20 bg-black/50">
                <CardTitle className="text-xl text-purple-400">Histórico de Distribuições</CardTitle>
                <CardDescription className="text-gray-400">Últimas distribuições de tokens realizadas</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto rounded-lg border border-purple-900/30">
                  <Table>
                    <TableCaption>Histórico de distribuições de tokens</TableCaption>
                    <TableHeader className="bg-purple-900/10">
                      <TableRow className="border-b border-purple-900/30 hover:bg-purple-900/20">
                        <TableHead className="text-purple-300">Usuário</TableHead>
                        <TableHead className="text-purple-300">Carteira</TableHead>
                        <TableHead className="text-purple-300">Tokens</TableHead>
                        <TableHead className="text-purple-300">Status</TableHead>
                        <TableHead className="text-purple-300">Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {claims
                        .filter((claim) => claim.status === "processed")
                        .slice(0, 5)
                        .map((claim) => (
                          <TableRow key={claim.id} className="border-b border-purple-900/20 hover:bg-purple-900/10">
                            <TableCell className="font-medium text-gray-300">
                              {claim.name || claim.twitterUsername || "N/A"}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-gray-300">
                              {claim.walletAddress.substring(0, 6)}...
                              {claim.walletAddress.substring(claim.walletAddress.length - 4)}
                            </TableCell>
                            <TableCell className="text-gray-300">{claim.tokensRequested}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-500/30">
                                Processado
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-300 text-xs">
                              {claim.processedAt ? new Date(claim.processedAt).toLocaleDateString() : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Estatísticas */}
          <TabsContent value="stats" className="space-y-6">
            <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="border-b border-purple-900/20 bg-black/50">
                <CardTitle className="text-xl text-purple-400">Estatísticas do AirDrop</CardTitle>
                <CardDescription className="text-gray-400">
                  Visão geral do progresso e distribuição do AirDrop
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {stats ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Total de Tokens Alocados</p>
                        <p className="text-2xl font-bold text-purple-300">
                          {stats.totalTokensAllocated.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Tokens Distribuídos</p>
                        <p className="text-2xl font-bold text-green-300">{stats.tokensDistributed.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Tokens Restantes</p>
                        <p className="text-2xl font-bold text-blue-300">{stats.tokensRemaining.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Total de Reivindicações</p>
                        <p className="text-2xl font-bold text-purple-300">{stats.totalClaims}</p>
                      </div>
                      <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Pendentes</p>
                        <p className="text-2xl font-bold text-yellow-300">{stats.pendingClaims}</p>
                      </div>
                      <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Processadas</p>
                        <p className="text-2xl font-bold text-green-300">{stats.processedClaims}</p>
                      </div>
                      <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Rejeitadas/Falhas</p>
                        <p className="text-2xl font-bold text-red-300">{stats.rejectedClaims + stats.failedClaims}</p>
                      </div>
                    </div>

                    <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-purple-300 mb-4">Progresso da Distribuição</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Tokens Distribuídos</span>
                          <span className="text-sm text-purple-300">
                            {Math.round((stats.tokensDistributed / stats.totalTokensAllocated) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-purple-900/20 rounded-full h-2.5">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{
                              width: `${Math.round((stats.tokensDistributed / stats.totalTokensAllocated) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Reivindicações Processadas</span>
                          <span className="text-sm text-purple-300">
                            {stats.totalClaims > 0 ? Math.round((stats.processedClaims / stats.totalClaims) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-purple-900/20 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${stats.totalClaims > 0 ? Math.round((stats.processedClaims / stats.totalClaims) * 100) : 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="border-b border-purple-900/20 bg-black/50">
                <CardTitle className="text-xl text-purple-400">Relatórios</CardTitle>
                <CardDescription className="text-gray-400">Exporte relatórios e dados do AirDrop</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="border-purple-800/30 hover:bg-purple-900/20 flex items-center"
                    onClick={handleExportCSV}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exportar Reivindicações (CSV)
                  </Button>
                  <Button variant="outline" className="border-purple-800/30 hover:bg-purple-900/20 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Exportar Estatísticas (CSV)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
              <CardHeader className="border-b border-purple-900/20 bg-black/50">
                <CardTitle className="text-xl text-purple-400">Configurações do AirDrop</CardTitle>
                <CardDescription className="text-gray-400">
                  Personalize as configurações do sistema de AirDrop
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="airdropEnabled" className="text-gray-300">
                        Status do AirDrop
                      </Label>
                      <Select
                        value={config.airdropEnabled ? "enabled" : "disabled"}
                        onValueChange={(value) => setConfig({ ...config, airdropEnabled: value === "enabled" })}
                      >
                        <SelectTrigger id="airdropEnabled" className="bg-black/50 border-purple-800/30 text-white">
                          <SelectValue placeholder="Status do AirDrop" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-800/30 text-white">
                          <SelectItem value="enabled">Ativado</SelectItem>
                          <SelectItem value="disabled">Desativado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tokensPerClaim" className="text-gray-300">
                        Tokens por Reivindicação
                      </Label>
                      <Input
                        id="tokensPerClaim"
                        type="number"
                        value={config.tokensPerClaim}
                        onChange={(e) => setConfig({ ...config, tokensPerClaim: Number(e.target.value) })}
                        className="bg-black/50 border-purple-800/30 text-white"
                        min={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalTokensAllocated" className="text-gray-300">
                        Total de Tokens Alocados
                      </Label>
                      <Input
                        id="totalTokensAllocated"
                        type="number"
                        value={config.totalTokensAllocated}
                        onChange={(e) => setConfig({ ...config, totalTokensAllocated: Number(e.target.value) })}
                        className="bg-black/50 border-purple-800/30 text-white"
                        min={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="claimDeadline" className="text-gray-300">
                        Data Limite para Reivindicações
                      </Label>
                      <Input
                        id="claimDeadline"
                        type="date"
                        value={config.claimDeadline ? new Date(config.claimDeadline).toISOString().split("T")[0] : ""}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            claimDeadline: e.target.value ? new Date(e.target.value).toISOString() : "",
                          })
                        }
                        className="bg-black/50 border-purple-800/30 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="launchDate" className="text-gray-300">
                        Data de Lançamento Oficial do Airdrop
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          id="launchDate"
                          type="date"
                          value={config.launchDate ? new Date(config.launchDate).toISOString().split("T")[0] : ""}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              launchDate: e.target.value ? new Date(e.target.value + "T00:00:00").toISOString() : "",
                            })
                          }
                          className="bg-black/50 border-purple-800/30 text-white"
                        />
                        <Input
                          id="launchTime"
                          type="time"
                          value={config.launchDate ? new Date(config.launchDate).toTimeString().slice(0, 5) : ""}
                          onChange={(e) => {
                            const currentDate = config.launchDate ? new Date(config.launchDate) : new Date()
                            const [hours, minutes] = e.target.value.split(":").map(Number)
                            currentDate.setHours(hours, minutes)
                            setConfig({
                              ...config,
                              launchDate: currentDate.toISOString(),
                            })
                          }}
                          className="bg-black/50 border-purple-800/30 text-white"
                        />
                      </div>
                      <p className="text-xs text-gray-400">Esta data será exibida no cronômetro na página inicial</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-purple-300">Requisitos de Tarefas</h3>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireTwitter"
                        checked={config.requireTwitter}
                        onChange={(e) => setConfig({ ...config, requireTwitter: e.target.checked })}
                        className="h-4 w-4 rounded border-purple-800/30 bg-black/50 text-purple-600 focus:ring-purple-600"
                      />
                      <Label htmlFor="requireTwitter" className="text-gray-300">
                        Exigir tarefas do Twitter
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requireTelegram"
                        checked={config.requireTelegram}
                        onChange={(e) => setConfig({ ...config, requireTelegram: e.target.checked })}
                        className="h-4 w-4 rounded border-purple-800/30 bg-black/50 text-purple-600 focus:ring-purple-600"
                      />
                      <Label htmlFor="requireTelegram" className="text-gray-300">
                        Exigir tarefa do Telegram
                      </Label>
                    </div>
                  </div>

                  <Button onClick={handleUpdateConfig} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Settings className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <PerformanceToggle />
    </main>
  )
}

