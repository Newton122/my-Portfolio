"use client"

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ContactRail from '@/components/ContactRail'
import PortfolioChat from '@/components/PortfolioChat'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <CustomCursor />
      <Navbar />
      <ContactRail />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <PortfolioChat />
    </div>
  )
}
