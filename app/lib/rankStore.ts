import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface RankConfig {
  tier: RankTier;
  name: string;
  icon: string;
  color: string;
  minXP: number;
  maxXP: number;
  shortName: string;
  badge: string;
}

// Define rank thresholds and properties
export const RANK_CONFIGS: Record<RankTier, RankConfig> = {
  bronze: {
    tier: "bronze",
    name: "Bronze",
    icon: "🥉",
    color: "#CD7F32",
    minXP: 0,
    maxXP: 5000,
    shortName: "B",
    badge: "🟤",
  },
  silver: {
    tier: "silver",
    name: "Silver",
    icon: "🥈",
    color: "#C0C0C0",
    minXP: 5000,
    maxXP: 15000,
    shortName: "S",
    badge: "🟩",
  },
  gold: {
    tier: "gold",
    name: "Gold",
    icon: "🥇",
    color: "#FFD700",
    minXP: 15000,
    maxXP: 30000,
    shortName: "G",
    badge: "🟨",
  },
  platinum: {
    tier: "platinum",
    name: "Platinum",
    icon: "💎",
    color: "#E5E4E2",
    minXP: 30000,
    maxXP: 50000,
    shortName: "P",
    badge: "🟦",
  },
  diamond: {
    tier: "diamond",
    name: "Diamond",
    icon: "✨",
    color: "#00FFFF",
    minXP: 50000,
    maxXP: Infinity,
    shortName: "D",
    badge: "🔷",
  },
};

// Rank order from lowest to highest
export const RANK_ORDER: RankTier[] = ["bronze", "silver", "gold", "platinum", "diamond"];

export interface RankState {
  // Current state
  currentRank: RankTier;
  previousRank: RankTier | null;
  totalXP: number;
  rankUpgradeNotification: boolean;

  // Actions
  calculateRank: (xp: number) => RankTier;
  updateRank: (xp: number) => void;
  getRankConfig: (tier: RankTier) => RankConfig;
  getRankProgress: (xp: number) => { current: number; needed: number; percent: number };
  isRankUpgrade: (fromRank: RankTier, toRank: RankTier) => boolean;
  dismissRankNotification: () => void;
}

export const useRankStore = create<RankState>()(
  persist(
    (set, get) => ({
      currentRank: "bronze",
      previousRank: null,
      totalXP: 0,
      rankUpgradeNotification: false,

      calculateRank: (xp: number): RankTier => {
        for (const rank of RANK_ORDER) {
          const config = RANK_CONFIGS[rank];
          if (xp >= config.minXP && xp < config.maxXP) {
            return rank;
          }
        }
        return "diamond";
      },

      updateRank: (xp: number) => {
        const { currentRank, calculateRank, isRankUpgrade } = get();
        const newRank = calculateRank(xp);

        // Check if rank changed
        if (newRank !== currentRank) {
          const isUpgrade = isRankUpgrade(currentRank, newRank);
          set({
            previousRank: currentRank,
            currentRank: newRank,
            totalXP: xp,
            rankUpgradeNotification: isUpgrade, // Only notify on upgrade, not downgrade
          });
        } else {
          set({ totalXP: xp });
        }
      },

      getRankConfig: (tier: RankTier): RankConfig => {
        return RANK_CONFIGS[tier];
      },

      getRankProgress: (xp: number) => {
        const rank = get().calculateRank(xp);
        const config = RANK_CONFIGS[rank];

        const rangeStart = config.minXP;
        const rangeEnd = config.maxXP === Infinity ? config.minXP + 50000 : config.maxXP;

        const current = xp - rangeStart;
        const needed = rangeEnd - rangeStart;
        const percent = Math.min((current / needed) * 100, 100);

        return { current, needed, percent };
      },

      isRankUpgrade: (fromRank: RankTier, toRank: RankTier): boolean => {
        const fromIndex = RANK_ORDER.indexOf(fromRank);
        const toIndex = RANK_ORDER.indexOf(toRank);
        return toIndex > fromIndex;
      },

      dismissRankNotification: () => {
        set({ rankUpgradeNotification: false });
      },
    }),
    { name: "edustream-rank" }
  )
);
