import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, Sparkles, Hand } from 'lucide-react';
import { playSound, speakWord } from '../../utils/audio';
import { CelebrationModal } from '../CelebrationModal';

interface CountingGameProps {
  soundEnabled: boolean;
  speechEnabled: boolean;
  onWin: (stars: number) => void;
  onHome: () => void;
}

interface CountingTheme {
  name: string;
  emoji: string;
  soundWord: string;
  bgGrad: string;
}

const COUNTING_THEMES: CountingTheme[] = [
  { name: 'Cute Ducks', emoji: '🦆', soundWord: 'ducks', bgGrad: 'from-amber-100 to-yellow-50' },
  { name: 'Twinkling Stars', emoji: '⭐', soundWord: 'stars', bgGrad: 'from-indigo-100 to-sky-50' },
  { name: 'Strawberries', emoji: '🍓', soundWord: 'strawberries', bgGrad: 'from-rose-100 to-pink-50' },
  { name: 'Friendly Frogs', emoji: '🐸', soundWord: 'frogs', bgGrad: 'from-emerald-100 to-teal-50' },
  { name: 'Balloons', emoji: '🎈', soundWord: 'balloons', bgGrad: 'from-purple-100 to-pink-50' },
  { name: 'Puppies', emoji: '🐶', soundWord: 'puppies', bgGrad: 'from-amber-100 to-orange-50' },
];

export const CountingGame: React.FC<CountingGameProps> = ({
  soundEnabled,
  speechEnabled,
  onWin,
  onHome,
}) => {
  const [round, setRound] = useState(1);
  const [targetCount, setTargetCount] = useState(3);
  const [theme, setTheme] = useState<CountingTheme>(COUNTING_THEMES[0]);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const initRound = (r: number) => {
    // Generate count between 2 and 7 (great for ages 3-6)
    const count = ((r + 1) % 6) + 2; // 2..7
    setTargetCount(count);

    const themeItem = COUNTING_THEMES[(r - 1) % COUNTING_THEMES.length];
    setTheme(themeItem);

    // Pick 3 options: target count + 2 distinct distractors
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
      const val = count + offset;
      if (val >= 1 && val <= 9 && val !== count) {
        distractors.add(val);
      }
    }
    const allOptions = [count, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

    setOptions(allOptions);
    setTappedIndices([]);
    setFeedback(null);
    setShowCelebration(false);

    speakWord(`Let's count the ${themeItem.soundWord}! Tap each one!`, speechEnabled);
  };

  useEffect(() => {
    initRound(round);
  }, [round]);

  // Handle child tapping an item directly on the screen
  const handleTapItem = (idx: number) => {
    if (tappedIndices.includes(idx)) return;

    const newTapped = [...tappedIndices, idx];
    setTappedIndices(newTapped);
    const countSoFar = newTapped.length;

    playSound.countNote(countSoFar, soundEnabled);
    speakWord(countSoFar.toString(), speechEnabled);
  };

  // Handle answering by tapping a number button
  const handleSelectAnswer = (chosen: number) => {
    if (feedback !== null) return;

    if (chosen === targetCount) {
      // Correct!
      playSound.correct(soundEnabled);
      setFeedback('correct');
      speakWord(`Super! There are ${chosen} ${theme.soundWord}!`, speechEnabled);

      setTimeout(() => {
        onWin(3);
        setShowCelebration(true);
      }, 700);
    } else {
      // Wrong
      playSound.gentleTryAgain(soundEnabled);
      setFeedback('wrong');
      speakWord(`Almost! Let's count again!`, speechEnabled);
      setTimeout(() => {
        setFeedback(null);
      }, 900);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between mb-4 bg-rose-50 p-3 sm:p-4 rounded-3xl border-2 border-rose-200">
        <div className="flex items-center gap-2">
          <span className="text-3xl">⭐</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-rose-950">Counting Game</h2>
            <p className="text-xs font-semibold text-rose-700">Tap to count 1, 2, 3!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white font-extrabold text-rose-900 rounded-xl text-xs sm:text-sm shadow-xs border border-rose-100">
            Round {round}
          </span>
          <button
            type="button"
            onClick={() => {
              playSound.pop(soundEnabled);
              initRound(round);
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white hover:bg-rose-100 active:scale-95 text-rose-900 rounded-2xl border border-rose-200 shadow-xs flex items-center gap-1 font-bold text-xs"
            title="Restart round"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>

      {/* Item Playground */}
      <div
        className={`w-full p-6 sm:p-8 rounded-3xl border-4 border-rose-300 bg-gradient-to-br ${theme.bgGrad} shadow-lg relative my-2 flex flex-col items-center`}
      >
        <div className="flex items-center gap-2 mb-4 bg-white/80 px-4 py-1.5 rounded-full shadow-xs text-xs font-black text-rose-900">
          <Hand className="w-4 h-4 text-rose-500 animate-bounce" />
          <span>Tap each item to count! ({tappedIndices.length}/{targetCount})</span>
        </div>

        {/* Items Container with playful spacing */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-lg min-h-[160px]">
          {Array.from({ length: targetCount }).map((_, idx) => {
            const isTapped = tappedIndices.includes(idx);
            const countOrder = tappedIndices.indexOf(idx) + 1;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleTapItem(idx)}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/90 border-4 flex items-center justify-center transition-all transform shadow-md active:scale-90 ${
                  isTapped
                    ? 'border-emerald-400 scale-105 shadow-emerald-200 shadow-lg'
                    : 'border-rose-200 hover:border-rose-400 hover:scale-105'
                }`}
              >
                <span className="text-5xl sm:text-6xl filter drop-shadow">
                  {theme.emoji}
                </span>

                {/* Tapped Badge */}
                {isTapped && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-md animate-pop-in">
                    {countOrder}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Prompt & Big Bouncy Number Buttons */}
      <div className="w-full max-w-md mt-4 p-5 bg-white rounded-3xl border-2 border-rose-200 shadow-sm flex flex-col items-center">
        <div className="text-sm font-black text-gray-800 mb-3 text-center">
          How many {theme.soundWord} are there?
        </div>

        <div className="grid grid-cols-3 gap-3 w-full">
          {options.map((opt) => {
            const isCorrect = opt === targetCount;
            const isSelectedCorrect = feedback === 'correct' && isCorrect;

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectAnswer(opt)}
                className={`h-20 sm:h-22 rounded-2xl font-black text-4xl sm:text-5xl flex items-center justify-center transition-all transform shadow-md active:scale-95 ${
                  isSelectedCorrect
                    ? 'bg-emerald-500 text-white border-4 border-emerald-600 scale-105'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-950 border-4 border-rose-200 hover:border-rose-400'
                }`}
              >
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        starsCount={3}
        message="Super Counter!"
        soundEnabled={soundEnabled}
        onRestart={() => initRound(round)}
        onNext={() => setRound((prev) => prev + 1)}
        onHome={onHome}
      />
    </div>
  );
};
