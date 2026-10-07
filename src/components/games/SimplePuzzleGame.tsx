import React, { useState, useEffect } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { playSound, speakWord } from '../../utils/audio';
import { CelebrationModal } from '../CelebrationModal';

interface SimplePuzzleGameProps {
  soundEnabled: boolean;
  speechEnabled: boolean;
  onWin: (stars: number) => void;
  onHome: () => void;
}

interface PuzzleTheme {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
  gridSize: 2; // 2x2 = 4 pieces (ideal for toddlers and young kids)
  pieces: {
    id: number;
    subEmoji: string;
    label: string;
    cornerClass: string;
  }[];
}

const PUZZLE_THEMES: PuzzleTheme[] = [
  {
    id: 'dino',
    name: 'Friendly Dinosaur',
    emoji: '🦕',
    bgGradient: 'from-emerald-300 via-teal-200 to-green-300',
    gridSize: 2,
    pieces: [
      { id: 0, subEmoji: '🌿', label: 'Jungle Plant', cornerClass: 'rounded-tl-3xl' },
      { id: 1, subEmoji: '🦕', label: 'Dino Head', cornerClass: 'rounded-tr-3xl' },
      { id: 2, subEmoji: '👣', label: 'Big Footprint', cornerClass: 'rounded-bl-3xl' },
      { id: 3, subEmoji: '🥚', label: 'Dino Egg', cornerClass: 'rounded-br-3xl' },
    ],
  },
  {
    id: 'space',
    name: 'Cosmic Rocket',
    emoji: '🚀',
    bgGradient: 'from-sky-300 via-indigo-200 to-purple-300',
    gridSize: 2,
    pieces: [
      { id: 0, subEmoji: '⭐', label: 'Twinkling Star', cornerClass: 'rounded-tl-3xl' },
      { id: 1, subEmoji: '🚀', label: 'Rocket Ship', cornerClass: 'rounded-tr-3xl' },
      { id: 2, subEmoji: '🪐', label: 'Ringed Planet', cornerClass: 'rounded-bl-3xl' },
      { id: 3, subEmoji: '🌙', label: 'Sleepy Moon', cornerClass: 'rounded-br-3xl' },
    ],
  },
  {
    id: 'safari',
    name: 'Happy Lion',
    emoji: '🦁',
    bgGradient: 'from-amber-200 via-yellow-200 to-orange-300',
    gridSize: 2,
    pieces: [
      { id: 0, subEmoji: '☀️', label: 'Bright Sun', cornerClass: 'rounded-tl-3xl' },
      { id: 1, subEmoji: '🦁', label: 'Lion King', cornerClass: 'rounded-tr-3xl' },
      { id: 2, subEmoji: '🌴', label: 'Palm Tree', cornerClass: 'rounded-bl-3xl' },
      { id: 3, subEmoji: '🐾', label: 'Paw Prints', cornerClass: 'rounded-br-3xl' },
    ],
  },
];

export const SimplePuzzleGame: React.FC<SimplePuzzleGameProps> = ({
  soundEnabled,
  speechEnabled,
  onWin,
  onHome,
}) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = PUZZLE_THEMES[themeIndex];

  // Placed pieces in the 2x2 board: array of length 4, each either piece id or null
  const [placedSlots, setPlacedSlots] = useState<(number | null)[]>([null, null, null, null]);
  // Selected piece tray
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [availablePieceIds, setAvailablePieceIds] = useState<number[]>([0, 1, 2, 3]);
  const [showCelebration, setShowCelebration] = useState(false);

  const resetPuzzle = () => {
    setPlacedSlots([null, null, null, null]);
    setSelectedPieceId(null);
    // Shuffle pieces tray
    setAvailablePieceIds([0, 1, 2, 3].sort(() => Math.random() - 0.5));
    setShowCelebration(false);
  };

  useEffect(() => {
    resetPuzzle();
  }, [themeIndex]);

  // Click on a piece in the tray
  const handleSelectPiece = (pieceId: number) => {
    playSound.pop(soundEnabled);
    const piece = theme.pieces.find((p) => p.id === pieceId);
    if (piece) {
      speakWord(piece.label, speechEnabled);
    }
    setSelectedPieceId(pieceId);
  };

  // Click on a target slot on the board
  const handleSlotClick = (slotIndex: number) => {
    if (selectedPieceId === null) return;

    if (selectedPieceId === slotIndex) {
      // Correct placement!
      playSound.correct(soundEnabled);
      const newPlaced = [...placedSlots];
      newPlaced[slotIndex] = selectedPieceId;
      setPlacedSlots(newPlaced);

      const newAvailable = availablePieceIds.filter((id) => id !== selectedPieceId);
      setAvailablePieceIds(newAvailable);
      setSelectedPieceId(null);

      const piece = theme.pieces.find((p) => p.id === selectedPieceId);
      if (piece) {
        speakWord(`Great! ${piece.label} placed!`, speechEnabled);
      }

      // Check win
      if (newPlaced.every((val) => val !== null)) {
        setTimeout(() => {
          onWin(3);
          setShowCelebration(true);
        }, 500);
      }
    } else {
      // Wrong slot
      playSound.gentleTryAgain(soundEnabled);
      speakWord('Try a different spot!', speechEnabled);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between mb-4 bg-amber-50 p-3 sm:p-4 rounded-3xl border-2 border-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🧩</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-950">Simple Puzzle</h2>
            <p className="text-xs font-semibold text-amber-700">Snap pieces into place!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <div className="flex gap-1 bg-white p-1 rounded-2xl border border-amber-200">
            {PUZZLE_THEMES.map((th, idx) => (
              <button
                key={th.id}
                type="button"
                onClick={() => {
                  playSound.pop(soundEnabled);
                  setThemeIndex(idx);
                }}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-xl text-xs font-bold transition-colors ${
                  themeIndex === idx ? 'bg-amber-400 text-amber-950' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span className="text-sm">{th.emoji}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              playSound.pop(soundEnabled);
              resetPuzzle();
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-amber-100 text-amber-900 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-1 font-bold text-xs"
            title="Restart puzzle"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Main Puzzle Board (2x2) */}
      <div className="w-full max-w-sm aspect-square p-3 bg-white rounded-3xl border-4 border-amber-300 shadow-lg relative my-2">
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 bg-gray-50 rounded-2xl p-2 border-2 border-dashed border-gray-300">
          {[0, 1, 2, 3].map((slotIdx) => {
            const placedPieceId = placedSlots[slotIdx];
            const isFilled = placedPieceId !== null;
            const correctPiece = theme.pieces[slotIdx];

            return (
              <div
                key={slotIdx}
                onClick={() => handleSlotClick(slotIdx)}
                className={`relative flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all ${
                  isFilled
                    ? `bg-gradient-to-tr ${theme.bgGradient} border-2 border-white shadow-md scale-100`
                    : selectedPieceId !== null
                    ? 'bg-amber-50/80 border-2 border-dashed border-amber-400 hover:bg-amber-100 scale-98'
                    : 'bg-white/60 border-2 border-dashed border-gray-200'
                }`}
              >
                {isFilled ? (
                  <div className="flex flex-col items-center justify-center animate-pop-in">
                    <span className="text-5xl sm:text-6xl filter drop-shadow">
                      {correctPiece.subEmoji}
                    </span>
                    <span className="text-[11px] font-black text-gray-800 mt-1">
                      {correctPiece.label}
                    </span>
                    <span className="absolute top-1 right-1 text-emerald-600">
                      <Sparkles className="w-4 h-4 fill-emerald-400" />
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-30">
                    <span className="text-3xl filter grayscale">
                      {correctPiece.subEmoji}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 mt-1">
                      Slot {slotIdx + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pieces Tray (Available to place) */}
      <div className="w-full max-w-sm mt-3 p-4 bg-white rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col items-center">
        <div className="text-xs font-black uppercase tracking-wider text-amber-800 mb-2">
          {availablePieceIds.length > 0 ? 'Tap a piece, then tap its slot!' : 'Puzzle Complete! 🎉'}
        </div>

        <div className="flex gap-2 sm:gap-3 justify-center min-h-[76px] items-center">
          {availablePieceIds.map((pieceId) => {
            const piece = theme.pieces.find((p) => p.id === pieceId)!;
            const isSelected = selectedPieceId === pieceId;

            return (
              <button
                key={pieceId}
                type="button"
                onClick={() => handleSelectPiece(pieceId)}
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center transition-all transform shadow-md active:scale-90 ${
                  isSelected
                    ? 'bg-amber-400 border-4 border-amber-600 scale-110 shadow-lg ring-4 ring-amber-200'
                    : 'bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 hover:scale-105'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{piece.subEmoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        starsCount={3}
        message={`Puzzle Solved! Great ${theme.name}!`}
        soundEnabled={soundEnabled}
        onRestart={resetPuzzle}
        onNext={() => setThemeIndex((prev) => (prev + 1) % PUZZLE_THEMES.length)}
        onHome={onHome}
      />
    </div>
  );
};
