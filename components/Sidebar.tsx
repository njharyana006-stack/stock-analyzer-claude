
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Page } from '../types';
import { HomeIcon, AnalyzeIcon, NewspaperIcon, SentimentIcon, ChevronLeftIcon, ChevronRightIcon, PieChartIcon, CompareIcon, SettingsIcon, SparklesIcon, XIcon, CheckCircleIcon, LockIcon, BookmarkIcon } from './icons';
import SmartStockLogo from './SmartStockLogo';

interface SidebarProps {
    currentPage: Page;
    setPage: (page: Page) => void;
    isCollapsed: boolean;
    onToggle: () => void;
    isMobileOpen: boolean;
    setMobileOpen: (isOpen: boolean) => void;
    onUpgrade: () => void;
    userName: string;
    setUserName: (name: string) => void;
    avatarUrl?: string;
}

const NavItem: React.FC<{
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isCollapsed: boolean;
    badge?: string;
}> = ({ icon: Icon, label, isActive, onClick, isCollapsed, badge }) => {
    
    return (
        <button
            onClick={onClick}
            className={`group relative flex items-center w-full rounded-xl transition-all duration-200 font-medium my-1 btn-interactive
            ${isCollapsed ? 'justify-center px-2 py-3' : 'justify-start px-4 py-3'}
            ${isActive 
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-lg shadow-slate-900/10 dark:shadow-white/10 scale-[1.02]' 
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20`}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
        >
            <Icon className={`flex-shrink-0 transition-transform duration-300 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
            
            {!isCollapsed && (
                <span className="ml-3 text-sm truncate flex-1 text-left tracking-tight font-semibold">
                    {label}
                </span>
            )}
            {!isCollapsed && badge && (
                <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ml-2 uppercase tracking-wider ${isActive ? 'bg-white/20 text-white dark:bg-black/10 dark:text-black' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'}`}>
                    {badge}
                </span>
            )}
            
            {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl transform translate-x-2 group-hover:translate-x-0">
                    {label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-slate-900 dark:border-r-white"></div>
                </div>
            )}
        </button>
    );
};

const SidebarContent: React.FC<Omit<SidebarProps, 'isMobileOpen' | 'setMobileOpen'>> = ({ currentPage, setPage, isCollapsed, onToggle, onUpgrade, userName, avatarUrl }) => {
    
    const mainNav = [
        { page: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { page: 'analysis', label: 'Deep Analysis', icon: AnalyzeIcon },
        { page: 'comparison', label: 'Compare Assets', icon: CompareIcon },
        { page: 'saved', label: 'Saved Reports', icon: BookmarkIcon },
    ] as const;
    
    const toolsNav = [
        { page: 'newsFeed', label: 'Market Intel', icon: SentimentIcon, badge: 'LIVE' },
        { page: 'profileGenerator', label: 'Strategy Gen', icon: PieChartIcon },
    ] as const;

    const getInitials = (str: string) => {
        if (!str) return 'U';
        return str.split(' ').map(n => n && n.length > 0 ? n[0] : '').join('').substring(0, 2).toUpperCase();
    };

    return (
        <div id="tour-nav-desktop" className={`flex flex-col h-full bg-white dark:bg-[#09090B] border-r border-slate-200 dark:border-white/5 z-50 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
            <div className={`flex items-center h-20 px-6 flex-shrink-0 ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}>
                <div className="w-8 h-8 flex-shrink-0 text-emerald-500 transition-transform duration-500 hover:rotate-180 cursor-pointer" onClick={() => setPage('dashboard')}>
                    <SmartStockLogo />
                </div>
                {!isCollapsed && (
                    <div className="ml-3 overflow-hidden animate-fade-in flex flex-col justify-center">
                        <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-none">SmartStock</h1>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Pro Platform</span>
                    </div>
                )}
            </div>
            
            <div className="flex-grow py-4 px-3 overflow-y-auto scrollbar-none flex flex-col min-h-0">
                <nav className="space-y-1">
                    {mainNav.map(item => (
                        <NavItem 
                            key={item.page}
                            {...item}
                            isActive={currentPage === item.page}
                            onClick={() => setPage(item.page)}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </nav>

                <div className="my-6 mx-4 h-px bg-slate-100 dark:bg-white/5"></div>

                <nav className="space-y-1">
                    {toolsNav.map(item => (
                        <NavItem 
                            key={item.page}
                            {...item}
                            isActive={currentPage === item.page}
                            onClick={() => setPage(item.page)}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </nav>
            </div>
            
            <div className="p-3 border-t border-slate-100 dark:border-white/5 space-y-3 bg-white/50 dark:bg-[#09090B] backdrop-blur-sm flex-shrink-0">
                {!isCollapsed && (
                    <button 
                        className="w-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-4 border border-white/10 relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg shadow-indigo-500/20 text-left btn-interactive" 
                        onClick={onUpgrade}
                    >
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <h4 className="text-xs font-bold text-white">Upgrade to Pro</h4>
                                <p className="text-[10px] text-indigo-100 mt-0.5 font-medium">Uncapped AI Power</p>
                            </div>
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                                <SparklesIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </button>
                )}

                <div className={`flex items-center ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'}`}>
                    <button 
                        className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'} cursor-pointer group rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none`}
                        onClick={() => setPage('settings')}
                        title="User Settings"
                    >
                        <div className="relative flex-shrink-0">
                            {avatarUrl ? (
                                <img 
                                    src={avatarUrl} 
                                    alt={userName} 
                                    className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-[#121214] shadow-sm"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs border-2 border-white dark:border-[#121214] shadow-sm">
                                    {getInitials(userName)}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#09090B] rounded-full"></div>
                        </div>
                        
                        {!isCollapsed && (
                            <div className="overflow-hidden flex-1 text-left">
                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{userName}</p>
                                <p className="text-xs text-slate-500 dark:text-zinc-500 truncate font-medium">Standard Account</p>
                            </div>
                        )}
                    </button>

                    <button
                        onClick={onToggle}
                        className={`hidden md:flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${isCollapsed ? 'w-full py-2' : 'w-8 h-8'}`}
                    >
                        {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = (props) => {
    return (
        <>
            <aside className="hidden md:flex flex-shrink-0 flex-col h-[100dvh] sticky top-0 z-50">
                 <SidebarContent {...props} />
            </aside>

            {props.isMobileOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => props.setMobileOpen(false)}
                    />
                    <div className="absolute top-0 bottom-0 left-0 w-[280px] bg-white dark:bg-[#09090B] shadow-2xl animate-slide-right transform transition-transform">
                        <div className="h-full flex flex-col relative">
                            <button 
                                onClick={() => props.setMobileOpen(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <XIcon className="w-6 h-6" />
                            </button>
                            <SidebarContent 
                                {...props} 
                                isCollapsed={false}
                                onToggle={() => {}}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
