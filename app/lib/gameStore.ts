import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RankTier } from "./rankStore";

export type Skin = "default" | "fire" | "ice" | "galaxy" | "gold" | "shadow" | "neon" | "custom";

export interface CustomTheme {
  bg: string;
  accent: string;
  text: string;
  surface: string;
  grad1: string;
  grad2: string;
  name: string;
}

export interface CustomAvatar {
  emoji: string;
  bgColor: string;
  borderColor: string;
  accessory: string;
  shape: "circle" | "rounded" | "hexagon";
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlockedAt?: number;
}

export interface LessonProgress {
  completed: boolean;
  score: number; // 0-100
  attempts: number;
}

export interface LanguageProgress {
  started: boolean;
  currentLesson: number;
  lessons: Record<string, LessonProgress>;
  xpEarned: number;
}

export interface GameState {
  // User
  user: { name: string; email: string } | null;
  // XP & Level
  xp: number;
  level: number;
  // Rank System
  rank: RankTier;
  previousRank: RankTier | null;
  rankUpgradeNotification: boolean;
  // Avatar
  activeSkin: Skin;
  unlockedSkins: Skin[];
  customTheme: CustomTheme | null;
  customAvatar: CustomAvatar | null;
  // Language progress
  languages: Record<string, LanguageProgress>;
  // Achievements
  achievements: Achievement[];
  // Streak
  streak: number;
  lastActiveDate: string;

  // Actions
  login: (name: string, email: string) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  completeLesson: (lang: string, lessonId: string, score: number) => void;
  setSkin: (skin: Skin) => void;
  unlockSkin: (skin: Skin) => void;
  unlockAchievement: (id: string) => void;
  saveCustomTheme: (theme: CustomTheme) => void;
  saveCustomAvatar: (avatar: CustomAvatar) => void;
  dismissRankNotification: () => void;
  calculateRank: (xp: number) => RankTier;
}

const XP_PER_LEVEL = 200;

const RANK_THRESHOLDS: Record<RankTier, number> = {
  bronze: 0,
  silver: 5000,
  gold: 15000,
  platinum: 30000,
  diamond: 50000,
};

const calculateRankFromXP = (xp: number): RankTier => {
  if (xp >= RANK_THRESHOLDS.diamond) return "diamond";
  if (xp >= RANK_THRESHOLDS.platinum) return "platinum";
  if (xp >= RANK_THRESHOLDS.gold) return "gold";
  if (xp >= RANK_THRESHOLDS.silver) return "silver";
  return "bronze";
};

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_lesson",   title: "First Step",      desc: "Complete your first lesson",          icon: "🎯" },
  { id: "html_master",    title: "HTML Master",      desc: "Complete all HTML lessons",           icon: "🏆" },
  { id: "css_wizard",     title: "CSS Wizard",       desc: "Complete all CSS lessons",            icon: "🎨" },
  { id: "js_ninja",       title: "JS Ninja",         desc: "Complete all JavaScript lessons",     icon: "⚡" },
  { id: "streak_7",       title: "On Fire",          desc: "7-day learning streak",               icon: "🔥" },
  { id: "perfect_score",  title: "Perfectionist",    desc: "Score 100% on any lesson",            icon: "💎" },
  { id: "level_5",        title: "Rising Star",      desc: "Reach Level 5",                       icon: "⭐" },
  { id: "level_10",       title: "Code Warrior",     desc: "Reach Level 10",                      icon: "🗡️" },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: null,
      xp: 0,
      level: 1,
      rank: "bronze",
      previousRank: null,
      rankUpgradeNotification: false,
      activeSkin: "default",
      unlockedSkins: ["default"],
      customTheme: null,
      customAvatar: null,
      languages: {},
      achievements: ALL_ACHIEVEMENTS,
      streak: 0,
      lastActiveDate: "",

      login: (name, email) => {
        set({ user: { name, email } });
        // Update streak
        const today = new Date().toDateString();
        const { lastActiveDate, streak } = get();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastActiveDate === yesterday ? streak + 1 : lastActiveDate === today ? streak : 1;
        set({ streak: newStreak, lastActiveDate: today });
      },

      logout: () => set({ user: null }),

      addXP: (amount) => {
        const { xp, level, rank } = get();
        const newXP = xp + amount;
        const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
        const newRank = calculateRankFromXP(newXP);

        // Check if rank upgraded
        const isRankUpgrade = newRank !== rank;
        const rankOrder: RankTier[] = ["bronze", "silver", "gold", "platinum", "diamond"];
        const oldRankIndex = rankOrder.indexOf(rank);
        const newRankIndex = rankOrder.indexOf(newRank);
        const isPromotion = newRankIndex > oldRankIndex;

        set({
          xp: newXP,
          level: newLevel,
          previousRank: isRankUpgrade ? rank : null,
          rank: newRank,
          rankUpgradeNotification: isRankUpgrade && isPromotion,
        });

        // Unlock skins at milestones
        if (newLevel >= 3  && !get().unlockedSkins.includes("fire"))    get().unlockSkin("fire");
        if (newLevel >= 5  && !get().unlockedSkins.includes("ice"))     get().unlockSkin("ice");
        if (newLevel >= 8  && !get().unlockedSkins.includes("galaxy"))  get().unlockSkin("galaxy");
        if (newLevel >= 12 && !get().unlockedSkins.includes("gold"))    get().unlockSkin("gold");
        if (newLevel >= 15 && !get().unlockedSkins.includes("shadow"))  get().unlockSkin("shadow");
        if (newLevel >= 20 && !get().unlockedSkins.includes("neon"))    get().unlockSkin("neon");

        // Level achievements
        if (newLevel >= 5)  get().unlockAchievement("level_5");
        if (newLevel >= 10) get().unlockAchievement("level_10");
      },

      completeLesson: (lang, lessonId, score) => {
        const { languages } = get();
        const langData = languages[lang] ?? { started: true, currentLesson: 0, lessons: {}, xpEarned: 0 };
        const prev = langData.lessons[lessonId];
        const isNew = !prev?.completed;
        const xpGain = isNew ? Math.round(50 + score * 0.5) : Math.round(score * 0.2);

        set({
          languages: {
            ...languages,
            [lang]: {
              ...langData,
              started: true,
              currentLesson: Math.max(langData.currentLesson, parseInt(lessonId) + 1),
              xpEarned: langData.xpEarned + xpGain,
              lessons: {
                ...langData.lessons,
                [lessonId]: { completed: true, score: Math.max(prev?.score ?? 0, score), attempts: (prev?.attempts ?? 0) + 1 },
              },
            },
          },
        });

        get().addXP(xpGain);
        if (isNew) get().unlockAchievement("first_lesson");
        if (score === 100) get().unlockAchievement("perfect_score");
      },

      setSkin: (skin) => {
        if (get().unlockedSkins.includes(skin)) set({ activeSkin: skin });
      },

      unlockSkin: (skin) => {
        const { unlockedSkins } = get();
        if (!unlockedSkins.includes(skin)) set({ unlockedSkins: [...unlockedSkins, skin] });
      },

      unlockAchievement: (id) => {
        const { achievements } = get();
        set({
          achievements: achievements.map(a =>
            a.id === id && !a.unlockedAt ? { ...a, unlockedAt: Date.now() } : a
          ),
        });
      },

      saveCustomTheme: (theme) => set({ customTheme: theme }),
      saveCustomAvatar: (avatar) => set({ customAvatar: avatar }),
      dismissRankNotification: () => set({ rankUpgradeNotification: false }),
      calculateRank: (xp: number): RankTier => calculateRankFromXP(xp),
    }),
    { name: "edustream-game" }
  )
);

export const XP_PER_LEVEL_CONST = XP_PER_LEVEL;
