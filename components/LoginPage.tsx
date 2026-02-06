
import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { updateUserProfile } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';
import { ShieldIcon, GoogleIcon, FacebookIcon, AppleIcon, UserIcon, ArrowLongRightIcon, LockIcon, CheckCircleIcon, InfoIcon, ExclamationTriangleIcon } from './icons';
import SmartStockLogo from './SmartStockLogo';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const { signInAsDemo } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Handle OAuth redirect callback - detect tokens in URL hash after Google/Apple redirect
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && (hash.includes('access_token') || hash.includes('refresh_token'))) {
            setIsLoading(true);
            // Supabase automatically picks up tokens from URL via onAuthStateChange in AuthContext.
            // We wait briefly then call onLogin to transition to the dashboard.
            const timeout = setTimeout(() => {
                onLogin();
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [onLogin]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
                if (error) throw error;
            } else {
                if (!fullName.trim()) throw new Error("Full Name is required.");
                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: { data: { full_name: fullName.trim() } }
                });
                if (error) throw error;
                if (data.user) {
                    await updateUserProfile(data.user.id, fullName.trim());
                    if (!data.session) {
                        setSuccessMsg("Account created! Please check your email for a verification link.");
                        setIsLoading(false);
                        return;
                    }
                }
            }
            onLogin();
        } catch (err: any) {
            console.error("Auth error details:", err);
            let msg = err.message || "Authentication failed.";
            
            // Map cryptic Supabase/network errors to user-friendly messages
            if (msg.includes('Invalid API key') || msg.includes('anon key')) {
                msg = "System configuration error: The API key for authentication is missing or invalid. Use 'Guest Mode' if you don't have your environment keys set up.";
            } else if (msg.includes('Invalid login credentials')) {
                msg = "Incorrect email or password. Please try again.";
            } else if (msg.includes('Email not confirmed')) {
                msg = "Your email is not yet verified. Please check your inbox for the confirmation link.";
            } else if (msg.includes('User already registered')) {
                msg = "An account with this email already exists. Please Sign In instead.";
            }
            
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuth = async (provider: 'google' | 'apple') => {
        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account',
                    }
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("OAuth error details:", err);
            let msg = err.message || `Failed to sign in with ${provider}.`;
            if (msg.includes('Invalid API key')) {
                msg = "Configuration Error: Social login requires a valid Supabase setup. Try 'Guest Mode' instead.";
            }
            setError(msg);
            setIsLoading(false);
        }
    };

    const handleGuest = () => {
        signInAsDemo();
        onLogin();
    };

    return (
        <div className="min-h-screen w-full flex bg-[#09090B] text-white overflow-hidden relative">
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 z-10">
                <div>
                    <div className="w-12 h-12 mb-8">
                        <SmartStockLogo />
                    </div>
                    <h1 className="text-6xl font-black tracking-tight leading-[1.1] mb-6">
                        Market <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Intelligence.</span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-md leading-relaxed font-medium">
                        Institutional-grade analysis synthesized from millions of data points. Technicals, Sentiment, and Fundamentals—unified.
                    </p>
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-zinc-500 text-sm font-medium">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#09090B] bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                                    <UserIcon className="w-4 h-4 text-zinc-400" />
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 10,000+ investors</p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20">
                <div className="w-full max-w-[420px] bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl animate-scale-in">
                    
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-16 h-16">
                            <SmartStockLogo />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="text-zinc-400 text-sm">Enter your credentials to access the terminal.</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 text-xs font-medium animate-fade-in leading-relaxed">
                                <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                        {successMsg && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-bold animate-fade-in">
                                <CheckCircleIcon className="w-4 h-4" />
                                {successMsg}
                            </div>
                        )}

                        {!isLogin && (
                            <div className="space-y-1.5 animate-slide-up">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                                    <input 
                                        type="text" 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative">
                                <LockIcon className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowLongRightIcon className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <button 
                            onClick={handleGuest} 
                            disabled={isLoading} 
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all group"
                        >
                            <UserIcon className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-bold text-emerald-400">Continue as Guest</span>
                        </button>
                        {!isSupabaseConfigured && (
                            <p className="text-[10px] text-zinc-600 text-center mt-2 flex items-center justify-center gap-1">
                                <InfoIcon className="w-3 h-3" />
                                Backend disconnected. Use Guest Mode.
                            </p>
                        )}
                    </div>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/5"></div>
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Or social login</span>
                        <div className="h-px flex-1 bg-white/5"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button onClick={() => handleOAuth('google')} disabled={isLoading} className="flex items-center justify-center py-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors gap-2">
                            <GoogleIcon className="w-5 h-5" />
                            <span className="text-xs font-bold text-zinc-400">Google</span>
                        </button>
                        <button onClick={() => handleOAuth('apple')} disabled={isLoading} className="flex items-center justify-center py-2.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors gap-2">
                            <AppleIcon className="w-5 h-5 text-white" />
                            <span className="text-xs font-bold text-zinc-400">Apple</span>
                        </button>
                    </div>

                    <p className="text-center text-xs text-zinc-500 font-medium">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            className="ml-1.5 text-white hover:underline font-bold"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
