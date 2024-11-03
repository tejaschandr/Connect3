'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Calculate year range
const currentYear = new Date().getFullYear()
const startYear = 1980
const endYear = currentYear + 5

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim() || !graduationYear.trim()) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    // Validate graduation year
    const yearNum = parseInt(graduationYear)
    if (isNaN(yearNum) || yearNum < startYear || yearNum > endYear) {
      setError(`Graduation year must be between ${startYear} and ${endYear}`)
      setLoading(false)
      return
    }

    const userData = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim(),
      school_year: yearNum, // Using actual graduation year
      num_of_connections: 0,
      invited_by: null
    }

    try {
      // First check if the API is available
      const healthCheck = await fetch(`${API_URL}/health`).catch(() => null)
      if (!healthCheck?.ok) {
        throw new Error('Unable to connect to the server. Please try again later.')
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create account')
      }

      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id)
        router.push('/dashboard')
      } else {
        throw new Error('Invalid response data')
      }
    } catch (error) {
      console.error('Error signing up:', error)
      setError(error instanceof Error 
        ? error.message 
        : 'Failed to connect to the server. Please check your internet connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-144px)] bg-gradient-to-b from-black to-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)]" />
      <Card className="w-full max-w-md shadow-2xl bg-gray-900/90 border border-pink-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-pink-300">Sign up for Connect3</CardTitle>
          <CardDescription className="text-gray-400">Create your account to start connecting</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 text-white"
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
                minLength={6}
                className="bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduationYear" className="text-gray-200">Graduation Year</Label>
              <Input
                id="graduationYear"
                type="number"
                min={startYear}
                max={endYear}
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                required
                placeholder="Enter your graduation year"
                className="bg-gray-800/50 border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-500 text-white transition-colors hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]" 
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}
            <p className="text-sm text-center text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-pink-400 hover:text-pink-300 transition-colors">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}