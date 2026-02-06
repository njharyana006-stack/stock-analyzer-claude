
import React from 'react';
import type { CompanyProfileData, MajorHolders } from '../../types';
import { MarketCapIcon, CeoIcon, EmployeesIcon, SectorIcon, CompanyIcon, CalendarIcon, GlobeAmericasIcon, HoldersIcon } from '../icons';
import HoldersInfo from './HoldersInfo';
import TradingStatusBadge from './TradingStatusBadge';
import { countryToFlag } from '../../utils';

interface CompanyProfileTabProps {
    profile: CompanyProfileData;
    holders: MajorHolders;
}

const ProfileRow: React.FC<{ label: string; value: string; icon: React.ReactElement<React.SVGProps<SVGSVGElement>> }> = ({ label, value, icon }) => (
    <div className="flex items-center py-4 border-b border-slate-100 dark:border-white/5 last:border-0 group hover:bg-slate-50 dark:hover:bg-white/5 px-3 rounded-xl transition-colors">
        <div className="text-slate-400 dark:text-zinc-400 mr-4 flex-shrink-0 bg-slate-100 dark:bg-white/5 p-2 rounded-lg group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors border border-slate-200 dark:border-white/5">
            {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <div className="flex-1 flex justify-between items-center">
            <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">{label}</p>
            <p className="text-base font-bold text-slate-900 dark:text-white text-right tracking-tight">{value || 'N/A'}</p>
        </div>
    </div>
);

const CompanyProfileTab: React.FC<CompanyProfileTabProps> = ({ profile, holders }) => {
    const countryName = profile.country || 'N/A';
    const flag = countryToFlag(profile.country);
    const countryValue = flag ? `${countryName} ${flag}` : countryName;

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <section className="bg-white dark:bg-[#121214] p-6 md:p-8 shadow-sm border border-slate-200 dark:border-white/5 rounded-[24px]">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black flex items-center text-slate-900 dark:text-white tracking-tight">
                        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 rounded-xl mr-3 border border-indigo-100 dark:border-indigo-500/20">
                            <CompanyIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        </span>
                        Key Information
                    </h3>
                    {profile.trading_status && profile.status_color && (
                        <TradingStatusBadge status={profile.trading_status} color={profile.status_color} />
                    )}
                </div>

                <div className="">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Metrics */}
                        <div>
                            <div className="space-y-1">
                                <ProfileRow label="Market Cap" value={profile.market_cap} icon={<MarketCapIcon />} />
                                <ProfileRow label="CEO" value={profile.ceo} icon={<CeoIcon />} />
                                <ProfileRow label="Employees" value={profile.employees} icon={<EmployeesIcon />} />
                                <ProfileRow label="Sector" value={profile.sector} icon={<SectorIcon />} />
                                <ProfileRow label="Industry" value={profile.industry} icon={<CompanyIcon />} />
                                <ProfileRow label="IPO Date" value={profile.ipo_date} icon={<CalendarIcon />} />
                                <ProfileRow label="Country" value={countryValue} icon={<GlobeAmericasIcon />} />
                            </div>
                        </div>

                        {/* Right: Description */}
                        <div className="bg-slate-50 dark:bg-[#18181B] rounded-2xl p-8 border border-slate-100 dark:border-white/5 relative h-full">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider opacity-90">About {profile.symbol}</h4>
                            <p className="text-sm md:text-base text-slate-700 dark:text-zinc-200 leading-relaxed text-justify font-medium">
                                {profile.description}
                            </p>
                            {/* Decorative Quote Icon */}
                            <div className="absolute top-6 right-6 text-slate-200 dark:text-white/5 pointer-events-none">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white dark:bg-[#121214] p-6 md:p-8 shadow-sm border border-slate-200 dark:border-white/5 rounded-[24px]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-black flex items-center text-slate-900 dark:text-white tracking-tight">
                        <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-500/10 rounded-xl mr-3 border border-indigo-100 dark:border-indigo-500/20">
                            <HoldersIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        </span>
                        Major Holders
                    </h3>
                </div>
                <HoldersInfo holders={holders} />
            </section>
        </div>
    );
};

export default CompanyProfileTab;
