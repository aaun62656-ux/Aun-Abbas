import React, { useEffect } from 'react';
import { Star, RotateCcw, Home, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';
import { fireCelebrationConfetti } from '../utils/confetti';

interface CelebrationModalProps {
  isOpen: boolean;
  starsCount?: number;
  message?: string;
  onRestart: () => void;
  onNext?: () => void;
  onHome: () => void;
  soundEnabled: boolean;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  starsCount = 3,
  message = 'Super Job! You Won!',
  onRestart,
  onNext,
  onHome,
  soundEnabled,
}) => {
  useEffect(() => {
    if (isOpen) {
      playSound.victory(soundEnabled);
      fireCelebrationConfetti();
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm p-6 text-center bg-white rounded-3xl shadow-2xl border-4 border-amber-300 transform scale-100 transition-all">
        {/* Decorative Mascot / Ribbon */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl animate-bounce">
            🎉
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-black text-amber-900 tracking-tight">
            {message}
          </h2>
          <p className="mt-1 text-sm font-semibold text-amber-700">
            You earned {starsCount} star{starsCount > 1 ? 's' : ''}!
          </p>

          {/* Star Badges */}
          <div className="flex justify-center items-center gap-2 my-5">
            {[1, 2, 3].map((starIdx) => (
              <div
                key={starIdx}
                className={`transform transition-all duration-300 ${
                  starIdx <= starsCount ? 'scale-110' : 'scale-90 opacity-40'
                }`}
              >
                <div className="p-2 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-inner">
                  <Star
                    className={`w-8 h-8 ${
                      starIdx <= starsCount
                        ? 'text-yellow-400 fill-yellow-400 filter drop-shadow'
                        : 'text-gray-300 fill-gray-200'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            {onNext && (
              <button
                type="button"
                onClick={() => {
                  playSound.pop(soundEnabled);
                  onNext();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-transform"
              >
                <span>Next Round</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playSound.pop(soundEnabled);
                onRestart();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-base shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-transform"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              <span>Play Again</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound.pop(soundEnabled);
                onHome();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-bold text-sm flex items-center justify-center gap-2 transition-transform"
            >
              <Home className="w-5 h-5" />
              <span>Choose Another Game</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
