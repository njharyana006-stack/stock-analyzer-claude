
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    signInAsDemo: () => void;
    isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        // Check for persisted guest session
        const isGuestSession = localStorage.getItem('smartstock_guest_mode') === 'true';

        if (isGuestSession) {
            setupGuestUser();
            setLoading(false);
            return;
        }

        // Detect OAuth redirect (tokens in URL hash after Google/Apple redirect)
        const hash = window.location.hash;
        const isOAuthRedirect = Boolean(hash && (hash.includes('access_token') || hash.includes('refresh_token')));

        // Helper to clean OAuth tokens from URL after processing
        const cleanUpOAuthHash = () => {
            if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
        };

        // Set up auth state listener FIRST so we don't miss the SIGNED_IN event
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setIsGuest(false);
                // If real login happens, clear guest flag
                localStorage.removeItem('smartstock_guest_mode');
            } else if (!isGuestSession) {
                // Only clear user if we aren't in a forced guest session
                setUser(null);
            }
            if (isOAuthRedirect) {
                cleanUpOAuthHash();
            }
            setLoading(false);
        });

        // Check active session from Supabase
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.warn("Supabase auth check failed:", error.message);
                }
                if (session?.user) {
                    setUser(session.user);
                    setIsGuest(false);
                    if (isOAuthRedirect) {
                        cleanUpOAuthHash();
                    }
                }
            } catch (e) {
                console.error("Auth initialization error:", e);
            } finally {
                setLoading(false);
            }
        };

        getSession();

        // Safety timeout: ensure loading stops even if OAuth processing stalls
        let oauthTimeout: ReturnType<typeof setTimeout> | null = null;
        if (isOAuthRedirect) {
            oauthTimeout = setTimeout(() => {
                cleanUpOAuthHash();
                setLoading(false);
            }, 5000);
        }

        return () => {
            subscription.unsubscribe();
            if (oauthTimeout) clearTimeout(oauthTimeout);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const setupGuestUser = () => {
        setIsGuest(true);
        setUser({
            id: 'guest-user-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'guest@smartstock.ai',
            email_confirmed_at: new Date().toISOString(),
            phone: '',
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: { full_name: 'Guest Explorer' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
        } as User);
    };

    const signOut = async () => {
        if (isGuest) {
            setIsGuest(false);
            setUser(null);
            localStorage.removeItem('smartstock_guest_mode');
        } else {
            await supabase.auth.signOut();
            setUser(null);
        }
    };

    const signInAsDemo = () => {
        localStorage.setItem('smartstock_guest_mode', 'true');
        setupGuestUser();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, signInAsDemo, isGuest }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
