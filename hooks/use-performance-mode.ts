"use client"

import { useState, useEffect } from "react"

export function usePerformanceMode() {
  const [isPerformanceMode, setIsPerformanceMode] = useState<boolean>(false)
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState<boolean>(false)

  // Carregar preferência do usuário e detectar dispositivos de baixo desempenho
  useEffect(() => {
    try {
      // Verificar se é um dispositivo móvel
      const isMobile =
        typeof window !== "undefined" &&
        (window.innerWidth < 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

      // Detectar dispositivos de baixo desempenho sem alterar o comportamento visual
      const detectLowPerformanceDevice = () => {
        try {
          // Verificar número de núcleos de CPU
          const lowCores =
            typeof navigator !== "undefined" &&
            navigator.hardwareConcurrency !== undefined &&
            navigator.hardwareConcurrency <= 2

          // Verificar memória disponível (se disponível)
          const lowMemory =
            typeof navigator !== "undefined" &&
            (navigator as any).deviceMemory !== undefined &&
            (navigator as any).deviceMemory <= 2

          return lowCores || lowMemory
        } catch (e) {
          return false
        }
      }

      // Dentro do useEffect, adicionar:
      const isLowPerformance = detectLowPerformanceDevice()
      setIsLowPerformanceMode(isLowPerformance)

      // Verificar se é um dispositivo de baixo desempenho
      // const isLowPerformance =
      //   isMobile ||
      //   (typeof navigator !== "undefined" &&
      //     navigator.hardwareConcurrency !== undefined &&
      //     navigator.hardwareConcurrency <= 4)

      // Definir o modo de baixo desempenho
      // setIsLowPerformanceMode(isLowPerformance)

      // Carregar preferência do usuário
      const savedMode = localStorage.getItem("performance-mode")

      // Se não houver preferência salva, usar o modo automático
      if (savedMode === null) {
        setIsPerformanceMode(isLowPerformance)
        localStorage.setItem("performance-mode", String(isLowPerformance))
      } else {
        setIsPerformanceMode(savedMode === "true")
      }

      // Aplicar classes ao documento
      if (savedMode === "true" || (savedMode === null && isLowPerformance)) {
        document.documentElement.classList.add("performance-mode")
      } else {
        document.documentElement.classList.remove("performance-mode")
      }
    } catch (error) {
      console.error("Erro ao acessar localStorage:", error)
    }
  }, [])

  // Função para alternar o modo
  const togglePerformanceMode = () => {
    try {
      const newMode = !isPerformanceMode
      setIsPerformanceMode(newMode)
      localStorage.setItem("performance-mode", String(newMode))

      // Aplicar classes ao documento
      if (newMode) {
        document.documentElement.classList.add("performance-mode")
      } else {
        document.documentElement.classList.remove("performance-mode")
      }
    } catch (error) {
      console.error("Erro ao salvar preferência:", error)
    }
  }

  return { isPerformanceMode, isLowPerformanceMode, togglePerformanceMode }
}

