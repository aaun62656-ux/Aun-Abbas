import React, { useState, useEffect } from 'react';
import { Lock, X, Check, ShieldCheck } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ParentGateModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
  soundEnabled: boolean;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  soundEnabled,
}) => {
  const [numA, setNumA] = useState(7);
  const [numB, setNumB] = useState(8);
  const [operator, setOperator] = useState<'+' | 'x'>('+');
  const [userAnswer, setUserAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  const generateProblem = () => {
    const isMult = Math.random() > 0.6;
    if (isMult) {
      const a = Math.floor(Math.random() * 6) + 3; // 3..8
      const b = Math.floor(Math.random() * 6) + 3; // 3..8
      setNumA(a);
      setNumB(b);
      setOperator('x');
    } else {
      const a = Math.floor(Math.random() * 12) + 7; // 7..18
      const b = Math.floor(Math.random() * 12) + 6; // 6..17
      setNumA(a);
      setNumB(b);
      setOperator('+');
    }
    setUserAnswer('');
    setErrorMsg(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateProblem();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const correctAnswer = operator === '+' ? numA + numB : numA * numB;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(userAnswer.trim(), 10);
    if (val === correctAnswer) {
      playSound.correct(soundEnabled);
      onSuccess();
    } else {
      playSound.gentleTryAgain(soundEnabled);
      setErrorMsg(true);
      generateProblem();
    }
  };

  const handleKeypadPress = (digit: string) => {
    playSound.pop(soundEnabled);
    if (userAnswer.length < 4) {
      setUserAnswer((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    playSound.pop(soundEnabled);
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm p-6 bg-white rounded-3xl shadow-2xl border-4 border-indigo-200">
        <button
          type="button"
          onClick={() => {
            playSound.pop(soundEnabled);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl mb-3 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-gray-900">Grown-Ups Only</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-[240px]">
            Please solve this math question to enter the Parent Settings area.
          </p>

          {/* Math Problem Card */}
          <div className="my-4 px-6 py-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl">
            <span className="text-2xl font-black tracking-widest text-indigo-900">
              {numA} {operator === 'x' ? '×' : '+'} {numB} = ?
            </span>
          </div>

          {/* Answer display */}
          <div className="w-full h-12 flex items-center justify-center bg-gray-50 border-2 border-gray-200 rounded-xl mb-3 text-2xl font-black text-gray-800">
            {userAnswer ? (
              userAnswer
            ) : (
              <span className="text-gray-300 text-lg font-normal">Type answer...</span>
            )}
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-500 mb-2">
              Incorrect answer. A new question has been loaded.
            </p>
          )}

          {/* Numeric Keypad for convenient mobile/tablet touch */}
          <div className="grid grid-cols-3 gap-2 w-full my-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="py-2.5 text-lg font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-2.5 text-lg font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl transition-colors"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleVerify()}
              className="py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl flex items-center justify-center shadow-md transition-colors"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Child-Safe Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
