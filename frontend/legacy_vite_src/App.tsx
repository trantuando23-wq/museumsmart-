import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MapPage } from './pages/MapPage'
import { ArtifactPage } from './pages/ArtifactPage'
import { ChatPage } from './pages/ChatPage'
import { Sparkles } from 'lucide-react'

// Three.js nặng nên tải lười (lazy loading) theo yêu cầu kiến trúc
const ViewerPage = lazy(() => import('./pages/ViewerPage'))

function LoadingFallback() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        color: 'var(--gold-primary)',
      }}
    >
      <Sparkles className="node-pulse" size={36} />
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
        Đang khởi tạo không gian 3D bảo tàng...
      </span>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/artifact/:code" element={<ArtifactPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route
          path="/viewer/:code"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ViewerPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
