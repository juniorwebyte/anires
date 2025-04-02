"use client"

import { DogIcon, Facebook, Github, Heart, Instagram, Mail, Twitter } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "@/lib/i18n/use-translations"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Footer() {
  const { t } = useTranslations()
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  // 1. Adicione uma nova constante para o endereço da carteira no início da função Footer
  const walletAddress = "0x0Fcf41A546b2de64aBDc320703dDD657dF802Eb4"
  const [donateButtonText, setDonateButtonText] = useState(t("footer.contact.donate"))
  const [isCopied, setIsCopied] = useState(false)

  // Animation variants for social icons
  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.2, rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.6 } },
    tap: { scale: 0.9 },
  }

  // 2. Adicione a função para copiar o endereço para a área de transferência
  const copyWalletAddress = () => {
    navigator.clipboard
      .writeText(walletAddress)
      .then(() => {
        setIsCopied(true)
        setDonateButtonText("✓ Copiado!")

        // Restaurar o texto original após 3 segundos
        setTimeout(() => {
          setIsCopied(false)
          setDonateButtonText(t("footer.contact.donate"))
        }, 3000)
      })
      .catch((err) => {
        console.error("Erro ao copiar: ", err)
        setDonateButtonText("Erro ao copiar")

        // Restaurar o texto original após 3 segundos
        setTimeout(() => {
          setDonateButtonText(t("footer.contact.donate"))
        }, 3000)
      })
  }

  return (
    <footer className="bg-gradient-to-b from-transparent to-blue-950/30 border-t border-blue-800/30 backdrop-blur-sm pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <div className="flex items-center mb-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
              >
                <DogIcon className="h-6 w-6 text-blue-400 mr-2" />
              </motion.div>
              <h3 className="text-xl font-bold text-blue-400">{t("footer.about.title")}</h3>
            </div>
            <p className="text-gray-300 mb-4">
              {t("footer.about.description")}
              <span
                className="text-yellow-400 ml-1 cursor-pointer hover:underline"
                onMouseEnter={() => setShowEasterEgg(true)}
                onMouseLeave={() => setShowEasterEgg(false)}
              >
                {t("footer.about.memes")} 🔥
              </span>
            </p>
            {showEasterEgg && (
              <motion.div
                className="text-xs text-gray-400 mb-3 bg-blue-900/30 p-2 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {t("footer.about.inspector")} 🕵️
              </motion.div>
            )}
            <div className="flex space-x-4">
              <motion.div
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredIcon("twitter")}
                onMouseLeave={() => setHoveredIcon(null)}
                className="relative"
              >
                <Link
                  href="https://x.com/aniresbank"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                {hoveredIcon === "twitter" && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-900/80 text-white text-xs p-1 rounded whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t("footer.iconQuotes.twitter")} 🐴
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredIcon("facebook")}
                onMouseLeave={() => setHoveredIcon(null)}
                className="relative"
              >
                <Link href="https://www.facebook.com/people/Anires-Animal-Rescue/61574159169589/" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                {hoveredIcon === "facebook" && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-900/80 text-white text-xs p-1 rounded whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t("footer.iconQuotes.facebook")} 📱
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredIcon("instagram")}
                onMouseLeave={() => setHoveredIcon(null)}
                className="relative"
              >
                <Link
                  href="https://www.instagram.com/aniresbank/"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                {hoveredIcon === "instagram" && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-900/80 text-white text-xs p-1 rounded whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t("footer.iconQuotes.instagram")} 📸
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredIcon("github")}
                onMouseLeave={() => setHoveredIcon(null)}
                className="relative"
              >
                <Link
                  href="https://github.com/juniorwebyte"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </Link>
                {hoveredIcon === "github" && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-900/80 text-white text-xs p-1 rounded whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t("footer.iconQuotes.github")} 💻
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-xl font-bold text-blue-400">{t("footer.quickLinks.title")} ✨</h3>
            <ul className="space-y-2 mt-4">
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">{t("footer.quickLinks.home")}</span>
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    🏠
                  </motion.span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">{t("footer.quickLinks.about")}</span>
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    📋
                  </motion.span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/claim" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">{t("footer.quickLinks.airdrop")}</span>
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{ scale: 1.3, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    🚀
                  </motion.span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/status" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">{t("footer.quickLinks.status")}</span>
                  <motion.span className="text-yellow-400" whileHover={{ scale: 1.3 }} transition={{ duration: 0.5 }}>
                    📊
                  </motion.span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/verify" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">{t("footer.quickLinks.verify")}</span>
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{ scale: 1.3, rotate: [0, 45, 0, -45, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ✅
                  </motion.span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Recursos */}
          <div>
            <h3 className="text-xl font-bold text-blue-400">{t("footer.resources.title")} 🔍</h3>
            <ul className="space-y-2 mt-4">
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  href="/seguranca"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"
                >
                  <span className="mr-2">{t("footer.resources.security")}</span>
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{ scale: 1.3, rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    🔒
                  </motion.span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  href="/tokenomics"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"
                >
                  <span className="mr-2">{t("footer.resources.tokenomics")}</span>
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{
                      scale: 1.3,
                      y: [0, -5, 0, -5, 0],
                      rotate: [0, 10, -10, 10, 0],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    💰
                  </motion.span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/roadmap" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">{t("footer.resources.roadmap")}</span>
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{ scale: 1.3, x: [0, 5, 0, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    🗺️
                  </motion.span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link href="/status" className="text-gray-300 hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">{t("footer.resources.status")}</span>
                  <motion.span className="text-yellow-400" whileHover={{ scale: 1.3 }} transition={{ duration: 0.5 }}>
                    📋
                  </motion.span>
                </Link>
              </li>
              <li className="hover:translate-x-1 transition-transform">
                <Link
                  href="/memes-secretos"
                  className="text-gray-300 hover:text-blue-400 transition-colors flex items-center"
                >
                  <span className="mr-2">{t("footer.resources.secretMemes")}</span>
                  <motion.span
                    className="text-yellow-400"
                    whileHover={{
                      scale: 1.3,
                      rotate: [0, 10, -10, 10, 0],
                      transition: { repeat: 2, duration: 0.3 },
                    }}
                  >
                    🤫
                  </motion.span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h3 className="text-xl font-bold text-blue-400">{t("footer.contact.title")} 📢</h3>
            <ul className="space-y-2 mt-4">
              <li className="flex items-center hover:translate-x-1 transition-transform">
                <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
                  <Mail className="h-4 w-4 text-blue-400 mr-2" />
                </motion.div>
                <a href="mailto:contato@anires.org" className="text-gray-300 hover:text-blue-400 transition-colors">
                  contato@anires.org
                </a>
              </li>
              <li className="mt-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredIcon("heart")}
                  onMouseLeave={() => setHoveredIcon(null)}
                  className="relative inline-block"
                >
                  <button
                    onClick={copyWalletAddress}
                    className={`inline-flex items-center ${isCopied ? "bg-green-600" : "bg-blue-600"} hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors`}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                    </motion.div>
                    {donateButtonText} {isCopied ? "✓" : "🚀"}
                  </button>
                  {hoveredIcon === "heart" && (
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-900/80 text-white text-xs p-1 rounded whitespace-nowrap"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {t("footer.iconQuotes.heart")} ❤️
                    </motion.div>
                  )}
                </motion.div>
              </li>
              <li className="mt-3 text-xs text-gray-500 italic">
                <motion.div
                  whileHover={{
                    color: "#FFD700",
                    transition: { duration: 0.3 },
                  }}
                >
                  {t("footer.contact.investQuote")} 🤔
                </motion.div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800/30 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Anires. {t("footer.legal.rights")}
              <motion.span
                className="ml-1 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                {t("footer.footerText")} 🔥
              </motion.span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/termos-de-servico" className="text-gray-400 hover:text-blue-400 transition-colors">
                  {t("footer.legal.terms")}
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href="/politica-de-privacidade" className="text-gray-400 hover:text-blue-400 transition-colors">
                  {t("footer.legal.privacy")}
                </Link>
              </motion.div>
              <motion.div
                whileHover={{
                  x: 3,
                  scale: 1.05,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors">
                  {t("footer.legal.cookies")}{" "}
                  <motion.span whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    🍪
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="text-center mt-4 text-xs text-gray-500"
            initial={{ opacity: 0.5 }}
            whileHover={{
              opacity: 1,
              color: "#FFD700",
              scale: 1.05,
            }}
          >
            {t("footer.memeInspector")} 🕵️
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

