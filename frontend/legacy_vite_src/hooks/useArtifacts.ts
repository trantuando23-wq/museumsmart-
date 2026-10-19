import { useState, useEffect } from 'react'
import { Artifact } from '../lib/types'
import { fetchArtifacts } from '../lib/api'

export function useArtifacts() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetchArtifacts()
      .then((data) => {
        if (isMounted) {
          setArtifacts(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Lỗi khi tải dữ liệu hiện vật')
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { artifacts, loading, error }
}
