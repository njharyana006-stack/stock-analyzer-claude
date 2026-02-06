
import React from 'react';
import type { SavedAnalysis, AnalysisResponse } from '../types';
import { TrashIcon, AnalyzeIcon } from './icons';

interface SavedAnalysesProps {
    analyses: SavedAnalysis[];
    onLoad: (analysis: AnalysisResponse) => void;
    onDelete: (savedAt: string) => void;
}

const SavedAnalyses: React.FC<SavedAnalysesProps> = ({ analyses, onLoad, onDelete }) => {
    if (!analyses || analyses.length === 0) {
        return null; // Don't render anything if there are no saved analyses
    }

    return (
        <div className="mb-8 animate-fade-in">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[var(--border)] space-y-3">
                {analyses.map((analysis) => (
                    <div
                        key={analysis.savedAt}
                        className="p-3 bg-white hover:bg-slate-50 hover:shadow-md hover:-translate-y-px rounded-xl transition-all duration-200 border border-slate-200/80"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold text-lg text-slate-800">{analysis.ticker}</p>
                                <p className="text-sm text-slate-500 truncate">{analysis.overview.company_name}</p>
                                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-semibold rounded-full">{analysis.user_risk}</span>
                                    <span>Saved: {new Date(analysis.savedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                                <button
                                    onClick={() => onDelete(analysis.savedAt)}
                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                                    aria-label={`Delete analysis for ${analysis.ticker}`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onLoad(analysis)}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                                >
                                   <AnalyzeIcon className="w-4 h-4" />
                                   <span>Load</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedAnalyses;
