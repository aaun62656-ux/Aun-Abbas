import React from 'react';
import { Home, Volume2, VolumeX, Lock, Star, Smartphone, Tablet, Monitor } from 'lucide-react';
import { GameType } from '../types';
import { playSound } from '../utils/audio';

interface HeaderProps {
  currentGame: GameType;
  onNavigateHome: () => void;
  onOpenParentGate: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  totalStars: number;
  viewportMode: 'mobile' | 'tablet' | 'full';
  onChangeViewport: (mode: 'mobile' | 'tablet' | 'full') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentGame,
  onNavigateHome,
  onOpenParentGate,
  soundEnabled,
  onToggleSound,
  totalStars,
  viewportMode,
  onChangeViewport,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-100 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left Zone: Brand / Home Button */}
        <div className="flex items-center gap-2">
          {currentGame !== 'home' ? (
            <button
              type="button"
              onClick={() => {
                playSound.pop(soundEnabled);
                onNavigateHome();
              }}
              className="flex items-center gap-2 px-3 py-2 bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-sm sm:text-base rounded-2xl shadow-sm transition-transform"
              aria-label="Go to Home Screen"
            >
              <Home className="w-5 h-5 stroke-[2.5]" />
              <span className="hidden xs:inline">Home</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🎈</span>
              <span className="font-black text-lg sm:text-xl text-sky-600 tracking-tight">
                Kids Fun Games
              </span>
            </div>
          )}
        </div>

        {/* Center Zone: Device Switcher (for previewing Android Phone vs Tablet responsiveness) */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            title="Android Phone View"
            onClick={() => onChangeViewport('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              viewportMode === 'mobile'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
          <button
            type="button"
            title="Android Tablet View"
            onClick={() => onChangeViewport('tablet')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              viewportMode === 'tablet'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            title="Full Screen Responsive View"
            onClick={() => onChangeViewport('full')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              viewportMode === 'full'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full</span>
          </button>
        </div>

        {/* Right Zone: Stars, Sound & Parent Lock */}
        <div className="flex items-center gap-2">
          {/* Star counter */}
          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-amber-900 tabular-nums">
              {totalStars}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              playSound.pop(!soundEnabled);
              onToggleSound();
            }}
            className={`p-2 rounded-2xl border-2 transition-transform active:scale-90 ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200'
            }`}
            aria-label={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <VolumeX className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>

          {/* Parent Zone Button */}
          {currentGame !== 'parent_zone' && (
            <button
              type="button"
              onClick={() => {
                playSound.pop(soundEnabled);
                onOpenParentGate();
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-800 font-bold text-xs sm:text-sm rounded-2xl transition-transform active:scale-95 shadow-xs"
              aria-label="Parent Zone"
            >
              <Lock className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Parents</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
