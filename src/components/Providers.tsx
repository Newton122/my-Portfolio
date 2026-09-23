"use client"

import dynamic from "next/dynamic"
import { LanguageProvider } from "@/context/LanguageContext"

const ClientProviders = dynamic(() => import('@/components/ClientProviders'), {
  ssr: false,
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ClientProviders>{children}</ClientProviders>
    </LanguageProvider>
  )
}
