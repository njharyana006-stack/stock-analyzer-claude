
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, ChevronRightIcon, UserIcon } from './icons';
import { useDashboard } from '../contexts/DashboardContext';
import type { Page } from '../types';
import SmartStockLogo from './SmartStockLogo';

interface TopBarProps {
    currentPage: Page;
    onRefresh: () => void;
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    onNavigate: (page: Page) => void;
    userName?: string;
    avatarUrl?: string;
}

interface NotificationItem {
    id: number;
    title: string;
    time: string;
    unread: boolean;
    type: 'success' | 'warning' | 'info';
}

const pageNames: Record<Page, string> = {
    dashboard: 'Dashboard',
    analysis: 'Deep Analysis',
    marketPulse: 'Market Pulse',
    newsFeed: 'Market Intelligence',
    profileGenerator: 'Strategy Gen',
    riskProfile: 'Settings',
    comparison: 'Compare',
    saved: 'Saved Reports',
    settings: 'Settings',
    managePlan: 'Subscription',
};

const TopBar: React.FC<TopBarProps> = ({ currentPage, isDarkMode, onToggleDarkMode, onNavigate, userName, avatarUrl }) => {
    const { isEditMode, toggleEditMode } = useDashboard();
    const [activeDropdown, setActiveDropdown] = useState<'notifications' | null>(null);
    const topBarRef = useRef<HTMLElement>(null);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const hasUnread = notifications.some(n => n.unread);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (topBarRef.current && !topBarRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleNotification = (e: Event) => {
            const customEvent = e as CustomEvent;
            const newNotif: NotificationItem = {
                id: Date.now(),
                title: customEvent.detail.title || 'New Activity',
                time: 'Just now',
                unread: true,
                type: customEvent.detail.type || 'info'
            };
            setNotifications(prev => [newNotif, ...prev].slice(0, 10));
        };
        window.addEventListener('smartstock_notification', handleNotification);
        return () => window.removeEventListener('smartstock_notification', handleNotification);
    }, []);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const getInitials = (str?: string) => {
        if (!str) return 'U';
        return str.charAt(0).toUpperCase();
    };

    return (
        <header
            ref={topBarRef}
            className="absolute top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5 pt-safe"
        >
            <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 h-16 md:h-[72px] max-w-[1920px] mx-auto">
                {/* Left: Logo + Page Name */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 md:hidden text-emerald-500 flex-shrink-0">
                        <SmartStockLogo />
                    </div>
                    <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                        <span className="text-slate-400 dark:text-zinc-600 font-bold tracking-widest text-[10px] uppercase">SmartStock</span>
                        <ChevronRightIcon className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-700" />
                    </div>
                    <h1 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white tracking-tight truncate">
                        {pageNames[currentPage]}
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 md:gap-2">
                    {currentPage === 'dashboard' && (
                        <button
                            onClick={toggleEditMode}
                            className={`hidden sm:flex items-center text-[11px] font-bold px-4 py-2 rounded-xl transition-all duration-200 border active:scale-95 touch-manipulation ${
                                isEditMode
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                            aria-label={isEditMode ? 'Save dashboard layout' : 'Customize dashboard layout'}
                            aria-pressed={isEditMode}
                        >
                            {isEditMode ? 'Save Layout' : 'Customize'}
                        </button>
                    )}

                    <div className="h-5 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

                    <button
                        onClick={onToggleDarkMode}
                        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-zinc-400 transition-all duration-200 active:scale-90 text-base touch-manipulation"
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        aria-pressed={isDarkMode}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications')}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 relative active:scale-90 touch-manipulation ${
                                activeDropdown === 'notifications' ? 'bg-slate-100 dark:bg-white/10' : ''
                            }`}
                            aria-label={hasUnread ? 'View notifications - you have unread notifications' : 'View notifications'}
                            aria-expanded={activeDropdown === 'notifications'}
                            aria-haspopup="true"
                        >
                            <BellIcon className="w-5 h-5 text-slate-500 dark:text-zinc-400" aria-hidden="true" />
                            {hasUnread && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-[#09090B] animate-pulse" aria-hidden="true"></span>
                            )}
                        </button>

                        {activeDropdown === 'notifications' && (
                            <div className="absolute top-full right-0 mt-2 w-[85vw] max-w-[320px] bg-white dark:bg-[#18181B] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-scale-in z-50 origin-top-right" role="menu" aria-label="Notifications menu">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Notifications</h3>
                                    {hasUnread && (
                                        <button onClick={markAllRead} className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline active:scale-95 transition-transform touch-manipulation" aria-label="Mark all notifications as read">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div key={n.id} className={`px-4 py-3 border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex gap-3 ${n.unread ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : ''}`}>
                                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-600'}`}></div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-medium leading-snug truncate ${n.unread ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-400'}`}>{n.title}</p>
                                                <span className="text-[10px] text-slate-400">{n.time}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-8 text-center text-slate-400 dark:text-zinc-500 text-xs">No notifications yet.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Avatar */}
                    <button
                        onClick={() => onNavigate('settings')}
                        className="p-0.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95 ml-0.5"
                        title="Settings"
                    >
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={userName} className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-white/10" />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-zinc-300 font-bold text-xs border border-slate-200 dark:border-white/10">
                                {getInitials(userName)}
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
