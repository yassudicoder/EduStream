import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MissionType = "problems" | "battles" | "streak" | "lessons" | "achievements";
export type MissionStatus = "pending" | "in-progress" | "completed";

export interface Mission {
  id: string;
  type: MissionType;
  title: string;
  description: string;
  target: number; // e.g., solve 2 problems
  progress: number; // e.g., 1 out of 2
  xpReward: number;
  status: MissionStatus;
  emoji: string;
  completedAt?: number; // timestamp
}

export interface MissionStoreState {
  missions: Mission[];
  lastResetDate: string;
  totalXpFromMissions: number;

  // Actions
  generateDailyMissions: () => void;
  updateMissionProgress: (missionId: string, increment: number) => void;
  completeMission: (missionId: string) => void;
  getMissions: () => Mission[];
  getCompletedCount: () => number;
  resetMissionsIfNeeded: () => void;
  getTodaysMissionsXp: () => number;
}

const MISSION_TEMPLATES: Array<{
  type: MissionType;
  title: string;
  description: string;
  target: number;
  xpReward: number;
  emoji: string;
}> = [
  {
    type: "problems",
    title: "Code Champion",
    description: "Solve 2 coding problems",
    target: 2,
    xpReward: 50,
    emoji: "💻",
  },
  {
    type: "problems",
    title: "Problem Solver",
    description: "Solve 3 coding problems",
    target: 3,
    xpReward: 75,
    emoji: "🧩",
  },
  {
    type: "battles",
    title: "Battle Master",
    description: "Win 1 arena battle",
    target: 1,
    xpReward: 60,
    emoji: "⚔️",
  },
  {
    type: "battles",
    title: "Warrior's Path",
    description: "Win 2 arena battles",
    target: 2,
    xpReward: 100,
    emoji: "🗡️",
  },
  {
    type: "streak",
    title: "Consistent Grinder",
    description: "Maintain your daily streak",
    target: 1,
    xpReward: 40,
    emoji: "🔥",
  },
  {
    type: "lessons",
    title: "Knowledge Seeker",
    description: "Complete 1 lesson",
    target: 1,
    xpReward: 45,
    emoji: "📚",
  },
  {
    type: "lessons",
    title: "Master Learner",
    description: "Complete 2 lessons",
    target: 2,
    xpReward: 80,
    emoji: "🎓",
  },
  {
    type: "achievements",
    title: "Achievement Hunter",
    description: "Unlock 1 new achievement",
    target: 1,
    xpReward: 55,
    emoji: "🏆",
  },
  {
    type: "problems",
    title: "Coding Marathon",
    description: "Solve 5 problems",
    target: 5,
    xpReward: 120,
    emoji: "🚀",
  },
  {
    type: "battles",
    title: "Arena Champion",
    description: "Win 3 battles",
    target: 3,
    xpReward: 150,
    emoji: "👑",
  },
];

function generateMissionId(): string {
  return `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function selectRandomMissions(count: number): Mission[] {
  const shuffled = [...MISSION_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((template) => ({
    id: generateMissionId(),
    type: template.type,
    title: template.title,
    description: template.description,
    target: template.target,
    progress: 0,
    xpReward: template.xpReward,
    status: "pending" as MissionStatus,
    emoji: template.emoji,
  }));
}

export const useMissionStore = create<MissionStoreState>()(
  persist(
    (set, get) => ({
      missions: [],
      lastResetDate: getTodayDate(),
      totalXpFromMissions: 0,

      generateDailyMissions: () => {
        const missionCount = Math.floor(Math.random() * 2) + 4; // 4-5 missions
        const newMissions = selectRandomMissions(missionCount);
        set({
          missions: newMissions,
          lastResetDate: getTodayDate(),
        });
      },

      updateMissionProgress: (missionId: string, increment: number) => {
        set((state) => ({
          missions: state.missions.map((mission) => {
            if (mission.id === missionId) {
              const newProgress = Math.min(mission.progress + increment, mission.target);
              const newStatus: MissionStatus =
                newProgress >= mission.target ? "completed" : "in-progress";
              return { ...mission, progress: newProgress, status: newStatus };
            }
            return mission;
          }),
        }));
      },

      completeMission: (missionId: string) => {
        set((state) => ({
          missions: state.missions.map((mission) => {
            if (mission.id === missionId && mission.status !== "completed") {
              return {
                ...mission,
                progress: mission.target,
                status: "completed",
                completedAt: Date.now(),
              };
            }
            return mission;
          }),
        }));
      },

      getMissions: () => {
        return get().missions;
      },

      getCompletedCount: () => {
        return get().missions.filter((m) => m.status === "completed").length;
      },

      resetMissionsIfNeeded: () => {
        const today = getTodayDate();
        const state = get();

        if (state.lastResetDate !== today) {
          // Reset for new day
          state.generateDailyMissions();
        }
      },

      getTodaysMissionsXp: () => {
        return get().missions
          .filter((m) => m.status === "completed")
          .reduce((sum, m) => sum + m.xpReward, 0);
      },
    }),
    {
      name: "edustream-missions",
      version: 1,
    }
  )
);
