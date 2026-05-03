import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SkillStatus = "locked" | "unlocked" | "in-progress" | "completed";

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXP: number;
  totalLessons: number;
  prerequisiteIds: string[]; // IDs of skills that must be completed first
  color: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface UserSkillProgress {
  skillId: string;
  status: SkillStatus;
  completedLessons: number;
  unlockedAt?: number;
  completedAt?: number;
  xpEarned: number;
}

export interface SkillTreeStoreState {
  skills: Skill[];
  userProgress: Record<string, UserSkillProgress>;
  totalXPEarned: number;

  // Actions
  initializeSkillTree: () => void;
  updateSkillProgress: (skillId: string, completedLessons: number) => void;
  unlockSkill: (skillId: string) => void;
  completeSkill: (skillId: string, xpReward: number) => void;
  getSkillStatus: (skillId: string) => SkillStatus;
  getCompletionPercentage: (skillId: string) => number;
  getUnlockedSkills: () => Skill[];
  getNextSkillsToUnlock: () => Skill[];
  canUnlockSkill: (skillId: string) => boolean;
  getSkillsByDifficulty: (difficulty: "beginner" | "intermediate" | "advanced") => Skill[];
}

const DEFAULT_SKILLS: Skill[] = [
  // Beginner tier
  {
    id: "html-basics",
    name: "HTML Basics",
    description: "Learn the foundation of web development with HTML",
    icon: "🔗",
    requiredXP: 0,
    totalLessons: 5,
    prerequisiteIds: [],
    color: "#f97316",
    difficulty: "beginner",
  },
  {
    id: "css-styling",
    name: "CSS Styling",
    description: "Master the art of styling with CSS",
    icon: "🎨",
    requiredXP: 100,
    totalLessons: 6,
    prerequisiteIds: ["html-basics"],
    color: "#8b5cf6",
    difficulty: "beginner",
  },
  {
    id: "js-fundamentals",
    name: "JavaScript Fundamentals",
    description: "Understand the basics of JavaScript programming",
    icon: "⚡",
    requiredXP: 200,
    totalLessons: 8,
    prerequisiteIds: ["html-basics"],
    color: "#fbbf24",
    difficulty: "beginner",
  },

  // Intermediate tier
  {
    id: "js-dom",
    name: "DOM Manipulation",
    description: "Learn to interact with the DOM using JavaScript",
    icon: "🖱️",
    requiredXP: 350,
    totalLessons: 6,
    prerequisiteIds: ["js-fundamentals", "css-styling"],
    color: "#f59e0b",
    difficulty: "intermediate",
  },
  {
    id: "js-async",
    name: "Async & Promises",
    description: "Master asynchronous programming in JavaScript",
    icon: "⏳",
    requiredXP: 350,
    totalLessons: 5,
    prerequisiteIds: ["js-fundamentals"],
    color: "#ec4899",
    difficulty: "intermediate",
  },
  {
    id: "react-intro",
    name: "React Basics",
    description: "Build interactive UIs with React",
    icon: "⚛️",
    requiredXP: 500,
    totalLessons: 7,
    prerequisiteIds: ["js-dom", "js-async"],
    color: "#06b6d4",
    difficulty: "intermediate",
  },

  // Advanced tier
  {
    id: "react-hooks",
    name: "React Hooks",
    description: "Master modern React with Hooks",
    icon: "🪝",
    requiredXP: 700,
    totalLessons: 6,
    prerequisiteIds: ["react-intro"],
    color: "#10b981",
    difficulty: "advanced",
  },
  {
    id: "state-management",
    name: "State Management",
    description: "Learn Redux, Context API, and Zustand",
    icon: "🗂️",
    requiredXP: 700,
    totalLessons: 5,
    prerequisiteIds: ["react-hooks"],
    color: "#06b6d4",
    difficulty: "advanced",
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "Add type safety to your JavaScript",
    icon: "📘",
    requiredXP: 600,
    totalLessons: 8,
    prerequisiteIds: ["js-fundamentals"],
    color: "#3b82f6",
    difficulty: "advanced",
  },
  {
    id: "nextjs-fullstack",
    name: "Next.js & Full Stack",
    description: "Build full-stack applications with Next.js",
    icon: "🚀",
    requiredXP: 1000,
    totalLessons: 9,
    prerequisiteIds: ["react-hooks", "typescript"],
    color: "#1f2937",
    difficulty: "advanced",
  },
];

export const useSkillTreeStore = create<SkillTreeStoreState>()(
  persist(
    (set, get) => ({
      skills: DEFAULT_SKILLS,
      userProgress: {},
      totalXPEarned: 0,

      initializeSkillTree: () => {
        set((state) => {
          const newProgress: Record<string, UserSkillProgress> = {};

          // Initialize all skills
          DEFAULT_SKILLS.forEach((skill) => {
            if (!state.userProgress[skill.id]) {
              newProgress[skill.id] = {
                skillId: skill.id,
                status: skill.prerequisiteIds.length === 0 ? "unlocked" : "locked",
                completedLessons: 0,
                xpEarned: 0,
              };
            }
          });

          return { userProgress: { ...state.userProgress, ...newProgress } };
        });
      },

      updateSkillProgress: (skillId: string, completedLessons: number) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            [skillId]: {
              ...state.userProgress[skillId],
              completedLessons,
              status:
                completedLessons >= (state.skills.find((s) => s.id === skillId)?.totalLessons ?? 0)
                  ? "completed"
                  : "in-progress",
            },
          },
        }));

        // Check if this unlocks any dependent skills
        get().getNextSkillsToUnlock().forEach((skill) => {
          if (get().canUnlockSkill(skill.id)) {
            get().unlockSkill(skill.id);
          }
        });
      },

      unlockSkill: (skillId: string) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            [skillId]: {
              ...state.userProgress[skillId],
              status: "unlocked",
              unlockedAt: Date.now(),
            },
          },
        }));
      },

      completeSkill: (skillId: string, xpReward: number) => {
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            [skillId]: {
              ...state.userProgress[skillId],
              status: "completed",
              completedAt: Date.now(),
              xpEarned: xpReward,
            },
          },
          totalXPEarned: state.totalXPEarned + xpReward,
        }));

        // Unlock dependent skills
        const completedSkill = get().skills.find((s) => s.id === skillId);
        if (completedSkill) {
          get().skills.forEach((skill) => {
            if (
              skill.prerequisiteIds.includes(skillId) &&
              get().canUnlockSkill(skill.id)
            ) {
              get().unlockSkill(skill.id);
            }
          });
        }
      },

      getSkillStatus: (skillId: string) => {
        return get().userProgress[skillId]?.status ?? "locked";
      },

      getCompletionPercentage: (skillId: string) => {
        const progress = get().userProgress[skillId];
        const skill = get().skills.find((s) => s.id === skillId);

        if (!progress || !skill) return 0;

        return Math.round((progress.completedLessons / skill.totalLessons) * 100);
      },

      getUnlockedSkills: () => {
        return get().skills.filter((skill) => {
          const status = get().getSkillStatus(skill.id);
          return status === "unlocked" || status === "in-progress" || status === "completed";
        });
      },

      getNextSkillsToUnlock: () => {
        return get().skills.filter((skill) => get().getSkillStatus(skill.id) === "locked");
      },

      canUnlockSkill: (skillId: string) => {
        const skill = get().skills.find((s) => s.id === skillId);
        if (!skill) return false;

        // Check if all prerequisites are completed
        return skill.prerequisiteIds.every(
          (prereqId) => get().getSkillStatus(prereqId) === "completed"
        );
      },

      getSkillsByDifficulty: (difficulty) => {
        return get().skills.filter((skill) => skill.difficulty === difficulty);
      },
    }),
    {
      name: "edustream-skill-tree",
      version: 1,
    }
  )
);
