'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Send } from 'lucide-react'

export default function Dashboard() {
  const [connections, setConnections] = useState([
    { id: 1, name: 'Alice Johnson', avatar: '/placeholder.svg' },
    { id: 2, name: 'Bob Smith', avatar: '/placeholder.svg' },
    { id: 3, name: 'Charlie Brown', avatar: '/placeholder.svg' },
  ])

  const [posts, setPosts] = useState([
    { id: 1, author: 'Alice Johnson', content: 'Just joined Connect3!', degree: 1 },
    { id: 2, author: 'Bob Smith', content: 'Excited to be here!', degree: 1 },
    { id: 3, author: 'David Lee', content: 'Hello from a friend of a friend!', degree: 2 },
  ])

  const [newConnection, setNewConnection] = useState('')
  const [newPost, setNewPost] = useState('')

  const handleAddConnection = () => {
    if (newConnection && connections.length < 3) {
      setConnections([...connections, { id: connections.length + 1, name: newConnection, avatar: '/placeholder.svg' }])
      setNewConnection('')
    }
  }

  const handleCreatePost = () => {
    if (newPost) {
      setPosts([{ id: posts.length + 1, author: 'You', content: newPost, degree: 0 }, ...posts])
      setNewPost('')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Connect3 Dashboard</h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                <AvatarFallback>YN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Your Name</h2>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Your Connections</CardTitle>
            <CardDescription>You can have up to 3 connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connections.map(connection => (
                <div key={connection.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={connection.avatar} alt={connection.name} />
                    <AvatarFallback>{connection.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{connection.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <form className="flex space-x-2 w-full" onSubmit={(e) => { e.preventDefault(); handleAddConnection(); }}>
              <Input
                placeholder="New connection name"
                value={newConnection}
                onChange={(e) => setNewConnection(e.target.value)}
                disabled={connections.length >= 3}
              />
              <Button type="submit" disabled={connections.length >= 3}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </form>
          </CardFooter>
        </Card>

        <Card className="col-span-1 md:col-span-2 row-span-2">
          <CardHeader>
            <CardTitle>Feed</CardTitle>
            <CardDescription>Posts from your network</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="mb-4" onSubmit={(e) => { e.preventDefault(); handleCreatePost(); }}>
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-2"
              />
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </form>
            <Separator className="my-4" />
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{post.author}</CardTitle>
                    <CardDescription>Degree of separation: {post.degree}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{post.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}