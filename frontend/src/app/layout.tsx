import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Connect3',
  description: 'Connect with your network, three at a time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header className="bg-primary text-primary-foreground p-4">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Connect3</h1>
            </div>
          </header>
          <main className="container mx-auto py-8">
            {children}
          </main>
          <footer className="bg-muted text-muted-foreground p-4 mt-8">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Connect3. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}