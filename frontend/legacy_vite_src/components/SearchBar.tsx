import React, { useState, useEffect, useRef } from 'react'
import { Search, X, MapPin } from 'lucide-react'
import { Artifact } from '../lib/types'
import { searchArtifacts } from '../lib/api'

interface SearchBarProps {
  onSelectArtifact: (artifact: Artifact) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectArtifact,
  placeholder = 'Tìm hiện vật, phòng trưng bày, thời kỳ...',
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Artifact[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const data = await searchArtifacts(query)
        setResults(data)
        setIsOpen(true)
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: 40 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-full)',
          padding: '10px 18px',
          boxShadow: 'var(--shadow-card)',
          transition: 'all 0.25s ease',
        }}
      >
        <Search size={20} color="var(--gold-primary)" style={{ flexShrink: 0, marginRight: 10 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            fontWeight: 500,
          }}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            maxHeight: '360px',
            overflowY: 'auto',
            zIndex: 50,
            padding: '8px 0',
          }}
        >
          {isSearching ? (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Đang tìm kiếm trong kho hiện vật...
            </div>
          ) : results.length > 0 ? (
            results.map((art) => (
              <div
                key={art.code}
                onClick={() => {
                  onSelectArtifact(art)
                  setIsOpen(false)
                  setQuery('')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 16px',
                  gap: 12,
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229, 169, 59, 0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <img
                  src={art.image_url}
                  alt={art.name}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    objectFit: 'cover',
                    border: '1px solid var(--border-gold)',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {art.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: 'rgba(229, 169, 59, 0.15)',
                        color: 'var(--gold-primary)',
                        fontWeight: 700,
                      }}
                    >
                      {art.code}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 2 }}>
                    <span>{art.era}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <MapPin size={12} color="var(--accent-cyan)" /> {art.room_code}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Không tìm thấy hiện vật phù hợp. Thử gõ "trống đồng", "ấn vàng", hoặc "A01"...
            </div>
          )}
        </div>
      )}
    </div>
  )
}
