"use client"

import { useTranslations } from "@/lib/i18n/use-translations"

// Este é um componente de exemplo para demonstrar como usar as traduções
export default function ExampleComponent() {
  const { t } = useTranslations()

  return (
    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg">
      <h2 className="text-xl font-bold mb-2">{t("common.example.title")}</h2>
      <p className="mb-4">{t("common.example.description")}</p>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-blue-500 rounded-md">{t("common.buttons.submit")}</button>
        <button className="px-4 py-2 bg-gray-500 rounded-md">{t("common.buttons.cancel")}</button>
      </div>
    </div>
  )
}

