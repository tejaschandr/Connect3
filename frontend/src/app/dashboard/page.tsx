'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Send, Edit2 } from 'lucide-react'
import { ForceGraph2D } from 'react-force-graph'

const API_URL = 'https://8df0-152-23-86-183.ngrok-free.app'

export default function Dashboard() {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    school_year: 0,
    num_of_connections: 0,
    invited_by: null
  })
  const [connections, setConnections] = useState([])
  const [posts, setPosts] = useState([])
  const [newConnection, setNewConnection] = useState('')
  const [newPost, setNewPost] = useState('')
  const [newPostDegree, setNewPostDegree] = useState('1')
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })

  useEffect(() => {
    fetchUserProfile()
    fetchConnections()
    fetchPosts()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await fetch(`${API_URL}/users/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user profile')
      const data = await response.json()
      setProfile(data)
      setEditedProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchConnections = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await fetch(`${API_URL}/users/${userId}/connections`)
      if (!response.ok) throw new Error('Failed to fetch connections')
      const data = await response.json()
      setConnections(data)
      updateGraphData(data)
    } catch (error) {
      console.error('Error fetching connections:', error)
    }
  }

  const updateGraphData = (connections) => {
    const nodes = [{ id: profile.id, name: profile.name }, ...connections.map(c => ({ id: c.id, name: c.name }))]
    const links = connections.map(c => ({ source: profile.id, target: c.id }))
    setGraphData({ nodes, links })
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const handleAddConnection = async () => {
    if (newConnection && connections.length < 3) {
      try {
        const response = await fetch(`${API_URL}/connect_users_by_name`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name1: profile.name, name2: newConnection }),
        })
        if (!response.ok) throw new Error('Failed to add connection')
        await fetchConnections()
        setNewConnection('')
      } catch (error) {
        console.error('Error adding connection:', error)
      }
    }
  }

  const handleCreatePost = async () => {
    if (newPost) {
      try {
        const response = await fetch(`${API_URL}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author_id: profile.id,
            content: newPost,
            visibility: parseInt(newPostDegree)
          }),
        })
        if (!response.ok) throw new Error('Failed to create post')
        await fetchPosts()
        setNewPost('')
        setNewPostDegree('1')
      } catch (error) {
        console.error('Error creating post:', error)
      }
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProfile),
      })
      if (!response.ok) throw new Error('Failed to update profile')
      setProfile(editedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)]" />
      <div className="container mx-auto relative">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-pink-300">Connect3 Dashboard</h1>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-gray-900/90 border-pink-500/30 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-pink-300">Your Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ height: '400px' }}>
                  <ForceGraph2D
                    graphData={graphData}
                    nodeLabel="name"
                    nodeColor={() => "#ec4899"}
                    linkColor={() => "#ec489980"}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/90 border-pink-500/30 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-pink-300">Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Name</Label>
                      <Input
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                        className="bg-gray-800 border-gray-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolYear" className="text-gray-300">School Year</Label>
                      <Input
                        id="schoolYear"
                        type="number"
                        value={editedProfile.school_year}
                        onChange={(e) => setEditedProfile({...editedProfile, school_year: parseInt(e.target.value)})}
                        className="bg-gray-800 border-gray-700 text-white focus:border-pink-500 focus:ring-pink-500/20"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" 
                        className="bg-green-600 hover:bg-green-500 text-white transition-colors hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        Save
                      </Button>
                      <Button type="button" onClick={() => setIsEditing(false)}
                        className="bg-gray-700 hover:bg-gray-600 text-white transition-colors">
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 text-gray-200">
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <p>School Year: {profile.school_year}</p>
                    <p>Connections: {profile.num_of_connections}</p>
                    <Button onClick={() => setIsEditing(true)}
                      className="bg-pink-600 hover:bg-pink-500 text-white transition-colors hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-gray-900/90 border-pink-500/30 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-pink-300">Your Connections</CardTitle>
                <CardDescription className="text-gray-400">You can have up to 3 connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connections.map(connection => (
                    <div key={connection.id} className="flex items-center space-x-4 p-2 rounded-lg bg-gray-800/50">
                      <Avatar>
                        <AvatarFallback className="bg-gray-700">{connection.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-gray-200">{connection.name}</span>
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
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20"
                  />
                  <Button type="submit" disabled={connections.length >= 3}
                    className="bg-green-600 hover:bg-green-500 text-white transition-colors hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </form>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900/90 border-pink-500/30 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-pink-300">Feed</CardTitle>
                <CardDescription className="text-gray-400">Posts from your network</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="mb-4 space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreatePost(); }}>
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20 min-h-[100px]"
                  />
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="postDegree" className="text-gray-300">Visible to:</Label>
                    <Select value={newPostDegree} onValueChange={setNewPostDegree}>
                      <SelectTrigger id="postDegree" 
                        className="w-[180px] bg-gray-800 border-gray-700 text-gray-200 focus:border-pink-500 focus:ring-pink-500/20">
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="1" className="text-gray-200">1st degree connections</SelectItem>
                        <SelectItem value="2" className="text-gray-200">Up to 2nd degree</SelectItem>
                        <SelectItem value="3" className="text-gray-200">Up to 3rd degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" 
                    className="bg-green-600 hover:bg-green-500 text-white transition-colors hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </form>
                <Separator className="my-4 bg-gray-700" />
                <div className="space-y-4">
                  {posts.map(post => (
                    <Card key={post.id} className="bg-gray-800/50 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-200">{post.author}</CardTitle>
                        <CardDescription className="text-gray-400">
                          Visible to: Up to {post.visibility}{post.visibility === 1 ? 'st' : post.visibility === 2 ? 'nd' : 
                          'rd'} degree connections
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300">{post.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}