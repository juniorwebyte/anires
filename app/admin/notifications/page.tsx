"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import AdminNavbar from "@/components/admin-navbar"
import { getTokenInfo } from "@/app/actions/token-info"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [token, setToken] = useState("")

  // Carregar o token de forma segura
  useEffect(() => {
    async function loadTokenInfo() {
      try {
        const { token } = await getTokenInfo()
        setToken(token)

        // Após carregar o token, buscar as notificações
        fetchNotifications(token)
      } catch (error) {
        console.error("Erro ao carregar informações do token:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar as informações de autenticação",
          variant: "destructive",
        })
      }
    }

    loadTokenInfo()
  }, [])

  // Função para buscar notificações
  const fetchNotifications = async (authToken: string) => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/notifications", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Falha ao buscar notificações")
      }

      const data = await response.json()
      setNotifications(data.notifications)
    } catch (error) {
      console.error("Erro ao buscar notificações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notificações",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para enviar notificação
  const handleSendNotification = async (e) => {
    e.preventDefault()

    if (!title || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a mensagem da notificação",
        variant: "destructive",
      })
      return
    }

    try {
      setSending(true)
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar notificação")
      }

      const data = await response.json()

      // Atualizar a lista de notificações
      fetchNotifications(token)

      // Limpar o formulário
      setTitle("")
      setMessage("")

      toast({
        title: "Sucesso",
        description: "Notificação enviada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao enviar notificação:", error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a notificação",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  // Função para enviar notificação de teste
  const handleSendTestNotification = async () => {
    if (!title || !message) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e a mensagem da notificação",
        variant: "destructive",
      })
      return
    }

    try {
      setSending(true)
      const response = await fetch("/api/admin/send-test-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar notificação de teste")
      }

      toast({
        title: "Sucesso",
        description: "Notificação de teste enviada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao enviar notificação de teste:", error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a notificação de teste",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminNavbar />

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Gerenciamento de Notificações</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário de envio de notificação */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Enviar Notificação</CardTitle>
              <CardDescription>Envie notificações para todos os usuários do Anires</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendNotification} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Título
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título da notificação"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite a mensagem da notificação"
                    className="bg-gray-800 border-gray-700"
                    rows={4}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={sending} className="bg-blue-600 hover:bg-blue-700">
                    {sending ? "Enviando..." : "Enviar Notificação"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={sending}
                    onClick={handleSendTestNotification}
                    className="border-blue-800 text-blue-400 hover:bg-blue-900/20"
                  >
                    Enviar Teste
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de notificações enviadas */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Histórico de Notificações</CardTitle>
              <CardDescription>Visualize as notificações enviadas anteriormente</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando notificações...</div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">Nenhuma notificação enviada ainda</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          {new Date(notification.date).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          {notification.sent ? (
                            <Badge className="bg-green-600">Enviada</Badge>
                          ) : (
                            <Badge className="bg-yellow-600">Pendente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

