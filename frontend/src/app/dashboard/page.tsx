'use client'

import { useState, useCallback } from 'react'
import ReactFlow, { 
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  MarkerType,
  Connection,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Send, X } from 'lucide-react'

const generateRandomPosition = () => ({
  x: Math.random() * 1000 - 500,
  y: Math.random() * 800 - 400,
})

function DashboardContent() {
  const [connections, setConnections] = useState([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', referredBy: 'You', graduationYear: 2022, degree: 1 },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', referredBy: 'You', graduationYear: 2023, degree: 1 },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', referredBy: 'Alice Johnson', graduationYear: 2021, degree: 2 },
  ])

  const [posts, setPosts] = useState([
    { id: 1, author: 'Alice Johnson', content: 'Just joined Connect3!', degree: 1 },
    { id: 2, author: 'Bob Smith', content: 'Excited to be here!', degree: 1 },
  ])

  const [newConnection, setNewConnection] = useState('')
  const [newPost, setNewPost] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedUser, setSelectedUser] = useState(null)
  const [disabled, setDisabled] = useState(null);

  // Create simplified nodes and edges
  const initialNodes = [
    { id: 'you', position: { x: 0, y: 0 }, data: { label: 'You' } },
    ...connections.map(conn => ({
        id: conn.id,
        position: generateRandomPosition(),
        data: { label: conn.name },
    })),
];

  const initialEdges = connections.map(conn => ({
    id: `e-you-${conn.id}`,
    source: 'you',
    target: conn.id,
    type: 'straight',
    style: { stroke: '#888', strokeWidth: 2 },  // Consistent edge styling
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#888',  // Consistent arrow color
    },
  }));
  

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(
      {
        ...params,
        type: 'straight',  // Ensures new edges are straight
        style: { stroke: '#888', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#888',
        },
      },
      eds
    )),
    [setEdges]
  );
  

  const handleAddConnection = () => {
    if (newConnection && connections.length < 10) {
      const newConn = { 
        id: `${connections.length + 1}`, 
        name: newConnection,
        email: `${newConnection.toLowerCase().replace(' ', '.')}@example.com`,
        referredBy: 'You',
        graduationYear: new Date().getFullYear(),
        degree: 1
      }
      setConnections([...connections, newConn])
      setNodes((nds) => [
        ...nds,
        { id: newConn.id, position: generateRandomPosition(), data: { label: newConn.name } },
      ])
      setEdges((eds) => [
        ...eds,
        { id: `e-you-${newConn.id}`, source: 'you', target: newConn.id },
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
    return sortBy === 'recent' ? b.id - a.id : a.degree - b.degree
  })

  return (
    <div className="h-screen relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgesUpdatable={!disabled}
        edgesFocusable={!disabled}
        nodesDraggable={!disabled}
        nodesConnectable={!disabled}
        nodesFocusable={!disabled}
        draggable={!disabled}
        panOnDrag={!disabled}
        elementsSelectable={!disabled}      
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
            <SelectTrigger id="sort" className="bg-background/50 border-primary text-primary">
              <SelectValue placeholder="Select sorting method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="distance">Shortest Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card className="mb-4 bg-background/50 border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Create Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleCreatePost(); }}>
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-2 bg-background/50 border-primary text-primary"
              />
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </form>
          </CardContent>
        </Card>
        {sortedPosts.map(post => (
          <Card key={post.id} className="bg-background/50 border-primary">
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
        <Card className="bg-background/50 border-primary">
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
                className="bg-background/50 border-primary text-primary"
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
