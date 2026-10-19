import { Artifact, ChatSource } from './types'

const BASE_URL = '/api'

export async function fetchArtifacts(): Promise<Artifact[]> {
  const res = await fetch(`${BASE_URL}/artifacts`)
  if (!res.ok) throw new Error('Không thể tải danh sách hiện vật')
  const data = await res.json()
  return data.artifacts || []
}

export async function fetchArtifactByCode(code: string): Promise<Artifact> {
  const res = await fetch(`${BASE_URL}/artifacts/${code}`)
  if (!res.ok) throw new Error(`Không tìm thấy hiện vật ${code}`)
  return res.json()
}

export async function searchArtifacts(query: string): Promise<Artifact[]> {
  if (!query.trim()) return []
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Lỗi tìm kiếm')
  return res.json()
}

export async function streamChat(
  message: string,
  artifactCode?: string,
  onToken?: (token: string) => void,
  onDone?: (sources: ChatSource[]) => void,
  onError?: (err: any) => void
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, artifact_code: artifactCode }),
    })

    if (!response.ok || !response.body) {
      throw new Error('Lỗi kết nối chat stream')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6))
            if (data.type === 'token' && onToken) {
              onToken(data.content)
            } else if (data.type === 'done' && onDone) {
              onDone(data.sources || [])
            }
          } catch (e) {
            // ignore non-json line
          }
        }
      }
    }
  } catch (error) {
    if (onError) onError(error)
  }
}
