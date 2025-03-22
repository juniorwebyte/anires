"use client"

import { DogIcon, Facebook, Github, Heart, Instagram, Mail, Twitter } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gradient-to-b from-transparent to-blue-950/30 border-t border-blue-800/30 backdrop-blur-sm pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <div className="flex items-center mb-4">
              <DogIcon className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-xl font-bold text-blue-400">{t("footer.about.title")}</h3>
            </div>
            <p className="text-gray-300 mb-4">{t("footer.about.description")}</p>
            <div className="flex space-x-4">
              <Link href="https://x.com/aniresbank" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://www.facebook.com/people/Anires-Animal-Rescue/61574159169589/" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/aniresbank/" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://github.com/juniorwebyte" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">{t("footer.quickLinks.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.quickLinks.home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.quickLinks.about")}
                </Link>
              </li>
              <li>
                <Link href="/claim" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.quickLinks.airdrop")}
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.quickLinks.status")}
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.quickLinks.verify")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Recursos */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">{t("footer.resources.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/seguranca" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.resources.security")}
                </Link>
              </li>
              <li>
                <Link href="/tokenomics" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.resources.tokenomics")}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.resources.roadmap")}
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-300 hover:text-blue-400 transition-colors">
                  {t("footer.quickLinks.status")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4 - Contato */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-4">{t("footer.contact.title")}</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-blue-400 mr-2" />
                <a
                  href="mailto:contato@anires.org"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  contato@anires.org
                </a>
              </li>
              <li className="mt-4">
                <Link
                  href="#"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Heart className="h-4 w-4 mr-2" /> {t("footer.contact.donate")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800/30 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Webyte® | Tecnologia Laravel - {t("footer.legal.rights")}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/termos-de-servico" className="text-gray-400 hover:text-blue-400 transition-colors">
                {t("footer.legal.terms")}
              </Link>
              <Link href="/politica-de-privacidade" className="text-gray-400 hover:text-blue-400 transition-colors">
                {t("footer.legal.privacy")}
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors">
                {t("footer.legal.cookies")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

