"use client";

import { useMissionStore } from "@/app/lib/missionStore";

export function useMissionIntegration() {
  const missions = useMissionStore((s) => s.missions);
  const updateMissionProgress = useMissionStore((s) => s.updateMissionProgress);
  const completeMission = useMissionStore((s) => s.completeMission);

  /**
   * Call this when user solves a problem
   */
  const recordProblemSolved = (count: number = 1) => {
    missions.forEach((mission) => {
      if (mission.type === "problems" && mission.status !== "completed") {
        updateMissionProgress(mission.id, count);
      }
    });
  };

  /**
   * Call this when user wins a battle
   */
  const recordBattleWon = (count: number = 1) => {
    missions.forEach((mission) => {
      if (mission.type === "battles" && mission.status !== "completed") {
        updateMissionProgress(mission.id, count);
      }
    });
  };

  /**
   * Call this when user completes a lesson
   */
  const recordLessonCompleted = (count: number = 1) => {
    missions.forEach((mission) => {
      if (mission.type === "lessons" && mission.status !== "completed") {
        updateMissionProgress(mission.id, count);
      }
    });
  };

  /**
   * Call this when user unlocks an achievement
   */
  const recordAchievementUnlocked = (count: number = 1) => {
    missions.forEach((mission) => {
      if (mission.type === "achievements" && mission.status !== "completed") {
        updateMissionProgress(mission.id, count);
      }
    });
  };

  /**
   * Call this to check if user maintained their streak
   * If streak is active, progress the streak mission
   */
  const recordStreakMaintained = () => {
    missions.forEach((mission) => {
      if (mission.type === "streak" && mission.status !== "completed") {
        updateMissionProgress(mission.id, 1);
      }
    });
  };

  /**
   * Manually complete a mission
   */
  const manuallyCompleteMission = (missionId: string) => {
    completeMission(missionId);
  };

  return {
    recordProblemSolved,
    recordBattleWon,
    recordLessonCompleted,
    recordAchievementUnlocked,
    recordStreakMaintained,
    manuallyCompleteMission,
  };
}
