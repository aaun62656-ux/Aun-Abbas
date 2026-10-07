import React, { useState } from 'react';
import { RotateCcw, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import { playSound, speakWord } from '../../utils/audio';
import { CelebrationModal } from '../CelebrationModal';

interface AlphabetLearningGameProps {
  soundEnabled: boolean;
  speechEnabled: boolean;
  onWin: (stars: number) => void;
  onHome: () => void;
}

interface LetterItem {
  letter: string;
  word: string;
  emoji: string;
  color: string;
}

const ALPHABET_DATA: LetterItem[] = [
  { letter: 'A', word: 'Apple', emoji: '🍎', color: 'bg-rose-50 border-rose-300 text-rose-700' },
  { letter: 'B', word: 'Bear', emoji: '🐻', color: 'bg-amber-50 border-amber-300 text-amber-800' },
  { letter: 'C', word: 'Cat', emoji: '🐱', color: 'bg-orange-50 border-orange-300 text-orange-700' },
  { letter: 'D', word: 'Dog', emoji: '🐶', color: 'bg-sky-50 border-sky-300 text-sky-800' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', color: 'bg-indigo-50 border-indigo-300 text-indigo-700' },
  { letter: 'F', word: 'Fish', emoji: '🐟', color: 'bg-teal-50 border-teal-300 text-teal-700' },
  { letter: 'G', word: 'Giraffe', emoji: '🦒', color: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
  { letter: 'H', word: 'Hat', emoji: '🎩', color: 'bg-purple-50 border-purple-300 text-purple-700' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', color: 'bg-pink-50 border-pink-300 text-pink-700' },
  { letter: 'J', word: 'Juice', emoji: '🧃', color: 'bg-orange-50 border-orange-300 text-orange-800' },
  { letter: 'K', word: 'Kite', emoji: '🪁', color: 'bg-sky-50 border-sky-300 text-sky-700' },
  { letter: 'L', word: 'Lion', emoji: '🦁', color: 'bg-amber-50 border-amber-300 text-amber-800' },
  { letter: 'M', word: 'Monkey', emoji: '🐵', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
  { letter: 'N', word: 'Nest', emoji: '🪺', color: 'bg-stone-50 border-stone-300 text-stone-700' },
  { letter: 'O', word: 'Orange', emoji: '🍊', color: 'bg-orange-50 border-orange-300 text-orange-700' },
  { letter: 'P', word: 'Penguin', emoji: '🐧', color: 'bg-cyan-50 border-cyan-300 text-cyan-800' },
  { letter: 'Q', word: 'Queen', emoji: '👑', color: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
  { letter: 'R', word: 'Rocket', emoji: '🚀', color: 'bg-rose-50 border-rose-300 text-rose-700' },
  { letter: 'S', word: 'Sun', emoji: '☀️', color: 'bg-amber-50 border-amber-300 text-amber-700' },
  { letter: 'T', word: 'Turtle', emoji: '🐢', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', color: 'bg-violet-50 border-violet-300 text-violet-700' },
  { letter: 'V', word: 'Violin', emoji: '🎻', color: 'bg-amber-50 border-amber-300 text-amber-900' },
  { letter: 'W', word: 'Whale', emoji: '🐳', color: 'bg-blue-50 border-blue-300 text-blue-800' },
  { letter: 'X', word: 'Xylophone', emoji: '🎹', color: 'bg-pink-50 border-pink-300 text-pink-800' },
  { letter: 'Y', word: 'Yacht', emoji: '⛵', color: 'bg-sky-50 border-sky-300 text-sky-800' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', color: 'bg-slate-50 border-slate-300 text-slate-800' },
];

export const AlphabetLearningGame: React.FC<AlphabetLearningGameProps> = ({
  soundEnabled,
  speechEnabled,
  onWin,
  onHome,
}) => {
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [selectedLetter, setSelectedLetter] = useState<LetterItem>(ALPHABET_DATA[0]);

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [targetItem, setTargetItem] = useState<LetterItem>(ALPHABET_DATA[0]);
  const [quizChoices, setQuizChoices] = useState<LetterItem[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize or generate quiz question
  const startNewQuizQuestion = () => {
    const target = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    setTargetItem(target);

    // Pick 3 distractors
    const distractors = ALPHABET_DATA.filter((i) => i.letter !== target.letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const choices = [target, ...distractors].sort(() => Math.random() - 0.5);
    setQuizChoices(choices);
    setQuizFeedback(null);

    // Speak prompt
    speakWord(`Can you find the letter ${target.letter}?`, speechEnabled);
  };

  const handleSelectLetter = (item: LetterItem) => {
    setSelectedLetter(item);
    playSound.pop(soundEnabled);
    speakWord(`${item.letter}. ${item.letter} is for ${item.word}.`, speechEnabled);
  };

  const handleQuizChoice = (choice: LetterItem) => {
    if (quizFeedback !== null) return;

    if (choice.letter === targetItem.letter) {
      playSound.correct(soundEnabled);
      setQuizFeedback('correct');
      speakWord(`Super! ${choice.letter} is for ${choice.word}!`, speechEnabled);

      const nextScore = quizScore + 1;
      setQuizScore(nextScore);

      if (nextScore >= 5) {
        setTimeout(() => {
          onWin(3);
          setShowCelebration(true);
        }, 600);
      } else {
        setTimeout(() => {
          startNewQuizQuestion();
        }, 1200);
      }
    } else {
      playSound.gentleTryAgain(soundEnabled);
      setQuizFeedback('wrong');
      speakWord(`That is ${choice.letter}. Try finding ${targetItem.letter}!`, speechEnabled);
      setTimeout(() => {
        setQuizFeedback(null);
      }, 900);
    }
  };

  const switchMode = (newMode: 'explore' | 'quiz') => {
    playSound.pop(soundEnabled);
    setMode(newMode);
    if (newMode === 'quiz') {
      setQuizScore(0);
      startNewQuizQuestion();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between mb-4 bg-emerald-50 p-3 sm:p-4 rounded-3xl border-2 border-emerald-200">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🔤</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-emerald-950">Alphabet Learning</h2>
            <p className="text-xs font-semibold text-emerald-700">Learn letters from A to Z!</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-emerald-200 shadow-xs">
          <button
            type="button"
            onClick={() => switchMode('explore')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
              mode === 'explore'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Explore A-Z
          </button>
          <button
            type="button"
            onClick={() => switchMode('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors flex items-center gap-1 ${
              mode === 'quiz'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz Game</span>
          </button>
        </div>
      </div>

      {/* MODE 1: EXPLORE A-Z */}
      {mode === 'explore' && (
        <div className="w-full flex flex-col items-center gap-4">
          {/* Spotlight Active Letter Showcase Card */}
          <div
            onClick={() => handleSelectLetter(selectedLetter)}
            className={`w-full max-w-md p-6 rounded-3xl border-4 ${selectedLetter.color} shadow-lg flex items-center justify-around cursor-pointer transform transition-transform hover:scale-102 active:scale-98`}
          >
            <div className="flex flex-col items-center">
              <span className="text-7xl sm:text-8xl font-black tracking-tight filter drop-shadow">
                {selectedLetter.letter}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-wide mt-1">
                {selectedLetter.letter.toLowerCase()}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-7xl animate-pulse">
                {selectedLetter.emoji}
              </span>
              <span className="text-xl sm:text-2xl font-black mt-2 text-gray-800">
                {selectedLetter.word}
              </span>
            </div>

            <button
              type="button"
              className="p-3 bg-white/80 rounded-2xl shadow-sm text-gray-700 hover:bg-white"
              aria-label="Hear pronunciation"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* Letter Grid A..Z */}
          <div className="w-full grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 sm:gap-2.5 mt-2">
            {ALPHABET_DATA.map((item) => {
              const isSelected = selectedLetter.letter === item.letter;
              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => handleSelectLetter(item)}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 font-black text-xl sm:text-2xl transition-all transform shadow-xs ${
                    isSelected
                      ? 'bg-amber-400 text-amber-950 scale-110 shadow-md ring-4 ring-amber-200 z-10'
                      : 'bg-white hover:bg-emerald-50 text-gray-800 border-2 border-gray-200 hover:border-emerald-300 active:scale-95'
                  }`}
                >
                  <span>{item.letter}</span>
                  <span className="text-xs sm:text-sm">{item.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: QUIZ CHALLENGE */}
      {mode === 'quiz' && (
        <div className="w-full flex flex-col items-center gap-4">
          {/* Question Banner */}
          <div className="w-full max-w-md p-6 bg-amber-100 border-4 border-amber-300 rounded-3xl text-center shadow-md">
            <div className="text-xs font-black uppercase tracking-wider text-amber-800 mb-1">
              Find This Letter! (Stars: {quizScore}/5)
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl sm:text-6xl font-black text-amber-950">
                Letter {targetItem.letter}
              </span>
              <button
                type="button"
                onClick={() => speakWord(`Find the letter ${targetItem.letter}`, speechEnabled)}
                className="p-2 bg-white rounded-xl shadow-xs text-amber-900"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xs font-bold text-amber-700 mt-2">
              Like in "{targetItem.word}" {targetItem.emoji}!
            </p>
          </div>

          {/* 4 Choices Grid */}
          <div className="w-full max-w-md grid grid-cols-2 gap-3 sm:gap-4 my-2">
            {quizChoices.map((choice) => {
              const isCorrectTarget = choice.letter === targetItem.letter;
              const isSelected = quizFeedback !== null && isCorrectTarget;

              return (
                <button
                  key={choice.letter}
                  type="button"
                  onClick={() => handleQuizChoice(choice)}
                  className={`h-28 sm:h-32 rounded-3xl font-black text-4xl sm:text-5xl flex flex-col items-center justify-center gap-1 transition-all transform shadow-md active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-400 text-white border-4 border-emerald-500 scale-105'
                      : 'bg-white hover:bg-emerald-50 text-gray-800 border-4 border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <span>{choice.letter}</span>
                  <span className="text-2xl">{choice.emoji}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              setQuizScore(0);
              startNewQuizQuestion();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-2xl text-xs font-bold text-gray-700 border border-gray-200 shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Quiz</span>
          </button>
        </div>
      )}

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        starsCount={3}
        message="Alphabet Superstar!"
        soundEnabled={soundEnabled}
        onRestart={() => {
          setQuizScore(0);
          setShowCelebration(false);
          startNewQuizQuestion();
        }}
        onNext={() => {
          setShowCelebration(false);
          setQuizScore(0);
          startNewQuizQuestion();
        }}
        onHome={onHome}
      />
    </div>
  );
};
