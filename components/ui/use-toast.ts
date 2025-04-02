"use client"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
} from "@/components/ui/toast"
import { useToast as useToastHooks } from "@/hooks/use-toast"
import { createContext, useState } from "react"

type ToastType = "default" | "destructive"
type ToastAction = {
  altText: string
}

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: ToastAction
  duration?: number
  type?: ToastType
  className?: string
}

type ToasterContextType = {
  toasts: ToastProps[]
  toast: (toast: Omit<ToastProps, "id">) => void
  dismiss: (toastId: string) => void
  update: (toast: ToastProps) => void
}

const ToasterContext = createContext<ToasterContextType>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
  update: () => {},
})

function generateId() {
  return String(Math.random())
}

function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (newToast: Omit<ToastProps, "id">) => {
    const id = generateId()
    setToasts([...toasts, { id, ...newToast }])
  }

  const dismiss = (toastId: string) => {
    setToasts(toasts.filter((toast) => toast.id !== toastId))
  }

  const update = (updatedToast: ToastProps) => {
    setToasts(toasts.map((toast) => (toast.id === updatedToast.id ? updatedToast : toast)))
  }

  return {
    toasts,
    toast,
    dismiss,
    update,
  }
}

export {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastProvider,
  ToastViewport,
  Toaster,
  useToastHooks as useToast,
}

