'use client'

import { useState } from 'react'
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
  const [newPostDegree, setNewPostDegree] = useState('1')
  const [profile, setProfile] = useState({
    name: 'Your Name',
    graduationYear: 2024,
    email: 'user@example.com',
    invitedBy: 'John Doe'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)

  const handleAddConnection = () => {
    if (newConnection && connections.length < 3) {
      setConnections([...connections, { id: connections.length + 1, name: newConnection, avatar: '/placeholder.svg' }])
      setNewConnection('')
    }
  }

  const handleCreatePost = () => {
    if (newPost) {
      setPosts([{ id: posts.length + 1, author: 'You', content: newPost, degree: parseInt(newPostDegree) }, ...posts])
      setNewPost('')
      setNewPostDegree('1')
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
    setEditedProfile(profile)
  }

  const handleSaveProfile = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  return (
    <div className="min-h-[calc(100vh-144px)] bg-gradient-to-b from-black to-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)]" />
      <div className="container mx-auto relative">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-pink-300">Connect3 Dashboard</h1>
        </header>
        
        <Tabs defaultValue="feed" className="space-y-4">
          <TabsList className="bg-gray-800 border border-pink-500/20">
            <TabsTrigger value="feed" 
              className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
              Feed
            </TabsTrigger>
            <TabsTrigger value="profile"
              className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-300">
              Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="col-span-1 bg-gray-900/90 border-pink-500/30 shadow-lg backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-pink-300">Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20 border-2 border-pink-500/30">
                      <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                      <AvatarFallback className="bg-gray-800">{profile.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-200">{profile.name}</h2>
                      <p className="text-sm text-gray-400">{profile.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 bg-gray-900/90 border-pink-500/30 shadow-lg backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-pink-300">Your Connections</CardTitle>
                  <CardDescription className="text-gray-400">You can have up to 3 connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {connections.map(connection => (
                      <div key={connection.id} className="flex items-center space-x-4 p-2 rounded-lg bg-gray-800/50">
                        <Avatar>
                          <AvatarImage src={connection.avatar} alt={connection.name} />
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

              <Card className="col-span-1 md:col-span-3 bg-gray-900/90 border-pink-500/30 shadow-lg backdrop-blur-sm">
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
                            Visible to: Up to {post.degree}{post.degree === 1 ? 'st' : post.degree === 2 ? 'nd' : 'rd'} degree connections
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
          </TabsContent>
          
          <TabsContent value="profile">
            <Card className="bg-gray-900/90 border-pink-500/30 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-pink-300">Your Profile</CardTitle>
                <CardDescription className="text-gray-400">View and edit your profile information</CardDescription>
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
                      <Label htmlFor="graduationYear" className="text-gray-300">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        type="number"
                        value={editedProfile.graduationYear}
                        onChange={(e) => setEditedProfile({...editedProfile, graduationYear: parseInt(e.target.value)})}
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
                    <p>Graduation Year: {profile.graduationYear}</p>
                    <p>Email: {profile.email}</p>
                    <Button onClick={handleEditProfile}
                      className="bg-pink-600 hover:bg-pink-500 text-white transition-colors hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}