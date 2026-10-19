'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  MapPin,
  Globe,
  Route,
  X,
  ChevronRight,
  Flame,
  Coffee,
  Ticket,
} from 'lucide-react'
import {
  MUSEUM_ROOMS,
  MUSEUM_ARTIFACTS,
  MUSEUM_FACILITIES,
  Artifact3D,
  RoomZone,
  AmenityFacility,
} from '@/data/museumData'

interface HeaderProps {
  onSelectArtifact: (artifact: Artifact3D) => void
  onSelectRoom: (room: RoomZone) => void
  onSelectAmenity?: (facility: AmenityFacility) => void
  onResetToEntrance: (gate?: 1 | 2) => void
  onStartSuggestedTour: () => void
  language: 'VI' | 'EN'
  onToggleLanguage: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onSelectArtifact,
  onSelectRoom,
  onSelectAmenity,
  onResetToEntrance,
  onStartSuggestedTour,
  language,
  onToggleLanguage,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Phím tắt Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Đóng kết quả khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Tìm kiếm trên toàn bộ 10 cổ vật, các phòng và tiện ích
  const filteredArtifacts = searchQuery.trim()
    ? MUSEUM_ARTIFACTS.filter(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.era.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.roomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const filteredRooms = searchQuery.trim()
    ? MUSEUM_ROOMS.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.theme.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const filteredAmenities = searchQuery.trim()
    ? MUSEUM_FACILITIES.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const totalResults =
    filteredArtifacts.length + filteredRooms.length + filteredAmenities.length

  return (
    <header className="relative z-40 w-full px-4 pt-3 pb-2 transition-all duration-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        
        {/* LOGO & BRANDING */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-800 to-cyan-500/10 border border-amber-500/40 shadow-lg shadow-amber-500/10">
              <span className="text-2xl animate-pulse">🏛️</span>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  {language === 'VI' ? 'BẢO TÀNG LỊCH SỬ THÔNG MINH' : 'HISTORICAL SMART MUSEUM'}
                </h1>
                <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-700/50">
                  3D TOP-DOWN
                </span>
              </div>
              <p className="text-[11px] font-medium tracking-wider text-slate-400">
                {language === 'VI'
                  ? 'Sơ đồ 3D kiến trúc & 10 Bảo vật Quốc gia'
                  : '3D Floorplan & 10 National Treasures'}
              </p>
            </div>
          </div>

          {/* Quick Language Toggle on Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200"
            >
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>{language}</span>
            </button>
          </div>
        </div>

        {/* SEARCH BAR WITH KEYBOARD SHORTCUT */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchOpen(true)
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={
                language === 'VI'
                  ? 'Tìm 10 bảo vật (A01-A10, Trống đồng, Kiếm Lê Lợi), WC, Quầy vé...'
                  : 'Search 10 treasures, rooms, WC, Ticket booth...'
              }
              className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/90 py-2.5 pl-10 pr-20 text-xs sm:text-sm text-slate-100 placeholder-slate-400 backdrop-blur-xl transition-all duration-200 focus:border-cyan-500/80 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setIsSearchOpen(false)
                  }}
                  className="rounded-full p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-semibold text-slate-400 shadow-sm">
                  <span>Ctrl</span>+<span>K</span>
                </kbd>
              )}
            </div>
          </div>

          {/* AUTOCOMPLETE DROPDOWN */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-96 overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
              {totalResults === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  {language === 'VI'
                    ? 'Không tìm thấy kết quả phù hợp cho "' + searchQuery + '"'
                    : 'No results found for "' + searchQuery + '"'}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Cổ vật (10 bảo vật) */}
                  {filteredArtifacts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        <Flame className="h-3.5 w-3.5" />
                        <span>
                          {language === 'VI' ? 'Bảo vật Quốc gia' : 'National Treasures'} ({filteredArtifacts.length})
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {filteredArtifacts.map((art) => (
                          <button
                            key={art.id}
                            onClick={() => {
                              onSelectArtifact(art)
                              setIsSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all hover:bg-slate-800/80 hover:border-slate-700 border border-transparent"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={art.image}
                                alt={art.name}
                                className="h-10 w-10 rounded-lg object-cover border border-amber-500/30 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs sm:text-sm text-slate-100 group-hover:text-amber-400 truncate">
                                    {language === 'VI' ? art.name : art.nameEn}
                                  </span>
                                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                                    {art.code}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {art.era} • {art.roomName}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tiện ích (WC, Vé, Café) */}
                  {filteredAmenities.length > 0 && (
                    <div className="border-t border-slate-800/80 pt-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                        <span>🚻 Tiện ích dịch vụ</span> ({filteredAmenities.length})
                      </div>
                      <div className="mt-1 space-y-1">
                        {filteredAmenities.map((facility) => (
                          <button
                            key={facility.id}
                            onClick={() => {
                              if (onSelectAmenity) onSelectAmenity(facility)
                              setIsSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all hover:bg-slate-800/80 hover:border-slate-700 border border-transparent"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{facility.icon}</span>
                              <div>
                                <span className="font-medium text-xs sm:text-sm text-slate-100 group-hover:text-cyan-400">
                                  {language === 'VI' ? facility.name : facility.nameEn}
                                </span>
                                <p className="text-[11px] text-slate-400">{facility.description}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phòng trưng bày */}
                  {filteredRooms.length > 0 && (
                    <div className="border-t border-slate-800/80 pt-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>
                          {language === 'VI' ? 'Không gian bảo tàng' : 'Museum Galleries'} ({filteredRooms.length})
                        </span>
                      </div>
                      <div className="mt-1 space-y-1">
                        {filteredRooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => {
                              onSelectRoom(room)
                              setIsSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all hover:bg-slate-800/80 hover:border-slate-700 border border-transparent"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black text-white"
                                style={{ backgroundColor: room.color }}
                              >
                                {room.code}
                              </div>
                              <div>
                                <span className="font-medium text-xs sm:text-sm text-slate-100 group-hover:text-cyan-400">
                                  {language === 'VI' ? room.name : room.nameEn}
                                </span>
                                <p className="text-[11px] text-slate-400">{room.theme}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* QUICK ACTION PILLS (CỔNG 1, CỔNG 2, LỘ TRÌNH, NGÔN NGỮ) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cổng 1 (Chính) */}
          <button
            onClick={() => onResetToEntrance(1)}
            className="flex items-center gap-1.5 rounded-2xl border border-cyan-500/30 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400 transition-all shadow-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-cyan-400 animate-bounce" />
            <span>{language === 'VI' ? 'Cổng 1 (Chính)' : 'Gate 1 (Main)'}</span>
          </button>

          {/* Cổng 2 (Nguyễn Bỉnh Khiêm) */}
          <button
            onClick={() => onResetToEntrance(2)}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-white transition-all shadow-sm"
          >
            <Ticket className="h-3.5 w-3.5 text-amber-400" />
            <span>{language === 'VI' ? 'Cổng 2 (Phố NBK)' : 'Gate 2 (NBK St.)'}</span>
          </button>

          {/* Lộ trình gợi ý 10 bảo vật */}
          <button
            onClick={onStartSuggestedTour}
            className="flex items-center gap-1.5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-slate-900 px-3 py-2 text-xs font-semibold text-amber-300 hover:border-amber-400 transition-all shadow-sm"
          >
            <Route className="h-3.5 w-3.5 text-amber-400" />
            <span>{language === 'VI' ? 'Tour 10 Bảo Vật' : 'Tour 10 Treasures'}</span>
          </button>

          {/* Language Switcher Button (Desktop) */}
          <button
            onClick={onToggleLanguage}
            className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-bold text-slate-300 hover:border-slate-500 hover:text-white transition-all"
            title="Đổi ngôn ngữ"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span>{language}</span>
          </button>
        </div>

      </div>
    </header>
  )
}
