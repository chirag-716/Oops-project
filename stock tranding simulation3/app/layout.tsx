import type { Metadata } from 'next'
import './globals.css'
import { DarkModeProvider } from '@/contexts/DarkModeContext'
import { ToastProvider } from '@/contexts/ToastContext'

export const metadata: Metadata = {
  title: 'Smart Stock Trading Simulation Platform',
  description: 'Real-time stock trading simulation with intelligent trading engine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <DarkModeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </DarkModeProvider>
      </body>
    </html>
  )
}
