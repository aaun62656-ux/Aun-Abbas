import React, { useState, useEffect } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { playSound, speakWord } from '../../utils/audio';
import { CelebrationModal } from '../CelebrationModal';

interface NumberMatchingGameProps {
  soundEnabled: boolean;
  speechEnabled: boolean;
  onWin: (stars: number) => void;
  onHome: () => void;
}

interface MatchPair {
  number: number;
  itemEmoji: string;
  itemName: string;
  color: string;
}

const ALL_PAIRS: MatchPair[] = [
  { number: 1, itemEmoji: '🐶', itemName: 'puppy', color: 'from-amber-400 to-orange-400' },
  { number: 2, itemEmoji: '🍎', itemName: 'apples', color: 'from-rose-400 to-red-400' },
  { number: 3, itemEmoji: '🚗', itemName: 'cars', color: 'from-sky-400 to-blue-400' },
  { number: 4, itemEmoji: '⭐', itemName: 'stars', color: 'from-yellow-400 to-amber-500' },
  { number: 5, itemEmoji: '🎈', itemName: 'balloons', color: 'from-purple-400 to-indigo-500' },
  { number: 6, itemEmoji: '🐸', itemName: 'frogs', color: 'from-emerald-400 to-green-500' },
  { number: 7, itemEmoji: '🌸', itemName: 'flowers', color: 'from-pink-400 to-rose-400' },
  { number: 8, itemEmoji: '🐟', itemName: 'fish', color: 'from-teal-400 to-cyan-500' },
  { number: 9, itemEmoji: '🍓', itemName: 'strawberries', color: 'from-red-400 to-pink-500' },
  { number: 10, itemEmoji: '🦆', itemName: 'ducks', color: 'from-yellow-400 to-amber-400' },
];

export const NumberMatchingGame: React.FC<NumberMatchingGameProps> = ({
  soundEnabled,
  speechEnabled,
  onWin,
  onHome,
}) => {
  const [level, setLevel] = useState(1);
  const [activePairs, setActivePairs] = useState<MatchPair[]>([]);
  const [shuffledCards, setShuffledCards] = useState<MatchPair[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedItemNumber, setSelectedItemNumber] = useState<number | null>(null);
  const [matchedNumbers, setMatchedNumbers] = useState<number[]>([]);
  const [isWobbling, setIsWobbling] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const initRound = (lvl: number) => {
    // Round 1: 1..4, Round 2: 3..7, Round 3: 5..9 or random 4
    let chosen: MatchPair[] = [];
    if (lvl === 1) {
      chosen = ALL_PAIRS.slice(0, 4);
    } else if (lvl === 2) {
      chosen = ALL_PAIRS.slice(2, 6);
    } else {
      const startIdx = (lvl % 5);
      chosen = ALL_PAIRS.slice(startIdx, startIdx + 4);
    }

    setActivePairs(chosen);
    // Shuffle the items column
    setShuffledCards([...chosen].sort(() => Math.random() - 0.5));
    setSelectedNumber(null);
    setSelectedItemNumber(null);
    setMatchedNumbers([]);
    setShowCelebration(false);
  };

  useEffect(() => {
    initRound(level);
  }, [level]);

  // Handle number click
  const handleSelectNumber = (num: number) => {
    if (matchedNumbers.includes(num)) return;
    playSound.pop(soundEnabled);
    speakWord(num.toString(), speechEnabled);

    if (selectedItemNumber !== null) {
      checkMatch(num, selectedItemNumber);
    } else {
      setSelectedNumber(num);
    }
  };

  // Handle item card click
  const handleSelectItem = (num: number, pair: MatchPair) => {
    if (matchedNumbers.includes(num)) return;
    playSound.pop(soundEnabled);
    speakWord(`${num} ${pair.itemName}`, speechEnabled);

    if (selectedNumber !== null) {
      checkMatch(selectedNumber, num);
    } else {
      setSelectedItemNumber(num);
    }
  };

  const checkMatch = (num: number, itemNum: number) => {
    if (num === itemNum) {
      // MATCH!
      const newMatched = [...matchedNumbers, num];
      setMatchedNumbers(newMatched);
      setSelectedNumber(null);
      setSelectedItemNumber(null);
      playSound.correct(soundEnabled);

      const matchedPair = activePairs.find((p) => p.number === num);
      if (matchedPair) {
        speakWord(`Great job! That is ${num}!`, speechEnabled);
      }

      if (newMatched.length === activePairs.length) {
        setTimeout(() => {
          onWin(3);
          setShowCelebration(true);
        }, 500);
      }
    } else {
      // MISMATCH
      setIsWobbling(itemNum);
      playSound.gentleTryAgain(soundEnabled);
      speakWord('Try again!', speechEnabled);
      setTimeout(() => {
        setIsWobbling(null);
        setSelectedNumber(null);
        setSelectedItemNumber(null);
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Game Header Bar */}
      <div className="w-full flex items-center justify-between mb-4 bg-sky-50 p-3 sm:p-4 rounded-3xl border-2 border-sky-200">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔢</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-sky-950">Number Matching</h2>
            <p className="text-xs font-semibold text-sky-700">Match the number to the group!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white font-extrabold text-sky-900 rounded-xl text-xs sm:text-sm shadow-xs border border-sky-100">
            Round {level}
          </span>
          <button
            type="button"
            onClick={() => {
              playSound.pop(soundEnabled);
              initRound(level);
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-sky-100 active:scale-95 text-sky-800 rounded-2xl border border-sky-200 shadow-xs flex items-center gap-1 font-bold text-xs"
            title="Restart round"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Matching Columns Grid */}
      <div className="w-full grid grid-cols-2 gap-3 sm:gap-6 my-2">
        {/* Left Column: Big Numbers */}
        <div className="flex flex-col gap-3">
          <span className="text-center font-extrabold text-xs uppercase tracking-wider text-gray-400">
            Numbers
          </span>
          {activePairs.map((pair) => {
            const isMatched = matchedNumbers.includes(pair.number);
            const isSelected = selectedNumber === pair.number;

            return (
              <button
                key={pair.number}
                type="button"
                disabled={isMatched}
                onClick={() => handleSelectNumber(pair.number)}
                className={`h-24 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center transition-all transform shadow-md relative ${
                  isMatched
                    ? 'bg-emerald-100 text-emerald-800 border-4 border-emerald-400 opacity-80 cursor-default scale-95'
                    : isSelected
                    ? 'bg-amber-300 text-amber-950 border-4 border-amber-500 scale-105 shadow-xl ring-4 ring-amber-200'
                    : 'bg-white hover:bg-amber-50 text-sky-900 border-4 border-sky-200 hover:border-amber-300 active:scale-95'
                }`}
              >
                <span>{pair.number}</span>
                {isMatched && (
                  <span className="absolute top-2 right-2 text-emerald-600">
                    <Sparkles className="w-5 h-5 fill-emerald-500" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Objects to Count */}
        <div className="flex flex-col gap-3">
          <span className="text-center font-extrabold text-xs uppercase tracking-wider text-gray-400">
            Pictures
          </span>
          {shuffledCards.map((pair) => {
            const isMatched = matchedNumbers.includes(pair.number);
            const isSelected = selectedItemNumber === pair.number;
            const isWrong = isWobbling === pair.number;

            return (
              <button
                key={pair.number}
                type="button"
                disabled={isMatched}
                onClick={() => handleSelectItem(pair.number, pair)}
                className={`h-24 sm:h-28 p-2 rounded-3xl flex flex-wrap items-center justify-center content-center gap-1.5 transition-all transform shadow-md relative ${
                  isMatched
                    ? 'bg-emerald-100 border-4 border-emerald-400 opacity-80 cursor-default scale-95'
                    : isWrong
                    ? 'bg-rose-100 border-4 border-rose-400 animate-shake'
                    : isSelected
                    ? 'bg-amber-300 border-4 border-amber-500 scale-105 shadow-xl ring-4 ring-amber-200'
                    : 'bg-white hover:bg-sky-50 border-4 border-sky-200 hover:border-amber-300 active:scale-95'
                }`}
              >
                {Array.from({ length: pair.number }).map((_, i) => (
                  <span
                    key={i}
                    className="text-2xl sm:text-3xl filter drop-shadow-xs transform transition-transform hover:scale-125"
                  >
                    {pair.itemEmoji}
                  </span>
                ))}

                {isMatched && (
                  <span className="absolute top-2 right-2 text-emerald-600">
                    <Sparkles className="w-5 h-5 fill-emerald-500" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Celebratory Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        starsCount={3}
        message="Numbers Matched!"
        soundEnabled={soundEnabled}
        onRestart={() => initRound(level)}
        onNext={() => setLevel((prev) => prev + 1)}
        onHome={onHome}
      />
    </div>
  );
};
