
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

interface ConsentContextType {
    hasConsented: boolean;
    loading: boolean;
    giveConsent: () => Promise<void>;
    revokeConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isGuest } = useAuth();
    const [hasConsented, setHasConsented] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    
    // Increment this version if Terms of Service change to force re-consent
    const CONSENT_VERSION = '1.0'; 
    const LS_KEY = `smartstock_consent_v${CONSENT_VERSION}`;

    useEffect(() => {
        const checkConsent = async () => {
            setLoading(true);
            
            // 1. Check Local Storage (Fastest & works for Guests)
            const localConsent = localStorage.getItem(LS_KEY);
            if (localConsent === 'true') {
                setHasConsented(true);
                setLoading(false);
                return;
            }

            // 2. If authenticated user (not guest), check Supabase Source of Truth
            if (user && !isGuest) {
                try {
                    const { data, error } = await supabase
                        .from('user_consents')
                        .select('has_consented')
                        .eq('user_id', user.id)
                        .eq('consent_version', CONSENT_VERSION)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .maybeSingle(); // Use maybeSingle to avoid 406 error on empty rows

                    if (data && data.has_consented) {
                        setHasConsented(true);
                        // Sync back to local storage for next load speed
                        localStorage.setItem(LS_KEY, 'true');
                    }
                } catch (err) {
                    console.error("Error checking consent:", err);
                }
            }
            setLoading(false);
        };

        checkConsent();
    }, [user, isGuest]);

    const giveConsent = async () => {
        // 1. Update State & Local Storage immediately for UI responsiveness
        setHasConsented(true);
        localStorage.setItem(LS_KEY, 'true');

        // 2. Persist to Supabase if logged in (Audit Trail)
        if (user && !isGuest) {
            try {
                await supabase.from('user_consents').insert({
                    user_id: user.id,
                    has_consented: true,
                    consent_date: new Date().toISOString(),
                    consent_version: CONSENT_VERSION,
                });
            } catch (err) {
                console.error("Failed to persist consent to DB (UI proceeds via LocalStorage):", err);
            }
        }
    };

    const revokeConsent = () => {
        setHasConsented(false);
        localStorage.removeItem(LS_KEY);
        // Note: We typically don't delete the DB record to maintain a historical audit trail
    };

    return (
        <ConsentContext.Provider value={{ hasConsented, loading, giveConsent, revokeConsent }}>
            {children}
        </ConsentContext.Provider>
    );
};

export const useConsent = () => {
    const context = useContext(ConsentContext);
    if (context === undefined) {
        throw new Error('useConsent must be used within a ConsentProvider');
    }
    return context;
};
