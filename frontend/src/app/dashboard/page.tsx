'use client'

import CustomNode from './CustomNode'
import { useState } from 'react'
import ReactFlow, { 
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Send, X } from 'lucide-react'

// Helper function to generate positions in a circular layout
const generateCircularPosition = (index: number, total: number, radius: number = 300) => {
  const angle = (index * 2 * Math.PI) / total
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  }
}

// Initial network data
const initialConnections = [
  { id: 'you', name: 'You', email: 'you@example.com', referredBy: null, graduationYear: 2024, degree: 0 },
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', referredBy: 'You', graduationYear: 2022, degree: 1 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', referredBy: 'You', graduationYear: 2023, degree: 1 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', referredBy: 'Alice Johnson', graduationYear: 2021, degree: 2 },
  { id: '4', name: 'David Miller', email: 'david@example.com', referredBy: 'Bob Smith', graduationYear: 2022, degree: 2 },
  { id: '5', name: 'Emma Davis', email: 'emma@example.com', referredBy: 'Charlie Brown', graduationYear: 2023, degree: 3 },
  { id: '6', name: 'Frank Wilson', email: 'frank@example.com', referredBy: 'You', graduationYear: 2024, degree: 1 },
  { id: '7', name: 'Grace Lee', email: 'grace@example.com', referredBy: 'David Miller', graduationYear: 2022, degree: 3 },
  { id: '8', name: 'Henry Garcia', email: 'henry@example.com', referredBy: 'Emma Davis', graduationYear: 2023, degree: 4 },
  { id: '9', name: 'Isabel Chen', email: 'isabel@example.com', referredBy: 'Frank Wilson', graduationYear: 2024, degree: 2 },
  { id: '10', name: 'Jack Thompson', email: 'jack@example.com', referredBy: 'Grace Lee', graduationYear: 2022, degree: 4 },
  { id: '11', name: 'Karen Martinez', email: 'karen@example.com', referredBy: 'You', graduationYear: 2023, degree: 1 },
]

// Define network connections
const networkConnections = [
  ['you', '1'], ['you', '2'], ['you', '6'], ['you', '11'],
  ['1', '3'], ['2', '4'], ['3', '5'], ['4', '7'],
  ['5', '8'], ['6', '9'], ['7', '10'], ['8', '10'],
  ['9', '11'], ['3', '4'], ['5', '7'], ['6', '8'],
  ['1', '4'], ['2', '6'], ['3', '7'], ['4', '9'],
  ['5', '10'], ['7', '8'], ['9', '10'], ['11', '1'],
]

function DashboardContent() {
  const [connections] = useState(initialConnections)
  const [posts, setPosts] = useState([
    { id: 1, author: 'Alice Johnson', content: 'Excited to connect with everyone!', degree: 1 },
    { id: 2, author: 'Bob Smith', content: 'Great network we\'re building here!', degree: 1 },
    { id: 3, author: 'Charlie Brown', content: 'Thanks for the connection, Alice!', degree: 2 },
  ])

  const [newPost, setNewPost] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [selectedUser, setSelectedUser] = useState(null)

  // Create initial nodes with circular layout
  const initialNodes = connections.map((conn, index) => ({
    id: conn.id,
    position: generateCircularPosition(index, connections.length),
    data: { 
      label: conn.name,
      isYou: conn.id === 'you'
    },
    type: 'custom'
  }))

  // Create initial edges from networkConnections
  const initialEdges = networkConnections.map(([ source, target ], index) => ({
    id: `e-${source}-${target}`,
    source,
    target,
    type: 'straight',
    style: { stroke: '#888', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#888',
    },
  }))

  const [nodes] = useNodesState(initialNodes)
  const [edges] = useEdgesState(initialEdges)

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
        nodeTypes={{ custom: CustomNode }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        fitView
        className="w-full h-full"
      >
        <Controls 
          showInteractive={false}
        />
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