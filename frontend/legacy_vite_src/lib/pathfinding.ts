import { MapNode, MapEdge, RouteResult } from './types'

// Sơ đồ các nút mốc trên bản đồ Isometric (Tọa độ trên khung SVG 1400x1000)
export const MUSEUM_NODES: Record<string, MapNode> = {
  // === Cổng vào và khu đón tiếp ===
  N_ENTRANCE: { id: 'N_ENTRANCE', name: 'Cổng Vào Chính', x: 700, y: 870, type: 'entrance' },
  N_TICKET: { id: 'N_TICKET', name: 'Quầy Bán Vé & Đón Tiếp', x: 560, y: 810, type: 'waypoint' },
  N_INFO: { id: 'N_INFO', name: 'Quầy Thông Tin Du Khách', x: 840, y: 810, type: 'waypoint' },

  // === Trục lối đi chính ===
  N_LOBBY: { id: 'N_LOBBY', name: 'Sảnh Trung Tâm', x: 700, y: 730, type: 'waypoint' },
  N_HALL_N: { id: 'N_HALL_N', name: 'Hành Lang Bắc', x: 700, y: 580, type: 'waypoint' },
  N_HALL_NW: { id: 'N_HALL_NW', name: 'Hành Lang Tây Bắc', x: 480, y: 480, type: 'waypoint' },
  N_HALL_NE: { id: 'N_HALL_NE', name: 'Hành Lang Đông Bắc', x: 920, y: 480, type: 'waypoint' },
  N_HALL_W: { id: 'N_HALL_W', name: 'Hành Lang Tây', x: 300, y: 580, type: 'waypoint' },
  N_HALL_E: { id: 'N_HALL_E', name: 'Hành Lang Đông', x: 1100, y: 580, type: 'waypoint' },
  N_JUNCTION_NW: { id: 'N_JUNCTION_NW', name: 'Ngã Tư Tây Bắc', x: 300, y: 380, type: 'waypoint' },
  N_JUNCTION_NE: { id: 'N_JUNCTION_NE', name: 'Ngã Tư Đông Bắc', x: 1100, y: 380, type: 'waypoint' },
  N_CENTER_TOP: { id: 'N_CENTER_TOP', name: 'Sân Thiên Đình', x: 700, y: 280, type: 'waypoint' },

  // === Vị trí các phòng trưng bày ===
  N_A1:  { id: 'N_A1',  name: 'Phòng A1: Trống đồng Đông Sơn',      x: 200, y: 250, type: 'artifact', code: 'A01', room_code: 'A1' },
  N_B2:  { id: 'N_B2',  name: 'Phòng B2: Ấn Vàng Triều Nguyễn',      x: 480, y: 280, type: 'artifact', code: 'A02', room_code: 'B2' },
  N_C1:  { id: 'N_C1',  name: 'Phòng C1: Tượng Quan Âm Bút Tháp',   x: 200, y: 460, type: 'artifact', code: 'A03', room_code: 'C1' },
  N_D3:  { id: 'N_D3',  name: 'Phòng D3: Bình Gốm Hoa Lam',         x: 920, y: 280, type: 'artifact', code: 'A04', room_code: 'D3' },
  N_B3:  { id: 'N_B3',  name: 'Phòng B3: Mũ Quan Triều Nguyễn',     x: 480, y: 620, type: 'artifact', code: 'A05', room_code: 'B3' },
  N_E1:  { id: 'N_E1',  name: 'Phòng E1: Kiếm Thuận Thiên',         x: 700, y: 160, type: 'artifact', code: 'A06', room_code: 'E1' },
  N_C2:  { id: 'N_C2',  name: 'Phòng C2: Chuông Thiên Mụ',          x: 200, y: 360, type: 'artifact', code: 'A07', room_code: 'C2' },
  N_B2b: { id: 'N_B2b', name: 'Phòng B2B: Ngọc Ấn Hoàng Đế',       x: 580, y: 330, type: 'artifact', code: 'A08', room_code: 'B2' },
  N_F1:  { id: 'N_F1',  name: 'Phòng F1: Tượng Chăm Pa Apsara',     x: 1200, y: 300, type: 'artifact', code: 'A09', room_code: 'F1' },
  N_G1:  { id: 'N_G1',  name: 'Phòng G1: Rồng Đất Nung Thăng Long', x: 1200, y: 450, type: 'artifact', code: 'A10', room_code: 'G1' },
}

// Mạng lưới lối đi kết nối (hai chiều)
export const MUSEUM_EDGES: MapEdge[] = [
  // Từ cổng vào sảnh chính
  { from: 'N_ENTRANCE', to: 'N_TICKET' },
  { from: 'N_ENTRANCE', to: 'N_INFO' },
  { from: 'N_TICKET',   to: 'N_LOBBY' },
  { from: 'N_INFO',     to: 'N_LOBBY' },
  { from: 'N_ENTRANCE', to: 'N_LOBBY' },

  // Trục dọc chính
  { from: 'N_LOBBY',    to: 'N_HALL_N' },
  { from: 'N_HALL_N',   to: 'N_CENTER_TOP' },
  { from: 'N_CENTER_TOP', to: 'N_E1' },
  { from: 'N_CENTER_TOP', to: 'N_B2' },
  { from: 'N_CENTER_TOP', to: 'N_D3' },

  // Hành lang Tây
  { from: 'N_LOBBY',       to: 'N_HALL_W' },
  { from: 'N_HALL_W',      to: 'N_JUNCTION_NW' },
  { from: 'N_JUNCTION_NW', to: 'N_C2' },
  { from: 'N_JUNCTION_NW', to: 'N_A1' },
  { from: 'N_C1',          to: 'N_HALL_W' },
  { from: 'N_JUNCTION_NW', to: 'N_C1' },

  // Hành lang Đông
  { from: 'N_LOBBY',       to: 'N_HALL_E' },
  { from: 'N_HALL_E',      to: 'N_JUNCTION_NE' },
  { from: 'N_JUNCTION_NE', to: 'N_F1' },
  { from: 'N_JUNCTION_NE', to: 'N_G1' },
  { from: 'N_JUNCTION_NE', to: 'N_D3' },

  // Hành lang Tây Bắc
  { from: 'N_HALL_N',   to: 'N_HALL_NW' },
  { from: 'N_HALL_NW',  to: 'N_B2' },
  { from: 'N_HALL_NW',  to: 'N_B2b' },
  { from: 'N_HALL_NW',  to: 'N_JUNCTION_NW' },

  // Hành lang Đông Bắc
  { from: 'N_HALL_N',   to: 'N_HALL_NE' },
  { from: 'N_HALL_NE',  to: 'N_D3' },
  { from: 'N_HALL_NE',  to: 'N_JUNCTION_NE' },

  // Phòng B3 gần sảnh
  { from: 'N_LOBBY',    to: 'N_B3' },
  { from: 'N_HALL_NW',  to: 'N_B3' },

  // B2 nối B2b
  { from: 'N_B2',  to: 'N_B2b' },
]

function euclideanDistance(a: MapNode, b: MapNode): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Thuật toán A* tìm đường đi tối ưu trong đồ thị không gian bảo tàng.
 */
export function findPathAStar(
  startId: string,
  targetId: string,
  nodes: Record<string, MapNode> = MUSEUM_NODES,
  edges: MapEdge[] = MUSEUM_EDGES
): RouteResult | null {
  const startNode = nodes[startId]
  const targetNode = nodes[targetId]

  if (!startNode || !targetNode) {
    return null
  }

  if (startId === targetId) {
    return {
      nodes: [startNode],
      totalDistance: 0,
      steps: [`Bạn đã ở ngay tại ${startNode.name}`],
    }
  }

  const adj: Record<string, string[]> = {}
  Object.keys(nodes).forEach((id) => (adj[id] = []))

  edges.forEach(({ from, to }) => {
    if (adj[from] && adj[to]) {
      adj[from].push(to)
      adj[to].push(from)
    }
  })

  const openSet: Set<string> = new Set([startId])
  const cameFrom: Record<string, string> = {}

  const gScore: Record<string, number> = {}
  const fScore: Record<string, number> = {}

  Object.keys(nodes).forEach((id) => {
    gScore[id] = Infinity
    fScore[id] = Infinity
  })

  gScore[startId] = 0
  fScore[startId] = euclideanDistance(startNode, targetNode)

  while (openSet.size > 0) {
    let currentId = ''
    let lowestF = Infinity
    openSet.forEach((id) => {
      if (fScore[id] < lowestF) {
        lowestF = fScore[id]
        currentId = id
      }
    })

    if (currentId === targetId) {
      const pathNodes: MapNode[] = []
      let curr = currentId
      while (curr) {
        pathNodes.unshift(nodes[curr])
        curr = cameFrom[curr]
      }

      const steps: string[] = []
      for (let i = 0; i < pathNodes.length - 1; i++) {
        const from = pathNodes[i]
        const to = pathNodes[i + 1]
        steps.push(`Từ ${from.name} → ${to.name}`)
      }

      return {
        nodes: pathNodes,
        totalDistance: Math.round(gScore[targetId] / 8),
        steps,
      }
    }

    openSet.delete(currentId)
    const neighbors = adj[currentId] || []

    for (const neighborId of neighbors) {
      const neighborNode = nodes[neighborId]
      const tentativeG = gScore[currentId] + euclideanDistance(nodes[currentId], neighborNode)

      if (tentativeG < gScore[neighborId]) {
        cameFrom[neighborId] = currentId
        gScore[neighborId] = tentativeG
        fScore[neighborId] = tentativeG + euclideanDistance(neighborNode, targetNode)
        openSet.add(neighborId)
      }
    }
  }

  return null
}
