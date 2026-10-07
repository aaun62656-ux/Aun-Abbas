import React from 'react';
import { Play, Star, Sparkles } from 'lucide-react';
import { GameInfo, GameStats, GameType } from '../types';
import { playSound } from '../utils/audio';

interface HomeScreenProps {
  stats: GameStats;
  soundEnabled: boolean;
  onSelectGame: (gameId: GameType) => void;
}

export const GAMES_LIST: GameInfo[] = [
  {
    id: 'number_matching',
    title: 'Number Matching',
    subtitle: 'Match numbers & fun objects!',
    icon: '🔢',
    color: 'from-sky-400 to-blue-500',
    borderColor: 'border-sky-300 hover:border-sky-400',
    bgGradient: 'bg-sky-50',
    description: 'Learn numbers 1 to 10 with cute friends',
    starsKey: 'numberMatchingStars',
  },
  {
    id: 'alphabet_learning',
    title: 'Alphabet Learning',
    subtitle: 'Explore letters A to Z!',
    icon: '🔤',
    color: 'from-emerald-400 to-green-500',
    borderColor: 'border-emerald-300 hover:border-emerald-400',
    bgGradient: 'bg-emerald-50',
    description: 'Hear phonics words & play fun letter quizzes',
    starsKey: 'alphabetLearningStars',
  },
  {
    id: 'memory_card',
    title: 'Memory Cards',
    subtitle: 'Find matching animal buddies!',
    icon: '🃏',
    color: 'from-purple-400 to-indigo-500',
    borderColor: 'border-purple-300 hover:border-purple-400',
    bgGradient: 'bg-purple-50',
    description: 'Flip cards and remember cute puppy & kitty pairs',
    starsKey: 'memoryCardStars',
  },
  {
    id: 'simple_puzzle',
    title: 'Simple Puzzle',
    subtitle: 'Snap pieces into place!',
    icon: '🧩',
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-300 hover:border-amber-400',
    bgGradient: 'bg-amber-50',
    description: 'Easy 4-piece jigsaw puzzles for little hands',
    starsKey: 'simplePuzzleStars',
  },
  {
    id: 'counting_game',
    title: 'Counting Game',
    subtitle: 'Tap to count 1, 2, 3!',
    icon: '⭐',
    color: 'from-rose-400 to-pink-500',
    borderColor: 'border-rose-300 hover:border-rose-400',
    bgGradient: 'bg-rose-50',
    description: 'Count ducks, balloons, and stars together',
    starsKey: 'countingGameStars',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  soundEnabled,
  onSelectGame,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
      {/* Friendly Hero Banner */}
      <div className="w-full text-center mb-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-100 border-2 border-yellow-300 text-yellow-900 rounded-full text-xs sm:text-sm font-extrabold mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Play · Learn · Smile</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
          <span>Kids Fun Games</span>
          <span className="text-3xl sm:text-4xl animate-bounce">🎈</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base font-semibold text-gray-600 max-w-md mx-auto">
          Choose a game below to start playing! Safe, colorful, and super fun!
        </p>
      </div>

      {/* Grid of Games with Large Play Buttons */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {GAMES_LIST.map((game) => {
          const earnedStars = (stats[game.starsKey] as number) || 0;

          return (
            <div
              key={game.id}
              className={`rounded-3xl border-4 ${game.borderColor} ${game.bgGradient} p-5 sm:p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col justify-between`}
            >
              {/* Card Top: Icon & Stars */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl sm:text-5xl border-2 border-white/80">
                    {game.icon}
                  </div>

                  <div className="flex items-center gap-1 px-3 py-1 bg-white/90 rounded-2xl shadow-xs border border-gray-100">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-xs sm:text-sm font-black text-gray-800">
                      {earnedStars}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                  {game.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-4">
                  {game.subtitle}
                </p>
              </div>

              {/* Large Play Button */}
              <button
                type="button"
                onClick={() => {
                  playSound.pop(soundEnabled);
                  onSelectGame(game.id);
                }}
                className={`w-full py-4 px-6 rounded-2xl bg-gradient-to-r ${game.color} text-white font-black text-lg sm:text-xl shadow-lg shadow-black/10 flex items-center justify-center gap-3 transition-transform active:scale-95 hover:brightness-105`}
              >
                <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                </div>
                <span>PLAY</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Safety & Offline Trust Footer */}
      <div className="mt-12 text-center text-xs font-semibold text-gray-600 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>100% Child-Safe · No Ads · Works Offline</span>
      </div>
    </div>
  );
};
