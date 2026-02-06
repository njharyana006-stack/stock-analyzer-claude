
import React from 'react';

interface RadialProgressProps {
  title: string;
  score: number;
  rationale?: string;
}

const RadialProgress: React.FC<RadialProgressProps> = ({ title, score, rationale }) => {
  const radius = 55;
  const stroke = 10;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 8) return '#10b981'; // emerald
    if (val >= 5) return '#f59e0b'; // amber
    return '#ef4444'; // rose
  };
  
  const scoreColor = getScoreColor(score);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full transition-all duration-700 p-2">
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36 md:w-44 md:h-44 group">
                {/* Glow Background */}
                <div 
                    className="absolute inset-4 rounded-full blur-2xl opacity-20 transition-all duration-700 group-hover:opacity-40" 
                    style={{ backgroundColor: scoreColor }}
                ></div>
                
                <svg
                    height="100%"
                    width="100%"
                    viewBox="0 0 120 120"
                    className="drop-shadow-xl relative z-10"
                >
                    <circle
                        className="text-slate-100 dark:text-white/5"
                        strokeWidth={stroke}
                        stroke="currentColor"
                        fill="transparent"
                        r={normalizedRadius}
                        cx="60"
                        cy="60"
                    />
                    <circle
                        stroke={scoreColor}
                        strokeWidth={stroke}
                        strokeDasharray={`${circumference} ${circumference}`}
                        style={{ 
                            strokeDashoffset, 
                            strokeLinecap: 'round', 
                            transition: 'stroke-dashoffset 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                        }}
                        fill="transparent"
                        r={normalizedRadius}
                        cx="60"
                        cy="60"
                        transform="rotate(-90 60 60)"
                        filter="url(#gaugeGlow)"
                    />
                    <defs>
                        <filter id="gaugeGlow">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 translate-y-1">
                     <p className="text-4xl md:text-5xl font-black tracking-tighter leading-none" style={{ color: scoreColor }}>
                        {Math.round(score)}
                    </p>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600 mt-1">Grade</p>
                </div>
            </div>
            
            <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-white mt-6 uppercase tracking-widest">{title}</h4>
        </div>
        
        {rationale && (
            <div className="mt-4 w-full">
                <p className="text-[11px] md:text-xs text-slate-500 dark:text-zinc-500 leading-relaxed max-w-[200px] mx-auto font-medium">
                    {rationale}
                </p>
            </div>
        )}
    </div>
  );
};

export default React.memo(RadialProgress);
