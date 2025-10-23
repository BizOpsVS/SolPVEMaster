-- PVEPOOLS Database Schema for Supabase
-- This schema supports the core business logic for prediction pools

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    wallet_address TEXT UNIQUE,
    total_staked DECIMAL(20,8) DEFAULT 0,
    total_won DECIMAL(20,8) DEFAULT 0,
    total_lost DECIMAL(20,8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table (tokens/coins that can be predicted)
CREATE TABLE public.assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    symbol TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    coingecko_id TEXT,
    dexscreener_id TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pools table (main prediction pools)
CREATE TABLE public.pools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id UUID REFERENCES public.assets(id) NOT NULL,
    duration TEXT NOT NULL CHECK (duration IN ('10m', '30m', '1h', '6h', '12h')),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'LOCKED', 'RESOLVED', 'SETTLED', 'ADMIN_REVIEW', 'REFUND')),
    
    -- AI Line Contract
    ai_line_bps INTEGER NOT NULL, -- basis points (300 = 3.00%)
    confidence_pct INTEGER NOT NULL CHECK (confidence_pct >= 0 AND confidence_pct <= 100),
    model_version TEXT NOT NULL,
    model_commit TEXT,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Timing
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    lock_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resolve_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Pots
    pot_over DECIMAL(20,8) DEFAULT 0,
    pot_under DECIMAL(20,8) DEFAULT 0,
    
    -- Price Snapshots
    entry_price DECIMAL(20,8),
    exit_price DECIMAL(20,8),
    entry_snapshot JSONB,
    exit_snapshot JSONB,
    
    -- Results
    return_pct DECIMAL(10,6),
    winner TEXT CHECK (winner IN ('OVER', 'UNDER', 'TIE')),
    fee_pct DECIMAL(5,4) DEFAULT 0.02,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stakes table (user bets)
CREATE TABLE public.stakes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pool_id UUID REFERENCES public.pools(id) NOT NULL,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('OVER', 'UNDER')),
    amount DECIMAL(20,8) NOT NULL CHECK (amount > 0),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED', 'SETTLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(pool_id, user_id, side) -- One stake per user per side per pool
);

-- Settlements table (payouts)
CREATE TABLE public.settlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pool_id UUID REFERENCES public.pools(id) NOT NULL,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    stake_id UUID REFERENCES public.stakes(id) NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('OVER', 'UNDER')),
    stake_amount DECIMAL(20,8) NOT NULL,
    payout_amount DECIMAL(20,8) NOT NULL,
    fee_applied DECIMAL(20,8) DEFAULT 0,
    tx_ref TEXT, -- Solana transaction reference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Oracle traces table (price source tracking)
CREATE TABLE public.oracle_traces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pool_id UUID REFERENCES public.pools(id) NOT NULL,
    snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('ENTRY', 'EXIT')),
    source TEXT NOT NULL,
    price DECIMAL(20,8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_pools_status ON public.pools(status);
CREATE INDEX idx_pools_asset_id ON public.pools(asset_id);
CREATE INDEX idx_pools_lock_at ON public.pools(lock_at);
CREATE INDEX idx_pools_resolve_at ON public.pools(resolve_at);
CREATE INDEX idx_stakes_pool_id ON public.stakes(pool_id);
CREATE INDEX idx_stakes_user_id ON public.stakes(user_id);
CREATE INDEX idx_stakes_status ON public.stakes(status);
CREATE INDEX idx_settlements_user_id ON public.settlements(user_id);
CREATE INDEX idx_settlements_pool_id ON public.settlements(pool_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Pools are publicly readable
CREATE POLICY "Pools are publicly readable" ON public.pools
    FOR SELECT USING (true);

-- Stakes are private to users
CREATE POLICY "Users can view own stakes" ON public.stakes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own stakes" ON public.stakes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stakes" ON public.stakes
    FOR UPDATE USING (auth.uid() = user_id);

-- Settlements are private to users
CREATE POLICY "Users can view own settlements" ON public.settlements
    FOR SELECT USING (auth.uid() = user_id);

-- Functions for common operations
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_staked DECIMAL(20,8),
    total_won DECIMAL(20,8),
    total_lost DECIMAL(20,8),
    win_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.total_staked,
        u.total_won,
        u.total_lost,
        CASE 
            WHEN u.total_staked > 0 THEN (u.total_won / u.total_staked) * 100
            ELSE 0
        END as win_rate
    FROM public.users u
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get pool statistics
CREATE OR REPLACE FUNCTION public.get_pool_stats(pool_uuid UUID)
RETURNS TABLE (
    total_pot DECIMAL(20,8),
    over_pct DECIMAL(5,2),
    under_pct DECIMAL(5,2),
    participant_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (p.pot_over + p.pot_under) as total_pot,
        CASE 
            WHEN (p.pot_over + p.pot_under) > 0 THEN (p.pot_over / (p.pot_over + p.pot_under)) * 100
            ELSE 50
        END as over_pct,
        CASE 
            WHEN (p.pot_over + p.pot_under) > 0 THEN (p.pot_under / (p.pot_over + p.pot_under)) * 100
            ELSE 50
        END as under_pct,
        COUNT(DISTINCT s.user_id) as participant_count
    FROM public.pools p
    LEFT JOIN public.stakes s ON s.pool_id = p.id AND s.status = 'ACTIVE'
    WHERE p.id = pool_uuid
    GROUP BY p.id, p.pot_over, p.pot_under;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample assets
INSERT INTO public.assets (symbol, name, coingecko_id, dexscreener_id) VALUES
('SOL', 'Solana', 'solana', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
('BONK', 'Bonk', 'bonk', 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263'),
('WIF', 'Dogwifhat', 'dogwifcoin', 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm'),
('PEPE', 'Pepe', 'pepe', '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr'),
('POPCAT', 'Popcat', 'popcat', '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr'),
('MEW', 'Cat in a Dogs World', 'cat-in-a-dogs-world', 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_pools
    BEFORE UPDATE ON public.pools
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_stakes
    BEFORE UPDATE ON public.stakes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
