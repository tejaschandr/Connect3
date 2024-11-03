import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, Users, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-144px)] bg-gradient-to-b from-black to-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)]" />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative">
        <Card className="bg-gray-900/90 border-pink-500/30 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-pink-300">About Connect3</CardTitle>
            <CardDescription className="text-center text-lg mt-2 text-gray-300">
              Visualize your social connections and explore the six degrees of separation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-gray-200 leading-relaxed">
              Connect3 is designed to allow users to visualize their social connections and explore the fascinating theory of six degrees of separation. According to this theory, anyone on the planet can be connected to any other person through a chain of acquaintances that has no more than five intermediaries.
            </p>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-pink-300">How It Works</h2>
              <p className="text-gray-200 leading-relaxed">
                Users can create an account, enter their connections, and the application will visualize how they are connected to others, potentially all the way to six degrees. It's a tool for understanding not just your social circle but how broadly extended it might be.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-pink-500/20 hover:border-pink-500/40 transition-colors">
                <CardHeader>
                  <Network className="w-12 h-12 mb-2 text-green-500" />
                  <CardTitle className="text-pink-300">Visualize Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">See how you're connected to others through an interactive network visualization.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-pink-500/20 hover:border-pink-500/40 transition-colors">
                <CardHeader>
                  <Users className="w-12 h-12 mb-2 text-green-500" />
                  <CardTitle className="text-pink-300">Expand Your Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Discover potential connections and grow your professional network.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-pink-500/20 hover:border-pink-500/40 transition-colors">
                <CardHeader>
                  <Zap className="w-12 h-12 mb-2 text-green-500" />
                  <CardTitle className="text-pink-300">Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Gain valuable insights into your social and professional circles.</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-pink-300">Meet the Team</h2>
              <p className="text-gray-200 leading-relaxed">
                Connect3 is brought to you by a dedicated group of developers who are passionate about networks and social connections. 
              </p>
              <Button variant="link" asChild className="text-green-400 hover:text-green-300 transition-colors p-0 mt-2">
                <Link href="/team">Learn more about our team</Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button asChild size="lg" 
              className="bg-green-600 hover:bg-green-500 text-white transition-colors hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <Link href="/signup">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}