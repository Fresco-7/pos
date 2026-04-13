import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from "@/components/theme-provider"
import RegisterModal from '@/components/modals/RegisterModal'
import ToasterProvider from '@/providers/ToasterProvider'
import { siteConfig } from '@/config/site'
import LoginModal from '@/components/modals/LoginModal'
import RestaurantModal from '@/components/modals/RestaurantModal'
import { EdgeStoreProvider } from '@/lib/edgestore'
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `${siteConfig.name} |  %s`
  },
  description: siteConfig.description,
  icons: {
    icon: "/images/icon.png",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>

      <body
        className={cn(
          'relative bg-background dark:bg-zinc-900 h-full font-sans antialiased',)}>
                    <link rel="icon" href="/images/rahul.png" sizes="any" />
        <main className='relative flex flex-col min-h-screen'>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme={'system'}
              enableSystem
              disableTransitionOnChange>
              <RegisterModal />
              <RestaurantModal />
              <LoginModal />
              <ToasterProvider />
              <div className='flex-grow flex-1 h-full'>
                {children}
              </div>
            </ThemeProvider>
          </EdgeStoreProvider>
        </main>
      </body>
    </html>
  )
}
