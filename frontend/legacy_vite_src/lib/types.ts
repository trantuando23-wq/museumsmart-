export interface Artifact {
  id: number
  code: string
  name: string
  description: string
  detailed_story?: string
  era: string
  year: number
  category: string
  location: string
  room_code: string
  node_id: string
  material?: string
  dimensions?: string
  image_url: string
  is_featured: boolean
  suggested_questions: string[]
  model_type?: string
}

export interface MapNode {
  id: string
  name: string
  x: number
  y: number
  type: 'entrance' | 'room' | 'waypoint' | 'artifact'
  code?: string
  room_code?: string
}

export interface MapEdge {
  from: string
  to: string
  distance?: number
}

export interface RouteResult {
  nodes: MapNode[]
  totalDistance: number
  steps: string[]
}

export interface ChatSource {
  code: string
  name: string
  era: string
  room_code: string
}

export interface ChatResponse {
  answer: string
  sources: ChatSource[]
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  isStreaming?: boolean
  timestamp: string
}
