import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Artifact } from '../lib/types'
import { fetchArtifactByCode } from '../lib/api'
import {
  ArrowLeft,
  Navigation,
  MessageSquare,
  Box,
  MapPin,
  Calendar,
  Sparkles,
  HelpCircle,
  Share2,
} from 'lucide-react'

export const ArtifactPage: React.FC = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [artifact, setArtifact] = useState<Artifact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return
    setLoading(true)
    fetchArtifactByCode(code)
      .then((data) => {
        setArtifact(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải thông tin hiện vật')
        setLoading(false)
      })
  }, [code])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold-primary)',
        }}
      >
        <Sparkles className="node-pulse" size={32} />
      </div>
    )
  }

  if (error || !artifact) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--accent-crimson)', marginBottom: 16 }}>{error || 'Không tìm thấy hiện vật'}</p>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'var(--gold-primary)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Quay lại bản đồ
        </button>
      </div>
    )
  }

  const handleAskQuestion = (question: string) => {
    navigate(`/chat?artifact=${artifact.code}&q=${encodeURIComponent(question)}`)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-main)',
        paddingBottom: 60,
      }}
    >
      {/* Top Floating Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          maxWidth: 640,
          margin: '0 auto',
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 800 }}>
            BẢO VẬT QUỐC GIA
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{artifact.code}</div>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: artifact.name,
                text: artifact.description,
                url: window.location.href,
              })
            }
          }}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <Share2 size={16} />
        </button>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 640, margin: '0 auto', padding: '16px' }}>
        {/* Authentic Artifact Showcase Card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 320,
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)',
            border: '1.5px solid var(--border-gold)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={artifact.image_url}
            alt={artifact.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              padding: '12px',
              transition: 'transform 0.3s ease',
            }}
          />
          {/* Subtle gradient overlay at bottom for title banner */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)',
              padding: '18px 18px 14px 18px',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--gold-primary)',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {artifact.category}
            </span>
            <h1
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                marginTop: 6,
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}
            >
              {artifact.name}
            </h1>
          </div>
        </div>

        {/* 3 Prominent Action Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            marginTop: 18,
          }}
        >
          {/* Chỉ đường */}
          <button
            onClick={() => navigate(`/?to=${artifact.code}`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-gold)',
            }}
          >
            <Navigation size={20} fill="#ffffff" />
            <span>Chỉ đường</span>
          </button>

          {/* Hỏi AI */}
          <button
            onClick={() => navigate(`/chat?artifact=${artifact.code}`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              background: '#e0f2fe',
              border: '1px solid #7dd3fc',
              color: '#0369a1',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <MessageSquare size={20} />
            <span>Hỏi AI</span>
          </button>

          {/* Xem 3D */}
          <button
            onClick={() => navigate(`/viewer/${artifact.code}`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '12px 8px',
              borderRadius: 'var(--radius-md)',
              background: '#f3e8ff',
              border: '1px solid #d8b4fe',
              color: '#7e22ce',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Box size={20} />
            <span>Xem 3D</span>
          </button>
        </div>

        {/* Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginTop: 18,
          }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold-primary)', fontSize: '0.8rem', fontWeight: 700 }}>
              <Calendar size={15} /> Thời kỳ & Niên đại
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: 4, color: 'var(--text-main)' }}>{artifact.era}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 2 }}>
              Năm {artifact.year > 0 ? artifact.year : `${Math.abs(artifact.year)} TCN`}
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 700 }}>
              <MapPin size={15} /> Vị trí trưng bày
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: 4, color: 'var(--text-main)' }}>Phòng {artifact.room_code}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 2 }}>{artifact.location}</div>
          </div>
        </div>

        {/* Detailed Story & History */}
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 20,
            marginTop: 18,
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', color: 'var(--gold-primary)', marginBottom: 12, fontWeight: 800 }}>
            Điển tích & Giá trị lịch sử
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.7 }}>
            {artifact.description}
          </p>
          {artifact.detailed_story && (
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 12 }}>
              {artifact.detailed_story}
            </p>
          )}

          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            {artifact.material && (
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Chất liệu:</strong> {artifact.material}
              </div>
            )}
            {artifact.dimensions && (
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Kích thước:</strong> {artifact.dimensions}
              </div>
            )}
          </div>
        </section>

        {/* Clickable Suggested Questions */}
        {artifact.suggested_questions && artifact.suggested_questions.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.88rem',
                fontWeight: 800,
                color: 'var(--gold-primary)',
                marginBottom: 10,
              }}
            >
              <HelpCircle size={16} /> Gợi ý câu hỏi cho AI Thuyết minh:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {artifact.suggested_questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(q)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-card)',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fef3c7'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <span>"{q}"</span>
                  <MessageSquare size={16} color="var(--gold-primary)" style={{ flexShrink: 0, marginLeft: 8 }} />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
