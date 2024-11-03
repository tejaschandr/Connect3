'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Share2, Send } from "lucide-react"
import { Toaster, toast } from 'sonner' // Import Sonner components
import { Textarea } from '@/components/ui/textarea'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Dashboard() {
    const [newConnection, setNewConnection] = useState('')
    const [user, setUser] = useState(null)
    const [connections, setConnections] = useState([])
    const [posts, setPosts] = useState([])
    const [newPost, setNewPost] = useState('')
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail')
        if (!userEmail) {
            // If no email, redirect to login
            router.push('/login')
            return
        }

        const fetchData = async () => {
            try {
                // Fetch user data
                const resUser = await fetch(`${API_URL}/users/email/${userEmail}`)
                if (!resUser.ok) {
                    throw new Error('Failed to fetch user data')
                }
                const userData = await resUser.json()
                setUser(userData)

                // Fetch user connections
                const resConnections = await fetch(`${API_URL}/users/${userEmail}/connections`)
                if (!resConnections.ok) {
                    throw new Error('Failed to fetch connections')
                }
                const connectionsData = await resConnections.json()
                setConnections(connectionsData.connections)

                // Fetch user feed
                const resFeed = await fetch(`${API_URL}/feed/${userData.id}`)
                if (!resFeed.ok) {
                    throw new Error('Failed to fetch feed')
                }
                const feedData = await resFeed.json()
                setPosts(feedData.feed)

                setLoading(false)
            } catch (err) {
                console.error(err)
                toast.error(err.message || 'An error occurred', { position: "bottom-right" })
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

    const handleNewConnection = async (e) => {
        e.preventDefault()
        if (connections.length >= 3) {
            toast.error('You have reached the maximum of 3 connections', { position: "bottom-right" })
            return
        }
        if (!newConnection.trim()) {
            toast.error('Please enter an email to connect', { position: "bottom-right" })
            return
        }
        try {
            // Send a request to connect users by email
            const res = await fetch(`${API_URL}/connect_users_by_email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email1: user.email,
                    email2: newConnection.trim(),
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || 'Failed to connect users')
            }

            const data = await res.json()
            console.log(data.message)

            // Refresh connections
            const resConnections = await fetch(`${API_URL}/users/${user.email}/connections`)
            if (resConnections.ok) {
                const connectionsData = await resConnections.json()
                setConnections(connectionsData.connections)
            }

        } catch (err) {
            console.error(err)
            toast.error(err.message || 'An error occurred', { position: "bottom-right" })
        }

        setNewConnection('')
    }

    const handleNewPost = () => {
        console.log("made new post")
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <>
            <Toaster richColors /> {/* Initialize the Toaster for notifications */}
            <div className="min-h-screen bg-gray-100 p-4">
                <div className="max-w-6xl mx-auto space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connect3 Dashboard</CardTitle>
                            <CardDescription>Your personal network hub</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt={user.name} />
                                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle>Your Connections</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {connections.length > 0 ? (
                                    <ul className="space-y-2">
                                        {connections.map((connection) => (
                                            <li key={connection.id} className="flex items-center space-x-2">
                                                <Avatar>
                                                    <AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{connection.name}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No connections found.</p>
                                )}
                            </CardContent>
                            <CardFooter>
                                <form onSubmit={handleNewConnection} className="w-full">
                                    <Label htmlFor="newConnection" className="sr-only">Request New Connection</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="newConnection"
                                            placeholder="Email to connect"
                                            value={newConnection}
                                            onChange={(e) => setNewConnection(e.target.value)} disabled={connections.length >= 3}
                                        />
                                        <Button type="submit" size="icon">
                                            <UserPlus className="h-4 w-4" />
                                            <span className="sr-only">Request Connection</span>
                                        </Button>
                                    </div>
                                </form>
                            </CardFooter>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Network Visualization</CardTitle>
                                <CardDescription>Visual representation of your connections</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Share2 className="h-12 w-12 text-gray-400" />
                                    <span className="sr-only">Placeholder for network graph</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Your Feed</CardTitle>
                            <CardDescription>Posts from your network and you</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleNewPost} className="mb-4">
                                <Label htmlFor="newPost" className="sr-only">Add a new post</Label>
                                <Textarea
                                    id="newPost"
                                    placeholder="What's on your mind?"
                                    value={newPost}
                                    onChange={(e) => (e.target.value)}
                                    className="mb-2"
                                />
                                <Button type="submit" className="w-full">
                                    <Send className="h-4 w-4 mr-2" />
                                    Post
                                </Button>
                            </form>
                            <ul className="space-y-4">
                                {posts.map((post) => (
                                    <li key={post.id}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-sm font-medium">{post.author}</CardTitle>
                                                <CardDescription>
                                                    {post.degree === 0 ? "Your post" : `Degree of separation: ${post.degree}`}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p>{post.content}</p>
                                            </CardContent>
                                        </Card>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}