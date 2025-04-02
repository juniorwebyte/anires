"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Share2, Users } from "lucide-react"
import { generateReferralLink } from "@/lib/referral-utils"
import { getReferralBonus, getReferrals } from "@/lib/claim-storage"

interface ReferralShareProps {
  walletAddress: string
}

export default function ReferralShare({ walletAddress }: ReferralShareProps) {
  const { toast } = useToast()
  const [referralLink, setReferralLink] = useState("")
  const [referralCount, setReferralCount] = useState(0)
  const [referralBonus, setReferralBonus] = useState(0)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    // Check if Web Share API is available
    setCanShare(typeof navigator !== "undefined" && !!navigator.share && typeof navigator.share === "function")

    if (walletAddress) {
      // Gerar link de referral
      const link = generateReferralLink(walletAddress)
      setReferralLink(link)

      // Obter contagem de referrals
      const referrals = getReferrals(walletAddress)
      setReferralCount(referrals.length)

      // Obter bônus de referral
      const bonus = getReferralBonus(walletAddress)
      setReferralBonus(bonus)
    }
  }, [walletAddress])

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Link copiado!",
          description: "Link de referral copiado para a área de transferência",
          className: "bg-green-950 border-green-800 text-green-100",
        })
      })
      .catch((err) => {
        console.error("Erro ao copiar: ", err)
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link",
          variant: "destructive",
        })
      })
  }

  const shareReferralLink = async () => {
    // Always copy to clipboard first as a fallback
    copyToClipboard(referralLink)

    // Then try to use the Web Share API if available
    if (canShare) {
      try {
        await navigator.share({
          title: "AniRes Airdrop",
          text: "Participe do airdrop do AniRes e ganhe tokens grátis! Use meu link de referral:",
          url: referralLink,
        })

        toast({
          title: "Link compartilhado!",
          description: "Obrigado por compartilhar seu link de referral",
          className: "bg-green-950 border-green-800 text-green-100",
        })
      } catch (error) {
        // Don't show an error toast since we already copied to clipboard
        console.log("Compartilhamento via API não foi possível, usando clipboard como fallback", error)
      }
    } else {
      // If Web Share API is not available, we already copied to clipboard
      toast({
        title: "Link copiado!",
        description:
          "Seu navegador não suporta compartilhamento direto. O link foi copiado para a área de transferência.",
        className: "bg-blue-950 border-blue-800 text-blue-100",
      })
    }
  }

  return (
    <Card className="border-purple-800/30 bg-[#0e0e1a] shadow-xl overflow-hidden">
      <CardHeader className="border-b border-purple-900/20 bg-[#0a0a14] py-3 px-4">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-base text-purple-400 ml-2">Programa de Referral</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-300 mb-4">
          Compartilhe seu link de referral e ganhe 10 tokens ANIRES para cada pessoa que participar do airdrop através
          do seu link!
        </p>

        {referralCount > 0 && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-800/30 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-400 font-medium">Seus Referrals</h3>
                <p className="text-sm text-gray-300 mt-1">
                  Você já convidou {referralCount} pessoa{referralCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Bônus de Tokens</p>
                <p className="text-green-400 font-medium">{referralBonus} ANIRES</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="referral-link" className="text-sm text-gray-400 mb-1 block">
            Seu link de referral
          </label>
          <div className="flex gap-2">
            <Input
              id="referral-link"
              value={referralLink}
              readOnly
              className="bg-[#13131f] border-purple-800/30 text-white"
            />
            <Button
              variant="outline"
              className="border-purple-800/30 text-purple-400 hover:bg-purple-900/20"
              onClick={() => copyToClipboard(referralLink)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={shareReferralLink}>
          <Share2 className="h-4 w-4 mr-2" />
          {canShare ? "Compartilhar Link de Referral" : "Copiar Link de Referral"}
        </Button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Os bônus de referral serão distribuídos junto com os tokens do airdrop após o lançamento oficial.
        </p>
      </CardContent>
    </Card>
  )
}

