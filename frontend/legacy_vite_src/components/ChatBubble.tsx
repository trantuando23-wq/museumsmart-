import React from 'react'
import { ChatMessage } from '../lib/types'
import { Bot, User, BookOpen, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ChatBubbleProps {
  message: ChatMessage
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user'
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 20,
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: isUser
            ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
            : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          flexShrink: 0,
          boxShadow: isUser ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'var(--shadow-gold)',
        }}
      >
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      <div
        style={{
          maxWidth: '82%',
          background: isUser
            ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
            : 'var(--bg-card)',
          backdropFilter: isUser ? 'none' : 'blur(16px)',
          border: isUser ? 'none' : '1px solid var(--border-gold)',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          padding: '14px 18px',
          color: isUser ? '#ffffff' : 'var(--text-main)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.65,
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}
        >
          {message.content}
          {message.isStreaming && (
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 15,
                marginLeft: 4,
                background: isUser ? '#ffffff' : 'var(--gold-primary)',
                animation: 'blink 0.8s infinite',
                verticalAlign: 'middle',
              }}
            />
          )}
        </div>

        <div
          style={{
            fontSize: '0.72rem',
            color: isUser ? 'rgba(255,255,255,0.8)' : 'var(--text-dim)',
            textAlign: isUser ? 'right' : 'left',
            marginTop: 6,
          }}
        >
          {message.timestamp}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div
            style={{
              marginTop: 12,
              paddingTop: 10,
              borderTop: isUser ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: isUser ? '#ffffff' : 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                marginBottom: 8,
              }}
            >
              <BookOpen size={13} /> Nguồn tư liệu bảo tàng:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {message.sources.map((src) => (
                <button
                  key={src.code}
                  onClick={() => navigate(`/artifact/${src.code}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#fef3c7',
                    border: '1px solid var(--border-gold)',
                    color: '#92400e',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fde68a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fef3c7')}
                >
                  <span>{src.name}</span>
                  <span style={{ opacity: 0.7 }}>({src.code})</span>
                  <ExternalLink size={12} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
