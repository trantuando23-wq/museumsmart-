import { useState, useCallback } from 'react'
import { ChatMessage, ChatSource } from '../lib/types'
import { streamChat } from '../lib/api'

export function useChatStream(initialArtifactCode?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: 'Xin chào! Tôi là Hướng dẫn viên AI của Bảo tàng Thông minh 🏛️. Bạn có thể hỏi tôi bất kỳ điều gì về lịch sử, nguồn gốc, điển tích hay cách đi lại tìm kiếm các hiện vật trong bảo tàng nhé!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(
    async (text: string, customArtifactCode?: string) => {
      if (!text.trim() || isStreaming) return

      const userMsgId = 'user_' + Date.now()
      const assistantMsgId = 'asst_' + Date.now()
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      const userMsg: ChatMessage = {
        id: userMsgId,
        sender: 'user',
        content: text,
        timestamp: timeStr,
      }

      const assistantPlaceholder: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: timeStr,
      }

      setMessages((prev) => [...prev, userMsg, assistantPlaceholder])
      setIsStreaming(true)

      const targetCode = customArtifactCode || initialArtifactCode

      await streamChat(
        text,
        targetCode,
        (token) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: msg.content + token } : msg
            )
          )
        },
        (sources: ChatSource[]) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, isStreaming: false, sources: sources }
                : msg
            )
          )
          setIsStreaming(false)
        },
        () => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    isStreaming: false,
                    content: msg.content || 'Xin lỗi quý khách, máy chủ AI hiện đang bận. Vui lòng thử lại trong giây lát!',
                  }
                : msg
            )
          )
          setIsStreaming(false)
        }
      )
    },
    [isStreaming, initialArtifactCode]
  )

  return { messages, isStreaming, sendMessage }
}
