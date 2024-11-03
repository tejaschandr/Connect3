'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/dashboard')
    } catch (error) {
      setError('Failed to log in. Please check your credentials.')
      console.error('Error signing in:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-144px)] bg-gradient-to-b from-black to-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)]" />
      <Card className="w-full max-w-md shadow-2xl bg-gray-900/90 border border-pink-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-pink-300">Login to Connect3</CardTitle>
          <CardDescription className="text-gray-400">Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" 
              className="w-full bg-green-600 hover:bg-green-500 text-white transition-colors hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
              disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <p className="text-sm text-center text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-pink-400 hover:text-pink-300 transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}