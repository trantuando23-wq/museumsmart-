import React from 'react'
import { Map, MessageSquare } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isMap = location.pathname === '/' || location.pathname.startsWith('/map')
  const isChat = location.pathname.startsWith('/chat')

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 68,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        maxWidth: 600,
        margin: '0 auto',
        padding: '0 24px',
      }}
    >
      {/* Map Tab */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: 'none',
          color: isMap ? 'var(--gold-primary)' : 'var(--text-dim)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          padding: '6px 20px',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <Map size={22} strokeWidth={isMap ? 2.5 : 2} />
        <span style={{ fontSize: '0.75rem', fontWeight: isMap ? 700 : 500 }}>Bản đồ</span>
      </button>

      {/* Chat AI Tab */}
      <button
        onClick={() => navigate('/chat')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          background: 'none',
          border: 'none',
          color: isChat ? 'var(--gold-primary)' : 'var(--text-dim)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          padding: '6px 20px',
          borderRadius: 'var(--radius-md)',
          position: 'relative',
        }}
      >
        <MessageSquare size={22} strokeWidth={isChat ? 2.5 : 2} />
        <span style={{ fontSize: '0.75rem', fontWeight: isChat ? 700 : 500 }}>Hỏi AI</span>
        <span
          style={{
            position: 'absolute',
            top: 4,
            right: 18,
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: 'var(--gold-primary)',
            boxShadow: '0 0 8px var(--gold-primary)',
          }}
        />
      </button>
    </nav>
  )
}
