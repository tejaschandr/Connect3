'use client'

import { useState, useCallback } from 'react'
import ReactFlow, { 
  Node,
  Edge,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Send, X } from 'lucide-react'

// Custom node
const UserNode = ({ data }) => (
  <div 
    className="flex flex-col items-center cursor-pointer"
    onClick={(event) => {
      event.stopPropagation();
      data.onClick(data.id);
    }}
  >
    <div className="rounded-full overflow-hidden border-2 border-primary w-16 h-16">
      <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
    </div>
    <div className="mt-2 px-2 py-1 bg-background rounded-full text-xs font-medium border border-border">
      {data.name}
    </div>
  </div>
)

const nodeTypes = {
  user: UserNode,
}

const generateRandomPosition = () => ({
  x: Math.random() * 1000 - 500,
  y: Math.random() * 800 - 400,
})

function DashboardContent() {
  const [connections, setConnections] = useState([
    { id: '1', name: 'Alice Johnson', avatar: '/placeholder.svg', email: 'alice@example.com', referredBy: 'You', graduationYear: 2022, degree: 1 },
    { id: '2', name: 'Bob Smith', avatar: '/placeholder.svg', email: 'bob@example.com', referredBy: 'You', graduationYear: 2023, degree: 1 },
    { id: '3', name: 'Charlie Brown', avatar: '/placeholder.svg', email: 'charlie@example.com', referredBy: 'Alice Johnson', graduationYear: 2021, degree: 2 },
    { id: '4', name: 'Diana Prince', avatar: '/placeholder.svg', email: 'diana@example.com', referredBy: 'Bob Smith', graduationYear: 2024, degree: 2 },
    { id: '5', name: 'Ethan Hunt', avatar: '/placeholder.svg', email: 'ethan@example.com', referredBy: 'Charlie Brown', graduationYear: 2022, degree: 3 },
    { id: '6', name: 'Fiona Apple', avatar: '/placeholder.svg', email: 'fiona@example.com', referredBy: 'Diana Prince', graduationYear: 2023, degree: 3 },
    { id: '7', name: 'George Clooney', avatar: '/placeholder.svg', email: 'george@example.com', referredBy: 'Ethan Hunt', graduationYear: 2021, degree: 4 },
    { id: '8', name: 'Hannah Montana', avatar: '/placeholder.svg', email: 'hannah@example.com', referredBy: 'Fiona Apple', graduationYear: 2024, degree: 4 },
    { id: '9', name: 'Ian McKellen', avatar: '/placeholder.svg', email: 'ian@example.com', referredBy: 'George Clooney', graduationYear: 2022, degree: 5 },
    { id: '10', name: 'Julia Roberts', avatar: '/placeholder.svg', email: 'julia@example.com', referredBy: 'Hannah Montana', graduationYear: 2023, degree: 5 },
  ])

  const [posts, setPosts] = useState([
    { id: 1, author: 'Alice Johnson', content: 'Just joined Connect3!', degree: 1 },
    { id: 2, author: 'Bob Smith', content: 'Excited to be here!', degree: 1 },
    { id: 3, author: 'Charlie Brown', content: 'Hello from a friend of a friend!', degree: 2 },
  ])

  const [newConnection, setNewConnection] = useState('')
  const [newPost, setNewPost] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedUser, setSelectedUser] = useState(null)

  // connections to nodes
  const initialNodes = [
    { id: 'you', type: 'user', position: { x: 0, y: 0 }, data: { id: 'you', name: 'You', avatar: '/placeholder.svg', onClick: setSelectedUser } },
    ...connections.map((conn) => ({
      id: conn.id,
      type: 'user',
      position: generateRandomPosition(),
      data: { ...conn, onClick: setSelectedUser },
    })),
  ]

  // Create edges
  const initialEdges = [
    ...connections.map(conn => ({ 
      id: `e-you-${conn.id}`, 
      source: 'you', 
      target: conn.id, 
      animated: true,
      style: { stroke: '#888', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#888',
      },
    })),
    { id: 'e-1-3', source: '1', target: '3', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-2-4', source: '2', target: '4', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-3-5', source: '3', target: '5', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-4-6', source: '4', target: '6', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-5-7', source: '5', target: '7', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-6-8', source: '6', target: '8', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-7-9', source: '7', target: '9', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-8-10', source: '8', target: '10', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-1-4', source: '1', target: '4', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-2-3', source: '2', target: '3', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-3-6', source: '3', target: '6', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-5-8', source: '5', target: '8', style: { stroke: '#888', strokeWidth: 2 } },
    { id: 'e-7-10', source: '7', target: '10', style: { stroke: '#888', strokeWidth: 2 } },
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({
    ...params,
    style: { stroke: '#888', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#888',
    },
  }, eds)), [setEdges])

  const handleAddConnection = () => {
    if (newConnection && connections.length < 10) {
      const newConn = { 
        id: `${connections.length + 1}`, 
        name: newConnection, 
        avatar: '/placeholder.svg',
        email: `${newConnection.toLowerCase().replace(' ', '.')}@example.com`,
        referredBy: 'You',
        graduationYear: new Date().getFullYear(),
        degree: 1
      }
      setConnections([...connections, newConn])
      setNodes((nds) => [
        ...nds,
        {
          id: newConn.id,
          type: 'user',
          position: generateRandomPosition(),
          data: { ...newConn, onClick: setSelectedUser },
        },
      ])
      setEdges((eds) => [
        ...eds,
        { 
          id: `e-you-${newConn.id}`, 
          source: 'you', 
          target: newConn.id, 
          animated: true,
          style: { stroke: '#888', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#888',
          },
        },
      ])
      setNewConnection('')
    }
  }

  const handleCreatePost = () => {
    if (newPost) {
      setPosts([{ id: posts.length + 1, author: 'You', content: newPost, degree: 0 }, ...posts])
      setNewPost('')
    }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.id - a.id
    } else {
      return a.degree - b.degree
    }
  })

  return (
    <div className="h-screen relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="w-full h-full"
      >
        <Controls />
      </ReactFlow>
      
      <div className="absolute top-0 right-0 w-96 h-full overflow-y-auto p-4 space-y-4">
        <h1 className="text-3xl font-bold mb-4 text-primary">Feed</h1>
        <div className="mb-4">
          <Label htmlFor="sort" className="text-primary">Sort by</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort" className="bg-background/50 backdrop-blur-sm border-primary text-primary">
              <SelectValue placeholder="Select sorting method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="distance">Shortest Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card className="mb-4 bg-background/50 backdrop-blur-sm border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Create Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleCreatePost(); }}>
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-2 bg-background/50 border-primary text-primary placeholder:text-primary/50"
              />
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </form>
          </CardContent>
        </Card>
        {sortedPosts.map(post => (
          <Card key={post.id} className="bg-background/50 backdrop-blur-sm border-primary">
            <CardHeader>
              <CardTitle className="text-lg text-primary">{post.author}</CardTitle>
              <div className="text-sm text-primary/70">Degree of separation: {post.degree}</div>
            </CardHeader>
            <CardContent>
              <p className="text-primary">{post.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-background/50 backdrop-blur-sm border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Add Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex space-x-2" onSubmit={(e) => { e.preventDefault(); handleAddConnection(); }}>
              <Input
                placeholder="New connection name"
                value={newConnection}
                onChange={(e) => setNewConnection(e.target.value)}
                disabled={connections.length >= 10}
                className="bg-background/50 border-primary text-primary placeholder:text-primary/50"
              />
              <Button type="submit" disabled={connections.length >= 10} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {selectedUser && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <Card className="bg-background border-primary w-80">
            <CardHeader className="flex flex-row justify-between items-start">
              <CardTitle className="text-primary">{selectedUser.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-primary"><strong>Email:</strong> {selectedUser.email}</p>
              <p className="text-primary"><strong>Referred by:</strong> {selectedUser.referredBy}</p>
              <p className="text-primary"><strong>Graduation Year:</strong> {selectedUser.graduationYear}</p>
              <p className="text-primary"><strong>Degree of Separation:</strong> {selectedUser.degree}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  return (
    <ReactFlowProvider>
      <DashboardContent />
    </ReactFlowProvider>
  )
}