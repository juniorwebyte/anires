"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bell, Loader2, LogOut, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { checkAdminAuthentication, logoutAdmin } from "@/lib/storage-service"
import PerformanceToggle from "@/components/performance-toggle"

// Adicione esta constante no início do arquivo, após as importações
const ADMIN_WHATSAPP_NUMBERS = [
  {
    name: "Admin 1",
    number: "+55 11 98480-1839",
    apiKey: "1782254",
  },
  {
    name: "Admin 2",
    number: "+55 11 94736-6820",
    apiKey: "7070864",
  },
]

interface Notification {
  walletAddress: string
  createdAt: string
  sent: boolean
  sentAt: string | null
}

export default function NotificationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isSendingTest, setIsSendingTest] = useState(false)

  // Verificar autenticação e carregar notificações
  useEffect(() => {
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
          loadNotifications()
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
  }, [router, toast])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      // Carregar notificações do servidor
      const response = await fetch("/api/admin/notifications")

      if (!response.ok) {
        throw new Error("Erro ao carregar notificações")
      }

      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
      toast({
        title: "Erro ao carregar notificações",
        description: "Ocorreu um erro ao carregar as notificações",
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

  // Adicione esta função ao componente para enviar teste para um admin específico
  const sendTestNotification = async (adminIndex: number) => {
    setIsSendingTest(true)
    try {
      const response = await fetch("/api/admin/send-test-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminIndex }),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar notificação de teste")
      }

      toast({
        title: "Notificação de teste enviada",
        description: `Uma mensagem de teste foi enviada para ${ADMIN_WHATSAPP_NUMBERS[adminIndex].name}`,
        className: "bg-green-950 border-green-800 text-green-100",
      })
    } catch (error) {
      console.error("Erro ao enviar notificação de teste:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar a notificação de teste",
        variant: "destructive",
      })
    } finally {
      setIsSendingTest(false)
    }
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
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-purple-900/20">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-white">Admin Street Dog Coin</span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Button
              onClick={() => router.push("/admin/dashboard")}
              className="px-3 py-2 text-sm rounded-md transition-colors flex items-center text-gray-300 hover:text-purple-300 hover:bg-purple-900/10"
              variant="ghost"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => router.push("/admin/notifications")}
              className="px-3 py-2 text-sm rounded-md transition-colors flex items-center text-purple-300 bg-purple-900/20"
              variant="ghost"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
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
          <h1 className="text-3xl font-bold text-purple-400">Notificações WhatsApp</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-purple-800/30 hover:bg-purple-900/20"
              onClick={loadNotifications}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden mb-6">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Números Configurados</CardTitle>
            <CardDescription className="text-gray-400">
              Números de WhatsApp configurados para receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {ADMIN_WHATSAPP_NUMBERS.map((admin, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-900/10 border border-purple-800/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-900/30 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-400"
                      >
                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                        <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                        <path d="M9 14a.5.5 0 0 0 .5.5c.28 0 .5-.224.5-.5v-1a.5.5 0 0 0-1 0v1Z" />
                        <path d="M14 14a.5.5 0 0 0 .5.5c.28 0 .5-.224.5-.5v-1a.5.5 0 0 0-1 0v1Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-purple-300">{admin.name}</p>
                      <p className="text-sm text-gray-400">{admin.number}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-800/30 hover:bg-green-900/20 text-green-300"
                    onClick={() => {
                      sendTestNotification(index)
                    }}
                  >
                    Enviar Teste
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-purple-400">Notificações de Reivindicações</CardTitle>
                <CardDescription className="text-gray-400">
                  Histórico de notificações WhatsApp enviadas para reivindicações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-purple-900/30">
                <Table>
                  <TableCaption>Histórico de notificações WhatsApp</TableCaption>
                  <TableHeader className="bg-purple-900/10">
                    <TableRow className="border-b border-purple-900/30 hover:bg-purple-900/20">
                      <TableHead className="text-purple-300">Endereço da Carteira</TableHead>
                      <TableHead className="text-purple-300">Data de Criação</TableHead>
                      <TableHead className="text-purple-300">Status</TableHead>
                      <TableHead className="text-purple-300">Data de Envio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification, index) => (
                      <TableRow key={index} className="border-b border-purple-900/20 hover:bg-purple-900/10">
                        <TableCell className="font-mono text-xs text-gray-300">
                          {notification.walletAddress.substring(0, 10)}...
                          {notification.walletAddress.substring(notification.walletAddress.length - 8)}
                        </TableCell>
                        <TableCell className="text-gray-300 text-xs">
                          {new Date(notification.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {notification.sent ? (
                            <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-500/30">
                              Enviado
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-500/30">
                              Falha no Envio
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-300 text-xs">
                          {notification.sentAt ? new Date(notification.sentAt).toLocaleString() : "Não enviado"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-900/20 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-purple-400" />
                </div>
                <p className="text-lg font-medium text-purple-300">Nenhuma notificação encontrada</p>
                <p className="mt-2 text-sm">Não há notificações no histórico</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-800/30 bg-black/30 backdrop-blur-sm shadow-xl overflow-hidden mt-6">
          <CardHeader className="border-b border-purple-900/20 bg-black/50">
            <CardTitle className="text-xl text-purple-400">Informações sobre Notificações</CardTitle>
            <CardDescription className="text-gray-400">
              Como funciona o sistema de notificações automáticas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-gray-300">
                O sistema envia automaticamente uma notificação para o seu WhatsApp (+55 11984801839) sempre que um
                usuário completa uma reivindicação de tokens com sucesso.
              </p>

              <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
                <h3 className="font-medium text-blue-300 mb-2">Como funciona</h3>
                <p className="text-sm text-gray-300">
                  1. Quando um usuário completa uma reivindicação, o sistema envia automaticamente uma mensagem para seu
                  WhatsApp.
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  2. A mensagem contém o endereço da carteira do usuário, informações do Twitter e Telegram (se
                  fornecidos) e a data da reivindicação.
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  3. Todas as notificações são registradas nesta página para referência futura.
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4">
                <h3 className="font-medium text-yellow-300 mb-2">Solução de problemas</h3>
                <p className="text-sm text-gray-300">Se você não estiver recebendo notificações, verifique:</p>
                <ul className="list-disc list-inside text-sm text-gray-300 mt-2 space-y-1">
                  <li>Se o número de WhatsApp está correto (+55 11984801839)</li>
                  <li>Se o seu WhatsApp está ativo e conectado à internet</li>
                  <li>Se o botão "Enviar Teste" funciona corretamente</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <PerformanceToggle />
    </main>
  )
}

