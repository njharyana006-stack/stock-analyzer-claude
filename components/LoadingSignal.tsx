
import React from 'react';
import SmartStockLogo from './SmartStockLogo';

interface LoadingSignalProps {
    message?: string;
    subMessage?: string;
}

const LoadingSignal: React.FC<LoadingSignalProps> = ({ message, subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 animate-fade-in" role="status" aria-live="polite" aria-label={message || "Loading"}>
      <div className="relative w-28 h-28 flex items-center justify-center mb-8">
        {/* Outer Pulse Glow */}
        <div className="absolute inset-0 bg-emerald-500/20 dark:bg-indigo-500/20 rounded-full blur-xl animate-pulse-slow" aria-hidden="true"></div>

        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 border-l-emerald-500/30 dark:border-t-indigo-500 dark:border-l-indigo-500/30 animate-spin-slow" aria-hidden="true"></div>

        {/* Inner rotating ring (reverse) */}
        <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-teal-400 border-r-teal-400/30 dark:border-b-violet-400 dark:border-r-violet-400/30 animate-spin-reverse" aria-hidden="true"></div>

        {/* Core container */}
        <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-white dark:bg-[#18181B] rounded-2xl shadow-lg border border-slate-100 dark:border-white/10">
             <div className="w-10 h-10 animate-pulse">
                <SmartStockLogo />
             </div>
        </div>

        {/* Orbiting particle */}
        <div className="absolute inset-0 animate-spin" aria-hidden="true">
            <div className="h-full w-full relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-emerald-400 dark:bg-indigo-400 rounded-full shadow-[0_0_10px_currentColor]"></div>
            </div>
        </div>
      </div>

      {message && (
        <div className="text-center space-y-2 max-w-sm mx-auto px-4">
            <h3 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 animate-pulse">{message}</h3>
            {subMessage && (
                <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-500 font-medium">{subMessage}</p>
            )}

            {/* Typing Dots */}
            <div className="flex gap-1.5 justify-center pt-2" aria-hidden="true">
                <span className="w-1.5 h-1.5 bg-emerald-500/60 dark:bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-500/60 dark:bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-emerald-500/60 dark:bg-indigo-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSignal;
