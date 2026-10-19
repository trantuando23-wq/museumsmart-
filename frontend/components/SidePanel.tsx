'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Artifact3D } from '@/data/museumData'
import { Artifact3DViewer } from './Artifact3DViewer'
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Box,
  Image as ImageIcon,
  FileText,
  Navigation,
  Compass,
  ChevronDown,
  Layers,
  Award,
  Calendar,
  Layers3,
  Bot,
  User,
  Check,
  Maximize2,
} from 'lucide-react'

interface SidePanelProps {
  artifact: Artifact3D | null
  isOpen: boolean
  onClose: () => void
  onNavigateToArtifact: (artifact: Artifact3D) => void
  language: 'VI' | 'EN'
}

interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: string
}

export const SidePanel: React.FC<SidePanelProps> = ({
  artifact,
  isOpen,
  onClose,
  onNavigateToArtifact,
  language,
}) => {
  // Upper Section Tab: 3D | Image | Archaeology Specs
  const [activeTab, setActiveTab] = useState<'3d' | 'image' | 'specs'>('3d')

  // Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  // AI Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoadingAi, setIsLoadingAi] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  // Khi chuyển hiện vật, khởi tạo lời chào và tin nhắn mở đầu của Tiến sĩ Di sản
  useEffect(() => {
    if (artifact) {
      setActiveTab('3d')
      setIsPlayingAudio(false)
      window.speechSynthesis?.cancel()

      const initialAiGreeting: ChatMessage = {
        id: `greet-${artifact.id}`,
        sender: 'assistant',
        content: `**Kính chào quý khách!** Tôi là Tiến sĩ Di sản, Thuyết minh viên trưởng của bảo tàng.

Rất hân hạnh được đồng hành cùng quý khách chiêm ngưỡng bảo vật **"${artifact.name}"** (${artifact.era}).

Quý khách có thể bấm nút **Phát thuyết minh giọng đọc** ở trên, hoặc chọn nhanh các câu hỏi bên dưới để chúng ta cùng giải mã những bí mật ngàn năm của di sản này!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([initialAiGreeting])
    }
  }, [artifact])

  // Tự động cuộn xuống đáy khi có tin nhắn mới
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages, isLoadingAi])

  // Trình phát thuyết minh Web Speech Synthesis (TTS)
  const handleToggleAudio = () => {
    if (!artifact) return

    if (isPlayingAudio) {
      window.speechSynthesis?.cancel()
      setIsPlayingAudio(false)
      setAudioProgress(0)
      return
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(artifact.audioIntro)
      utterance.lang = language === 'VI' ? 'vi-VN' : 'en-US'
      utterance.rate = 0.95
      utterance.pitch = 1.0

      utterance.onstart = () => {
        setIsPlayingAudio(true)
      }

      utterance.onend = () => {
        setIsPlayingAudio(false)
        setAudioProgress(0)
      }

      utterance.onerror = () => {
        setIsPlayingAudio(false)
        setAudioProgress(0)
      }

      synthRef.current = utterance
      window.speechSynthesis.speak(utterance)

      // Simulated Progress timer
      let progress = 0
      const interval = setInterval(() => {
        progress += 100 / (artifact.audioDuration || 60)
        if (progress >= 100) {
          clearInterval(interval)
          setAudioProgress(0)
        } else {
          setAudioProgress(Math.min(progress, 100))
        }
      }, 1000)
    } else {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc thuyết minh tự động.')
    }
  }

  // Gửi câu hỏi đến AI Docent API
  const handleSendMessage = async (customPrompt?: string) => {
    const questionText = customPrompt || inputValue
    if (!questionText.trim() || !artifact || isLoadingAi) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: questionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!customPrompt) setInputValue('')
    setIsLoadingAi(true)

    try {
      const res = await fetch('/api/docent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactId: artifact.id,
          userQuestion: userMsg.content,
          chatHistory: messages.map((m) => ({ sender: m.sender, content: m.content })),
        }),
      })

      const data = await res.json()
      if (res.ok && data.answer) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, assistantMsg])
      } else {
        throw new Error(data.error || 'Lỗi kết nối thuyết minh viên')
      }
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        content: `**Tiến sĩ Di sản:** Rất tiếc, đã có gián đoạn kết nối. Tuy nhiên, về bảo vật **${artifact.name}**, xin lưu ý: ${artifact.fullStory}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, fallbackMsg])
    } finally {
      setIsLoadingAi(false)
    }
  }

  // Nhận diện giọng nói Voice Input qua Web Speech Recognition
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech.')
      return
    }

    if (isRecording) {
      setIsRecording(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language === 'VI' ? 'vi-VN' : 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(transcript)
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  if (!isOpen || !artifact) return null

  return (
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full sm:max-w-xl md:max-w-2xl flex-col border-l border-slate-700/60 bg-slate-950/95 shadow-2xl backdrop-blur-2xl transition-all duration-300">
      
      {/* 1. TOP HEADER: TITLE & CONTROLS */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black">
            {artifact.code}
          </span>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-100 truncate">
              {language === 'VI' ? artifact.name : artifact.nameEn}
            </h2>
            <p className="text-[11px] text-amber-400/90 truncate font-medium">
              {artifact.nationalTreasureRank}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Navigate Button */}
          <button
            onClick={() => onNavigateToArtifact(artifact)}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-500/25 hover:from-cyan-500 hover:to-cyan-400 transition-all"
          >
            <Navigation className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{language === 'VI' ? 'Dẫn đường' : 'Navigate'}</span>
          </button>

          {/* Close Panel Button */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. UPPER SECTION - 3D INSPECTION, ACTUAL IMAGE & ARCHAEOLOGICAL SPECS */}
      <div className="border-b border-slate-800/80 p-4 bg-slate-900/40">
        
        {/* Tab Switcher */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/90 p-1">
            <button
              onClick={() => setActiveTab('3d')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                activeTab === '3d'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="h-3.5 w-3.5" />
              <span>{language === 'VI' ? 'Mô hình 3D' : '3D Model'}</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                activeTab === 'image'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{language === 'VI' ? 'Ảnh thực tế' : 'Real Photo'}</span>
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                activeTab === 'specs'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{language === 'VI' ? 'Thông số khảo cổ' : 'Specs'}</span>
            </button>
          </div>

          <span className="text-[11px] font-medium text-slate-400">
            {artifact.roomName.split('-')[0].trim()}
          </span>
        </div>

        {/* Tab 1: 3D Model Inspector */}
        {activeTab === '3d' && (
          <Artifact3DViewer artifact={artifact} language={language} />
        )}

        {/* Tab 2: Real Photographic Archive */}
        {activeTab === 'image' && (
          <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950">
            <img
              src={artifact.image}
              alt={artifact.name}
              className="h-full w-full object-contain"
            />
            <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-slate-950/85 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md border border-slate-800">
              {artifact.shortDescription}
            </div>
          </div>
        )}

        {/* Tab 3: Detailed Archaeological Specs */}
        {activeTab === 'specs' && (
          <div className="h-72 w-full overflow-y-auto rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 text-xs space-y-2.5 scrollbar-thin">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-[10px] text-slate-400 block font-medium">Niên đại khảo cổ</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{artifact.era}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-[10px] text-slate-400 block font-medium">Chất liệu chế tác</span>
                <span className="font-bold text-amber-300 mt-0.5 block">{artifact.material}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-[10px] text-slate-400 block font-medium">Quy chuẩn kích thước</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{artifact.dimensions}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-[10px] text-slate-400 block font-medium">Khối lượng hiện vật</span>
                <span className="font-bold text-slate-200 mt-0.5 block">{artifact.weight || 'Đang cập nhật'}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <span className="text-[10px] text-cyan-400 block font-bold uppercase tracking-wider mb-1">
                Kỹ thuật chế tác độc bản
              </span>
              <p className="text-slate-300 leading-relaxed">{artifact.craftingTechnique}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <span className="text-[10px] text-amber-400 block font-bold uppercase tracking-wider mb-1">
                Tình trạng bảo tồn hiện tại
              </span>
              <p className="text-slate-300 leading-relaxed">{artifact.preservationStatus}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. AUDIO WAVEFORM & SPEECH PLAYER BAR */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleAudio}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
              isPlayingAudio
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-600/30'
            }`}
            title={isPlayingAudio ? 'Dừng đọc' : 'Phát thuyết minh tự động'}
          >
            {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-300">
                {language === 'VI' ? 'Giọng đọc Thuyết minh viên' : 'Audio Narration'}
              </span>
              <span className="text-[10px] text-slate-400">({artifact.audioDuration}s)</span>
            </div>
            <p className="text-[10px] text-slate-400">{artifact.narrator}</p>
          </div>
        </div>

        {/* Simulated Audio Waveform Bars */}
        <div className="flex items-center gap-1 h-7 px-2">
          {[4, 12, 22, 16, 26, 18, 10, 24, 14, 6].map((height, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlayingAudio
                  ? 'bg-gradient-to-t from-purple-500 to-cyan-400 wave-bar'
                  : 'bg-slate-700'
              }`}
              style={{
                height: isPlayingAudio ? `${height}px` : '6px',
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 4. LOWER SECTION - AI MUSEUM DOCENT (CONVERSATION & INPUT) */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-950/60">
        
        {/* Chat History Container */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user'

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/40 mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.content}
                  <span
                    className={`block mt-1.5 text-[9px] ${
                      isUser ? 'text-cyan-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-600/30 text-cyan-400 border border-cyan-500/40 mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            )
          })}

          {/* AI Thinking Animation */}
          {isLoadingAi && (
            <div className="flex items-center gap-2 text-xs text-purple-400 py-2">
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>{language === 'VI' ? 'Tiến sĩ Di sản đang tra cứu văn bia khảo cổ...' : 'AI Docent is referencing historical archives...'}</span>
            </div>
          )}
        </div>

        {/* Quick Prompt Chips */}
        <div className="border-t border-slate-800/80 px-4 py-2 bg-slate-900/80">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {artifact.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="flex-shrink-0 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3 py-1.5 text-[11px] font-medium text-purple-300 hover:border-purple-400 hover:bg-purple-900/50 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Text & Voice Input Field */}
        <div className="border-t border-slate-800/80 p-3 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition-all ${
                isRecording
                  ? 'border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
              title={isRecording ? 'Đang lắng nghe...' : 'Hỏi bằng giọng nói'}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            {/* Input Text Box */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isRecording
                  ? (language === 'VI' ? 'Đang nghe... xin mời nói' : 'Listening... please speak')
                  : (language === 'VI' ? 'Hỏi Tiến sĩ Di sản về cổ vật này...' : 'Ask the AI Museum Docent...')
              }
              className="flex-1 rounded-xl border border-slate-700/80 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoadingAi}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-purple-500 hover:to-purple-400 transition-all shadow-md shadow-purple-600/25"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </aside>
  )
}
