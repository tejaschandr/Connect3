import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Connect3</CardTitle>
          <CardDescription>Connect with your network, three at a time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Connect3 is a unique social platform that allows you to maintain meaningful connections with just three people at a time.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}