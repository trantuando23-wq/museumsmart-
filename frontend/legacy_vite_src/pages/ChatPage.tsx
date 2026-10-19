import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ChatBubble } from '../components/ChatBubble'
import { BottomNav } from '../components/BottomNav'
import { useChatStream } from '../hooks/useChatStream'
import { Send, ArrowLeft, X } from 'lucide-react'

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const artifactCode = searchParams.get('artifact') || undefined
  const initialQuery = searchParams.get('q')

  const { messages, isStreaming, sendMessage } = useChatStream(artifactCode)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasAutoSentRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialQuery && !hasAutoSentRef.current) {
      hasAutoSentRef.current = true
      sendMessage(initialQuery, artifactCode)
    }
  }, [initialQuery, artifactCode, sendMessage])

  const handleSend = () => {
    if (!inputText.trim() || isStreaming) return
    const text = inputText
    setInputText('')
    sendMessage(text, artifactCode)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const quickQuestions = [
    'Giới thiệu bảo vật tiêu biểu nhất?',
    'Cách di chuyển tới phòng trống đồng A1?',
    'Lịch sử và niên đại của các bảo ấn triều Nguyễn?',
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-main)',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-gold)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 30,
          maxWidth: 600,
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '1.1rem' }}>🏛️</span>
              <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>AI Thuyết Minh Viên</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-emerald)' }} />
              Sẵn sàng giải đáp 24/7 (RAG Powered)
            </div>
          </div>
        </div>

        {artifactCode && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(229, 169, 59, 0.15)',
              border: '1px solid var(--border-gold)',
              fontSize: '0.75rem',
              color: 'var(--gold-primary)',
              fontWeight: 700,
            }}
          >
            <span>{artifactCode}</span>
            <button
              onClick={() => navigate('/chat')}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0 }}
            >
              <X size={12} />
            </button>
          </div>
        )}
      </header>

      {/* Messages Scroll Area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px 140px 16px',
          maxWidth: 600,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {messages.length <= 2 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 8, fontWeight: 600 }}>
              CÂU HỎI THƯỜNG GẶP:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q, artifactCode)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 14px',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(229, 169, 59, 0.1)'
                    e.currentTarget.style.borderColor = 'var(--border-gold)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  }}
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Floating Chat Input Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 68,
          left: 0,
          right: 0,
          maxWidth: 600,
          margin: '0 auto',
          padding: '10px 16px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-subtle)',
          zIndex: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              artifactCode
                ? `Hỏi AI về hiện vật ${artifactCode}...`
                : 'Nhập câu hỏi về bảo tàng, hiện vật, chỉ đường...'
            }
            disabled={isStreaming}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.92rem',
              padding: '6px 8px',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isStreaming}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: inputText.trim() && !isStreaming
                ? 'linear-gradient(135deg, #e5a93b 0%, #c2884a 100%)'
                : 'rgba(255,255,255,0.08)',
              border: 'none',
              color: inputText.trim() && !isStreaming ? '#0a0d14' : 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() && !isStreaming ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
