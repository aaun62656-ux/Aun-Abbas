import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ScreenTimeAlertProps {
  isOpen: boolean;
  onDismiss: () => void;
  soundEnabled: boolean;
}

export const ScreenTimeAlert: React.FC<ScreenTimeAlertProps> = ({
  isOpen,
  onDismiss,
  soundEnabled,
}) => {
  const [showParentCode, setShowParentCode] = useState(false);
  const [typedCode, setTypedCode] = useState('');

  if (!isOpen) return null;

  const handleParentUnlock = () => {
    if (typedCode === '99' || typedCode === 'parent' || !showParentCode) {
      playSound.pop(soundEnabled);
      setShowParentCode(false);
      setTypedCode('');
      onDismiss();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm p-6 text-center bg-white rounded-3xl shadow-2xl border-4 border-emerald-300">
        <div className="w-20 h-20 mx-auto -mt-12 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-200 border-4 border-white shadow-lg flex items-center justify-center text-4xl animate-bounce">
          🌱
        </div>

        <h3 className="mt-4 text-2xl font-black text-gray-900">
          Time for a Play Break!
        </h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed font-medium">
          Great job learning today! Rest your eyes, take a stretch, drink some water, and smile!
        </p>

        <div className="my-5 p-4 bg-emerald-50 rounded-2xl flex items-center justify-center gap-3 text-emerald-800 font-bold text-sm">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>You earned great stars today!</span>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </div>

        {!showParentCode ? (
          <button
            type="button"
            onClick={() => setShowParentCode(true)}
            className="w-full py-3 px-4 text-xs font-bold text-gray-400 hover:text-gray-600 rounded-xl"
          >
            Parent: Extend or dismiss
          </button>
        ) : (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              Enter parent code <span className="font-bold text-gray-700">99</span> to resume:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={typedCode}
                onChange={(e) => setTypedCode(e.target.value)}
                placeholder="Code"
                className="flex-1 px-3 py-2 text-center text-sm font-bold border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleParentUnlock}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700"
              >
                Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
