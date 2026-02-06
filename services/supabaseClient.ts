
import { createClient } from '@supabase/supabase-js';

// Helper to get env var safely across different environments
const getEnv = (key: string): string => {
    // Check process.env (Node/Webpack/Next.js)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key] as string;
    }
    // Check import.meta.env (Vite/ESBuild)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        // @ts-ignore
        return import.meta.env[key];
    }
    return '';
};

// Common Supabase environment variable names
const urlKeys = ['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL'];
const keyKeys = ['SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'];

const findFirst = (keys: string[]): string => {
    for (const key of keys) {
        const val = getEnv(key);
        if (val && val !== 'undefined' && val !== 'null') return val;
    }
    return '';
};

// Use provided credentials as hardcoded fallbacks to guarantee functionality
const DEFAULT_URL = 'https://eikcxebnjxecgfdgvnbx.supabase.co';
const DEFAULT_KEY = 'sb_publishable_KtNkeQ-1QtsZbdQxzNSWKQ_ppL4BMGK';

const supabaseUrl = findFirst(urlKeys) || DEFAULT_URL;
const supabaseKey = findFirst(keyKeys) || DEFAULT_KEY;

// Flag used by UI to detect configuration state
export const isSupabaseConfigured = Boolean(supabaseKey && supabaseKey.length > 10);

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

if (!findFirst(keyKeys)) {
    console.info('Using hardcoded project credentials for authentication.');
}
