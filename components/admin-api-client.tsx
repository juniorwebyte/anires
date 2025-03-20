"use client"

import { useState, useEffect } from "react"
import { getTokenInfo } from "@/app/actions/token-info"

// Cliente de API para o painel de administração
export function useAdminApi() {
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadToken() {
      try {
        // Tentar obter o token da sessão primeiro
        const sessionToken = sessionStorage.getItem("adminToken")

        if (sessionToken) {
          setToken(sessionToken)
        } else {
          // Se não houver token na sessão, obter do servidor
          const { token: serverToken } = await getTokenInfo()
          setToken(serverToken)
        }
      } catch (err) {
        console.error("Erro ao carregar token:", err)
        setError(err instanceof Error ? err : new Error("Erro desconhecido ao carregar token"))
      } finally {
        setLoading(false)
      }
    }

    loadToken()
  }, [])

  // Função para fazer requisições autenticadas
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error("Token não disponível")
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  // Função para obter dados
  const getData = async (url: string) => {
    const response = await fetchWithAuth(url)

    if (!response.ok) {
      throw new Error(`Erro ao obter dados: ${response.status}`)
    }

    return response.json()
  }

  // Função para enviar dados
  const postData = async (url: string, data: any) => {
    const response = await fetchWithAuth(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Erro ao enviar dados: ${response.status}`)
    }

    return response.json()
  }

  // Função para atualizar dados
  const putData = async (url: string, data: any) => {
    const response = await fetchWithAuth(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Erro ao atualizar dados: ${response.status}`)
    }

    return response.json()
  }

  // Função para excluir dados
  const deleteData = async (url: string) => {
    const response = await fetchWithAuth(url, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Erro ao excluir dados: ${response.status}`)
    }

    return response.json()
  }

  return {
    token,
    loading,
    error,
    getData,
    postData,
    putData,
    deleteData,
  }
}

