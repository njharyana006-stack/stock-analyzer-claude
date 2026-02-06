import React from 'react';
import { InfoIcon } from './icons';

interface InfoTooltipProps {
  /** The text content to display inside the tooltip. */
  text: string;
}

/**
 * A reusable component that displays an info icon. On hover, it shows a
 * tooltip with the provided text. This is used across the app to explain
 * complex financial terms to beginners.
 */
const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  return (
    <div className="group relative flex items-center">
      <InfoIcon className="w-4 h-4 text-slate-400 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
        {text}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800"></div>
      </div>
    </div>
  );
};

export default InfoTooltip;
