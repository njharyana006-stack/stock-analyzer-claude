
import React from 'react';
import type { RiskProfile } from '../types';
import { ShieldIcon, ScaleIcon, RocketIcon, PieChartIcon, RiskIcon } from './icons';

interface RiskProfilePageProps {
    currentProfile: RiskProfile;
    setProfile: (profile: RiskProfile) => void;
    addToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

const COLORS = ['#4f46e5', '#38bdf8', '#a78bfa'];

const AllocationChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercent = 0;

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 120 120" className="w-20 h-20 md:w-32 md:h-32 transform -rotate-90">
                {data.map((item, index) => {
                    const percent = (item.value / total) * 100;
                    const dash = (percent / 100) * circumference;
                    const offset = (accumulatedPercent / 100) * circumference;
                    accumulatedPercent += percent;
                    return (
                        <circle
                            key={item.label}
                            cx="60" cy="60" r={radius}
                            fill="none" stroke={COLORS[index % COLORS.length]} strokeWidth="20"
                            strokeDasharray={`${dash} ${circumference}`}
                            strokeDashoffset={-offset}
                        />
                    );
                })}
            </svg>
            <div className="mt-4 w-full space-y-1">
                {data.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between text-[10px] md:text-xs">
                        <div className="flex items-center">
                            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full mr-1.5" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                            <span className="text-slate-600 dark:text-[#B0B8C4]">{item.label}</span>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-white">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ProfileCard: React.FC<{
    title: RiskProfile;
    description: string;
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    allocation: { label: string, value: number }[];
    isSelected: boolean;
    onSelect: () => void;
}> = ({ title, description, icon, allocation, isSelected, onSelect }) => {
    
    return (
        <div 
            onClick={onSelect}
            className={`g-card !p-4 md:!p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-[#1A2332] border dark:border-[#2C3646] ${isSelected ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg bg-indigo-50/50 dark:bg-[#1A2332]' : 'border-transparent hover:shadow-xl hover:border-slate-200'}`}
        >
            <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-[#0F1419] text-slate-600 dark:text-[#B0B8C4]'}`}>
                    {React.cloneElement(icon, { className: 'w-6 h-6 md:w-7 md:h-7' })}
                </div>
                <h3 className="text-base md:text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-[#B0B8C4] mt-3 md:mt-4 min-h-[40px] md:min-h-[60px] leading-relaxed">{description}</p>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-200 dark:border-[#2C3646]">
                <h4 className="text-xs md:text-sm font-semibold text-center text-slate-700 dark:text-[#B0B8C4] mb-3">Asset Allocation</h4>
                <AllocationChart data={allocation} />
            </div>
        </div>
    );
};

const profiles = [
    {
        type: 'Conservative',
        icon: <ShieldIcon />,
        description: "Focuses on capital preservation and stable, predictable returns. Lower risk tolerance.",
        allocation: [{label: 'Bonds', value: 50}, {label: 'Blue-Chip Stocks', value: 40}, {label: 'Cash', value: 10}]
    },
    {
        type: 'Moderate',
        icon: <ScaleIcon />,
        description: "Seeks a balance between growth and risk. Aims for steady capital appreciation over time.",
        allocation: [{label: 'Growth Stocks', value: 40}, {label: 'Value Stocks', value: 30}, {label: 'Bonds', value: 30}]
    },
    {
        type: 'Aggressive',
        icon: <RocketIcon />,
        description: "Prioritizes high growth potential, accepting significant volatility for higher returns.",
        allocation: [{label: 'Growth Stocks', value: 70}, {label: 'ETFs', value: 20}, {label: 'Speculative', value: 10}]
    }
];

const RiskProfilePage: React.FC<RiskProfilePageProps> = ({ currentProfile, setProfile, addToast }) => {

    const handleSelectProfile = (profile: RiskProfile) => {
        setProfile(profile);
        addToast(`Risk Profile set to: ${profile}`, 'success');
    };

    return (
        <div className="animate-fade-in pt-8 pb-20">
             <h2 className="text-3xl font-black flex items-center mb-2 text-slate-900 dark:text-white tracking-tight">
                <RiskIcon className="w-8 h-8 mr-3 text-indigo-500" />
                Investor Profile
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mb-8 font-medium">
                Your chosen profile helps AI tailor its analysis and suggestions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {profiles.map(p => (
                    <ProfileCard 
                        key={p.type}
                        title={p.type as RiskProfile}
                        description={p.description}
                        icon={p.icon}
                        allocation={p.allocation}
                        isSelected={currentProfile === p.type}
                        onSelect={() => handleSelectProfile(p.type as RiskProfile)}
                    />
                ))}
            </div>
        </div>
    );
};

export default RiskProfilePage;
