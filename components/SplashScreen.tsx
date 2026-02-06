
import React, { useState } from 'react';
import { AnalyzeIcon, NewspaperIcon, PieChartIcon, ArrowLongRightIcon } from './icons';
import SmartStockLogo from './SmartStockLogo';

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Market Intelligence",
            description: "Real-time AI synthesis of technicals, fundamentals, and social sentiment.",
            icon: <AnalyzeIcon className="w-20 h-20 text-emerald-500" />,
            bgColor: "bg-emerald-500/10",
            accentColor: "text-emerald-500"
        },
        {
            title: "Sentiment Analysis",
            description: "Scan millions of news articles and social posts to gauge market mood instantly.",
            icon: <NewspaperIcon className="w-20 h-20 text-indigo-500" />,
            bgColor: "bg-indigo-500/10",
            accentColor: "text-indigo-500"
        },
        {
            title: "Strategy Generator",
            description: "Build optimized portfolios tailored to your personal risk tolerance and timeline.",
            icon: <PieChartIcon className="w-20 h-20 text-amber-500" />,
            bgColor: "bg-amber-500/10",
            accentColor: "text-amber-500"
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            onFinish();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#09090B] text-white">
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                {/* Header */}
                <div className="pt-12 px-8 flex justify-center">
                    <div className="w-12 h-12">
                        <SmartStockLogo />
                    </div>
                </div>

                {/* Carousel Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative z-10">
                    <div className="w-full max-w-sm">
                        <div className={`w-40 h-40 mx-auto rounded-[32px] flex items-center justify-center mb-10 ${slides[currentSlide].bgColor} border border-white/5 shadow-2xl transition-all duration-500 transform`}>
                            {slides[currentSlide].icon}
                        </div>
                        
                        <h2 className="text-3xl font-black mb-4 tracking-tight animate-fade-in">
                            {slides[currentSlide].title}
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed font-medium min-h-[80px] animate-fade-in">
                            {slides[currentSlide].description}
                        </p>
                    </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mb-10">
                    {slides.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Action Area */}
            <div className="p-8 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent">
                <button 
                    onClick={nextSlide}
                    className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-white/10"
                >
                    <span>{currentSlide === slides.length - 1 ? 'Start Now' : 'Next'}</span>
                    <ArrowLongRightIcon className="w-5 h-5" />
                </button>
                {currentSlide < slides.length - 1 && (
                    <button 
                        onClick={onFinish}
                        className="w-full py-4 mt-2 text-zinc-500 font-semibold text-sm hover:text-white transition-colors"
                    >
                        Skip to Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default SplashScreen;
