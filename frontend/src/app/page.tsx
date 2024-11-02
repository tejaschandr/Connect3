import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg bg-gray-800 border border-pink-500">
        <CardHeader className="text-center">
          <div className="w-48 h-48 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-400/30" />
              <circle cx="30" cy="35" r="8" fill="currentColor" className="text-pink-500" />
              <circle cx="70" cy="35" r="8" fill="currentColor" className="text-pink-500" />
              <circle cx="50" cy="75" r="8" fill="currentColor" className="text-pink-500" />
              <line x1="30" y1="35" x2="70" y2="35" stroke="currentColor" strokeWidth="2" className="text-pink-400" />
              <line x1="30" y1="35" x2="50" y2="75" stroke="currentColor" strokeWidth="2" className="text-pink-400" />
              <line x1="70" y1="35" x2="50" y2="75" stroke="currentColor" strokeWidth="2" className="text-pink-400" />
            </svg>
          </div>
          <CardTitle className="text-4xl font-bold text-pink-300 mb-2">Connect3</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-lg mb-6 text-gray-200">
            Meaningful connections, three at a time.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="w-full sm:w-auto bg-green-700 text-gray-100 hover:bg-green-600">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-pink-500 text-pink-400 hover:border-pink-400">
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
