import React from 'react'
import { Artifact } from '../lib/types'
import { Navigation, Info, X, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface BottomSheetProps {
  artifact: Artifact | null
  onClose: () => void
  onNavigateToArtifact: (artifact: Artifact) => void
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  artifact,
  onClose,
  onNavigateToArtifact,
}) => {
  const navigate = useNavigate()

  if (!artifact) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 76,
        left: 0,
        right: 0,
        margin: '0 auto',
        maxWidth: 540,
        padding: '0 16px',
        zIndex: 45,
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: 18,
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: '#f1f5f9',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
              border: '1.5px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={artifact.image_url}
              alt={artifact.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0, paddingRight: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid var(--border-gold)',
                }}
              >
                {artifact.code}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {artifact.category}
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {artifact.name}
            </h3>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 500 }}>
              <MapPin size={13} color="var(--accent-cyan)" /> {artifact.location}
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: '0.86rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginTop: 12,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {artifact.description}
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            onClick={() => onNavigateToArtifact(artifact)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '11px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            <Navigation size={18} fill="#ffffff" />
            Chỉ đường
          </button>

          <button
            onClick={() => navigate(`/artifact/${artifact.code}`)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '11px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#f8fafc',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
            }}
          >
            <Info size={18} color="var(--gold-primary)" />
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  )
}
