import React from 'react'
import { RouteResult } from '../lib/types'
import { Navigation, X, Footprints, CheckCircle2 } from 'lucide-react'

interface RoutePanelProps {
  route: RouteResult
  targetName: string
  onClearRoute: () => void
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
  route,
  targetName,
  onClearRoute,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        left: 16,
        right: 16,
        margin: '0 auto',
        maxWidth: 500,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-card)',
        zIndex: 35,
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e5a93b 0%, #c2884a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0d14',
            }}
          >
            <Navigation size={18} fill="#0a0d14" />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Đang chỉ đường đến: <span style={{ color: 'var(--gold-primary)' }}>{targetName}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: 10, marginTop: 2 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Footprints size={14} color="var(--accent-cyan)" /> Khoảng cách ~ {route.totalDistance}m
              </span>
              <span>•</span>
              <span>{route.nodes.length - 1} chặng di chuyển</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClearRoute}
          title="Kết thúc chỉ đường"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-dim)',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Turn by turn guidance accordion preview */}
      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <CheckCircle2 size={14} color="var(--accent-emerald)" />
        <span>Lộ trình tối ưu được tính bởi thuật toán <strong>A* (A-Star Pathfinding)</strong></span>
      </div>
    </div>
  )
}
