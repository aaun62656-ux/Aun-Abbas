import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  mode: 'mobile' | 'tablet' | 'full';
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ mode, children }) => {
  if (mode === 'full') {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  const isMobile = mode === 'mobile';

  return (
    <div className="w-full min-h-screen bg-slate-900 py-6 sm:py-10 px-2 sm:px-4 flex items-center justify-center overflow-x-hidden">
      {/* Outer Device Chassis */}
      <div
        className={`relative bg-black rounded-[48px] p-3 sm:p-4 shadow-2xl border-4 border-slate-700 transition-all duration-300 ${
          isMobile
            ? 'w-full max-w-[420px] min-h-[820px]'
            : 'w-full max-w-[860px] min-h-[720px]'
        }`}
      >
        {/* Device Screen Bezel */}
        <div className="relative w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col shadow-inner">
          {/* Android Status Bar */}
          <div className="w-full bg-white/90 backdrop-blur-xs px-6 py-2 flex items-center justify-between text-[11px] font-bold text-gray-700 select-none border-b border-gray-100 z-50">
            <span>9:41</span>

            {/* Android Camera Punch Hole */}
            <div className="w-3.5 h-3.5 bg-black rounded-full shadow-inner mx-auto"></div>

            <div className="flex items-center gap-1.5 text-gray-600">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Device Screen Content Area */}
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative bg-gradient-to-b from-sky-50/50 via-white to-amber-50/30">
            {children}
          </div>

          {/* Android Navigation Pill Bar at bottom */}
          <div className="w-full bg-white/95 py-2.5 flex items-center justify-center select-none border-t border-gray-100 z-50">
            <div className="w-32 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
