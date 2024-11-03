import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import Link from 'next/link'

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
      <body className={`${inter.className} bg-black min-h-screen`}>
        <AuthProvider>
          <header className="bg-gray-900/90 border-b border-pink-500/30 backdrop-blur-sm text-pink-400 p-4 sticky top-0 z-50">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold hover:text-pink-300 transition-colors">
                <Link href="/">Connect3</Link>
              </h1>
            </div>
          </header>
          <main className="min-h-[calc(100vh-144px)]">
            {children}
          </main>
          <footer className="bg-gray-900/90 border-t border-pink-500/30 backdrop-blur-sm text-pink-400 p-4">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Connect3. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}