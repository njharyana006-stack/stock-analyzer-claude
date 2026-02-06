
import { supabase } from './supabaseClient';
import type { SavedAnalysis } from '../types';

// Helper to notify UI components of changes
const notifyChange = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('stock_activity_changed'));
    }
};

const notifyPopup = (title: string, type: 'success' | 'info' | 'warning' = 'info') => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('smartstock_notification', {
            detail: { title, type }
        }));
    }
}

export const saveStock = async (userId: string, ticker: string, companyName: string, price: number, analysisData?: any) => {
    const payload = {
        symbol: ticker,
        stock_name: companyName,
        price,
        analysis_data: analysisData,
        added_date: new Date().toISOString()
    };

    if (userId === 'guest-user-id') {
        const stored = localStorage.getItem('guest_saved_stocks');
        const stocks = stored ? JSON.parse(stored) : [];
        if (!stocks.some((s: any) => s.symbol === ticker)) {
            const newStock = { id: Date.now(), ...payload };
            localStorage.setItem('guest_saved_stocks', JSON.stringify([...stocks, newStock]));
            notifyChange();
        } else {
            const updatedStocks = stocks.map((s: any) => s.symbol === ticker ? { ...s, ...payload, id: s.id } : s);
            localStorage.setItem('guest_saved_stocks', JSON.stringify(updatedStocks));
            notifyChange();
        }
        return;
    }

    const { error } = await supabase
        .from('saved_stocks')
        .upsert({ 
            user_id: userId, 
            symbol: ticker, 
            stock_name: companyName, 
            price: price,
            analysis_data: analysisData 
        }, { onConflict: 'user_id, symbol' });
    
    if (!error) notifyChange();
    if (error) throw error;
};

export const getSavedStocks = async (userId: string) => {
    if (userId === 'guest-user-id') {
        const stored = localStorage.getItem('guest_saved_stocks');
        return stored ? JSON.parse(stored) : [];
    }
    const { data, error } = await supabase
        .from('saved_stocks')
        .select('*')
        .eq('user_id', userId)
        .order('added_date', { ascending: false });
        
    if (error) throw error;
    return data;
};

export const deleteSavedStock = async (id: number) => {
    const stored = localStorage.getItem('guest_saved_stocks');
    if (stored) {
        let stocks = JSON.parse(stored);
        if (stocks.some((s: any) => s.id === id)) {
            stocks = stocks.filter((s: any) => s.id !== id);
            localStorage.setItem('guest_saved_stocks', JSON.stringify(stocks));
            notifyChange();
            return;
        }
    }

    const { error } = await supabase
        .from('saved_stocks')
        .delete()
        .eq('id', id);
        
    if (!error) notifyChange();
    if (error) throw error;
};

export const getAlerts = async (userId: string) => {
    if (userId === 'guest-user-id') {
        const stored = localStorage.getItem('guest_stock_alerts');
        return stored ? JSON.parse(stored) : [];
    }
    try {
        const { data, error } = await supabase
            .from('stock_alerts')
            .select('*')
            .eq('user_id', userId);
            
        if (error) {
            if (error.code === '42P01') return [];
            throw error;
        }
        return data || [];
    } catch (e) {
        return [];
    }
};

export const toggleAlert = async (userId: string, ticker: string) => {
    let result = false;
    if (userId === 'guest-user-id') {
        const stored = localStorage.getItem('guest_stock_alerts');
        let alerts = stored ? JSON.parse(stored) : [];
        const exists = alerts.find((a: any) => a.symbol === ticker);
        
        if (exists) {
            alerts = alerts.filter((a: any) => a.symbol !== ticker);
            result = false;
        } else {
            alerts.push({ id: Date.now(), symbol: ticker, created_at: new Date().toISOString() });
            result = true;
        }
        localStorage.setItem('guest_stock_alerts', JSON.stringify(alerts));
    } else {
        const { data } = await supabase
            .from('stock_alerts')
            .select('id')
            .eq('user_id', userId)
            .eq('symbol', ticker)
            .maybeSingle();
        
        if (data) {
            await supabase.from('stock_alerts').delete().eq('id', data.id);
            result = false;
        } else {
            await supabase.from('stock_alerts').insert({ user_id: userId, symbol: ticker });
            result = true;
        }
    }
    notifyChange();
    notifyPopup(result ? `Alert Activated: ${ticker}` : `Alert Removed: ${ticker}`, 'info');
    return result;
};

export const castVote = async (userId: string, ticker: string, vote: 'Bullish' | 'Bearish', aiSignal?: string) => {
    const key = userId === 'guest-user-id' ? 'guest_stock_votes' : `user_votes_${userId}`;
    const stored = localStorage.getItem(key);
    const votes = stored ? JSON.parse(stored) : {};
    votes[ticker] = { vote, aiSignal: aiSignal || 'Neutral', date: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(votes));

    if (userId === 'guest-user-id') return;

    try {
        await supabase.from('stock_votes').upsert({ user_id: userId, symbol: ticker, vote, ai_signal: aiSignal }, { onConflict: 'user_id, symbol' });
    } catch (e) {}
};

export const getUserVote = async (userId: string, ticker: string) => {
    const key = userId === 'guest-user-id' ? 'guest_stock_votes' : `user_votes_${userId}`;
    const stored = localStorage.getItem(key);
    const localVotes = stored ? JSON.parse(stored) : {};
    if (localVotes[ticker]) return localVotes[ticker].vote;
    if (userId === 'guest-user-id') return null;
    const { data } = await supabase.from('stock_votes').select('vote').eq('user_id', userId).eq('symbol', ticker).maybeSingle();
    return data?.vote || null;
};

export const getVoteHistory = async (userId: string) => {
    const key = userId === 'guest-user-id' ? 'guest_stock_votes' : `user_votes_${userId}`;
    const stored = localStorage.getItem(key);
    const local = stored ? JSON.parse(stored) : {};
    const localList = Object.entries(local).map(([s, d]: any) => ({ symbol: s, vote: d.vote, ai_signal: d.aiSignal, created_at: d.date }));

    if (userId === 'guest-user-id') return localList.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const { data } = await supabase.from('stock_votes').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    return data || localList;
};

export const getUserProfile = async (userId: string) => {
    if (userId === 'guest-user-id') return { full_name: 'Guest Explorer' };
    const { data } = await supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle();
    return data;
};

export const updateUserProfile = async (userId: string, fullName: string, avatarUrl?: string) => {
    if (userId === 'guest-user-id') return;
    const updates: any = { id: userId, full_name: fullName };
    if (avatarUrl) updates.avatar_url = avatarUrl;
    const { error } = await supabase.from('user_profiles').upsert(updates);
    if (error) throw error;
};

export const uploadAvatar = async (userId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
};
