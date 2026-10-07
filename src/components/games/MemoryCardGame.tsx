import React, { useState, useEffect } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { playSound, speakWord } from '../../utils/audio';
import { CelebrationModal } from '../CelebrationModal';

interface MemoryCardGameProps {
  soundEnabled: boolean;
  speechEnabled: boolean;
  onWin: (stars: number) => void;
  onHome: () => void;
}

interface MemoryCard {
  id: number;
  pairId: string;
  emoji: string;
  name: string;
  bgGrad: string;
}

const ANIMAL_PAIRS = [
  { pairId: 'puppy', emoji: '🐶', name: 'Puppy', bgGrad: 'from-amber-200 to-yellow-300' },
  { pairId: 'kitty', emoji: '🐱', name: 'Kitten', bgGrad: 'from-orange-200 to-rose-300' },
  { pairId: 'bunny', emoji: '🐰', name: 'Bunny', bgGrad: 'from-pink-200 to-rose-300' },
  { pairId: 'panda', emoji: '🐼', name: 'Panda', bgGrad: 'from-gray-200 to-slate-300' },
  { pairId: 'lion', emoji: '🦁', name: 'Lion', bgGrad: 'from-amber-300 to-orange-400' },
  { pairId: 'frog', emoji: '🐸', name: 'Frog', bgGrad: 'from-emerald-200 to-teal-300' },
];

export const MemoryCardGame: React.FC<MemoryCardGameProps> = ({
  soundEnabled,
  speechEnabled,
  onWin,
  onHome,
}) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'normal'>('easy');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const setupBoard = (diff: 'easy' | 'normal') => {
    const pairCount = diff === 'easy' ? 3 : 6;
    const selectedAnimals = ANIMAL_PAIRS.slice(0, pairCount);

    const deck: MemoryCard[] = [];
    selectedAnimals.forEach((item, index) => {
      deck.push({
        id: index * 2,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        bgGrad: item.bgGrad,
      });
      deck.push({
        id: index * 2 + 1,
        pairId: item.pairId,
        emoji: item.emoji,
        name: item.name,
        bgGrad: item.bgGrad,
      });
    });

    // Shuffle deck
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIds([]);
    setMatchedPairIds([]);
    setMoves(0);
    setIsChecking(false);
    setShowCelebration(false);
  };

  useEffect(() => {
    setupBoard(difficulty);
  }, [difficulty]);

  const handleCardClick = (card: MemoryCard) => {
    if (isChecking) return;
    if (flippedIds.includes(card.id) || matchedPairIds.includes(card.pairId)) return;

    playSound.pop(soundEnabled);
    const newFlipped = [...flippedIds, card.id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // MATCH!
        playSound.correct(soundEnabled);
        speakWord(`You found the ${firstCard.name}!`, speechEnabled);

        const newMatched = [...matchedPairIds, firstCard.pairId];
        setMatchedPairIds(newMatched);
        setFlippedIds([]);
        setIsChecking(false);

        const targetCount = difficulty === 'easy' ? 3 : 6;
        if (newMatched.length === targetCount) {
          const starsEarned = moves <= (targetCount * 2) ? 3 : 2;
          setTimeout(() => {
            onWin(starsEarned);
            setShowCelebration(true);
          }, 600);
        }
      } else {
        // MISMATCH
        playSound.gentleTryAgain(soundEnabled);
        setTimeout(() => {
          setFlippedIds([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between mb-4 bg-purple-50 p-3 sm:p-4 rounded-3xl border-2 border-purple-200">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🃏</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-purple-950">Memory Card Game</h2>
            <p className="text-xs font-semibold text-purple-700">Find the matching animal buddies!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty pills */}
          <div className="bg-white p-1 rounded-2xl border border-purple-200 flex text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                playSound.pop(soundEnabled);
                setDifficulty('easy');
              }}
              className={`px-2.5 py-1 rounded-xl transition-colors ${
                difficulty === 'easy' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              3 Pairs
            </button>
            <button
              type="button"
              onClick={() => {
                playSound.pop(soundEnabled);
                setDifficulty('normal');
              }}
              className={`px-2.5 py-1 rounded-xl transition-colors ${
                difficulty === 'normal' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              6 Pairs
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound.pop(soundEnabled);
              setupBoard(difficulty);
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-purple-100 text-purple-900 rounded-2xl border border-purple-200 shadow-xs flex items-center gap-1 font-bold text-xs"
            title="Restart game"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`w-full grid gap-3 sm:gap-4 my-3 ${
          difficulty === 'easy' ? 'grid-cols-3 max-w-lg' : 'grid-cols-3 sm:grid-cols-4 max-w-xl'
        }`}
      >
        {cards.map((card) => {
          const isFlipped = flippedIds.includes(card.id);
          const isMatched = matchedPairIds.includes(card.pairId);
          const showFace = isFlipped || isMatched;

          return (
            <button
              key={card.id}
              type="button"
              disabled={showFace}
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-3xl font-black transition-all transform shadow-md relative perspective-1000 ${
                isMatched
                  ? 'bg-emerald-100 border-4 border-emerald-400 scale-95 opacity-90'
                  : showFace
                  ? `bg-gradient-to-tr ${card.bgGrad} border-4 border-purple-400 scale-100 shadow-lg`
                  : 'bg-gradient-to-tr from-purple-500 to-indigo-600 border-4 border-purple-300 hover:scale-103 active:scale-95'
              }`}
              style={{ minHeight: difficulty === 'easy' ? '120px' : '95px' }}
            >
              {showFace ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 animate-flip-in">
                  <span className="text-4xl sm:text-5xl filter drop-shadow">
                    {card.emoji}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800 mt-1">
                    {card.name}
                  </span>
                  {isMatched && (
                    <span className="absolute top-2 right-2 text-emerald-600">
                      <Sparkles className="w-4 h-4 fill-emerald-500" />
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  <span className="text-3xl sm:text-4xl animate-pulse">⭐</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 mt-1">
                    Tap me
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        starsCount={3}
        message="Memory Champion!"
        soundEnabled={soundEnabled}
        onRestart={() => setupBoard(difficulty)}
        onNext={() => {
          setDifficulty(difficulty === 'easy' ? 'normal' : 'easy');
        }}
        onHome={onHome}
      />
    </div>
  );
};
