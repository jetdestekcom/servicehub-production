import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { Navigation } from '@/components/Navigation'
import { MobileNavigation } from '@/components/MobileNavigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JetDestek.com - Hızlı ve Güvenilir Hizmet Platformu',
  description: 'Ev temizliğinden teknik desteğe, bahçe bakımından nakliyeye kadar binlerce profesyonel hizmet veren. Hızlı, güvenli ve uygun fiyatlı çözümler.',
  keywords: 'hizmet, temizlik, tamir, nakliye, boyama, teknik destek, bahçe bakımı, özel ders, jetdestek, armut alternatifi',
  authors: [{ name: 'JetDestek Team' }],
  openGraph: {
    title: 'JetDestek.com - Hızlı ve Güvenilir Hizmet Platformu',
    description: 'Profesyonel hizmet verenlerle buluş, güvenli ödeme yap, hızlı çözüm al.',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JetDestek.com - Hızlı ve Güvenilir Hizmet Platformu',
    description: 'Profesyonel hizmet verenlerle buluş, güvenli ödeme yap, hızlı çözüm al.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          {children}
          <MobileNavigation />
        </Providers>
      </body>
    </html>
  )
}