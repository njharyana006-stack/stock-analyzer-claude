
import React, { useState, useCallback, useEffect } from 'react';
/* Fix: Removed incorrect and unused import of createRoot from 'react-dom'. Line 3 was causing a module resolution error. */
import type { RiskProfile, AnalysisResponse, Page, SavedAnalysis, AIPortfolio } from './types';
import { getStockAnalysis, getAIPortfolioForProfile } from './services/geminiService';
import AnalysisDisplay from './components/AnalysisDisplay';
import { BotIcon, InfoIcon, CheckCircleIcon, XCircleIcon, XIcon, ReloadIcon, SearchIcon, BookmarkIcon } from './components/icons';
import StockSelector from './components/StockSelector';
import StockDiscovery from './components/StockDiscovery';
import { extractJson, isValidAnalysisResponse, triggerNotification } from './utils';
import DashboardPage from './components/DashboardPage';
import NewsPage from './components/NewsPage';
import AnalysisSkeleton from './components/AnalysisSkeleton';
import ProfileGeneratorPage from './components/ProfileGeneratorPage';
import RiskProfilePage from './components/RiskProfilePage';
import TopBar from './components/TopBar';
import ComparisonPage from './components/comparison/ComparisonPage';
import LoginPage from './components/LoginPage';
import { DashboardProvider, useDashboard } from './contexts/DashboardContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConsentProvider, useConsent } from './contexts/ConsentContext';
import BottomNav from './components/BottomNav';
import OnboardingModal from './components/OnboardingModal';
import PullToRefresh from './components/PullToRefresh';
import SubscriptionModal from './components/SubscriptionModal';
import LoadingSignal from './components/LoadingSignal';
import SavedPage from './components/SavedPage';
import SettingsPage from './components/SettingsPage';
import ManagePlanPage from './components/ManagePlanPage';
import Sidebar from './components/Sidebar';
import SplashScreen from './components/SplashScreen';
import ConsentScreen from './components/ConsentScreen';
import MediaStudioPage from './components/MediaStudioPage';
import ImageAnalyzerPage from './components/ImageAnalyzerPage';

type ToastType = 'info' | 'success' | 'error';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastComponent: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
    const baseClasses = 'flex items-center w-full max-w-xs p-4 space-x-3 glass-panel rounded-[20px] shadow-lg shadow-black/5 transition-all transform';
    const typeConfig = {
        success: { icon: <CheckCircleIcon className="w-6 h-6 text-emerald-500" /> },
        error: { icon: <XCircleIcon className="w-6 h-6 text-rose-500" /> },
        info: { icon: <InfoIcon className="w-6 h-6 text-teal-500" /> },
    };
    const config = typeConfig[toast.type];
    return (
        <div className={`${baseClasses} animate-slide-up bg-white/90 dark:bg-[#18181B]/90 border-l-4 ${toast.type === 'success' ? 'border-emerald-500' : toast.type === 'error' ? 'border-rose-500' : 'border-teal-500'}`}>
            <div className="flex-shrink-0">{config.icon}</div>
            <div className="text-sm font-medium text-slate-800 dark:text-white">{toast.message}</div>
            <button onClick={onRemove} className="ml-auto -mr-1 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close notification">
                <XIcon className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-white" />
            </button>
        </div>
    );
};

const MainContent: React.FC<{
    renderPage: () => React.ReactNode;
    currentPage: Page;
    setPage: (page: Page) => void;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    toasts: Toast[];
    setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
    userName: string;
    setUserName: (name: string) => void;
    avatarUrl?: string;
    setAvatarUrl: (url: string) => void;
    onUpgrade: () => void;
}> = ({ 
    renderPage, currentPage, setPage, isDarkMode, setIsDarkMode, toasts, setToasts, userName, setUserName, avatarUrl, setAvatarUrl, onUpgrade
}) => {
    const { refreshDashboard, refreshNews } = useDashboard();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleGlobalRefresh = async () => {
        await Promise.all([refreshDashboard(), refreshNews()]);
    };

    return (
        <div className="min-h-[100dvh] bg-transparent text-slate-900 dark:text-slate-50 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-800 dark:selection:text-emerald-200 flex overflow-hidden">
            
            <Sidebar 
                currentPage={currentPage}
                setPage={setPage}
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobileOpen={false} 
                setMobileOpen={() => {}} 
                onUpgrade={onUpgrade}
                userName={userName}
                setUserName={setUserName}
                avatarUrl={avatarUrl}
            />

            <div className={`flex-1 flex flex-col h-[100dvh] relative transition-all duration-300 ease-in-out overflow-hidden`}>
                <TopBar 
                    currentPage={currentPage}
                    onRefresh={handleGlobalRefresh}
                    isDarkMode={isDarkMode}
                    onToggleDarkMode={() => setIsDarkMode(p => !p)}
                    onNavigate={setPage}
                    userName={userName}
                    avatarUrl={avatarUrl}
                />
                
                <main className="flex-1 w-full relative bg-[#F8FAFC] dark:bg-[#020617] pt-16 md:pt-20 overflow-hidden">
                    <PullToRefresh onRefresh={handleGlobalRefresh}>
                        <div className="w-full mx-auto min-h-full pb-32 pt-safe pl-safe pr-safe">
                            <div className="animate-fade-in key={currentPage}"> 
                                {renderPage()}
                            </div>
                        </div>
                    </PullToRefresh>
                </main>
            </div>

            <BottomNav currentPage={currentPage} setPage={setPage} />
            {currentPage === 'dashboard' && <OnboardingModal />}

            <div className="fixed top-[calc(var(--sat)+80px)] right-6 z-[60] w-full max-w-[320px] space-y-3 pointer-events-none flex flex-col items-end pr-safe">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastComponent toast={toast} onRemove={() => setToasts(current => current.filter(t => t.id !== toast.id))} />
                    </div>
                ))}
            </div>
        </div>
    );
}

const AppContent: React.FC = () => {
  const { user, loading, isGuest } = useAuth();
  const { hasConsented, loading: consentLoading } = useConsent();
  // Skip splash screen when returning from OAuth redirect (user already authenticated)
  const [showSplash, setShowSplash] = useState(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token') || hash.includes('refresh_token'))) {
      return false;
    }
    return true;
  });
  const [ticker, setTicker] = useState<string>('NOW');
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('Moderate');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentPage, setPage] = useState<Page>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [comparisonTickers, setComparisonTickers] = useState<(string | null)[]>([null, null, null, null]);
  const [userName, setUserName] = useState("User");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Background Portfolio State
  const [portfolioData, setPortfolioData] = useState<AIPortfolio | null>(null);
  const [isGenLoading, setIsGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
      if (user?.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name);
      } else if (user?.email) {
          setUserName(user.email.split('@')[0]);
      } else if (isGuest) {
          setUserName("Guest Explorer");
      }
      
      if (user?.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
      }
  }, [user, isGuest]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 6000);
  }, []);

  const handleSetPage = (page: Page) => {
    if (isGuest && (page === 'profileGenerator' || page === 'comparison' || page === 'saved')) {
        addToast("Create an account to access advanced tools like Comparisons and Strategy Generation.", 'info');
        return; 
    }
    setPage(page);
  };
  
  const handleNewAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
    handleSetPage('analysis');
  }, []);

  const handleResetComparison = useCallback(() => {
    setComparisonTickers([null, null, null, null]);
    addToast("Comparison workspace cleared.", 'info');
  }, [addToast]);

  const handleAnalyze = useCallback(async (tickerToAnalyze: string, riskProfileToUse: RiskProfile) => {
    if (isGuest) {
        addToast("Register to unlock Deep AI Analysis.", 'info');
        return;
    }

    if (!tickerToAnalyze) {
        setError("Please enter a stock ticker to analyze.");
        addToast("Please enter a stock ticker.", 'error');
        return;
    }
    handleSetPage('analysis');
    setTicker(tickerToAnalyze);
    setRiskProfile(riskProfileToUse);
    addToast(`Processing intelligence for ${tickerToAnalyze}...`, 'info');
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      setLoadingMessage(`Gathering real-time data for ${tickerToAnalyze}...`);
      const resultText = await getStockAnalysis(tickerToAnalyze, riskProfileToUse);
      setLoadingMessage(`Synthesizing AI Report...`);
      const result = JSON.parse(extractJson(resultText));
      if (!isValidAnalysisResponse(result)) throw new Error("The AI returned an incomplete data structure. Please try again.");
      setAnalysisResult(result);
      addToast(`Analysis for ${tickerToAnalyze} ready!`, 'success');
      triggerNotification(`Deep Analysis Completed: ${tickerToAnalyze}`, 'success');
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      addToast(`Analysis for ${tickerToAnalyze} failed.`, 'error');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [addToast, isGuest]);

  const handleGeneratePortfolio = useCallback(async (horizon: string, count: number) => {
      setIsGenLoading(true);
      setGenError(null);
      setPortfolioData(null);
      addToast(`Generating new ${riskProfile} portfolio...`, 'info');
      try {
          const resultText = await getAIPortfolioForProfile(riskProfile, horizon, count);
          const newPortfolio: AIPortfolio = JSON.parse(extractJson(resultText));
          setPortfolioData(newPortfolio);
          addToast('New portfolio generated successfully!', 'success');
          triggerNotification(`New ${riskProfile} Strategy Ready`, 'success');
      } catch (e) {
          console.error(e);
          const errorMessage = e instanceof Error ? e.message : "Failed to generate a new portfolio.";
          setGenError(errorMessage);
          addToast(errorMessage, 'error');
      } finally {
          setIsGenLoading(false);
      }
  }, [riskProfile, addToast]);
  
  const renderPage = () => {
      switch(currentPage) {
          case 'dashboard':
            return <DashboardPage onSelectTicker={(ticker) => handleAnalyze(ticker, riskProfile)} onNavigate={handleSetPage} userName={userName} />;
          case 'analysis':
             if (analysisResult) {
                return (
                    <div className="space-y-6 md:space-y-8 pt-4 pb-12 w-full max-w-[1920px] mx-auto px-4 md:px-8">
                        <div className="flex justify-end gap-3 px-2 md:px-0">
                            <button
                                onClick={handleNewAnalysis}
                                className="flex items-center space-x-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-slate-900 dark:bg-white dark:text-black rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
                            >
                                <SearchIcon className="w-4 h-4" />
                                <span>New Scan</span>
                            </button>
                        </div>
                        <AnalysisDisplay result={analysisResult} addToast={addToast} />
                    </div>
                );
            }

            return (
                <div className="pt-8 w-full max-w-[1920px] mx-auto">
                    <div className="max-w-6xl mx-auto px-4 md:px-8">
                        <div className="text-center mb-12 animate-slide-up">
                            {(isLoading || error) && (
                                <>
                                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Deep Analysis</h1>
                                    <p className="text-slate-600 dark:text-zinc-400 text-lg font-medium">AI-powered investment intelligence.</p>
                                </>
                            )}
                        </div>
                        
                        {!isLoading && !error && (
                            <div className="mb-12 relative z-20">
                                <StockSelector onAnalyze={handleAnalyze} initialTicker={ticker} initialRiskProfile={riskProfile} isLoading={isLoading} />
                            </div>
                        )}

                        {isLoading ? (
                            <div className="mt-16 relative z-10">
                                <LoadingSignal 
                                    message={loadingMessage || 'Processing market data...'} 
                                    subMessage="Synthesizing financials, news, and technicals."
                                />
                                <div className="opacity-20 blur-[1px] pointer-events-none mt-12 select-none scale-95 transform origin-top transition-transform duration-1000">
                                    <AnalysisSkeleton />
                                </div>
                            </div>
                        ) : error ? (
                            <div className="g-card flex flex-col items-center justify-center min-h-[400px] border-rose-200 dark:border-rose-500/20 text-center p-12 rounded-[40px] max-w-2xl mx-auto bg-rose-50/50 dark:bg-rose-900/10 shadow-xl animate-fade-in">
                                <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mb-6 shadow-inner"><InfoIcon className="w-10 h-10 text-rose-600 dark:text-rose-400" /></div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Analysis Failed</h3>
                                <p className="text-base text-rose-700 dark:text-rose-300 max-w-md leading-relaxed">{error}</p>
                                <button onClick={() => handleAnalyze(ticker, riskProfile)} className="mt-8 px-8 py-4 text-sm font-bold text-white bg-rose-600 rounded-2xl hover:bg-rose-700 flex items-center space-x-3 transition-all shadow-lg hover:shadow-rose-500/30 hover:-translate-y-1 active:translate-y-0">
                                    <ReloadIcon className="w-5 h-5" />
                                    <span>Retry Analysis</span>
                                </button>
                            </div>
                        ) : (
                            <StockDiscovery onAnalyze={handleAnalyze} currentRiskProfile={riskProfile} />
                        )}
                    </div>
                </div>
            );
          case 'marketPulse':
            return <div className="px-4 md:px-8 pt-6"><NewsPage addToast={addToast} /></div>;
          case 'newsFeed':
              return <div className="px-4 md:px-8 pt-6"><NewsPage addToast={addToast} /></div>;
          case 'profileGenerator':
              return <div className="px-4 md:px-8 pt-6"><ProfileGeneratorPage 
                riskProfile={riskProfile} 
                addToast={addToast} 
                portfolio={portfolioData}
                isLoading={isGenLoading}
                error={genError}
                onGenerate={handleGeneratePortfolio}
              /></div>;
          case 'riskProfile':
              return <div className="px-4 md:px-8 pt-6"><RiskProfilePage currentProfile={riskProfile} setProfile={setRiskProfile} addToast={addToast} /></div>;
          case 'comparison':
              return <div className="px-4 md:px-8 pt-6"><ComparisonPage 
                        onBack={() => handleSetPage('dashboard')} 
                        onLoadAnalysis={(analysis) => {
                            setAnalysisResult(analysis);
                            setTicker(analysis.ticker);
                            handleSetPage('analysis');
                        }}
                        tickers={comparisonTickers}
                        onTickersChange={setComparisonTickers}
                        onReset={handleResetComparison}
                    /></div>;
          case 'saved':
              return <div className="px-4 md:px-12 pt-10"><SavedPage 
                  onLoadAnalysis={(analysis) => {
                      setAnalysisResult(analysis);
                      setTicker(analysis.ticker);
                      setRiskProfile(analysis.user_risk);
                      handleSetPage('analysis');
                  }} 
                  onRescan={(ticker) => {
                      handleAnalyze(ticker, 'Moderate');
                  }}
                  addToast={addToast} 
              /></div>;
          case 'settings':
              return <SettingsPage 
                onBack={() => handleSetPage('dashboard')} 
                userName={userName} 
                setUserName={setUserName} 
                onNavigate={handleSetPage} 
                avatarUrl={avatarUrl} 
                setAvatarUrl={setAvatarUrl}
                riskProfile={riskProfile}
                setRiskProfile={setRiskProfile}
                addToast={addToast}
              />;
          case 'managePlan':
              return <ManagePlanPage onBack={() => handleSetPage('settings')} addToast={addToast} />;
          default:
            return <DashboardPage onSelectTicker={(ticker) => handleAnalyze(ticker, riskProfile)} onNavigate={handleSetPage} userName={userName} />;
      }
  }

  if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (loading || consentLoading) {
      return <div className="h-screen w-full flex items-center justify-center bg-[#09090B] text-white">Loading...</div>;
  }

  if (!user) {
      return <LoginPage onLogin={() => {}} />;
  }

  if (!hasConsented) {
      return <ConsentScreen />;
  }

  return (
      <DashboardProvider>
          <MainContent 
            renderPage={renderPage}
            currentPage={currentPage}
            setPage={handleSetPage}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            toasts={toasts}
            setToasts={setToasts}
            userName={userName}
            setUserName={setUserName}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            onUpgrade={() => setIsSubscriptionModalOpen(true)}
          />
          <SubscriptionModal isOpen={isSubscriptionModalOpen} onClose={() => setIsSubscriptionModalOpen(false)} />
      </DashboardProvider>
  );
}

const App: React.FC = () => {
    return (
        <AuthProvider>
            <ConsentProvider>
                <AppContent />
            </ConsentProvider>
        </AuthProvider>
    );
};

export default App;
