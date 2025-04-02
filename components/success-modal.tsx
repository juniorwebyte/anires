"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  walletAddress: string
  tokenAmount: number
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, walletAddress, tokenAmount }) => {
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copiado!",
          description: "Endereço copiado para a área de transferência",
          className: "bg-green-950 border-green-800 text-green-100",
        })
      })
      .catch((err) => {
        console.error("Erro ao copiar: ", err)
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto",
          variant: "destructive",
        })
      })
  }

  useEffect(() => {
    return () => {
      // Limpeza ao desmontar
      console.log("SuccessModal desmontado")
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0e0e1a] border-purple-800/30 text-white max-w-md mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
          </div>
          <DialogTitle className="text-xl text-center text-green-400">Reivindicação Concluída com Sucesso!</DialogTitle>
          <DialogDescription className="text-center text-gray-300">
            Seus tokens serão enviados em breve para sua carteira.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-3 bg-[#13131f] rounded-md border border-purple-800/30">
            <p className="text-sm text-gray-400 mb-1">Seu endereço de carteira:</p>
            <div className="flex items-center justify-between">
              <code className="text-xs text-purple-300 font-mono break-all">{walletAddress}</code>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-800/30 text-purple-400 hover:bg-purple-900/20 ml-2 flex-shrink-0"
                onClick={() => copyToClipboard(walletAddress)}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copiar
              </Button>
            </div>
          </div>

          <div className="p-3 bg-green-900/20 border border-green-800/30 rounded-md">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-green-400">{tokenAmount.toLocaleString()} $ANIRES</span> serão
              enviados para sua carteira em breve. Você receberá uma notificação quando a transferência for concluída.
            </p>
          </div>

          <div className="text-center text-sm text-gray-400 mt-4">Obrigado por participar do nosso airdrop!</div>

          <div className="flex justify-center mt-4">
            <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700 text-white">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessModal

