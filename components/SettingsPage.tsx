
import React, { useState, useEffect, useRef } from 'react';
import { UserIcon, ShieldIcon, SparklesIcon, ChevronLeftIcon, LockIcon, CheckCircleIcon, BotIcon, TrendingDownIcon, TrendUpIcon, AnalyzeIcon, PlusIcon, ScaleIcon, RocketIcon, RiskIcon } from './icons';
import type { Page, RiskProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile, getVoteHistory, uploadAvatar } from '../services/dbService';
import { supabase } from '../services/supabaseClient';
import { getStockLogo } from '../constants/stocks';

interface SettingsPageProps {
    onBack: () => void;
    userName: string; 
    setUserName: (name: string) => void;
    onNavigate: (page: Page) => void;
    avatarUrl?: string;
    setAvatarUrl: (url: string) => void;
    riskProfile: RiskProfile;
    setRiskProfile: (profile: RiskProfile) => void;
    addToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    onBack, userName, setUserName, onNavigate, avatarUrl, setAvatarUrl, riskProfile, setRiskProfile, addToast 
}) => {
    const { user, signOut } = useAuth();
    const [editableName, setEditableName] = useState(userName);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [voteHistory, setVoteHistory] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            if (user) {
                const profile = await getUserProfile(user.id);
                if (profile?.full_name) { setEditableName(profile.full_name); setUserName(profile.full_name); }
                if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
                try {
                    const votes = await getVoteHistory(user.id);
                    if (votes) setVoteHistory(votes);
                } catch (e) {}
            }
        };
        loadProfile();
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await updateUserProfile(user.id, editableName, avatarUrl);
            setUserName(editableName);
            setSuccessMessage('Profile updated successfully.');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e) {} finally { setIsSaving(false); }
    };

    const handleRiskChange = (profile: RiskProfile) => {
        setRiskProfile(profile);
        addToast(`Global Investment Profile set to ${profile}.`, 'success');
    };

    const riskOptions = [
        { id: 'Conservative' as RiskProfile, label: 'Low Risk', icon: <ShieldIcon className="w-5 h-5" />, desc: 'Capital preservation & steady yields.', color: 'text-emerald-500' },
        { id: 'Moderate' as RiskProfile, label: 'Medium Risk', icon: <ScaleIcon className="w-5 h-5" />, desc: 'Balanced growth and volatility.', color: 'text-indigo-500' },
        { id: 'Aggressive' as RiskProfile, label: 'High Risk', icon: <RocketIcon className="w-5 h-5" />, desc: 'Maximize returns via high-beta assets.', color: 'text-rose-500' },
    ];

    return (
        <div className="animate-fade-in w-full max-w-2xl mx-auto pt-8 pb-20 px-4">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-500 dark:text-zinc-400 transition-colors">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Terminal Settings</h1>
            </div>

            <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white dark:bg-[#121214] rounded-[24px] p-6 border border-slate-200 dark:border-white/5 shadow-sm">
                    <h2 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-6">User Profile</h2>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                            {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover rounded-full" /> : userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 w-full">
                            <input 
                                type="text" value={editableName} onChange={(e) => setEditableName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            />
                            {editableName !== userName && (
                                <button onClick={handleSaveProfile} className="mt-3 text-xs font-bold text-indigo-500 hover:underline">Save Name</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Investment Strategy Card */}
                <div className="bg-white dark:bg-[#121214] rounded-[24px] p-6 border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <RiskIcon className="w-4 h-4 text-indigo-500" />
                        <h2 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Investment Strategy</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {riskOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleRiskChange(opt.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${riskProfile === opt.id ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-slate-200'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${riskProfile === opt.id ? 'bg-white dark:bg-[#18181B] ' + opt.color : 'bg-white dark:bg-black/20 text-slate-400'}`}>
                                    {opt.icon}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${riskProfile === opt.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-zinc-300'}`}>{opt.label}</p>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">{opt.desc}</p>
                                </div>
                                {riskProfile === opt.id && <CheckCircleIcon className="w-5 h-5 text-indigo-500 animate-pop" />}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={signOut} className="w-full py-4 text-sm font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 rounded-2xl hover:bg-rose-100 transition-colors">Sign Out of Terminal</button>
            </div>
        </div>
    );
};

export default SettingsPage;
