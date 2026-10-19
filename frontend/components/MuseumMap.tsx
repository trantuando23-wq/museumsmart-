'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import {
  MUSEUM_ROOMS,
  MUSEUM_ARTIFACTS,
  MUSEUM_FACILITIES,
  MUSEUM_GRAPH_NODES,
  RoomZone,
  Artifact3D,
  AmenityFacility,
  calculateShortestPath,
} from '@/data/museumData'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Footprints,
  Layers,
  Sparkles,
  Eye,
} from 'lucide-react'

interface MuseumMapProps {
  selectedArtifact: Artifact3D | null
  activeRouteTarget: Artifact3D | AmenityFacility | null
  onSelectArtifact: (artifact: Artifact3D) => void
  onSelectRoom: (room: RoomZone) => void
  onSelectAmenity?: (amenity: AmenityFacility) => void
  language: 'VI' | 'EN'
}

/* =========================================================================
   TEXTURE GENERATORS
   ========================================================================= */

// 1. SÀN GỖ SÁNG SỒI (LIGHT SCANDINAVIAN OAK PARQUET)
function createLightWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#eddcc4'
  ctx.fillRect(0, 0, 512, 512)

  const plankHeight = 32
  const numPlanks = 512 / plankHeight
  const plankTones = ['#f4e5cf', '#ecd7be', '#e7cfb0', '#ebd9c3', '#f0dfc9', '#e4c9a8']

  for (let i = 0; i < numPlanks; i++) {
    const y = i * plankHeight
    const tone = plankTones[i % plankTones.length]
    ctx.fillStyle = tone
    ctx.fillRect(0, y, 512, plankHeight - 1)

    ctx.strokeStyle = '#c4ae93'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, y + plankHeight)
    ctx.lineTo(512, y + plankHeight)
    ctx.stroke()

    const offset = (i % 3) * 160
    for (let x = offset; x < 512; x += 170) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + plankHeight)
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(5, 5)
  return texture
}

// 2. SÀN GẠCH MEN TRẮNG WC (WHITE TILES)
function createRestroomTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, 256, 256)
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2

  const tileSize = 32
  for (let x = 0; x <= 256; x += tileSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 256)
    ctx.stroke()
  }
  for (let y = 0; y <= 256; y += tileSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(256, y)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  return texture
}

// 3. SÀN ĐÁ TERRAZZO CAFÉ (GREY TERRAZZO)
function createCafeFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(0, 0, 256, 256)
  const fleckColors = ['#f8fafc', '#64748b', '#cbd5e1', '#475569', '#e2e8f0']
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = fleckColors[i % fleckColors.length]
    ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 3 + 1, Math.random() * 3 + 1)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  return texture
}

// 4. TƯỜNG GẠCH CỔ ĐỎ (TERRACOTTA BRICK)
function createBrickCutawayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#dcd5c9'
  ctx.fillRect(0, 0, 256, 256)

  const brickH = 16
  const brickW = 36
  const brickShades = ['#9e3c1b', '#b04924', '#8c3315', '#a4421f', '#b8542f', '#7d2a10']

  let row = 0
  for (let y = 1; y < 256; y += brickH + 2) {
    const isOdd = row % 2 === 1
    const startX = isOdd ? -(brickW / 2) : 0
    for (let x = startX; x < 256; x += brickW + 2) {
      ctx.fillStyle = brickShades[(row * 7 + Math.floor(x / 30)) % brickShades.length]
      ctx.fillRect(x + 1, y, brickW, brickH)
    }
    row++
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 1)
  return texture
}

// 4b. SÀN SẢNH ĐÓN TIẾP & BÁN VÉ (POLISHED IVORY TERRAZZO & BRASS INLAYS)
function createLobbyFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, 512, 512)

  // Hạt thạch anh & đá cẩm thạch ngà sang trọng
  const flecks = ['#e2e8f0', '#cbd5e1', '#f1f5f9', '#ede9fe', '#fef3c7']
  for (let i = 0; i < 700; i++) {
    ctx.fillStyle = flecks[i % flecks.length]
    ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 3 + 1, Math.random() * 3 + 1)
  }

  // Đường ron chỉ đồng vàng (brass inlay grid) phân ô sảnh lớn
  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 2
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 512)
    ctx.stroke()
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}


// 5. TRANH TREO TƯỜNG GALLERY
function createFramedArtTexture(styleIdx: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 320
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#1e1e24'
  ctx.fillRect(0, 0, 256, 320)
  ctx.fillStyle = '#faf8f5'
  ctx.fillRect(14, 14, 228, 292)

  if (styleIdx === 0) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(28, 28, 200, 264)
    ctx.fillStyle = '#dc2626'
    ctx.fillRect(28, 28, 110, 110)
    ctx.fillStyle = '#2563eb'
    ctx.fillRect(150, 190, 78, 102)
    ctx.fillStyle = '#facc15'
    ctx.fillRect(28, 220, 60, 72)
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(138, 28, 8, 264)
    ctx.fillRect(28, 138, 200, 8)
  } else if (styleIdx === 1) {
    const grad = ctx.createLinearGradient(28, 28, 228, 292)
    grad.addColorStop(0, '#f43f5e')
    grad.addColorStop(1, '#8b5cf6')
    ctx.fillStyle = grad
    ctx.fillRect(28, 28, 200, 264)
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(128, 140, 50, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 22px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('ĐÔNG SƠN', 128, 230)
  } else {
    ctx.fillStyle = '#78350f'
    ctx.fillRect(28, 28, 200, 264)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 4
    ctx.strokeRect(38, 38, 180, 244)
    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 36px serif'
    ctx.textAlign = 'center'
    ctx.fillText('ĐẠI NAM', 128, 150)
  }

  return new THREE.CanvasTexture(canvas)
}

// 6. BIỂN HIỆU TIỆN ÍCH DẠ QUANG
function createSignTexture(text: string, icon: string, bgColor: string, fgColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = bgColor
  ctx.roundRect(4, 4, 504, 152, 24)
  ctx.fill()
  ctx.strokeStyle = fgColor
  ctx.lineWidth = 6
  ctx.roundRect(8, 8, 496, 144, 20)
  ctx.stroke()

  ctx.fillStyle = fgColor
  ctx.font = 'bold 44px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${icon} ${text}`, 256, 80)

  return new THREE.CanvasTexture(canvas)
}

// 7. NHÂN VẬT SILHOUETTE KIẾN TRÚC
function createSilhouetteSpriteTexture(pose: 'viewing' | 'walking'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, 128, 256)
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 3

  if (pose === 'viewing') {
    ctx.beginPath()
    ctx.arc(64, 40, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(56, 56)
    ctx.lineTo(44, 130)
    ctx.lineTo(84, 130)
    ctx.lineTo(72, 56)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.rect(48, 130, 12, 105)
    ctx.rect(68, 130, 12, 105)
    ctx.fill()
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.arc(60, 42, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(54, 58)
    ctx.lineTo(46, 132)
    ctx.lineTo(80, 130)
    ctx.lineTo(70, 58)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(52, 132)
    ctx.lineTo(36, 235)
    ctx.lineTo(48, 235)
    ctx.lineTo(62, 132)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(70, 132)
    ctx.lineTo(88, 230)
    ctx.lineTo(98, 230)
    ctx.lineTo(78, 132)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  return new THREE.CanvasTexture(canvas)
}

export const MuseumMap: React.FC<MuseumMapProps> = ({
  selectedArtifact,
  activeRouteTarget,
  onSelectArtifact,
  onSelectRoom,
  onSelectAmenity,
  language,
}) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<'isometric' | 'top_down'>('isometric')
  const [activeFilter, setActiveFilter] = useState<'all' | 'artifacts' | 'amenities'>('all')

  const [hoveredItemName, setHoveredItemName] = useState<string | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const interactiveArtifactsRef = useRef<{ mesh: THREE.Object3D; artifact: Artifact3D }[]>([])
  const interactiveAmenitiesRef = useRef<{ mesh: THREE.Object3D; facility: AmenityFacility }[]>([])
  const roomPlatesRef = useRef<{ mesh: THREE.Mesh; room: RoomZone }[]>([])
  const userPinRef = useRef<THREE.Group | null>(null)

  const startNode = MUSEUM_GRAPH_NODES['NODE_ENTRANCE']

  const targetNodeId = activeRouteTarget
    ? activeRouteTarget.nodeId
    : selectedArtifact
    ? selectedArtifact.nodeId
    : null

  const pathResult = useMemo(() => {
    return targetNodeId ? calculateShortestPath('NODE_ENTRANCE', targetNodeId) : null
  }, [targetNodeId])

  const to3DCoords = (x: number, y: number): [number, number] => {
    const worldX = (x - 600) / 10
    const worldZ = (y - 500) / 10
    return [worldX, worldZ]
  }

  // =========================================================================
  // SETUP THREE.JS ISOMETRIC CUTAWAY SCENE
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 1000
    const height = container.clientHeight || 700

    // 1. Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x0e131f)

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.5, 600)
    cameraRef.current = camera

    if (viewMode === 'isometric') {
      camera.position.set(-65, 82, 90)
      camera.lookAt(2, -2, 4)
    } else {
      camera.position.set(0, 140, 10)
      camera.lookAt(0, 0, 0)
    }

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    rendererRef.current = renderer
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.4)
    scene.add(ambientLight)

    const mainSun = new THREE.DirectionalLight(0xfffbeb, 2.3)
    mainSun.position.set(50, 95, 60)
    mainSun.castShadow = true
    mainSun.shadow.mapSize.width = 2048
    mainSun.shadow.mapSize.height = 2048
    mainSun.shadow.bias = -0.0005
    scene.add(mainSun)

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.6)
    fillLight.position.set(-60, 40, -50)
    scene.add(fillLight)

    // 5. Materials
    const woodFloorTexture = createLightWoodFloorTexture()
    const brickCutawayTexture = createBrickCutawayTexture()
    const wcTileTexture = createRestroomTileTexture()
    const cafeFloorTexture = createCafeFloorTexture()
    const lobbyFloorTexture = createLobbyFloorTexture()

    const floorWoodMaterial = new THREE.MeshStandardMaterial({
      map: woodFloorTexture,
      roughness: 0.35,
      metalness: 0.05,
    })

    const lobbyFloorMaterial = new THREE.MeshStandardMaterial({
      map: lobbyFloorTexture,
      roughness: 0.22,
      metalness: 0.12,
    })

    const selectedFloorMaterial = new THREE.MeshStandardMaterial({
      map: woodFloorTexture,
      color: 0xffedd5,
      roughness: 0.25,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
    })

    const galleryWallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.8,
      metalness: 0.05,
    })

    const brickCutawayMaterial = new THREE.MeshStandardMaterial({
      map: brickCutawayTexture,
      roughness: 0.85,
      metalness: 0.05,
    })

    const capWallMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
    })

    const plinthMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.2,
      metalness: 0.1,
    })

    const selectedPlinthMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.4,
    })

    const vitrineGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
    })

    // 6. KHỐI ĐẾ KIẾN TRÚC & VỈA HÈ CÂY XANH
    const basePodium = new THREE.Mesh(
      new THREE.BoxGeometry(130, 2.0, 110),
      new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 })
    )
    basePodium.position.set(0, -1.2, 5)
    basePodium.receiveShadow = true
    scene.add(basePodium)

    const frontBoulevard = new THREE.Mesh(
      new THREE.BoxGeometry(125, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.7 })
    )
    frontBoulevard.position.set(0, 0, 52)
    frontBoulevard.receiveShadow = true
    scene.add(frontBoulevard)

    for (let x = -48; x <= 48; x += 16) {
      const planter = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.4, 1.2, 16),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
      )
      planter.position.set(x, 0.6, 52)
      planter.castShadow = true
      scene.add(planter)

      const foliage = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.8),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 })
      )
      foliage.position.set(x, 2.2, 52)
      foliage.castShadow = true
      scene.add(foliage)
    }

    // =========================================================================
    // 7. SÀN NHÀ: PHỦ HẾT KHU VỰC MÀU ĐỎ; BỎ SÀN GỖ Ở KHU MÀU ĐEN (SẢNH & QUẦY VÉ)
    // =========================================================================
    // Người dùng yêu cầu:
    // 1. "chỗ màu đỏ phủ sàn hết đi" -> Phủ sàn toàn bộ hành lang bao quanh giếng trời (Bắc, Tây, Đông) và mặt tiền nối WC, Café.
    // 2. "chỗ màu đen bỏ phần sàn đi đây sẽ là phần sảnh" -> Bỏ sàn gỗ phòng trưng bày tại góc Đông Nam / lối vào, chuyển thành Sảnh đón tiếp chính.
    // 3. "chỗ màu xanh nước biển là quầy bán vé" -> Xây dựng Quầy bán vé & thông tin hiện đại tại đúng ô màu xanh.
    const whiteFloorGroup = new THREE.Group()

    // --- CÁNH TÂY: TOÀN BỘ CÁC GIAN TRƯNG BÀY TÂY (A1, C1, C2, B2, B2B) ---
    // Từ X: -54 đến -14, Z: -17 đến 38
    const floorWestWing = new THREE.Mesh(new THREE.BoxGeometry(40, 0.3, 55), floorWoodMaterial)
    floorWestWing.position.set(-34, 0.11, 10.5)
    floorWestWing.receiveShadow = true
    whiteFloorGroup.add(floorWestWing)

    // --- KHU VỰC MÀU ĐỎ: PHỦ SÀN HẾT HOÀN TOÀN CÁC HÀNH LANG NỐI XUNG QUANH GIẾNG TRỜI ---
    // 1. Hành lang Bắc rộng mở (nối WC, Gian Lam Sơn E1, và Cafe): từ X: -54 đến 54, Z: -38 đến -17 (không còn khe hở đen)
    const floorNorthCorridor = new THREE.Mesh(new THREE.BoxGeometry(108, 0.3, 21), floorWoodMaterial)
    floorNorthCorridor.position.set(0, 0.11, -27.5)
    floorNorthCorridor.receiveShadow = true
    whiteFloorGroup.add(floorNorthCorridor)

    // 2. Hành lang nhánh Tây ven thảm cỏ giếng trời: từ X: -19 đến -13, Z: -23 đến 0 (lấp kín ô trống đen bên trái giếng trời)
    const floorCourtyardWest = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 23), floorWoodMaterial)
    floorCourtyardWest.position.set(-16, 0.11, -11.5)
    floorCourtyardWest.receiveShadow = true
    whiteFloorGroup.add(floorCourtyardWest)

    // 3. Hành lang nhánh Đông ven thảm cỏ giếng trời: từ X: 13 đến 19, Z: -23 đến 0 (lấp kín ô trống đen bên phải giếng trời)
    const floorCourtyardEast = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 23), floorWoodMaterial)
    floorCourtyardEast.position.set(16, 0.11, -11.5)
    floorCourtyardEast.receiveShadow = true
    whiteFloorGroup.add(floorCourtyardEast)

    // 4. Hành lang trung tâm phía sau Sảnh Bát Giác: từ X: -14 đến 14, Z: 0 đến 18
    const floorCenterNorth = new THREE.Mesh(new THREE.BoxGeometry(28, 0.3, 18), floorWoodMaterial)
    floorCenterNorth.position.set(0, 0.11, 9)
    floorCenterNorth.receiveShadow = true
    whiteFloorGroup.add(floorCenterNorth)

    // --- CÁNH ĐÔNG: CÁC GIAN TRƯNG BÀY PHÍA ĐÔNG (F1, D3, G1) VẪN CÓ SÀN GỖ ---
    // Gian trưng bày phía Đông: từ X: 32 đến 54, Z: -17 đến 38
    const floorEastWingGalleries = new THREE.Mesh(new THREE.BoxGeometry(22, 0.3, 55), floorWoodMaterial)
    floorEastWingGalleries.position.set(43, 0.11, 10.5)
    floorEastWingGalleries.receiveShadow = true
    whiteFloorGroup.add(floorEastWingGalleries)

    // Hành lang Đông Bắc nối lên Café: từ X: 14 đến 32, Z: -17 đến 20
    const floorEastCorridorNorth = new THREE.Mesh(new THREE.BoxGeometry(18, 0.3, 37), floorWoodMaterial)
    floorEastCorridorNorth.position.set(23, 0.11, 1.5)
    floorEastCorridorNorth.receiveShadow = true
    whiteFloorGroup.add(floorEastCorridorNorth)

    scene.add(whiteFloorGroup)

    // =========================================================================
    // 7b. KHU VỰC MÀU ĐEN: BỎ SÀN GỖ VÀ LÀM SẢNH ĐÓN TIẾP & QUẦY VÉ (CHỖ MÀU XANH NƯỚC BIỂN)
    // =========================================================================
    // Khu vực màu đen là sảnh đón tiếp chính cửa Nam (X: -8 đến 32, Z: 20 đến 38)
    const grandLobbyGroup = new THREE.Group()

    // Sàn đá cẩm thạch ngà & chỉ đồng vàng sang trọng phân biệt rõ rệt với sàn gỗ phòng trưng bày
    const grandLobbyFloor = new THREE.Mesh(
      new THREE.BoxGeometry(38, 0.32, 16),
      lobbyFloorMaterial
    )
    grandLobbyFloor.position.set(12, 0.12, 29)
    grandLobbyFloor.receiveShadow = true
    grandLobbyGroup.add(grandLobbyFloor)

    // Thảm chào đón nhung đỏ trang trọng ngay sau cửa trượt
    const welcomeRug = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 0.05, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 })
    )
    welcomeRug.position.set(0, 0.29, 32.5)
    grandLobbyGroup.add(welcomeRug)

    // Dải chỉ vàng định hướng phân luồng từ cửa vào Quầy Vé
    const guideLine = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.02, 0.4),
      new THREE.MeshBasicMaterial({ color: 0xd4af37 })
    )
    guideLine.position.set(10, 0.29, 32.5)
    grandLobbyGroup.add(guideLine)

    // --- CHỖ MÀU XANH NƯỚC BIỂN: QUẦY BÁN VÉ & THÔNG TIN HƯỚNG DẪN DU KHÁCH ---
    const ticketFacility = MUSEUM_FACILITIES.find((f) => f.code === 'TICKET-1') || MUSEUM_FACILITIES[0]
    const ticketCounterGroup = new THREE.Group()
    ticketCounterGroup.position.set(23, 0, 27)

    // Khối thân quầy ốp lam gỗ sồi sang trọng
    const counterBase = new THREE.Mesh(
      new THREE.BoxGeometry(8.5, 1.25, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 })
    )
    counterBase.position.set(0, 0.63, 0)
    counterBase.castShadow = true
    counterBase.receiveShadow = true
    counterBase.userData = { facility: ticketFacility }
    ticketCounterGroup.add(counterBase)

    // Mặt bàn đá Calacatta cẩm thạch trắng viền vàng
    const counterTop = new THREE.Mesh(
      new THREE.BoxGeometry(9.0, 0.12, 2.3),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 })
    )
    counterTop.position.set(0, 1.3, 0)
    counterTop.castShadow = true
    ticketCounterGroup.add(counterTop)

    // 3 vách kính quầy vé trong suốt ngăn dịch vụ có khe giao dịch & mic
    for (let i = -1; i <= 1; i++) {
      const glassPane = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 1.2, 0.08),
        new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, roughness: 0.05 })
      )
      glassPane.position.set(i * 2.7, 1.95, -0.2)
      ticketCounterGroup.add(glassPane)

      // Khe vé inox ở chân kính
      const ticketSlot = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.08, 0.15),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
      )
      ticketSlot.position.set(i * 2.7, 1.38, -0.2)
      ticketCounterGroup.add(ticketSlot)

      // Màn hình máy tính POS bán vé cảm ứng
      const posMonitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.5, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
      )
      posMonitor.position.set(i * 2.7, 1.6, 0.4)
      ticketCounterGroup.add(posMonitor)

      const posScreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.64, 0.44, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      )
      posScreen.position.set(i * 2.7, 1.6, 0.46)
      ticketCounterGroup.add(posScreen)

      // Ghế nhân viên trực quầy vé
      const staffStool = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.75, 16),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
      )
      staffStool.position.set(i * 2.7, 0.38, 0.9)
      ticketCounterGroup.add(staffStool)
    }

    // Biển hiệu 3D phát sáng "QUẦY BÁN VÉ • TICKETING & INFORMATION"
    const ticketSignTex = createSignTexture('QUẦY BÁN VÉ • TICKET & INFO', '🎟️', '#0f172a', '#f59e0b')
    const ticketSign = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 1.3),
      new THREE.MeshBasicMaterial({ map: ticketSignTex, transparent: true })
    )
    ticketSign.position.set(0, 3.2, -0.2)
    ticketCounterGroup.add(ticketSign)

    // Cột phân luồng dây nhung đỏ inox (Queue Stanchions) sang trọng
    for (let qx = -3.6; qx <= 3.6; qx += 2.4) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.18, 1.1, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 })
      )
      pole.position.set(qx, 0.55, -2.4)
      pole.castShadow = true
      ticketCounterGroup.add(pole)

      const topper = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 })
      )
      topper.position.set(qx, 1.15, -2.4)
      ticketCounterGroup.add(topper)
    }

    // Dây nhung đỏ nối giữa các cột
    const velvetRope1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 2.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.7 })
    )
    velvetRope1.rotation.z = Math.PI / 2
    velvetRope1.position.set(-2.4, 0.95, -2.4)
    ticketCounterGroup.add(velvetRope1)

    const velvetRope2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 2.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.7 })
    )
    velvetRope2.rotation.z = Math.PI / 2
    velvetRope2.position.set(2.4, 0.95, -2.4)
    ticketCounterGroup.add(velvetRope2)

    // Giá để sơ đồ brochure hướng dẫn tham quan bảo tàng
    const brochureStand = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.3, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 })
    )
    brochureStand.position.set(-5.2, 0.65, -1.0)
    ticketCounterGroup.add(brochureStand)

    const brochurePapers = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.3, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
    )
    brochurePapers.position.set(-5.2, 1.35, -1.0)
    ticketCounterGroup.add(brochurePapers)

    grandLobbyGroup.add(ticketCounterGroup)
    scene.add(grandLobbyGroup)
    interactiveAmenitiesRef.current.push({ mesh: counterBase, facility: ticketFacility })

    // =========================================================================
    // 8. DÃY TƯỜNG CẮT THẤP MÀU CAM BÊN TRÁI: DÃY HOÀN CHỈNH KHÔNG NGẮT QUÃNG
    // =========================================================================
    // Người dùng yêu cầu: "ở chỗ chấm màu cam bên trái bạn làm thành 1 dãy hoàn chỉnh đừng ngắt quãng"
    const continuousWallGroup = new THREE.Group()
    const cutWallH = 1.3
    const cutWallThick = 0.7

    // Đoạn 1: Tường trước mặt tiền phía Nam chạy dài liên tục từ X = -54 đến X = 54 (Z = 38)
    const southContinuousWall = new THREE.Mesh(
      new THREE.BoxGeometry(108, cutWallH, cutWallThick),
      brickCutawayMaterial
    )
    southContinuousWall.position.set(0, cutWallH / 2 + 0.1, 38)
    southContinuousWall.castShadow = true
    southContinuousWall.receiveShadow = true
    continuousWallGroup.add(southContinuousWall)

    const southCap = new THREE.Mesh(
      new THREE.BoxGeometry(108.2, 0.15, cutWallThick + 0.15),
      capWallMaterial
    )
    southCap.position.set(0, cutWallH + 0.15, 38)
    continuousWallGroup.add(southCap)

    // Đoạn 2: Tường hông phía Tây chạy dài liên tục từ Z = 38 ngược lên Z = -16 (X = -54)
    const westContinuousWall = new THREE.Mesh(
      new THREE.BoxGeometry(cutWallThick, cutWallH, 54),
      brickCutawayMaterial
    )
    westContinuousWall.position.set(-54, cutWallH / 2 + 0.1, 11)
    westContinuousWall.castShadow = true
    westContinuousWall.receiveShadow = true
    continuousWallGroup.add(westContinuousWall)

    const westCap = new THREE.Mesh(
      new THREE.BoxGeometry(cutWallThick + 0.15, 0.15, 54.2),
      capWallMaterial
    )
    westCap.position.set(-54, cutWallH + 0.15, 11)
    continuousWallGroup.add(westCap)

    scene.add(continuousWallGroup)

    // =========================================================================
    // 9. SẢNH BÁT GIÁC TRUNG TÂM & 2 CỘT 2 BÊN CỬA (CHỈ XÓA CỘT CHẮN TRƯỚC CỬA)
    // =========================================================================
    const rotundaGroup = new THREE.Group()
    const rotundaFloor = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 14, 0.38, 8),
      new THREE.MeshStandardMaterial({ color: 0xfaf5ef, roughness: 0.2, metalness: 0.15 })
    )
    rotundaFloor.position.set(0, 0.16, 18)
    rotundaFloor.receiveShadow = true
    rotundaGroup.add(rotundaFloor)

    const medallionRing = new THREE.Mesh(
      new THREE.RingGeometry(6, 7.5, 32),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, side: THREE.DoubleSide })
    )
    medallionRing.rotation.x = -Math.PI / 2
    medallionRing.position.set(0, 0.36, 18)
    rotundaGroup.add(medallionRing)

    // Các cột vòng tròn sảnh Bát Giác (chỉ bỏ cột ở chính giữa chắn cửa X: 0)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4
      const cx = Math.cos(angle) * 13.5
      const cz = 18 + Math.sin(angle) * 13.5

      // Người dùng: "thêm ở chỗ cửa ra vào thêm 2 cái cột 2 bên chỉ xóa cái cột chắn trước cửa thôi cái này tôi có vẽ trong hình"
      // Xóa cột chính giữa (cx gần 0 và cz > 25)
      if (Math.abs(cx) < 3 && cz > 25) continue

      const colMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.6, 7.5, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.2 })
      )
      colMesh.position.set(cx, 3.8, cz)
      colMesh.castShadow = true
      rotundaGroup.add(colMesh)
    }

    // THÊM 2 CỘT 2 BÊN CỬA RA VÀO NHƯ HÌNH VẼ CỦA BẠN (CỘT ĐỠ CỔNG VÒM ĐỐI XỨNG)
    for (let sideX of [-6.0, 6.0]) {
      const gateCol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.65, 7.5, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.2 })
      )
      gateCol.position.set(sideX, 3.8, 30.5)
      gateCol.castShadow = true
      rotundaGroup.add(gateCol)
    }

    const infoPodium = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7 })
    )
    infoPodium.position.set(0, 0.6, 18)
    infoPodium.castShadow = true
    rotundaGroup.add(infoPodium)

    scene.add(rotundaGroup)

    // =========================================================================
    // 10. SÂN VƯỜN GIẾNG TRỜI TRUNG TÂM (THẢM CỎ XANH & HỒ SEN ĐẸP MẮT)
    // =========================================================================
    const courtyard = new THREE.Mesh(
      new THREE.BoxGeometry(26, 0.2, 22),
      new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.85 })
    )
    courtyard.position.set(0, 0.1, -12)
    courtyard.receiveShadow = true
    scene.add(courtyard)

    const pond = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.25, 12),
      new THREE.MeshPhysicalMaterial({ color: 0x0284c7, roughness: 0.05, transmission: 0.8, ior: 1.33 })
    )
    pond.position.set(0, 0.16, -12)
    scene.add(pond)

    const courtyardGlass = new THREE.Mesh(
      new THREE.BoxGeometry(26.2, 2.8, 22.2),
      new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.1 })
    )
    courtyardGlass.position.set(0, 1.4, -12)
    scene.add(courtyardGlass)

    // =========================================================================
    // 11. BỐ TRÍ CÂY XANH Ở CÁC VỊ TRÍ CHẤM XANH LÁ CÂY (POTTED PLANTS)
    // =========================================================================
    // Người dùng yêu cầu: "bố trí thêm các cây xanh ở các vị trí chấm xanh lá cây"
    const greenDotPositions = [
      [-16, -12], // Chấm xanh hành lang Tây ven giếng trời
      [-16, 18],  // Chấm xanh góc nối Sảnh Bát Giác & Cánh Tây
      [16, 18],   // Chấm xanh góc nối Sảnh Bát Giác & Cánh Đông
      [-8, 31],   // Chấm xanh bên trái cửa vào chính
      [8, 31],    // Chấm xanh bên phải cửa vào chính
      [16, -12],  // Chấm xanh hành lang Đông ven giếng trời
    ]

    greenDotPositions.forEach(([gx, gz]) => {
      const plantGroup = new THREE.Group()
      plantGroup.position.set(gx, 0.2, gz)

      // Chậu sứ trắng trụ đứng cao cấp
      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.5, 1.4, 16),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
      )
      pot.position.y = 0.7
      pot.castShadow = true
      plantGroup.add(pot)

      // Cây bàng cảnh / monstera lá to xanh mướt
      const leaves = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.2),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 })
      )
      leaves.position.y = 1.9
      leaves.castShadow = true
      plantGroup.add(leaves)

      scene.add(plantGroup)
    })

    // =========================================================================
    // 12. DỰNG TỪNG PHÒNG TRƯNG BÀY
    // =========================================================================
    roomPlatesRef.current = []

    MUSEUM_ROOMS.forEach((room) => {
      const [wx, wz] = to3DCoords(room.centerX, room.centerY)
      const wWidth = room.width / 10
      const wHeight = room.height / 10
      const isSelected = selectedArtifact?.roomCode === room.code

      const rFloor = new THREE.Mesh(
        new THREE.BoxGeometry(wWidth, 0.32, wHeight),
        isSelected ? selectedFloorMaterial : floorWoodMaterial
      )
      rFloor.position.set(wx, 0.12, wz)
      rFloor.receiveShadow = true
      rFloor.userData = { room }
      scene.add(rFloor)
      roomPlatesRef.current.push({ mesh: rFloor, room })

      const edgeWire = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(wWidth, 0.34, wHeight)),
        new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 })
      )
      edgeWire.position.set(wx, 0.12, wz)
      scene.add(edgeWire)

      const fullWallH = 5.6
      const wallThick = 0.65

      // TƯỜNG BẮC CAO TREO TRANH
      if (room.wing === 'north' || room.y <= 360) {
        const northWall = new THREE.Mesh(
          new THREE.BoxGeometry(wWidth, fullWallH, wallThick),
          galleryWallMaterial
        )
        northWall.position.set(wx, fullWallH / 2 + 0.1, wz - wHeight / 2 + wallThick / 2)
        northWall.castShadow = true
        scene.add(northWall)

        for (let t = -1; t <= 1; t += 2) {
          const artTexture = createFramedArtTexture(Math.abs(room.name.length + t) % 3)
          const paintingMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(3.6, 4.4),
            new THREE.MeshStandardMaterial({ map: artTexture, roughness: 0.2 })
          )
          paintingMesh.position.set(wx + t * (wWidth / 4), 3.2, wz - wHeight / 2 + wallThick + 0.05)
          scene.add(paintingMesh)
        }
      }

      // TƯỜNG ĐÔNG
      if (room.wing === 'east' && room.x >= 920) {
        const eastWall = new THREE.Mesh(
          new THREE.BoxGeometry(wallThick, fullWallH, wHeight),
          galleryWallMaterial
        )
        eastWall.position.set(wx + wWidth / 2 - wallThick / 2, fullWallH / 2 + 0.1, wz)
        eastWall.castShadow = true
        scene.add(eastWall)

        const artTexture = createFramedArtTexture((room.name.length * 3) % 3)
        const paintingEast = new THREE.Mesh(
          new THREE.PlaneGeometry(3.6, 4.4),
          new THREE.MeshStandardMaterial({ map: artTexture, roughness: 0.2 })
        )
        paintingEast.rotation.y = -Math.PI / 2
        paintingEast.position.set(wx + wWidth / 2 - wallThick - 0.05, 3.2, wz)
        scene.add(paintingEast)
      }
    })

    // =========================================================================
    // 13. NÂNG CHIỀU CAO TỪ ĐẤT LÊN BỆ CỬA SỔ & CÂN ĐỐI 2 CỬA SỔ (CHỖ MÀU TÍM)
    // =========================================================================
    // Người dùng yêu cầu: "nâng cái chiều cao từ cửa sổ đến đất lên và đặt cái cửa sổ vào"
    const windowZPositions = [2.5, 21.5]
    windowZPositions.forEach((wz) => {
      const winGroup = new THREE.Group()
      winGroup.position.set(52, 0, wz)

      // Bệ tường từ đất lên cửa sổ nâng cao lên 1.5 mét (so với 0.8m trước đây)
      const sillMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 1.5, 3.6),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
      )
      sillMesh.position.y = 0.75
      winGroup.add(sillMesh)

      // Khung cửa sổ kính caro kiểu Pháp đặt phía trên bệ tường (từ 1.5m lên 4.8m)
      const windowGlass = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 3.3, 3.4),
        new THREE.MeshPhysicalMaterial({
          color: 0xbae6fd,
          transparent: true,
          opacity: 0.35,
          roughness: 0.05,
          transmission: 0.9,
          ior: 1.5,
        })
      )
      windowGlass.position.y = 3.15
      winGroup.add(windowGlass)

      // Khung nhôm đen caro
      const outerFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.2, 3.3, 3.4)),
        new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 3 })
      )
      outerFrame.position.y = 3.15
      winGroup.add(outerFrame)

      for (let gy of [2.3, 3.15, 4.0]) {
        const barH = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 3.4), new THREE.MeshStandardMaterial({ color: 0x0f172a }))
        barH.position.y = gy
        winGroup.add(barH)
      }
      for (let gz of [-0.85, 0.85]) {
        const barV = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.3, 0.06), new THREE.MeshStandardMaterial({ color: 0x0f172a }))
        barV.position.set(0, 3.15, gz)
        winGroup.add(barV)
      }

      scene.add(winGroup)
    })

    // =========================================================================
    // 14. CỬA TRƯỢT SIÊU THỊ TỰ ĐỘNG TẠI CỔNG VÀO (GIỮA 2 CỘT)
    // =========================================================================
    const supermarketDoorGroup = new THREE.Group()
    supermarketDoorGroup.position.set(0, 0, 31)

    // Ray trượt nhôm/inox treo
    const doorTrack = new THREE.Mesh(
      new THREE.BoxGeometry(10.5, 0.35, 0.3),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.2 })
    )
    doorTrack.position.set(0, 4.2, 0)
    supermarketDoorGroup.add(doorTrack)

    // Cảm biến chuyển động siêu thị ở giữa
    const motionSensor = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.25, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
    )
    motionSensor.position.set(0, 4.4, 0.1)
    supermarketDoorGroup.add(motionSensor)

    const sensorLed = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }))
    sensorLed.position.set(0, 4.35, 0.32)
    supermarketDoorGroup.add(sensorLed)

    // 2 vách kính cố định 2 bên
    const fixedGlassL = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.8, 0.08),
      new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, roughness: 0.05 })
    )
    fixedGlassL.position.set(-3.8, 2.0, 0)
    supermarketDoorGroup.add(fixedGlassL)

    const fixedGlassR = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.8, 0.08),
      new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, roughness: 0.05 })
    )
    fixedGlassR.position.set(3.8, 2.0, 0)
    supermarketDoorGroup.add(fixedGlassR)

    // 2 cánh kính trượt siêu thị mở hé đón khách
    const slidingGlassL = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 3.8, 0.08),
      new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, roughness: 0.05 })
    )
    slidingGlassL.position.set(-1.8, 2.0, 0.06)
    supermarketDoorGroup.add(slidingGlassL)

    const slidingGlassR = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 3.8, 0.08),
      new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.35, roughness: 0.05 })
    )
    slidingGlassR.position.set(1.8, 2.0, 0.06)
    supermarketDoorGroup.add(slidingGlassR)

    // Dải decal mờ an toàn siêu thị
    for (let stripeY of [1.6, 2.2]) {
      const decalL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }))
      decalL.position.set(-1.8, stripeY, 0.06)
      supermarketDoorGroup.add(decalL)

      const decalR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }))
      decalR.position.set(1.8, stripeY, 0.06)
      supermarketDoorGroup.add(decalR)
    }

    scene.add(supermarketDoorGroup)

    // =========================================================================
    // 15. TOÀN BỘ KHU MÀU ĐỎ: KHU VỆ SINH LỚN CHIA 2 KHU NAM & NỮ (CHIP MẪU 1)
    // =========================================================================
    // Người dùng yêu cầu:
    // - "toàn bộ khu màu đỏ là được dùng cho nhà vệ sinh chia ra 2 khu nam và nữ"
    // - "chỗ màu xanh lá cây bạn cắt ngang chỗ đó làm 1 cái lối đi"
    // Toàn bộ góc Tây Bắc (X: -52 đến -18, Z: -38 đến -16)
    const wcFacility = MUSEUM_FACILITIES.find((f) => f.code === 'WC-WEST') || MUSEUM_FACILITIES[2]
    const grandWcGroup = new THREE.Group()
    grandWcGroup.position.set(-35, 0, -27)

    // Sàn gạch men trắng vuông kẻ ron phủ trọn vẹn toàn bộ khu màu đỏ
    const wcFloorSlab = new THREE.Mesh(
      new THREE.BoxGeometry(32, 0.3, 20),
      new THREE.MeshStandardMaterial({ map: wcTileTexture, roughness: 0.25 })
    )
    wcFloorSlab.position.set(0, 0.15, 0)
    wcFloorSlab.receiveShadow = true
    grandWcGroup.add(wcFloorSlab)

    // TƯỜNG NGĂN CHIA ĐÔI: Chỉ chạy từ Z = -9.8 đến Z = 2.0 để CHỪA LẠI LỐI ĐI CẮT NGANG TẠI CHỖ MÀU XANH LÁ
    const midWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 4.0, 11.8),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    )
    midWall.position.set(0, 2.0, -3.9)
    grandWcGroup.add(midWall)

    // Tường hậu
    const backWallWc = new THREE.Mesh(
      new THREE.BoxGeometry(32, 4.0, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 })
    )
    backWallWc.position.set(0, 2.0, -9.8)
    grandWcGroup.add(backWallWc)

    // --- CHỖ MÀU XANH LÁ CÂY: CẮT NGANG LÀM LỐI ĐI THÔNG SUỐT RỘNG RÃI (LỐI VÀO WC) ---
    // Hành lang lối đi thông suốt chạy ngang từ Tây sang Đông (local Z: 3.5 đến 9.5)
    const walkwayAisle = new THREE.Mesh(
      new THREE.BoxGeometry(31.6, 0.04, 6.0),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 })
    )
    walkwayAisle.position.set(0, 0.32, 6.5)
    walkwayAisle.receiveShadow = true
    grandWcGroup.add(walkwayAisle)

    // Dải đèn LED chỉ dẫn âm sàn chạy dài theo lối đi màu xanh lá
    const floorLedGuide = new THREE.Mesh(
      new THREE.BoxGeometry(31.6, 0.02, 0.15),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    )
    floorLedGuide.position.set(0, 0.35, 3.6)
    grandWcGroup.add(floorLedGuide)

    // Biển chỉ dẫn định hướng lối đi: Trái sang WC Nam, Phải sang WC Nữ
    const menSignTex = createSignTexture('LỐI VÀO WC NAM • GENTS', '🚹 ⬅', '#0f172a', '#38bdf8')
    const menSign = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.3), new THREE.MeshBasicMaterial({ map: menSignTex, transparent: true }))
    menSign.position.set(-8.0, 3.0, 3.5)
    grandWcGroup.add(menSign)

    const womenSignTex = createSignTexture('LỐI VÀO WC NỮ • LADIES', '➡ 🚺', '#831843', '#f472b6')
    const womenSign = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.3), new THREE.MeshBasicMaterial({ map: womenSignTex, transparent: true }))
    womenSign.position.set(8.0, 3.0, 3.5)
    grandWcGroup.add(womenSign)

    // --- PHÂN KHU NAM (BÊN TRÁI - GENTS WC 🚹) ---
    // Dãy 4 buồng vệ sinh nam có vách xám (chuẩn Mẫu 1)
    for (let i = 0; i < 4; i++) {
      const bx = -14.5 + i * 2.4
      const divider = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.8, 3.6), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }))
      divider.position.set(bx, 1.6, -7.0)
      grandWcGroup.add(divider)

      const sDoor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 0.08), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }))
      sDoor.position.set(bx + 1.2, 1.6, -5.2)
      grandWcGroup.add(sDoor)
    }

    // Dãy 5 bồn tiểu nam có vách ngăn lượn cong đầu (chuẩn Mẫu 1)
    for (let u = 0; u < 5; u++) {
      const uZ = -7.5 + u * 2.0
      const uDiv = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.08), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }))
      uDiv.position.set(-0.8, 1.2, uZ)
      grandWcGroup.add(uDiv)

      const urinal = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 0.5), new THREE.MeshStandardMaterial({ color: 0xffffff }))
      urinal.position.set(-0.6, 1.0, uZ + 1.0)
      grandWcGroup.add(urinal)
    }

    // Bàn lavabo chậu rửa âm bàn đặt nép tường Tây (không chắn lối đi)
    const vanityMen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 5.0), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }))
    vanityMen.position.set(-14.8, 1.1, -1.0)
    grandWcGroup.add(vanityMen)

    const mirrorMen = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 4.8), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, metalness: 0.95 }))
    mirrorMen.position.set(-15.8, 2.3, -1.0)
    grandWcGroup.add(mirrorMen)

    // --- PHÂN KHU NỮ (BÊN PHẢI - LADIES WC 🚺) ---
    // Dãy 6 buồng vệ sinh nữ riêng tư khép kín cao cấp
    for (let i = 0; i < 6; i++) {
      const gx = 1.5 + i * 2.3
      const dividerW = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.8, 3.8), new THREE.MeshStandardMaterial({ color: 0xf472b6 }))
      dividerW.position.set(gx, 1.6, -7.0)
      grandWcGroup.add(dividerW)

      const wDoor = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.6, 0.08), new THREE.MeshStandardMaterial({ color: 0xfdf2f8 }))
      wDoor.position.set(gx + 1.15, 1.6, -5.1)
      grandWcGroup.add(wDoor)
    }

    // Bàn trang điểm và rửa tay (Vanity & Makeup Counter) nép sát tường Đông kèm gương LED
    const vanityWomen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.3, 6.2), new THREE.MeshStandardMaterial({ color: 0xfdf2f8 }))
    vanityWomen.position.set(14.8, 1.1, -1.0)
    grandWcGroup.add(vanityWomen)

    const mirrorLedWomen = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.6, 6.0), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, metalness: 0.95 }))
    mirrorLedWomen.position.set(15.8, 2.3, -1.0)
    grandWcGroup.add(mirrorLedWomen)

    scene.add(grandWcGroup)
    interactiveAmenitiesRef.current.push({ mesh: wcFloorSlab, facility: wcFacility })

    // =========================================================================
    // 16. TOÀN BỘ KHU MÀU XANH NƯỚC BIỂN: KHU CAFÉ LỚN (CHUẨN MẪU 2 JAPANDI)
    // =========================================================================
    // Người dùng yêu cầu:
    // - "toàn bộ phần màu xanh nước biển là khu cho cafe"
    // - "thêm bàn ghế vào quán cafe" -> Bố trí đầy đủ bàn tròn, bàn nhóm, ghế bar và sofa lounge phong cách Scandi / Japandi
    // Toàn bộ góc Đông Bắc (X: 18 đến 54, Z: -38 đến -14)
    const cafeFacility = MUSEUM_FACILITIES.find((f) => f.code === 'CAFE') || MUSEUM_FACILITIES[4]
    const grandCafeGroup = new THREE.Group()
    grandCafeGroup.position.set(36, 0, -27)

    // Sàn terrazzo xám cao cấp phủ trọn vẹn toàn bộ khu màu xanh nước biển
    const cafeFloorSlab = new THREE.Mesh(
      new THREE.BoxGeometry(32, 0.3, 20),
      new THREE.MeshStandardMaterial({ map: cafeFloorTexture, roughness: 0.3 })
    )
    cafeFloorSlab.position.set(0, 0.15, 0)
    cafeFloorSlab.receiveShadow = true
    grandCafeGroup.add(cafeFloorSlab)

    // Mảng tường sau & Mảng tường gỗ nâu "COFFEE"
    const cafeBackWall = new THREE.Mesh(
      new THREE.BoxGeometry(32, 4.0, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
    )
    cafeBackWall.position.set(0, 2.0, -9.8)
    grandCafeGroup.add(cafeBackWall)

    const cafeAccentWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2.4, 7.0),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
    )
    cafeAccentWall.position.set(-15.6, 2.6, -4.0)
    grandCafeGroup.add(cafeAccentWall)

    const coffeeBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.8, 3.0),
      new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.4 })
    )
    coffeeBoard.position.set(-15.4, 2.8, -4.0)
    grandCafeGroup.add(coffeeBoard)

    // Ghế băng dài gắn tường nệm kem
    const cafeBanquette = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.45, 7.0),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 })
    )
    cafeBanquette.position.set(-14.8, 0.45, -4.0)
    grandCafeGroup.add(cafeBanquette)

    // 3 bàn vuông kèm 3 ghế đơn trước ghế băng dài
    for (let bz of [-6.0, -4.0, -2.0]) {
      const banqTable = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.08, 1.2),
        new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.3 })
      )
      banqTable.position.set(-13.0, 0.85, bz)
      grandCafeGroup.add(banqTable)

      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85), new THREE.MeshStandardMaterial({ color: 0x0f172a }))
      leg.position.set(-13.0, 0.42, bz)
      grandCafeGroup.add(leg)

      // Ghế đơn đối diện
      const chairOpp = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.08, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
      )
      chairOpp.position.set(-11.2, 0.45, bz)
      grandCafeGroup.add(chairOpp)

      const chairBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.45, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
      )
      chairBack.position.set(-10.85, 0.7, bz)
      grandCafeGroup.add(chairBack)
    }

    // Quầy Bar pha chế dài mặt đá trắng, ốp lam gỗ sồi dọc
    const baristaBar = new THREE.Mesh(
      new THREE.BoxGeometry(10.0, 1.2, 2.0),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    )
    baristaBar.position.set(8.0, 0.6, 1.5)
    grandCafeGroup.add(baristaBar)

    const barWoodBase = new THREE.Mesh(
      new THREE.BoxGeometry(9.8, 1.05, 1.8),
      new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.5 })
    )
    barWoodBase.position.set(8.0, 0.55, 1.5)
    grandCafeGroup.add(barWoodBase)

    // Máy pha Espresso đen/inox & máy xay cà phê
    const espressoMach = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.8, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.2 })
    )
    espressoMach.position.set(11.0, 1.6, 1.5)
    grandCafeGroup.add(espressoMach)

    // Vòm kính úp bánh ngọt
    for (let px of [4.5, 6.2, 7.8]) {
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, roughness: 0.1 })
      )
      dome.position.set(px, 1.25, 1.5)
      grandCafeGroup.add(dome)
    }

    // 4 GHẾ BAR CAO (BAR STOOLS) DỌC THEO QUẦY PHA CHẾ
    for (let bx of [4.5, 6.8, 9.1, 11.4]) {
      const barStoolSeat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
      )
      barStoolSeat.position.set(bx, 0.75, 3.2)
      grandCafeGroup.add(barStoolSeat)

      const barStoolLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.06, 0.75, 8),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 })
      )
      barStoolLeg.position.set(bx, 0.38, 3.2)
      grandCafeGroup.add(barStoolLeg)
    }

    // Bàn làm việc nhóm dài gỗ kèm 6 ghế đẩu và 3 đèn thả trần
    const communalTable = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.12, 2.2), new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.4 }))
    communalTable.position.set(-3.0, 0.9, -4.0)
    grandCafeGroup.add(communalTable)

    for (let sx of [-4.5, -3.0, -1.5]) {
      // Ghế phía trên và phía dưới bàn nhóm
      for (let sz of [-5.5, -2.5]) {
        const cStool = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 0.45, 12),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 })
        )
        cStool.position.set(sx, 0.23, sz)
        grandCafeGroup.add(cStool)
      }
    }

    for (let lx of [-4.5, -3.0, -1.5]) {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffedd5, emissive: 0xfde047, emissiveIntensity: 0.9 }))
      lamp.position.set(lx, 2.4, -4.0)
      grandCafeGroup.add(lamp)
    }

    // --- BỘ BÀN TRÒN BISTRO 2 CHỖ (4 BỘ BÀN GHẾ VEN GIẾNG TRỜI) ---
    const bistroConfigs = [
      { x: -10.0, z: 6.5 },
      { x: -5.5, z: 6.5 },
      { x: -1.0, z: 6.5 },
      { x: 3.5, z: 6.5 },
    ]

    bistroConfigs.forEach(({ x, z }) => {
      // Mặt bàn tròn gỗ sồi
      const bTable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.75, 0.08, 24),
        new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.3 })
      )
      bTable.position.set(x, 0.85, z)
      grandCafeGroup.add(bTable)

      const bLeg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.18, 0.85, 16),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 })
      )
      bLeg.position.set(x, 0.42, z)
      grandCafeGroup.add(bLeg)

      // Cốc cà phê nhỏ xinh trên bàn
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }))
      cup.position.set(x + 0.15, 0.95, z)
      grandCafeGroup.add(cup)

      // 2 Ghế Scandi uốn cong 2 bên bàn
      for (let side of [-1, 1]) {
        const chairZ = z + side * 1.15
        const chairSeat = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.32, 0.06, 16),
          new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 })
        )
        chairSeat.position.set(x, 0.45, chairZ)
        grandCafeGroup.add(chairSeat)

        const chairLeg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8),
          new THREE.MeshStandardMaterial({ color: 0x0f172a })
        )
        chairLeg.position.set(x, 0.22, chairZ)
        grandCafeGroup.add(chairLeg)

        const backrest = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.3, 0.06),
          new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.4 })
        )
        backrest.position.set(x, 0.65, chairZ + side * 0.25)
        grandCafeGroup.add(backrest)
      }
    })

    // --- 2 BỘ BÀN ĂN 4 CHỖ CHO GIA ĐÌNH / NHÓM BẠN ---
    for (let tx of [-8.5, -2.5]) {
      const diningTable = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.1, 1.4),
        new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.3 })
      )
      diningTable.position.set(tx, 0.85, 1.2)
      grandCafeGroup.add(diningTable)

      const dLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85), new THREE.MeshStandardMaterial({ color: 0x0f172a }))
      dLeg1.position.set(tx - 0.9, 0.42, 1.2)
      grandCafeGroup.add(dLeg1)

      const dLeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.85), new THREE.MeshStandardMaterial({ color: 0x0f172a }))
      dLeg2.position.set(tx + 0.9, 0.42, 1.2)
      grandCafeGroup.add(dLeg2)

      // 4 Ghế ăn bọc nệm (2 trước, 2 sau)
      for (let side of [-1, 1]) {
        for (let offset of [-0.65, 0.65]) {
          const dChair = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.08, 0.55),
            new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 })
          )
          dChair.position.set(tx + offset, 0.45, 1.2 + side * 1.1)
          grandCafeGroup.add(dChair)

          const dChairLeg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.45),
            new THREE.MeshStandardMaterial({ color: 0x0f172a })
          )
          dChairLeg.position.set(tx + offset, 0.22, 1.2 + side * 1.1)
          grandCafeGroup.add(dChairLeg)

          const dChairBack = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.4, 0.06),
            new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 })
          )
          dChairBack.position.set(tx + offset, 0.68, 1.2 + side * 1.35)
          grandCafeGroup.add(dChairBack)
        }
      }
    }

    // --- GÓC SOFA LOUNGE CAO CẤP THƯ THÁI ---
    const sofaCoffeeTable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 0.08, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 })
    )
    sofaCoffeeTable.position.set(4.0, 0.5, -4.5)
    grandCafeGroup.add(sofaCoffeeTable)

    for (let lx of [2.2, 5.8]) {
      const loungeChair = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.5, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 })
      )
      loungeChair.position.set(lx, 0.35, -4.5)
      grandCafeGroup.add(loungeChair)

      const loungeBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.8, 1.1),
        new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.7 })
      )
      loungeBack.position.set(lx + (lx < 4 ? -0.5 : 0.5), 0.7, -4.5)
      grandCafeGroup.add(loungeBack)
    }

    scene.add(grandCafeGroup)
    interactiveAmenitiesRef.current.push({ mesh: cafeFloorSlab, facility: cafeFacility })

    // =========================================================================
    // 17. BỤC CỔ VẬT TRƯNG BÀY NGAY TRUNG TÂM PHÒNG
    // =========================================================================
    interactiveArtifactsRef.current = []

    MUSEUM_ARTIFACTS.forEach((art) => {
      const room = MUSEUM_ROOMS.find((r) => r.code === art.roomCode)
      const posX = room ? room.centerX : 600
      const posY = room ? room.centerY : 680
      const [ax, az] = to3DCoords(posX, posY)
      const isSelected = selectedArtifact?.id === art.id

      const artGroup = new THREE.Group()
      artGroup.position.set(ax, 0, az)

      const plinthMesh = new THREE.Mesh(
        art.modelType === 'bronze_drum'
          ? new THREE.CylinderGeometry(1.8, 2.0, 1.6, 24)
          : new THREE.BoxGeometry(2.6, 1.6, 2.6),
        isSelected ? selectedPlinthMaterial : plinthMaterial
      )
      plinthMesh.position.y = 0.8
      plinthMesh.castShadow = true
      plinthMesh.receiveShadow = true
      plinthMesh.userData = { artifact: art }
      artGroup.add(plinthMesh)

      const vitrineMesh = new THREE.Mesh(
        art.modelType === 'bronze_drum'
          ? new THREE.CylinderGeometry(1.9, 1.9, 2.2, 24)
          : new THREE.BoxGeometry(2.7, 2.4, 2.7),
        vitrineGlassMaterial
      )
      vitrineMesh.position.y = 2.8
      artGroup.add(vitrineMesh)

      const baseRim = new THREE.Mesh(
        new THREE.RingGeometry(1.65, 1.85, 32),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 })
      )
      baseRim.rotation.x = -Math.PI / 2
      baseRim.position.y = 1.62
      artGroup.add(baseRim)

      let artifactVisual: THREE.Object3D

      if (art.modelType === 'bronze_drum') {
        const drumGroup = new THREE.Group()
        const drumBody = new THREE.Mesh(
          new THREE.CylinderGeometry(1.1, 0.8, 1.0, 24),
          new THREE.MeshStandardMaterial({ color: 0x92400e, metalness: 0.7, roughness: 0.4 })
        )
        const drumTop = new THREE.Mesh(
          new THREE.CylinderGeometry(1.25, 1.25, 0.15, 24),
          new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8, roughness: 0.3 })
        )
        drumTop.position.y = 0.52
        drumGroup.add(drumBody)
        drumGroup.add(drumTop)
        artifactVisual = drumGroup
      } else if (art.modelType === 'golden_seal') {
        const sealGroup = new THREE.Group()
        const sealBase = new THREE.Mesh(
          new THREE.BoxGeometry(1.0, 0.35, 1.0),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.95, roughness: 0.15 })
        )
        const dragonKnob = new THREE.Mesh(
          new THREE.TorusGeometry(0.35, 0.16, 12, 24, Math.PI),
          new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.1 })
        )
        dragonKnob.position.y = 0.28
        dragonKnob.rotation.x = -Math.PI / 2
        sealGroup.add(sealBase)
        sealGroup.add(dragonKnob)
        artifactVisual = sealGroup
      } else if (art.modelType === 'buddha_statue') {
        const buddhaGroup = new THREE.Group()
        const lotusBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.9, 0.7, 0.3, 16),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 })
        )
        const bodyMesh = new THREE.Mesh(
          new THREE.ConeGeometry(0.55, 1.0, 16),
          new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.6 })
        )
        bodyMesh.position.y = 0.55
        buddhaGroup.add(lotusBase)
        buddhaGroup.add(bodyMesh)
        artifactVisual = buddhaGroup
      } else if (art.modelType === 'blue_white_vase') {
        const vase = new THREE.Mesh(
          new THREE.SphereGeometry(0.7, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.2 })
        )
        vase.scale.set(0.9, 1.45, 0.9)
        artifactVisual = vase
      } else if (art.modelType === 'sword') {
        const sword = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 1.6, 0.22),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 })
        )
        sword.rotation.z = Math.PI / 3
        artifactVisual = sword
      } else if (art.modelType === 'jade_seal') {
        const jade = new THREE.Mesh(
          new THREE.BoxGeometry(0.85, 0.75, 0.85),
          new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.85 })
        )
        artifactVisual = jade
      } else {
        const stat = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.55, 1.2, 12),
          new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.5, roughness: 0.3 })
        )
        artifactVisual = stat
      }

      artifactVisual.position.y = 2.5
      artifactVisual.castShadow = true
      artGroup.add(artifactVisual)

      const spotLight = new THREE.SpotLight(isSelected ? 0xf59e0b : 0xfffaed, isSelected ? 4.5 : 2.5, 9, Math.PI / 4, 0.4)
      spotLight.position.set(0, 5.0, 0)
      spotLight.target = plinthMesh
      artGroup.add(spotLight)

      if (isSelected) {
        const selectedGlow = new THREE.Mesh(
          new THREE.RingGeometry(2.2, 2.9, 32),
          new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })
        )
        selectedGlow.rotation.x = -Math.PI / 2
        selectedGlow.position.y = 0.05
        artGroup.add(selectedGlow)
      }

      scene.add(artGroup)
      interactiveArtifactsRef.current.push({ mesh: plinthMesh, artifact: art })
    })

    // =========================================================================
    // 18. NHÂN VẬT SILHOUETTE KIẾN TRÚC
    // =========================================================================
    const silhouetteConfigs = [
      { x: -38, z: 12, pose: 'viewing' as const, scale: 3.2 },
      { x: -44, z: 15, pose: 'walking' as const, scale: 3.2 },
      { x: -38, z: 31, pose: 'viewing' as const, scale: 3.0 },
      { x: -18, z: 12, pose: 'viewing' as const, scale: 3.2 },
      { x: 2, z: 24, pose: 'walking' as const, scale: 3.2 },
      { x: -28, z: -20, pose: 'walking' as const, scale: 3.0 }, // Đi vào WC
      { x: 28, z: -20, pose: 'viewing' as const, scale: 3.2 },  // Khách gọi café
      { x: 38, z: 12, pose: 'viewing' as const, scale: 3.2 },
      { x: 4, z: -33, pose: 'viewing' as const, scale: 3.4 },
    ]

    silhouetteConfigs.forEach((cfg) => {
      const silTexture = createSilhouetteSpriteTexture(cfg.pose)
      const spriteMat = new THREE.SpriteMaterial({ map: silTexture, transparent: true, depthWrite: false })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.position.set(cfg.x, cfg.scale / 2 + 0.1, cfg.z)
      sprite.scale.set(cfg.scale * 0.5, cfg.scale, 1)
      scene.add(sprite)
    })

    // =========================================================================
    // 19. USER START LOCATION: "📍 BẠN Ở ĐÂY" (TẠI CỔNG 1)
    // =========================================================================
    const userGroup = new THREE.Group()
    userPinRef.current = userGroup
    const [ux, uz] = to3DCoords(startNode.x, startNode.y)
    userGroup.position.set(ux, 0.4, uz)

    const userHalo = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 2.5, 32),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide })
    )
    userHalo.rotation.x = -Math.PI / 2
    userHalo.position.y = 0.1
    userGroup.add(userHalo)

    const userPinCone = new THREE.Mesh(
      new THREE.ConeGeometry(1.0, 2.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.9 })
    )
    userPinCone.rotation.x = Math.PI
    userPinCone.position.y = 3.2
    userGroup.add(userPinCone)

    scene.add(userGroup)

    // =========================================================================
    // 20. LỘ TRÌNH DẪN ĐƯỜNG 3D
    // =========================================================================
    if (pathResult && pathResult.pathNodes.length > 1) {
      const points: THREE.Vector3[] = []
      pathResult.pathNodes.forEach((n) => {
        const [px, pz] = to3DCoords(n.x, n.y)
        points.push(new THREE.Vector3(px, 0.45, pz))
      })

      if (selectedArtifact && !activeRouteTarget) {
        const room = MUSEUM_ROOMS.find((r) => r.code === selectedArtifact.roomCode)
        if (room) {
          const [ax, az] = to3DCoords(room.centerX, room.centerY)
          points.push(new THREE.Vector3(ax, 0.45, az))
        }
      }

      const curve = new THREE.CatmullRomCurve3(points)
      const tubeGeo = new THREE.TubeGeometry(curve, 72, 0.32, 12, false)
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.95,
        roughness: 0.1,
      })
      const pathTube = new THREE.Mesh(tubeGeo, tubeMat)
      scene.add(pathTube)

      for (let pt of points) {
        const nodeDot = new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 12, 12),
          new THREE.MeshBasicMaterial({ color: 0xffedd5 })
        )
        nodeDot.position.copy(pt)
        scene.add(nodeDot)
      }
    }

    // =========================================================================
    // 21. INTERACTION: RAYCASTING FOR HOVER & CLICK
    // =========================================================================
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    let isMouseDown = false
    let startMouseX = 0
    let startMouseY = 0

    const handlePointerDown = (e: MouseEvent) => {
      isMouseDown = true
      startMouseX = e.clientX
      startMouseY = e.clientY
    }

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      if (isMouseDown && cameraRef.current) {
        const deltaX = e.clientX - startMouseX
        const deltaY = e.clientY - startMouseY

        if (viewMode === 'isometric') {
          cameraRef.current.position.x -= deltaX * 0.12
          cameraRef.current.position.z -= deltaY * 0.08
        } else {
          cameraRef.current.position.x -= deltaX * 0.14
          cameraRef.current.position.z -= deltaY * 0.14
        }

        startMouseX = e.clientX
        startMouseY = e.clientY
        return
      }

      raycaster.setFromCamera(mouse, camera)

      // Hover Cổ vật
      const artCandidates = interactiveArtifactsRef.current.map((item) => item.mesh)
      const artIntersects = raycaster.intersectObjects(artCandidates, true)
      if (artIntersects.length > 0) {
        const matched = interactiveArtifactsRef.current.find(
          (item) => item.mesh === artIntersects[0].object || item.mesh.children.includes(artIntersects[0].object)
        )
        if (matched) {
          setHoveredItemName(language === 'VI' ? `🏛️ ${matched.artifact.name}` : `🏛️ ${matched.artifact.nameEn}`)
          setHoverPosition({ x: e.clientX, y: e.clientY })
          renderer.domElement.style.cursor = 'pointer'
          return
        }
      }

      // Hover Tiện ích (WC, Café)
      const amenityCandidates = interactiveAmenitiesRef.current.map((item) => item.mesh)
      const amenityIntersects = raycaster.intersectObjects(amenityCandidates, true)
      if (amenityIntersects.length > 0) {
        const matched = interactiveAmenitiesRef.current.find(
          (item) => item.mesh === amenityIntersects[0].object || item.mesh.children.includes(amenityIntersects[0].object)
        )
        if (matched) {
          setHoveredItemName(`${matched.facility.icon} ${matched.facility.name}`)
          setHoverPosition({ x: e.clientX, y: e.clientY })
          renderer.domElement.style.cursor = 'pointer'
          return
        }
      }

      setHoveredItemName(null)
      renderer.domElement.style.cursor = 'grab'
    }

    const handlePointerUp = (e: MouseEvent) => {
      isMouseDown = false
      const moveDistance = Math.hypot(e.clientX - startMouseX, e.clientY - startMouseY)
      if (moveDistance < 5) {
        const rect = renderer.domElement.getBoundingClientRect()
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(mouse, camera)

        // 1. Click Bục Cổ vật
        const artCandidates = interactiveArtifactsRef.current.map((item) => item.mesh)
        const artIntersects = raycaster.intersectObjects(artCandidates, true)
        if (artIntersects.length > 0) {
          const matched = interactiveArtifactsRef.current.find(
            (item) => item.mesh === artIntersects[0].object || item.mesh.children.includes(artIntersects[0].object)
          )
          if (matched) {
            onSelectArtifact(matched.artifact)
            return
          }
        }

        // 2. Click Tiện ích (WC, Café)
        const amenityCandidates = interactiveAmenitiesRef.current.map((item) => item.mesh)
        const amenityIntersects = raycaster.intersectObjects(amenityCandidates, true)
        if (amenityIntersects.length > 0) {
          const matched = interactiveAmenitiesRef.current.find(
            (item) => item.mesh === amenityIntersects[0].object || item.mesh.children.includes(amenityIntersects[0].object)
          )
          if (matched && onSelectAmenity) {
            onSelectAmenity(matched.facility)
            return
          }
        }

        // 3. Click Sàn Phòng Trưng Bày
        const roomHitCandidates = roomPlatesRef.current.map((item) => item.mesh)
        const roomIntersects = raycaster.intersectObjects(roomHitCandidates, false)
        if (roomIntersects.length > 0) {
          const matchedRoom = roomPlatesRef.current.find(
            (item) => item.mesh === roomIntersects[0].object
          )
          if (matchedRoom) {
            onSelectRoom(matchedRoom.room)
          }
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!cameraRef.current) return
      const delta = e.deltaY * 0.08
      cameraRef.current.position.y = Math.min(Math.max(cameraRef.current.position.y + delta, 30), 160)
    }

    const dom = renderer.domElement
    dom.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('mouseup', handlePointerUp)
    dom.addEventListener('wheel', handleWheel, { passive: false })

    // 22. ANIMATION LOOP
    let animationId: number
    let clock = 0
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      clock += 0.03

      if (userPinRef.current) {
        userPinRef.current.position.y = 0.4 + Math.sin(clock * 3) * 0.25
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      dom.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)
      dom.removeEventListener('wheel', handleWheel)
      renderer.dispose()
    }
  }, [selectedArtifact, activeRouteTarget, viewMode, onSelectArtifact, onSelectRoom, onSelectAmenity, language])

  // CHUYỂN ĐỔI CHẾ ĐỘ XEM
  const toggleViewMode = (mode: 'isometric' | 'top_down') => {
    setViewMode(mode)
    if (cameraRef.current) {
      if (mode === 'isometric') {
        cameraRef.current.position.set(-65, 82, 90)
        cameraRef.current.lookAt(2, -2, 4)
      } else {
        cameraRef.current.position.set(0, 140, 10)
        cameraRef.current.lookAt(0, 0, 0)
      }
    }
  }

  const handleZoom = (direction: 'in' | 'out') => {
    if (cameraRef.current) {
      const delta = direction === 'in' ? -15 : 15
      cameraRef.current.position.y = Math.min(Math.max(cameraRef.current.position.y + delta, 30), 160)
    }
  }

  const handleResetView = () => {
    if (cameraRef.current) {
      if (viewMode === 'isometric') {
        cameraRef.current.position.set(-65, 82, 90)
        cameraRef.current.lookAt(2, -2, 4)
      } else {
        cameraRef.current.position.set(0, 140, 10)
        cameraRef.current.lookAt(0, 0, 0)
      }
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden select-none bg-[#0E131F]">
      {/* 3D Three.js Canvas Container */}
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* FLOATING HOVER TOOLTIP */}
      {hoveredItemName && hoverPosition && (
        <div
          className="pointer-events-none fixed z-50 flex items-center gap-2 rounded-xl border border-amber-500/40 bg-slate-950/90 px-3 py-1.5 shadow-2xl backdrop-blur-md animate-fade-in"
          style={{
            left: `${hoverPosition.x + 16}px`,
            top: `${hoverPosition.y - 40}px`,
          }}
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-100">{hoveredItemName}</span>
        </div>
      )}

      {/* TOP-LEFT: ROUTE NAVIGATION BADGE */}
      {pathResult && (
        <div className="absolute top-4 left-4 z-30 flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-slate-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl max-w-md animate-fade-in">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
            <Footprints className="h-4 w-4 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {language === 'VI' ? 'Đang dẫn đường 3D:' : '3D Route Path:'}
              </span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-extrabold text-amber-300">
                {activeRouteTarget?.code || selectedArtifact?.roomCode}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-100 truncate">
              {activeRouteTarget?.name || selectedArtifact?.name} (~{pathResult.totalDistanceMeters}m • {activeRouteTarget ? '1-2 phút' : selectedArtifact?.walkTime})
            </p>
          </div>
        </div>
      )}

      {/* TOP-CENTER: AMENITY & ARTIFACT FILTER PILLS */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-1 backdrop-blur-xl shadow-xl">
        <button
          onClick={() => setActiveFilter('all')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'VI' ? 'Tất cả' : 'All'}
        </button>
        <button
          onClick={() => setActiveFilter('artifacts')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            activeFilter === 'artifacts'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'VI' ? '🏛️ 10 Cổ vật 3D' : '🏛️ 10 Artifacts'}
        </button>
        <button
          onClick={() => setActiveFilter('amenities')}
          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            activeFilter === 'amenities'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {language === 'VI' ? '🚻 Tiện ích (WC, Vé, Café)' : '🚻 Facilities'}
        </button>
      </div>

      {/* TOP-RIGHT: 3D VIEW TOGGLES & CONTROLS */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <div className="flex flex-col rounded-2xl border border-slate-700/80 bg-slate-900/95 p-1 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => toggleViewMode('isometric')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'isometric'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Góc nhìn 3D Isometric Diorama (Cắt lớp kiến trúc)"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{language === 'VI' ? 'Phối cảnh 3D' : 'Isometric 3D'}</span>
          </button>

          <button
            onClick={() => toggleViewMode('top_down')}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'top_down'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Nhìn từ trên xuống (Top-down 3D)"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{language === 'VI' ? 'Nhìn trên xuống' : 'Top-down'}</span>
          </button>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-xl backdrop-blur-xl">
          <button
            onClick={() => handleZoom('in')}
            className="p-2.5 text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors border-b border-slate-800"
            title="Phóng to"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2.5 text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors border-b border-slate-800"
            title="Thu nhỏ"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2.5 text-slate-300 hover:bg-slate-800 hover:text-amber-400 transition-colors"
            title="Đặt lại góc nhìn"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-xl backdrop-blur-xl">
          <Compass className="h-6 w-6 text-amber-400 animate-spin-slow" />
        </div>
      </div>

      {/* QUICK AMENITIES BAR (BOTTOM-RIGHT) */}
      <div className="absolute bottom-4 right-4 z-30 hidden sm:flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
        <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {language === 'VI' ? 'Tiện ích:' : 'Amenities:'}
        </span>
        {MUSEUM_FACILITIES.slice(0, 4).map((facility) => (
          <button
            key={facility.id}
            onClick={() => {
              if (onSelectAmenity) onSelectAmenity(facility)
            }}
            className="flex items-center gap-1 rounded-xl bg-slate-800/80 hover:bg-amber-950/60 hover:border-amber-500/50 border border-slate-700 px-2.5 py-1 text-xs text-slate-200 hover:text-amber-300 transition-all"
            title={facility.name}
          >
            <span>{facility.icon}</span>
            <span className="text-[11px] font-semibold">{facility.name.split('(')[0].trim()}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
