import React, { useState, useRef, useCallback, useEffect } from 'react'
import { RouteResult, Artifact } from '../lib/types'
import { MUSEUM_NODES, MUSEUM_EDGES } from '../lib/pathfinding'
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Eye } from 'lucide-react'

interface MapViewProps {
  artifacts: Artifact[]
  selectedArtifact: Artifact | null
  activeRoute: RouteResult | null
  currentStartNodeId: string
  onSelectArtifact: (artifact: Artifact) => void
}

// Góc xoay isometric
const ISO_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const ISO_TILTS = [30, 45, 20]

// Màu sắc cho từng loại phòng
const ROOM_COLORS: Record<string, { fill: string; stroke: string; roof: string; label: string }> = {
  A1:  { fill: '#fde68a', stroke: '#d97706', roof: '#f59e0b', label: '#78350f' },
  B2:  { fill: '#fce7f3', stroke: '#db2777', roof: '#ec4899', label: '#831843' },
  B3:  { fill: '#ffe4e6', stroke: '#e11d48', roof: '#f43f5e', label: '#881337' },
  C1:  { fill: '#dcfce7', stroke: '#16a34a', roof: '#22c55e', label: '#14532d' },
  C2:  { fill: '#d1fae5', stroke: '#059669', roof: '#10b981', label: '#064e3b' },
  D3:  { fill: '#dbeafe', stroke: '#2563eb', roof: '#3b82f6', label: '#1e3a8a' },
  E1:  { fill: '#fef3c7', stroke: '#d97706', roof: '#f59e0b', label: '#78350f' },
  F1:  { fill: '#ede9fe', stroke: '#7c3aed', roof: '#8b5cf6', label: '#4c1d95' },
  G1:  { fill: '#f0fdf4', stroke: '#15803d', roof: '#16a34a', label: '#14532d' },
}

// Emoji icon cho từng cổ vật
const ARTIFACT_ICONS: Record<string, string> = {
  A01: '🥁', A02: '🔑', A03: '🙏', A04: '🏺', A05: '👑',
  A06: '⚔️', A07: '🔔', A08: '💎', A09: '💃', A10: '🐉',
}

// Chuyển tọa độ 2D sang isometric 3D theo góc xoay
function toIso(x: number, y: number, rotDeg: number, tilt: number, width: number, height: number) {
  // Trung tâm bản đồ
  const cx = width / 2
  const cy = height / 2
  // Normalize về -0.5..0.5
  const nx = (x / 1400) - 0.5
  const ny = (y / 1000) - 0.5
  // Xoay
  const rad = (rotDeg * Math.PI) / 180
  const rx = nx * Math.cos(rad) - ny * Math.sin(rad)
  const ry = nx * Math.sin(rad) + ny * Math.cos(rad)
  // Chiếu isometric với tilt
  const tiltRad = (tilt * Math.PI) / 180
  const px = rx * width * 0.8
  const py = ry * Math.cos(tiltRad) * height * 0.8
  return { x: cx + px, y: cy + py }
}

export const MapView: React.FC<MapViewProps> = ({
  artifacts,
  selectedArtifact,
  activeRoute,
  currentStartNodeId,
  onSelectArtifact,
}) => {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [rotIndex, setRotIndex] = useState(0)
  const [tiltIndex, setTiltIndex] = useState(0)
  const [animTick, setAnimTick] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const W = 900
  const H = 700
  const rotDeg = ISO_ANGLES[rotIndex]
  const tilt = ISO_TILTS[tiltIndex]

  // Animation tick cho đường route
  useEffect(() => {
    const id = setInterval(() => setAnimTick(t => t + 1), 100)
    return () => clearInterval(id)
  }, [])

  const project = useCallback((x: number, y: number) => {
    return toIso(x, y, rotDeg, tilt, W, H)
  }, [rotDeg, tilt])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setIsDragging(false)

  // Touch support
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y }
    }
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && lastTouchRef.current) {
      setPan({ x: e.touches[0].clientX - lastTouchRef.current.x, y: e.touches[0].clientY - lastTouchRef.current.y })
    }
  }

  const startNode = MUSEUM_NODES[currentStartNodeId] || MUSEUM_NODES['N_ENTRANCE']
  const startPt = project(startNode.x, startNode.y)

  // Tính polyline route
  const routePoints = activeRoute
    ? activeRoute.nodes.map(n => {
        const p = project(n.x, n.y)
        return `${p.x},${p.y}`
      }).join(' ')
    : ''

  // Danh sách phòng trưng bày (hình hộp isometric)
  const rooms = [
    // [x, y, w, h, room_code, label]
    { x: 80,  y: 170, w: 260, h: 200, code: 'A1',  label: 'A1 • Đông Sơn',   artCode: 'A01' },
    { x: 350, y: 180, w: 220, h: 180, code: 'B2',  label: 'B2 • Hoàng Gia',  artCode: 'A02' },
    { x: 80,  y: 380, w: 220, h: 180, code: 'C1',  label: 'C1 • Phật Giáo',  artCode: 'A03' },
    { x: 800, y: 160, w: 240, h: 200, code: 'D3',  label: 'D3 • Gốm Sứ',    artCode: 'A04' },
    { x: 350, y: 530, w: 220, h: 180, code: 'B3',  label: 'B3 • Cung Đình',  artCode: 'A05' },
    { x: 560, y: 80,  w: 260, h: 160, code: 'E1',  label: 'E1 • Anh Hùng',   artCode: 'A06' },
    { x: 80,  y: 280, w: 180, h: 160, code: 'C2',  label: 'C2 • Chuông',     artCode: 'A07' },
    { x: 440, y: 270, w: 200, h: 160, code: 'B2',  label: 'B2B • Ngọc Ấn',  artCode: 'A08' },
    { x: 1080,y: 200, w: 240, h: 200, code: 'F1',  label: 'F1 • Chăm Pa',   artCode: 'A09' },
    { x: 1080,y: 380, w: 240, h: 180, code: 'G1',  label: 'G1 • Thăng Long', artCode: 'A10' },
  ]

  // Hành lang và đường đi
  const corridors = [
    // Sảnh chính (đáy)
    { x1: 200, y1: 720, x2: 1200, y2: 720, w: 80 },
    // Trục dọc
    { x1: 700, y1: 200, x2: 700, y2: 870, w: 60 },
    // Hành lang ngang trên
    { x1: 200, y1: 300, x2: 1300, y2: 300, w: 50 },
    // Hành lang ngang giữa
    { x1: 200, y1: 520, x2: 900, y2: 520, w: 50 },
  ]

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #f0fdf4 60%, #fefce8 100%)',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => { lastTouchRef.current = null }}
    >
      {/* === ĐIỀU KHIỂN GÓC NHÌN === */}
      <div style={{
        position: 'absolute', top: 80, right: 16, zIndex: 40,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {/* Xoay trái */}
        <button
          onClick={e => { e.stopPropagation(); setRotIndex(i => (i - 1 + ISO_ANGLES.length) % ISO_ANGLES.length) }}
          style={ctrlBtnStyle}
          title="Xoay trái"
        >
          <RotateCcw size={16} />
        </button>
        {/* Xoay phải */}
        <button
          onClick={e => { e.stopPropagation(); setRotIndex(i => (i + 1) % ISO_ANGLES.length) }}
          style={ctrlBtnStyle}
          title="Xoay phải"
        >
          <RotateCw size={16} />
        </button>
        {/* Tilt */}
        <button
          onClick={e => { e.stopPropagation(); setTiltIndex(i => (i + 1) % ISO_TILTS.length) }}
          style={ctrlBtnStyle}
          title="Đổi góc nghiêng"
        >
          <Eye size={16} />
        </button>

        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 2, paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }} />

        {/* Phóng to */}
        <button
          onClick={e => { e.stopPropagation(); setZoom(z => Math.min(z + 0.2, 3)) }}
          style={ctrlBtnStyle}
          title="Phóng to"
        >
          <ZoomIn size={16} />
        </button>
        {/* Thu nhỏ */}
        <button
          onClick={e => { e.stopPropagation(); setZoom(z => Math.max(z - 0.2, 0.4)) }}
          style={ctrlBtnStyle}
          title="Thu nhỏ"
        >
          <ZoomOut size={16} />
        </button>
        {/* Reset */}
        <button
          onClick={e => { e.stopPropagation(); setZoom(1); setPan({ x: 0, y: 0 }); setRotIndex(0); setTiltIndex(0) }}
          style={{ ...ctrlBtnStyle, fontSize: '0.65rem', fontWeight: 800, color: '#0284c7' }}
          title="Đặt lại"
        >
          ↺
        </button>
      </div>

      {/* === BADGE GÓC NHÌN === */}
      <div style={{
        position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
        border: '1px solid #e2e8f0', borderRadius: 20, padding: '4px 14px',
        fontSize: '0.72rem', fontWeight: 700, color: '#475569',
        display: 'flex', alignItems: 'center', gap: 6, zIndex: 30,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <span>🧭</span>
        <span>Góc {rotDeg}° · Nghiêng {tilt}°</span>
        <span style={{ color: '#94a3b8' }}>| Kéo để di chuyển · Nút xoay để đổi góc</span>
      </div>

      {/* === SVG BẢN ĐỒ === */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          overflow: 'visible',
        }}
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#00000030" />
          </filter>
          <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#f59e0b" floodOpacity="0.9" />
          </filter>
          <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.7" />
          </filter>
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <pattern id="floorTile" patternUnits="userSpaceOnUse" width="40" height="40">
            <rect width="40" height="40" fill="#f8fafc" />
            <rect x="0" y="0" width="20" height="20" fill="#f1f5f9" opacity="0.5" />
            <rect x="20" y="20" width="20" height="20" fill="#f1f5f9" opacity="0.5" />
          </pattern>
        </defs>

        {/* NỀN BẢO TÀNG */}
        {(() => {
          // Vẽ nền tổng thể
          const corners = [
            { x: 0,    y: 0    },
            { x: 1400, y: 0    },
            { x: 1400, y: 1000 },
            { x: 0,    y: 1000 },
          ]
          const pts = corners.map(c => project(c.x, c.y))
          return (
            <polygon
              points={pts.map(p => `${p.x},${p.y}`).join(' ')}
              fill="url(#floorTile)"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
          )
        })()}

        {/* VIỀN NGOÀI BẢO TÀNG */}
        {(() => {
          const outerWalls = [
            [{ x: 0, y: 0 }, { x: 1400, y: 0 }],
            [{ x: 1400, y: 0 }, { x: 1400, y: 1000 }],
            [{ x: 1400, y: 1000 }, { x: 0, y: 1000 }],
            [{ x: 0, y: 1000 }, { x: 0, y: 0 }],
          ]
          return outerWalls.map((wall, i) => {
            const a = project(wall[0].x, wall[0].y)
            const b = project(wall[1].x, wall[1].y)
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94a3b8" strokeWidth="3" />
          })
        })()}

        {/* CÁC HÀNH LANG */}
        {corridors.map((cor, i) => {
          // Vẽ dải hành lang có chiều rộng
          const dx = cor.x2 - cor.x1
          const dy = cor.y2 - cor.y1
          const len = Math.sqrt(dx * dx + dy * dy)
          const nx = -dy / len * cor.w / 2
          const ny = dx / len * cor.w / 2
          const corners2 = [
            { x: cor.x1 + nx, y: cor.y1 + ny },
            { x: cor.x2 + nx, y: cor.y2 + ny },
            { x: cor.x2 - nx, y: cor.y2 - ny },
            { x: cor.x1 - nx, y: cor.y1 - ny },
          ]
          const pts = corners2.map(c => project(c.x, c.y))
          return (
            <polygon
              key={i}
              points={pts.map(p => `${p.x},${p.y}`).join(' ')}
              fill="url(#corridorGrad)"
              stroke="#cbd5e1"
              strokeWidth="1"
              opacity="0.7"
            />
          )
        })}

        {/* CÁC CẠNH ĐỒ THỊ (nhạt) */}
        {MUSEUM_EDGES.map((edge, idx) => {
          const from = MUSEUM_NODES[edge.from]
          const to = MUSEUM_NODES[edge.to]
          if (!from || !to) return null
          const a = project(from.x, from.y)
          const b = project(to.x, to.y)
          return (
            <line
              key={idx}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 4"
              opacity="0.35"
            />
          )
        })}

        {/* CÁC PHÒNG TRƯNG BÀY - Hình hộp isometric */}
        {rooms.map((room) => {
          const art = artifacts.find(a => a.code === room.artCode)
          const color = ROOM_COLORS[room.code] || ROOM_COLORS['A1']
          const isSelected = selectedArtifact?.code === room.artCode

          // 4 góc sàn
          const x1 = room.x, y1 = room.y
          const x2 = room.x + room.w, y2 = room.y
          const x3 = room.x + room.w, y3 = room.y + room.h
          const x4 = room.x, y4 = room.y + room.h

          const p1 = project(x1, y1)
          const p2 = project(x2, y2)
          const p3 = project(x3, y3)
          const p4 = project(x4, y4)

          // Điểm tâm
          const cx = (x1 + x3) / 2
          const cy = (y1 + y3) / 2
          const cp = project(cx, cy)

          // Chiều cao tường (3D effect)
          const wallH = isSelected ? 28 : 20

          return (
            <g
              key={room.artCode}
              onClick={e => { e.stopPropagation(); if (art) onSelectArtifact(art) }}
              style={{ cursor: 'pointer' }}
              filter={isSelected ? 'url(#shadow)' : undefined}
            >
              {/* Tường phía trước bên trái */}
              <polygon
                points={`${p4.x},${p4.y} ${p3.x},${p3.y} ${p3.x},${p3.y - wallH} ${p4.x},${p4.y - wallH}`}
                fill={isSelected ? color.stroke : '#d1d5db'}
                stroke={color.stroke}
                strokeWidth="1"
                opacity="0.8"
              />
              {/* Tường phía trước bên phải */}
              <polygon
                points={`${p3.x},${p3.y} ${p2.x},${p2.y} ${p2.x},${p2.y - wallH} ${p3.x},${p3.y - wallH}`}
                fill={isSelected ? '#f3f4f6' : '#e5e7eb'}
                stroke={color.stroke}
                strokeWidth="1"
                opacity="0.7"
              />
              {/* Mái (mặt trên) */}
              <polygon
                points={[
                  `${p1.x},${p1.y - wallH}`,
                  `${p2.x},${p2.y - wallH}`,
                  `${p3.x},${p3.y - wallH}`,
                  `${p4.x},${p4.y - wallH}`,
                ].join(' ')}
                fill={isSelected ? color.roof : color.fill}
                stroke={color.stroke}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />

              {/* Tên phòng */}
              <text
                x={cp.x}
                y={cp.y - wallH - 4}
                textAnchor="middle"
                fill={color.label}
                fontSize="10"
                fontWeight="800"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {room.label}
              </text>

              {/* Icon hiện vật */}
              <text
                x={cp.x}
                y={cp.y - wallH + 14}
                textAnchor="middle"
                fontSize="18"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {ARTIFACT_ICONS[room.artCode] || '🏛️'}
              </text>

              {/* Viền phát sáng khi được chọn */}
              {isSelected && (
                <polygon
                  points={[
                    `${p1.x},${p1.y - wallH - 3}`,
                    `${p2.x},${p2.y - wallH - 3}`,
                    `${p3.x},${p3.y - wallH - 3}`,
                    `${p4.x},${p4.y - wallH - 3}`,
                  ].join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  opacity="0.8"
                  className="room-pulse"
                />
              )}
            </g>
          )
        })}

        {/* CỔng VÀO CHÍNH */}
        {(() => {
          const gx = 700, gy = 870
          const p = project(gx, gy)
          const pL = project(gx - 80, gy)
          const pR = project(gx + 80, gy)
          const pTop = project(gx, gy - 100)
          return (
            <g>
              {/* Cổng tam quan */}
              <line x1={pL.x} y1={pL.y} x2={pL.x} y2={pL.y - 40} stroke="#1e3a8a" strokeWidth="10" strokeLinecap="round" />
              <line x1={pR.x} y1={pR.y} x2={pR.x} y2={pR.y - 40} stroke="#1e3a8a" strokeWidth="10" strokeLinecap="round" />
              <line x1={pL.x} y1={pL.y - 40} x2={pR.x} y2={pR.y - 40} stroke="#f59e0b" strokeWidth="6" />
              <text x={p.x} y={p.y - 50} textAnchor="middle" fill="#1e3a8a" fontSize="11" fontWeight="900">
                🏛️ CỔNG VÀO CHÍNH
              </text>
            </g>
          )
        })()}

        {/* QUẦY VÉ */}
        {(() => {
          const p = project(560, 810)
          return (
            <g>
              <rect x={p.x - 35} y={p.y - 22} width="70" height="28" rx="8" fill="#0284c7" />
              <text x={p.x} y={p.y - 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800">🎫 BÁN VÉ</text>
            </g>
          )
        })()}

        {/* QUẦY THÔNG TIN */}
        {(() => {
          const p = project(840, 810)
          return (
            <g>
              <rect x={p.x - 30} y={p.y - 22} width="60" height="28" rx="8" fill="#059669" />
              <text x={p.x} y={p.y - 4} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800">ℹ️ INFO</text>
            </g>
          )
        })()}

        {/* NHÀ VỆ SINH */}
        {[{ x: 180, y: 720 }, { x: 1220, y: 720 }].map((pos, i) => {
          const p = project(pos.x, pos.y)
          return (
            <g key={i}>
              <rect x={p.x - 22} y={p.y - 18} width="44" height="22" rx="6" fill="#1e293b" />
              <text x={p.x} y={p.y - 2} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">🚻 WC</text>
            </g>
          )
        })}

        {/* TRẠM Y TẾ */}
        {(() => {
          const p = project(700, 720)
          return (
            <g>
              <rect x={p.x - 24} y={p.y - 18} width="48" height="22" rx="6" fill="#ef4444" />
              <text x={p.x} y={p.y - 2} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">🏥 Y TẾ</text>
            </g>
          )
        })()}

        {/* === TUYẾN ĐƯỜNG DẪN A* === */}
        {routePoints && (
          <g filter="url(#routeGlow)">
            <polyline
              points={routePoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
            <polyline
              points={routePoints}
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="18 10"
              strokeDashoffset={-(animTick * 3)}
            />
            <polyline
              points={routePoints}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="18 10"
              strokeDashoffset={-(animTick * 3)}
            />
          </g>
        )}

        {/* === ICON NGƯỜI (VỊ TRÍ CỦA BẠN) === */}
        {(() => {
          const p = startPt
          return (
            <g transform={`translate(${p.x}, ${p.y})`}>
              {/* Vòng sóng lan tỏa */}
              <circle r="28" fill="rgba(59, 130, 246, 0.15)" className="node-pulse" />
              <circle r="18" fill="rgba(59, 130, 246, 0.25)" />

              {/* SVG icon người */}
              <g transform="translate(-10, -32)">
                {/* Đầu */}
                <circle cx="10" cy="6" r="6" fill="#1d4ed8" stroke="#fff" strokeWidth="1.5" />
                {/* Thân */}
                <path d="M4,22 Q3,14 10,12 Q17,14 16,22 Z" fill="#2563eb" stroke="#fff" strokeWidth="1" />
                {/* Chân trái */}
                <path d="M6,22 L4,32" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" />
                {/* Chân phải */}
                <path d="M14,22 L16,32" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" />
                {/* Tay trái */}
                <path d="M4,16 L-2,22" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
                {/* Tay phải */}
                <path d="M16,16 L22,22" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Label */}
              <rect x="-32" y="-50" width="64" height="18" rx="5" fill="#1d4ed8" />
              <text x="0" y="-37" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">BẠN Ở ĐÂY</text>
            </g>
          )
        })()}

        {/* === CÁC PIN / MARKER HIỆN VẬT === */}
        {artifacts.map((art) => {
          const node = MUSEUM_NODES[art.node_id]
          if (!node) return null
          const p = project(node.x, node.y)
          const isSelected = selectedArtifact?.code === art.code

          return (
            <g
              key={art.code}
              transform={`translate(${p.x}, ${p.y})`}
              onClick={e => { e.stopPropagation(); onSelectArtifact(art) }}
              style={{ cursor: 'pointer' }}
              filter={isSelected ? 'url(#pinGlow)' : undefined}
            >
              {/* Vòng sóng khi được chọn */}
              {isSelected && (
                <circle r="36" fill="none" stroke="#f59e0b" strokeWidth="3" className="node-pulse" opacity="0.8" />
              )}

              {/* Thân pin drop */}
              <ellipse cx="0" cy="8" rx="18" ry="6" fill="rgba(0,0,0,0.2)" />
              <path
                d={`M0,-38 C-16,-38 -16,-14 0,0 C16,-14 16,-38 0,-38`}
                fill={isSelected ? '#dc2626' : '#ffffff'}
                stroke={isSelected ? '#7f1d1d' : '#d97706'}
                strokeWidth="2.5"
              />
              {/* Icon emoji trong pin */}
              <text x="0" y="-18" textAnchor="middle" fontSize="14" style={{ userSelect: 'none' }}>
                {ARTIFACT_ICONS[art.code] || '🏛️'}
              </text>

              {/* Badge mã số */}
              <rect x="-14" y="-50" width="28" height="14" rx="4" fill={isSelected ? '#dc2626' : '#1e293b'} />
              <text x="0" y="-39" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900">
                {art.code}
              </text>
            </g>
          )
        })}

        {/* LEGEND */}
        {(() => {
          const lp = project(50, 930)
          return (
            <g transform={`translate(${lp.x}, ${lp.y})`}>
              <rect x="-4" y="-16" width="170" height="22" rx="5" fill="rgba(255,255,255,0.85)" />
              <circle cx="8" cy="-5" r="6" fill="#1d4ed8" />
              <text x="20" y="-1" fontSize="9" fill="#334155" fontWeight="700">Vị trí của bạn</text>
              <circle cx="90" cy="-5" r="5" fill="#dc2626" />
              <text x="102" y="-1" fontSize="9" fill="#334155" fontWeight="700">Hiện vật</text>
            </g>
          )
        })()}
      </svg>

      {/* CSS Animations */}
      <style>{`
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 0.2; }
        }
        .node-pulse {
          animation: nodePulse 2s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes roomPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.3; }
        }
        .room-pulse {
          animation: roomPulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

const ctrlBtnStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.95)',
  border: '1.5px solid #e2e8f0',
  color: '#334155',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  backdropFilter: 'blur(8px)',
  fontSize: '1rem',
  transition: 'all 0.15s ease',
}
