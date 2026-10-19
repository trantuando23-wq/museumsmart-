'use client'

import React from 'react'
import { Artifact3D, MUSEUM_ARTIFACTS } from '@/data/museumData'
import { Navigation, Clock, Sparkles } from 'lucide-react'

interface ArtifactDrawerProps {
  selectedArtifact: Artifact3D | null
  onSelectArtifact: (artifact: Artifact3D) => void
  onNavigateToArtifact: (artifact: Artifact3D) => void
  language: 'VI' | 'EN'
}

export const ArtifactDrawer: React.FC<ArtifactDrawerProps> = ({
  selectedArtifact,
  onSelectArtifact,
  onNavigateToArtifact,
  language,
}) => {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-30 lg:right-auto lg:max-w-3xl">
      <div className="pointer-events-auto flex flex-col gap-2 rounded-3xl border border-slate-700/60 bg-slate-950/90 p-3 shadow-2xl backdrop-blur-2xl">
        
        {/* Drawer Header with Title & Badge */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {language === 'VI' ? 'Bộ Sưu Tập 10 Bảo Vật Quốc Gia 3D' : '10 National Treasures 3D Collection'}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {MUSEUM_ARTIFACTS.length} {language === 'VI' ? 'bảo vật tương tác' : 'interactive artifacts'}
          </span>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-3 overflow-x-auto pb-1 pt-1 scrollbar-thin">
          {MUSEUM_ARTIFACTS.map((artifact) => {
            const isSelected = selectedArtifact?.id === artifact.id

            return (
              <div
                key={artifact.id}
                onClick={() => onSelectArtifact(artifact)}
                className={`group relative flex w-64 sm:w-72 flex-shrink-0 cursor-pointer items-center gap-3 rounded-2xl p-2.5 transition-all duration-300 border ${
                  isSelected
                    ? 'border-amber-500 bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900/90 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-800">
                  <img
                    src={artifact.image}
                    alt={artifact.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 text-[9px] font-black text-amber-400 backdrop-blur-sm">
                    {artifact.code}
                  </span>
                </div>

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-400 truncate">
                    {language === 'VI' ? artifact.name : artifact.nameEn}
                  </h4>
                  
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {artifact.roomName.split('-')[0].trim()}
                  </p>

                  <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1 font-medium text-cyan-400">
                      <Clock className="h-3 w-3" />
                      <span>{artifact.walkTime}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 font-bold text-slate-300 border border-slate-700">
                      {artifact.roomCode}
                    </span>
                  </div>
                </div>

                {/* Quick Navigate Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onNavigateToArtifact(artifact)
                  }}
                  title={language === 'VI' ? 'Dẫn đường đến đây' : 'Navigate here'}
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-cyan-500 hover:text-white'
                  }`}
                >
                  <Navigation className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
