
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { updateUserProfile } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';
import { ShieldIcon, GoogleIcon, FacebookIcon, AppleIcon, UserIcon } from './icons';
import SmartStockLogo from './SmartStockLogo';

interface AuthPageProps {
    onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const { signInAsDemo } = useAuth();
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

      // Handle OAuth callback redirect
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      // OAuth tokens received - wait for Supabase to process them
      const timeout = setTimeout(() => {
        onLogin();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [onLogin]);

    const validatePassword = (pwd: string) => {
        if (pwd.length < 7) return "Password must be at least 7 characters.";
        if (!/[A-Z]/.test(pwd)) return "Password must contain at least one capital letter.";
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return "Password must contain at least one special character.";
        return null;
    };

    const clearErrorOnInput = () => {
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const cleanEmail = email.trim();
        const cleanConfirmEmail = confirmEmail.trim();

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password,
                });
                if (error) throw error;
            } else {
                // Sign Up Validation
                if (!firstName.trim() || !lastName.trim()) {
                    throw new Error("Please enter your first and last name.");
                }
                
                if (cleanEmail !== cleanConfirmEmail) {
                    throw new Error("Email addresses do not match.");
                }

                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }

                const passwordError = validatePassword(password);
                if (passwordError) {
                    throw new Error(passwordError);
                }

                const fullName = `${firstName.trim()} ${lastName.trim()}`;

                const { data, error } = await supabase.auth.signUp({
                    email: cleanEmail,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });
                
                if (error) throw error;

                // If signup successful, save profile
                if (data.user) {
                    try {
                        await updateUserProfile(data.user.id, fullName);
                    } catch (profileError) {
                        console.error("Failed to save user profile:", profileError);
                    }
                    
                    if (!data.session) {
                        setSuccessMessage("Account created! Please check your email to verify your account.");
                        setIsLoading(false);
                        return;
                    }
                }
            }
            onLogin();
        } catch (err: any) {
            // Safe error message extraction
            let msg = 'Authentication failed. Please check your credentials.';
            if (typeof err === 'string') {
                msg = err;
            } else if (err instanceof Error) {
                msg = err.message;
            } else if (err && typeof err === 'object' && 'message' in err) {
                msg = String(err.message);
            }

            // Handle specific error cases with user-friendly messages
            if (msg.includes('Invalid login credentials') || msg.includes('Invalid grant')) {
                msg = 'Account not found or incorrect password. Please check your details or Sign Up if you are new.';
                // Do not console.error expected validation errors to keep logs clean
                console.warn("Auth attempt failed:", msg);
            } else if (msg.includes('Invalid API key') || msg.includes('jwks')) {
                msg = 'Configuration Error: Invalid Supabase API Key. Please use "Continue as Guest" to bypass.';
                console.error("Auth error:", err);
            } else if (msg.includes('User already registered')) {
                msg = 'This email is already registered. Please sign in instead.';
                console.warn("Auth attempt failed:", msg);
            } else if (msg.includes('Email not confirmed')) {
                msg = 'Please verify your email address before signing in.';
                console.warn("Auth attempt failed:", msg);
            } else {
                console.error("Auth error:", err);
            }
            
            setError(msg);
        } finally {
            if (!successMessage) {
                setIsLoading(false);
            }
        }
    };

    const handleForgotPassword = async () => {
        const cleanEmail = email.trim();
        if (!cleanEmail) {
            setError("Please enter your email address to reset password.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
                redirectTo: window.location.origin,
            });
            
            if (error) {
                if (error.status === 429) {
                    throw new Error("Too many requests. Please wait a moment before trying again.");
                }
                if (error.message.toLowerCase().includes('not found') || error.message.toLowerCase().includes('invalid')) {
                     throw new Error("This email is not registered. Please check the address or Sign Up.");
                }
                throw error;
            }
            
            setSuccessMessage("Password reset instructions sent. If you don't receive an email, this account may not exist.");
        } catch (err: any) {
            console.error("Reset password error:", err);
            let msg = err.message || "Failed to send reset email. Please try again.";
            
            if (msg.includes('not registered') || msg.includes('not found')) {
                msg = "This email is not registered in our database. Please Sign Up.";
            }
            
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuth = async (provider: 'google' | 'facebook' | 'apple') => {
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("OAuth error:", err);
            let msg = err.message || `Failed to sign in with ${provider}`;
            if (msg.includes('provider is not enabled') || msg.includes('Unsupported provider')) {
                msg = `${provider.charAt(0).toUpperCase() + provider.slice(1)} login is currently being set up. Please use email/password or Guest mode.`;
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestAccess = () => {
        signInAsDemo();
        onLogin();
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError(null);
        setSuccessMessage(null);
        setConfirmEmail('');
        setConfirmPassword('');
        setPassword('');
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#09090B] relative overflow-hidden text-white font-sans">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            <div className="relative z-10 w-full max-w-[400px] p-6 sm:p-8">
                <div className="text-center mb-8 animate-scale-in flex flex-col items-center">
                    <div className="w-24 h-24 mb-4 drop-shadow-2xl">
                        <SmartStockLogo />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight">SmartStock AI</h1>
                    <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase mt-1">Institutional Intelligence</p>
                </div>

                <div className="bg-[#121214]/60 backdrop-blur-2xl rounded-[32px] border border-white/10 p-2 shadow-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="bg-[#18181B]/50 rounded-[24px] p-6 border border-white/5">
                        <form onSubmit={handleAuth} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center animate-fade-in break-words">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center animate-fade-in break-words">
                                    {successMessage}
                                </div>
                            )}
                            
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={firstName}
                                            onChange={(e) => { setFirstName(e.target.value); clearErrorOnInput(); }}
                                            className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={lastName}
                                            onChange={(e) => { setLastName(e.target.value); clearErrorOnInput(); }}
                                            className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); clearErrorOnInput(); }}
                                    className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>

                            {!isLogin && (
                                <div className="space-y-1.5 animate-fade-in">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Confirm Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={confirmEmail}
                                        onChange={(e) => { setConfirmEmail(e.target.value); clearErrorOnInput(); }}
                                        className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                                        placeholder="Confirm email"
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Password</label>
                                    {isLogin && (
                                        <button 
                                            type="button"
                                            onClick={handleForgotPassword}
                                            className="text-[10px] text-zinc-500 hover:text-zinc-300 font-bold tracking-wide transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); clearErrorOnInput(); }}
                                    className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                                {!isLogin && <p className="text-[10px] text-zinc-500 px-1">Min 7 chars, 1 capital, 1 special char.</p>}
                            </div>

                            {!isLogin && (
                                <div className="space-y-1.5 animate-fade-in">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value); clearErrorOnInput(); }}
                                        className="w-full bg-[#09090B] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                                        placeholder="Confirm password"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-bold text-sm py-3.5 rounded-xl hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 mt-4 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10">{isLogin ? 'Enter Vault' : 'Create Account'}</span>
                                        <ShieldIcon className="w-4 h-4 relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>
                        
                        <div className="my-6 relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative bg-[#18181B] px-3 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Or continue with</div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            <button 
                                onClick={() => handleOAuth('google')}
                                disabled={isLoading}
                                className="flex items-center justify-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                title="Sign in with Google"
                            >
                                <GoogleIcon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => handleOAuth('apple')}
                                disabled={isLoading}
                                className="flex items-center justify-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                title="Sign in with Apple"
                            >
                                <AppleIcon className="w-5 h-5 text-white" />
                            </button>
                            <button 
                                onClick={() => handleOAuth('facebook')}
                                disabled={isLoading}
                                className="flex items-center justify-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                title="Sign in with Facebook"
                            >
                                <FacebookIcon className="w-5 h-5 text-[#1877F2]" />
                            </button>
                            <button 
                                onClick={handleGuestAccess}
                                disabled={isLoading}
                                className="flex items-center justify-center py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                title="Explore as Guest"
                            >
                                <UserIcon className="w-5 h-5 text-emerald-400" />
                            </button>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <button 
                                onClick={toggleMode}
                                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
                            >
                                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] text-zinc-500 font-medium tracking-wide">Secured by Supabase</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
