
-- Create user_consents table
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    has_consented BOOLEAN NOT NULL DEFAULT FALSE,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    consent_version TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own consent history
CREATE POLICY "Users can view own consents" 
ON public.user_consents 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own consent records
CREATE POLICY "Users can insert own consents" 
ON public.user_consents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
