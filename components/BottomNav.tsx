
import React from 'react';
import { HomeIcon, TrendUpIcon, NewspaperIcon, CompareIcon, PieChartIcon } from './icons';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setPage }) => {

  const navItems = [
    { page: 'dashboard', label: 'Home', icon: HomeIcon },
    { page: 'analysis', label: 'Analyze', icon: TrendUpIcon },
    { page: 'profileGenerator', label: 'Strategy', icon: PieChartIcon },
    { page: 'comparison', label: 'Compare', icon: CompareIcon },
    { page: 'newsFeed', label: 'Intel', icon: NewspaperIcon },
  ];

  return (
    <nav id="tour-nav-mobile" className="fixed bottom-0 left-0 right-0 z-[100] md:hidden" role="navigation" aria-label="Main mobile navigation">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/5" aria-hidden="true"></div>

      <div className="relative flex justify-around items-center px-2 h-[68px] pb-safe max-w-md mx-auto">
        {navItems.map((item) => {
          const targetPage = item.page as Page;
          const isActive = currentPage === targetPage;

          return (
            <button
              key={item.label}
              onClick={() => setPage(targetPage)}
              className="flex flex-col items-center justify-center min-w-[56px] w-full h-full group relative touch-manipulation"
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-slate-900 dark:bg-white transition-all duration-200" aria-hidden="true"></div>
              )}

              <div
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-slate-900 dark:text-white bg-slate-100/50 dark:bg-white/5'
                    : 'text-slate-400 dark:text-zinc-600 group-active:bg-slate-100/50 dark:group-active:bg-white/5'
                }`}
              >
                <item.icon className={`w-[22px] h-[22px] transition-transform duration-200 ${isActive ? 'scale-110' : 'group-active:scale-90'}`} aria-hidden="true" />
              </div>

              <span className={`text-[10px] font-semibold tracking-wide transition-all duration-200 mt-0.5 ${
                isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
