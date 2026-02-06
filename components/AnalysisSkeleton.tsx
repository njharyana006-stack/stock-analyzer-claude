


import React from 'react';

const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-slate-200 rounded ${className}`} />
);

const AnalysisSkeleton: React.FC = () => (
    <div className="animate-pulse max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-x-6">
            <div className="w-16 h-16 rounded-lg bg-slate-200" />
            <div className="space-y-2">
                <SkeletonBlock className="h-8 w-64" />
                <SkeletonBlock className="h-4 w-32" />
            </div>
             <div className="ml-auto space-y-2 text-right">
                <SkeletonBlock className="h-8 w-40 ml-auto" />
                <SkeletonBlock className="h-4 w-24 ml-auto" />
            </div>
        </div>

        {/* Tabs */}
        <div className="h-12 border-b border-slate-200 flex items-end space-x-6">
            <SkeletonBlock className="h-5 w-24 mb-3" />
            <SkeletonBlock className="h-5 w-32 mb-3" />
            <SkeletonBlock className="h-5 w-28 mb-3" />
        </div>

        {/* Summary Card */}
        <div className="g-card !p-6 space-y-4">
            <SkeletonBlock className="h-6 w-48 mb-4" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
             <SkeletonBlock className="h-4 w-4/5" />
        </div>
        
        {/* Chart Card */}
        <div className="g-card !p-6">
            <div className="flex justify-between items-center mb-4">
                <SkeletonBlock className="h-6 w-56" />
                <SkeletonBlock className="h-8 w-48" />
            </div>
            <SkeletonBlock className="h-96 w-full" />
        </div>
    </div>
);

export default AnalysisSkeleton;