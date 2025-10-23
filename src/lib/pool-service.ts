import { PoolCard, PoolListItem, Stake, Side } from "@/types/pve";

// Mock API service for development
class PoolService {
  private pools: PoolListItem[] = [];
  private stakes: Stake[] = [];

  // Initialize with some example pools
  constructor() {
    this.initializeExamplePools();
  }

  private initializeExamplePools() {
    const now = Date.now();
    this.pools = [
      {
        id: "pool_bonk_10m_001",
        asset_id: "bonk",
        asset_symbol: "BONK",
        currency: "USD",
        duration: "10m",
        ai: {
          line_bps: 320, // 3.2%
          confidence_pct: 78,
          model_version: "pve-v0.3",
          commit: "a1b2c3d4e5f6",
          generated_at: new Date().toISOString()
        },
        start_at: new Date(now - 2 * 60 * 1000).toISOString(), // Started 2 minutes ago
        lock_at: new Date(now + 2 * 60 * 1000).toISOString(), // Locks in 2 minutes
        resolve_at: new Date(now + 8 * 60 * 1000).toISOString(), // Resolves in 8 minutes
        status: "OPEN",
        pots: {
          over: 65.5,
          under: 34.5
        }
      },
      {
        id: "pool_wif_30m_001",
        asset_id: "wif",
        asset_symbol: "WIF",
        currency: "USD",
        duration: "30m",
        ai: {
          line_bps: 280, // 2.8%
          confidence_pct: 82,
          model_version: "pve-v0.3",
          commit: "b2c3d4e5f6a1",
          generated_at: new Date().toISOString()
        },
        start_at: new Date(now - 5 * 60 * 1000).toISOString(), // Started 5 minutes ago
        lock_at: new Date(now + 7 * 60 * 1000).toISOString(), // Locks in 7 minutes
        resolve_at: new Date(now + 25 * 60 * 1000).toISOString(), // Resolves in 25 minutes
        status: "OPEN",
        pots: {
          over: 45.2,
          under: 54.8
        }
      },
      {
        id: "pool_pepe_1h_001",
        asset_id: "pepe",
        asset_symbol: "PEPE",
        currency: "USD",
        duration: "1h",
        ai: {
          line_bps: 410, // 4.1%
          confidence_pct: 71,
          model_version: "pve-v0.3",
          commit: "c3d4e5f6a1b2",
          generated_at: new Date().toISOString()
        },
        start_at: new Date(now - 10 * 60 * 1000).toISOString(), // Started 10 minutes ago
        lock_at: new Date(now + 14 * 60 * 1000).toISOString(), // Locks in 14 minutes
        resolve_at: new Date(now + 50 * 60 * 1000).toISOString(), // Resolves in 50 minutes
        status: "OPEN",
        pots: {
          over: 72.1,
          under: 27.9
        }
      },
      {
        id: "pool_doge_6h_001",
        asset_id: "doge",
        asset_symbol: "DOGE",
        currency: "USD",
        duration: "6h",
        ai: {
          line_bps: 230, // 2.3%
          confidence_pct: 85,
          model_version: "pve-v0.3",
          commit: "d4e5f6a1b2c3",
          generated_at: new Date().toISOString()
        },
        start_at: new Date(now - 2.4 * 60 * 60 * 1000).toISOString(), // Started 2.4 hours ago
        lock_at: new Date(now - 2 * 60 * 1000).toISOString(), // Locked 2 minutes ago
        resolve_at: new Date(now + 3.6 * 60 * 60 * 1000).toISOString(), // Resolves in 3.6 hours
        status: "LOCKED",
        pots: {
          over: 58.3,
          under: 41.7
        },
        snapshots: {
          entry: {
            price: 0.00001234,
            ts: new Date(now - 2 * 60 * 1000).toISOString(),
            sources: [
              { src: "coingecko", price: 0.00001234, ts: new Date().toISOString(), ok: true },
              { src: "coincap", price: 0.00001231, ts: new Date().toISOString(), ok: true },
              { src: "binance", price: 0.00001239, ts: new Date().toISOString(), ok: true }
            ]
          }
        }
      },
      {
        id: "pool_sol_12h_001",
        asset_id: "sol",
        asset_symbol: "SOL",
        currency: "USD",
        duration: "12h",
        ai: {
          line_bps: 180, // 1.8%
          confidence_pct: 76,
          model_version: "pve-v0.3",
          commit: "e5f6a1b2c3d4",
          generated_at: new Date().toISOString()
        },
        start_at: new Date(now - 12 * 60 * 60 * 1000).toISOString(), // Started 12 hours ago
        lock_at: new Date(now - 4.8 * 60 * 60 * 1000).toISOString(), // Locked 4.8 hours ago
        resolve_at: new Date(now - 1 * 60 * 1000).toISOString(), // Resolved 1 minute ago
        status: "RESOLVED",
        pots: {
          over: 38.2,
          under: 61.8
        },
        snapshots: {
          entry: {
            price: 95.50,
            ts: new Date(now - 4.8 * 60 * 60 * 1000).toISOString(),
            sources: [
              { src: "coingecko", price: 95.50, ts: new Date().toISOString(), ok: true },
              { src: "coincap", price: 95.48, ts: new Date().toISOString(), ok: true },
              { src: "binance", price: 95.52, ts: new Date().toISOString(), ok: true }
            ]
          },
          exit: {
            price: 97.22, // +1.8% change
            ts: new Date(now - 1 * 60 * 1000).toISOString(),
            sources: [
              { src: "coingecko", price: 97.22, ts: new Date().toISOString(), ok: true },
              { src: "coincap", price: 97.20, ts: new Date().toISOString(), ok: true },
              { src: "binance", price: 97.25, ts: new Date().toISOString(), ok: true }
            ]
          }
        },
        result: {
          ret_pct: 1.8,
          line_pct: 1.8,
          winner: "TIE",
          fee_pct: 0.02
        }
      }
    ];
  }

  // Get all pools
  async getPools(): Promise<PoolCard[]> {
    return this.pools.map(pool => this.convertToPoolCard(pool));
  }

  // Get pools by status
  async getPoolsByStatus(status: string): Promise<PoolCard[]> {
    return this.pools
      .filter(pool => pool.status === status)
      .map(pool => this.convertToPoolCard(pool));
  }

  // Get pools by duration
  async getPoolsByDuration(duration: string): Promise<PoolCard[]> {
    return this.pools
      .filter(pool => pool.duration === duration)
      .map(pool => this.convertToPoolCard(pool));
  }

  // Get a specific pool
  async getPool(id: string): Promise<PoolListItem | null> {
    return this.pools.find(pool => pool.id === id) || null;
  }

  // Place a stake
  async placeStake(poolId: string, userId: string, side: Side, amount: number): Promise<Stake> {
    const pool = this.pools.find(p => p.id === poolId);
    if (!pool) {
      throw new Error("Pool not found");
    }

    if (pool.status !== "OPEN") {
      throw new Error("Pool is not open for staking");
    }

    // Check if pool is still in enrollment window
    const now = Date.now();
    const lockTime = new Date(pool.lock_at).getTime();
    if (now >= lockTime) {
      throw new Error("Pool enrollment window has closed");
    }

    // Create new stake
    const stake: Stake = {
      id: `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pool_id: poolId,
      user_id: userId,
      side,
      amount,
      created_at: new Date().toISOString(),
      status: "ACTIVE"
    };

    this.stakes.push(stake);

    // Update pool pots
    if (side === "OVER") {
      pool.pots.over += amount;
    } else {
      pool.pots.under += amount;
    }

    return stake;
  }

  // Cancel a stake
  async cancelStake(stakeId: string, userId: string): Promise<Stake> {
    const stake = this.stakes.find(s => s.id === stakeId && s.user_id === userId);
    if (!stake) {
      throw new Error("Stake not found");
    }

    if (stake.status !== "ACTIVE") {
      throw new Error("Stake cannot be cancelled");
    }

    const pool = this.pools.find(p => p.id === stake.pool_id);
    if (!pool) {
      throw new Error("Pool not found");
    }

    // Check if pool is still in enrollment window
    const now = Date.now();
    const lockTime = new Date(pool.lock_at).getTime();
    if (now >= lockTime) {
      throw new Error("Pool enrollment window has closed");
    }

    // Update stake status
    stake.status = "CANCELLED";

    // Update pool pots
    if (stake.side === "OVER") {
      pool.pots.over -= stake.amount;
    } else {
      pool.pots.under -= stake.amount;
    }

    return stake;
  }

  // Get user's stakes
  async getUserStakes(userId: string): Promise<Stake[]> {
    return this.stakes.filter(stake => stake.user_id === userId);
  }

  // Get user's stakes for a specific pool
  async getUserPoolStakes(userId: string, poolId: string): Promise<Stake[]> {
    return this.stakes.filter(stake => 
      stake.user_id === userId && 
      stake.pool_id === poolId && 
      stake.status === "ACTIVE"
    );
  }

  // Convert PoolListItem to PoolCard
  private convertToPoolCard(pool: PoolListItem): PoolCard {
    const totalPot = pool.pots.over + pool.pots.under;
    const overPct = totalPot > 0 ? (pool.pots.over / totalPot) * 100 : 50;
    const underPct = totalPot > 0 ? (pool.pots.under / totalPot) * 100 : 50;

    return {
      id: pool.id,
      asset_symbol: pool.asset_symbol,
      duration: pool.duration,
      status: pool.status,
      lock_at: pool.lock_at,
      resolve_at: pool.resolve_at,
      ai_line_pct: pool.ai.line_bps / 100, // Convert basis points to percentage
      confidence_pct: pool.ai.confidence_pct,
      over_pct: overPct,
      under_pct: underPct
    };
  }

  // Simulate pool lifecycle updates
  startPoolLifecycleSimulation() {
    setInterval(() => {
      const now = Date.now();
      
      this.pools.forEach(pool => {
        const lockTime = new Date(pool.lock_at).getTime();
        const resolveTime = new Date(pool.resolve_at).getTime();

        if (pool.status === "OPEN" && now >= lockTime) {
          pool.status = "LOCKED";
          console.log(`Pool ${pool.id} locked`);
        } else if (pool.status === "LOCKED" && now >= resolveTime) {
          pool.status = "RESOLVED";
          console.log(`Pool ${pool.id} resolved`);
        }
      });
    }, 1000); // Check every second
  }
}

// Create singleton instance
export const poolService = new PoolService();

// Start the simulation
poolService.startPoolLifecycleSimulation();