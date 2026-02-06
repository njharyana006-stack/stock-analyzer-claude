
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { DashboardPageData, NewsArticle, DashboardWidget, WidgetType } from '../types';
import { getDashboardPageData, getMarketNews } from '../services/geminiService';
import { extractJson, isDataStale } from '../utils';

interface DashboardContextType {
  dashboardData: DashboardPageData | null;
  marketNews: NewsArticle[];
  isDashboardLoading: boolean;
  isNewsLoading: boolean;
  refreshDashboard: (force?: boolean) => Promise<void>;
  refreshNews: (force?: boolean) => Promise<void>;
  lastUpdated: Date | null;
  widgets: DashboardWidget[];
  isEditMode: boolean;
  toggleEditMode: () => void;
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  moveWidget: (index: number, direction: 'up' | 'down') => void;
  resetWidgets: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_WIDGETS: DashboardWidget[] = [
    { id: 'glance', type: 'MARKET_GLANCE' },
    { id: 'metrics', type: 'KEY_METRICS' },
    { id: 'calendar', type: 'ECONOMIC_CALENDAR' },
    { id: 'etfs', type: 'ETF_PERFORMANCE' },
    { id: 'news', type: 'NEWS_FEED' }
];

const CACHE_KEYS = {
    DASHBOARD_DATA: 'smartstock_dashboard_data',
    DASHBOARD_TIMESTAMP: 'smartstock_dashboard_ts',
    NEWS_DATA: 'smartstock_news_data',
    NEWS_TIMESTAMP: 'smartstock_news_ts',
    WIDGETS_CONFIG: 'smartstock_widgets_config'
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<DashboardPageData | null>(null);
  const [marketNews, setMarketNews] = useState<NewsArticle[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Initialize widgets from storage or defaults
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
      const saved = localStorage.getItem(CACHE_KEYS.WIDGETS_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const hasInitialized = useRef(false);

  // Persist widgets on change
  useEffect(() => {
      localStorage.setItem(CACHE_KEYS.WIDGETS_CONFIG, JSON.stringify(widgets));
  }, [widgets]);

  const toggleEditMode = useCallback(() => setIsEditMode(prev => !prev), []);

  const addWidget = useCallback((type: WidgetType) => {
      const newWidget: DashboardWidget = { id: `widget-${Date.now()}`, type };
      setWidgets(prev => [...prev, newWidget]);
  }, []);

  const removeWidget = useCallback((id: string) => setWidgets(prev => prev.filter(w => w.id !== id)), []);

  const moveWidget = useCallback((index: number, direction: 'up' | 'down') => {
      setWidgets(prev => {
          const newWidgets = [...prev];
          if (direction === 'up' && index > 0) [newWidgets[index], newWidgets[index - 1]] = [newWidgets[index - 1], newWidgets[index]];
          else if (direction === 'down' && index < newWidgets.length - 1) [newWidgets[index], newWidgets[index + 1]] = [newWidgets[index + 1], newWidgets[index]];
          return newWidgets;
      });
  }, []);

  const resetWidgets = useCallback(() => setWidgets([...DEFAULT_WIDGETS]), []);

  const refreshDashboard = useCallback(async (force = false) => {
    // 1. Check Cache
    if (!force) {
        const cachedData = localStorage.getItem(CACHE_KEYS.DASHBOARD_DATA);
        const timestamp = localStorage.getItem(CACHE_KEYS.DASHBOARD_TIMESTAMP);
        
        if (cachedData && timestamp) {
            const lastFetch = parseInt(timestamp);
            if (!isDataStale(lastFetch)) {
                // Cache is valid (fetched today after 3 AM, or yesterday and it's not yet 3 AM)
                try {
                    setDashboardData(JSON.parse(cachedData));
                    setLastUpdated(new Date(lastFetch));
                    return;
                } catch (e) {
                    console.warn("Invalid cached dashboard data, fetching fresh.");
                }
            }
        }
    }

    // 2. Fetch Fresh if forced or stale
    setIsDashboardLoading(true);
    try {
      const dashboardResult = await getDashboardPageData();
      const data: DashboardPageData = JSON.parse(extractJson(dashboardResult));
      
      const now = Date.now();
      setDashboardData(data);
      setLastUpdated(new Date(now));
      
      // Update Storage
      localStorage.setItem(CACHE_KEYS.DASHBOARD_DATA, JSON.stringify(data));
      localStorage.setItem(CACHE_KEYS.DASHBOARD_TIMESTAMP, now.toString());
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsDashboardLoading(false);
    }
  }, []);

  const refreshNews = useCallback(async (force = false) => {
    // 1. Check Cache
    if (!force) {
        const cachedNews = localStorage.getItem(CACHE_KEYS.NEWS_DATA);
        const timestamp = localStorage.getItem(CACHE_KEYS.NEWS_TIMESTAMP);
        
        if (cachedNews && timestamp) {
            const lastFetch = parseInt(timestamp);
            if (!isDataStale(lastFetch)) {
                try {
                    setMarketNews(JSON.parse(cachedNews));
                    return;
                } catch (e) {
                    console.warn("Invalid cached news data.");
                }
            }
        }
    }

    // 2. Fetch Fresh
    setIsNewsLoading(true);
    try {
      const resultText = await getMarketNews();
      const news: NewsArticle[] = JSON.parse(extractJson(resultText));
      
      setMarketNews(news);
      
      // Update Storage
      localStorage.setItem(CACHE_KEYS.NEWS_DATA, JSON.stringify(news));
      localStorage.setItem(CACHE_KEYS.NEWS_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.error("News fetch error:", error);
    } finally {
      setIsNewsLoading(false);
    }
  }, []);

  // INITIAL FETCH: Only run once on mount
  useEffect(() => {
    if (!hasInitialized.current) {
        hasInitialized.current = true;
        refreshDashboard(false); // Try cache first
        refreshNews(false); // Try cache first
    }
  }, [refreshDashboard, refreshNews]);

  return (
    <DashboardContext.Provider value={{
        dashboardData, marketNews, isDashboardLoading, isNewsLoading, refreshDashboard, refreshNews, lastUpdated,
        widgets, isEditMode, toggleEditMode, addWidget, removeWidget, moveWidget, resetWidgets,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};
