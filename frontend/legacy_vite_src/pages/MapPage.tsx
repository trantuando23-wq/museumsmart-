import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapView } from '../components/MapView'
import { SearchBar } from '../components/SearchBar'
import { BottomSheet } from '../components/BottomSheet'
import { RoutePanel } from '../components/RoutePanel'
import { BottomNav } from '../components/BottomNav'
import { useArtifacts } from '../hooks/useArtifacts'
import { Artifact, RouteResult } from '../lib/types'
import { findPathAStar, MUSEUM_NODES } from '../lib/pathfinding'
import { QrCode, Navigation, ChevronUp, ChevronDown, Compass, List, X } from 'lucide-react'

// Emoji icon cho từng cổ vật
const ARTIFACT_ICONS: Record<string, string> = {
  A01: '🥁', A02: '🔑', A03: '🙏', A04: '🏺', A05: '👑',
  A06: '⚔️', A07: '🔔', A08: '💎', A09: '💃', A10: '🐉',
}

// Màu badge cho từng cổ vật
const ROOM_COLORS: Record<string, string> = {
  A1: '#d97706', B2: '#db2777', B3: '#e11d48', C1: '#16a34a',
  C2: '#059669', D3: '#2563eb', E1: '#d97706', F1: '#7c3aed',
  G1: '#15803d',
}

export const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { artifacts } = useArtifacts()

  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [activeRoute, setActiveRoute] = useState<RouteResult | null>(null)
  const [routeTargetName, setRouteTargetName] = useState<string>('')
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [panelTab, setPanelTab] = useState<'list' | 'route'>('list')

  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')
  const [startNodeId] = useState<string>(
    fromParam && MUSEUM_NODES[fromParam] ? fromParam : 'N_ENTRANCE'
  )

  const handleNavigateToArtifact = (artifact: Artifact) => {
    setSelectedArtifact(artifact)
    const targetNodeId = artifact.node_id
    const route = findPathAStar(startNodeId, targetNodeId)
    if (route) {
      setActiveRoute(route)
      setRouteTargetName(`${artifact.name} (${artifact.room_code})`)
      setPanelTab('route')
    }
  }

  useEffect(() => {
    if (toParam && artifacts.length > 0) {
      const target = artifacts.find((a) => a.code.toUpperCase() === toParam.toUpperCase())
      if (target) {
        handleNavigateToArtifact(target)
      }
    }
  }, [toParam, artifacts])

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. HEADER / THANH TÌM KIẾM */}
      <header
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          right: 16,
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Logo + mốc vị trí */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
              padding: '6px 16px', borderRadius: 9999,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1.5px solid rgba(217,119,6,0.25)',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🏛️</span>
            <span style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.04em', color: '#78350f' }}>
              BẢO TÀNG • <span style={{ color: '#d97706' }}>SMART MUSEUM</span>
            </span>
          </div>

          <div
            style={{
              fontSize: '0.72rem', fontWeight: 700, color: '#0284c7',
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
              padding: '5px 12px', borderRadius: 9999,
              border: '1px solid #bae6fd',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <QrCode size={12} />
            <span>Cổng vào chính</span>
          </div>
        </div>

        <SearchBar onSelectArtifact={handleNavigateToArtifact} />
      </header>

      {/* 2. ROUTE PANEL (khi đang dẫn đường) */}
      {activeRoute && (
        <RoutePanel
          route={activeRoute}
          targetName={routeTargetName}
          onClearRoute={() => {
            setActiveRoute(null)
            setSelectedArtifact(null)
            setPanelTab('list')
          }}
        />
      )}

      {/* 3. BẢN ĐỒ */}
      <main style={{ flex: 1, width: '100%', height: '100%' }}>
        <MapView
          artifacts={artifacts}
          selectedArtifact={selectedArtifact}
          activeRoute={activeRoute}
          currentStartNodeId={startNodeId}
          onSelectArtifact={handleNavigateToArtifact}
        />
      </main>

      {/* 4. PANEL DANH SÁCH HIỆN VẬT (bên trái, có thể thu gọn) */}
      <div
        style={{
          position: 'absolute',
          bottom: selectedArtifact ? 280 : 82,
          left: 12,
          zIndex: 42,
          width: isPanelOpen ? 300 : 48,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        }}
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          style={{
            position: 'absolute', top: 8, right: 8, zIndex: 2,
            background: '#0f172a', color: '#fff',
            border: 'none', borderRadius: '50%',
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {isPanelOpen ? <X size={14} /> : <List size={14} />}
        </button>

        {/* Panel content */}
        <div
          style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 18,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.8)',
            overflow: 'hidden',
            minHeight: isPanelOpen ? 0 : 48,
          }}
        >
          {/* Header panel */}
          <div
            style={{
              padding: '12px 40px 10px 14px',
              borderBottom: isPanelOpen ? '1px solid #f1f5f9' : 'none',
              background: 'linear-gradient(to right, #fef3c7, #fff)',
            }}
          >
            {!isPanelOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Compass size={16} color="#d97706" />
              </div>
            ) : (
              <div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => setPanelTab('list')}
                    style={{
                      padding: '4px 10px', borderRadius: 8,
                      border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                      background: panelTab === 'list' ? '#0f172a' : 'transparent',
                      color: panelTab === 'list' ? '#fff' : '#64748b',
                    }}
                  >
                    📋 Danh sách
                  </button>
                  {activeRoute && (
                    <button
                      onClick={() => setPanelTab('route')}
                      style={{
                        padding: '4px 10px', borderRadius: 8,
                        border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
                        background: panelTab === 'route' ? '#d97706' : 'transparent',
                        color: panelTab === 'route' ? '#fff' : '#64748b',
                      }}
                    >
                      🧭 Đường đi
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 3 }}>
                  {artifacts.length} hiện vật · Bấm để dẫn đường
                </div>
              </div>
            )}
          </div>

          {/* Danh sách hiện vật */}
          {isPanelOpen && panelTab === 'list' && (
            <div
              style={{
                maxHeight: 280, overflowY: 'auto', padding: '8px 10px',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}
            >
              {artifacts.map((art) => {
                const isSelected = selectedArtifact?.code === art.code
                const badgeColor = ROOM_COLORS[art.room_code] || '#64748b'
                const icon = ARTIFACT_ICONS[art.code] || '🏛️'
                return (
                  <button
                    key={art.code}
                    onClick={() => handleNavigateToArtifact(art)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 12,
                      background: isSelected
                        ? 'linear-gradient(to right, #fef3c7, #fff7ed)'
                        : 'rgba(248,250,252,0.8)',
                      border: isSelected ? '1.5px solid #f59e0b' : '1px solid transparent',
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 12px rgba(245,158,11,0.2)' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#f1f5f9'
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(248,250,252,0.8)'
                    }}
                  >
                    {/* Emoji icon */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${badgeColor}15`,
                      border: `1.5px solid ${badgeColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', flexShrink: 0,
                    }}>
                      {icon}
                    </div>

                    {/* Tên + mã phòng */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.8rem', fontWeight: isSelected ? 800 : 600,
                        color: isSelected ? '#78350f' : '#1e293b',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {art.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 800,
                          padding: '1px 6px', borderRadius: 4,
                          background: badgeColor, color: '#fff',
                        }}>
                          {art.room_code}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                          {art.code}
                        </span>
                      </div>
                    </div>

                    {/* Icon điều hướng */}
                    <Navigation size={14} color={isSelected ? '#d97706' : '#cbd5e1'} style={{ flexShrink: 0 }} />
                  </button>
                )
              })}
            </div>
          )}

          {/* Tab đường đi */}
          {isPanelOpen && panelTab === 'route' && activeRoute && (
            <div style={{ padding: '10px 12px', maxHeight: 280, overflowY: 'auto' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                padding: '8px 12px', borderRadius: 10,
                background: 'linear-gradient(to right, #fef3c7, #fff7ed)',
                border: '1px solid #f59e0b',
              }}>
                <Navigation size={16} color="#d97706" />
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#78350f' }}>
                    {routeTargetName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#b45309' }}>
                    ~{activeRoute.totalDistance}m · {activeRoute.steps.length} bước
                  </div>
                </div>
              </div>
              {activeRoute.steps.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start',
                  padding: '5px 0', borderBottom: i < activeRoute.steps.length - 1 ? '1px dashed #f1f5f9' : 'none',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#0f172a', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800, flexShrink: 0, marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.4 }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. BOTTOM SHEET CHI TIẾT HIỆN VẬT */}
      <BottomSheet
        artifact={selectedArtifact}
        onClose={() => {
          setSelectedArtifact(null)
          setActiveRoute(null)
          setPanelTab('list')
        }}
        onNavigateToArtifact={handleNavigateToArtifact}
      />

      {/* 6. BOTTOM NAVIGATION */}
      <BottomNav />
    </div>
  )
}
