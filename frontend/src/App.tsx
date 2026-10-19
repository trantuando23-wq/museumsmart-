import { useState, useEffect } from 'react'
import './App.css'

interface Artifact {
  id: number
  name: string
  description: string
  era: string
  year: number
  category: string
  location: string
  image_url: string
  is_featured: boolean
}

function App() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/artifacts')
      .then((res) => res.json())
      .then((data) => {
        setArtifacts(data.artifacts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>🏛️ Smart Museum</h1>
        <p>Hệ thống bảo tàng thông minh</p>
      </header>

      <main className="main">
        <section className="artifacts-section">
          <h2>Hiện vật nổi bật</h2>
          {loading ? (
            <p className="loading">Đang tải dữ liệu...</p>
          ) : artifacts.length > 0 ? (
            <div className="artifacts-grid">
              {artifacts.map((artifact) => (
                <div key={artifact.id} className="artifact-card">
                  <div className="artifact-badge">{artifact.category}</div>
                  <h3>{artifact.name}</h3>
                  <p className="artifact-era">{artifact.era} ({artifact.year > 0 ? artifact.year : `${Math.abs(artifact.year)} TCN`})</p>
                  <p className="artifact-desc">{artifact.description}</p>
                  <span className="artifact-location">📍 {artifact.location}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Chưa có dữ liệu hiện vật. Hãy khởi động Backend!</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Smart Museum Team</p>
      </footer>
    </div>
  )
}

export default App
