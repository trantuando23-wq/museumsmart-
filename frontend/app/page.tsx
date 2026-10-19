'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { MuseumMap } from '@/components/MuseumMap'
import { ArtifactDrawer } from '@/components/ArtifactDrawer'
import { SidePanel } from '@/components/SidePanel'
import {
  MUSEUM_ROOMS,
  MUSEUM_ARTIFACTS,
  MUSEUM_FACILITIES,
  Artifact3D,
  RoomZone,
  AmenityFacility,
} from '@/data/museumData'
import {
  Compass,
  Footprints,
  Sparkles,
  ArrowRight,
  X,
  Volume2,
  CheckCircle2,
  Layers,
} from 'lucide-react'

export default function SmartMuseumPage() {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact3D | null>(
    MUSEUM_ARTIFACTS[0]
  )
  const [activeRouteTarget, setActiveRouteTarget] = useState<
    Artifact3D | AmenityFacility | null
  >(null)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [language, setLanguage] = useState<'VI' | 'EN'>('VI')

  // Tour Gợi ý thông minh (Smart Suggested Tour 10 Bảo Vật)
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentTourIndex, setCurrentTourIndex] = useState(0)

  // Thứ tự tham quan tối ưu toàn bộ 10 bảo vật quốc gia theo chuỗi hành lang liên tục:
  // Cổng 1 -> Trống đồng A01 -> Chuông C07 -> Tượng Phật C03 -> Ấn vàng B02 -> Ngọc ấn B08 -> Mũ quan B05 -> Kiếm Thuận Thiên E06 -> Bình gốm D04 -> Tượng Chăm F09 -> Rồng Thăng Long G10
  const tourArtifactOrder = [
    MUSEUM_ARTIFACTS[0], // A01 - Trống đồng Đông Sơn
    MUSEUM_ARTIFACTS[6], // A07 - Chuông Thiên Mụ
    MUSEUM_ARTIFACTS[2], // A03 - Tượng Phật Quan Âm
    MUSEUM_ARTIFACTS[1], // A02 - Ấn vàng Sắc mệnh chi bảo
    MUSEUM_ARTIFACTS[7], // A08 - Ngọc ấn Hoàng đế chi bảo
    MUSEUM_ARTIFACTS[4], // A05 - Mũ quan nhất phẩm
    MUSEUM_ARTIFACTS[5], // A06 - Kiếm Thuận Thiên Lê Lợi
    MUSEUM_ARTIFACTS[3], // A04 - Bình gốm hoa lam
    MUSEUM_ARTIFACTS[8], // A09 - Tượng Chăm Pa Apsara
    MUSEUM_ARTIFACTS[9], // A10 - Rồng đất nung Thăng Long
  ]

  // Xử lý khi chọn cổ vật
  const handleSelectArtifact = (artifact: Artifact3D) => {
    setSelectedArtifact(artifact)
    setActiveRouteTarget(artifact)
    setIsSidePanelOpen(true)
  }

  // Xử lý khi chọn tiện ích (WC, Quầy vé, Quầy nước, Quầy lưu niệm)
  const handleSelectAmenity = (facility: AmenityFacility) => {
    setActiveRouteTarget(facility)
  }

  // Xử lý khi chọn một phòng trưng bày từ Header hoặc Click phòng
  const handleSelectRoom = (room: RoomZone) => {
    const art = MUSEUM_ARTIFACTS.find((a) => a.roomCode === room.code)
    if (art) {
      handleSelectArtifact(art)
    }
  }

  // Đặt lại điểm về Cổng 1 (Chính) hoặc Cổng 2 (Phố Nguyễn Bỉnh Khiêm)
  const handleResetToEntrance = (gate: 1 | 2 = 1) => {
    setActiveRouteTarget(null)
    if (tourArtifactOrder.length > 0) {
      setSelectedArtifact(tourArtifactOrder[0])
    }
  }

  // Bắt đầu Lộ trình gợi ý 10 bảo vật quốc gia
  const handleStartSuggestedTour = () => {
    setIsTourActive(true)
    setCurrentTourIndex(0)
    const firstArt = tourArtifactOrder[0]
    handleSelectArtifact(firstArt)
  }

  // Bước tiếp theo trong lộ trình gợi ý
  const handleNextTourStep = () => {
    if (currentTourIndex < tourArtifactOrder.length - 1) {
      const nextIdx = currentTourIndex + 1
      setCurrentTourIndex(nextIdx)
      handleSelectArtifact(tourArtifactOrder[nextIdx])
    } else {
      setIsTourActive(false)
      setCurrentTourIndex(0)
    }
  }

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#0B0F19]">
      
      {/* 1. GLOBAL HEADER BAR */}
      <Header
        onSelectArtifact={handleSelectArtifact}
        onSelectRoom={handleSelectRoom}
        onSelectAmenity={handleSelectAmenity}
        onResetToEntrance={handleResetToEntrance}
        onStartSuggestedTour={handleStartSuggestedTour}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'VI' ? 'EN' : 'VI'))}
      />

      {/* 2. TOUR PROGRESS FLOATING BANNER (khi đang trong chế độ Lộ trình 10 bảo vật) */}
      {isTourActive && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 rounded-2xl border border-amber-500/50 bg-slate-950/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl animate-fade-in">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-xs">
            {currentTourIndex + 1}/10
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                {language === 'VI' ? 'Lộ trình 10 Bảo Vật Quốc Gia' : '10 National Treasures Tour'}
              </span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                {tourArtifactOrder[currentTourIndex].code}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-200">
              {language === 'VI'
                ? tourArtifactOrder[currentTourIndex].name
                : tourArtifactOrder[currentTourIndex].nameEn}
            </p>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={handleNextTourStep}
              className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md"
            >
              <span>
                {currentTourIndex === tourArtifactOrder.length - 1
                  ? (language === 'VI' ? 'Hoàn thành' : 'Finish')
                  : (language === 'VI' ? 'Điểm tiếp theo' : 'Next stop')}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsTourActive(false)}
              className="rounded-lg p-1 text-slate-400 hover:text-white"
              title="Dừng lộ trình"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN TOP-DOWN 3D ARCHITECTURAL MAP CONTAINER */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <MuseumMap
          selectedArtifact={selectedArtifact}
          activeRouteTarget={activeRouteTarget}
          onSelectArtifact={handleSelectArtifact}
          onSelectRoom={handleSelectRoom}
          onSelectAmenity={handleSelectAmenity}
          language={language}
        />

        {/* 4. FLOATING ARTIFACT CAROUSEL (BOTTOM-LEFT - 10 BẢO VẬT) */}
        <ArtifactDrawer
          selectedArtifact={selectedArtifact}
          onSelectArtifact={handleSelectArtifact}
          onNavigateToArtifact={handleSelectArtifact}
          language={language}
        />
      </div>

      {/* 5. SLIDE-OVER DETAIL, 3D INSPECTION & AI DOCENT PANEL (RIGHT) */}
      <SidePanel
        artifact={selectedArtifact}
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        onNavigateToArtifact={handleSelectArtifact}
        language={language}
      />
    </main>
  )
}
