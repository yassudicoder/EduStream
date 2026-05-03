"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "@/app/lib/missionStore";
import { useGameStore } from "@/app/lib/gameStore";
import { MissionCard } from "./MissionCard";
import { useToast } from "./ToastSystem";
import { ConfettiCelebration } from "./CelebrationEffects";
import { CheckCircle2, Zap, Calendar } from "lucide-react";

export function DailyMissions() {
  const missions = useMissionStore((s) => s.missions);
  const generateDailyMissions = useMissionStore((s) => s.generateDailyMissions);
  const resetMissionsIfNeeded = useMissionStore((s) => s.resetMissionsIfNeeded);
  const getCompletedCount = useMissionStore((s) => s.getCompletedCount);
  const getTodaysMissionsXp = useMissionStore((s) => s.getTodaysMissionsXp);

  const addXP = useGameStore((s) => s.addXP);
  const { showToast } = useToast();
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);

  // Initialize missions on mount
  useEffect(() => {
    resetMissionsIfNeeded();
    if (missions.length === 0) {
      generateDailyMissions();
    }
  }, []);

  // Monitor mission completions
  useEffect(() => {
    const completedCount = getCompletedCount();

    if (completedCount > previousCompletedCount) {
      const newlyCompletedMission = missions.find((m) => m.status === "completed" && m.completedAt);
      if (newlyCompletedMission) {
        // Show toast notification
        showToast({
          type: "achievement",
          title: "Mission Completed! 🎉",
          message: `${newlyCompletedMission.title} - +${newlyCompletedMission.xpReward} XP`,
        });

        // Add XP to user
        addXP(newlyCompletedMission.xpReward);

        // Show celebration effect
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);

        // Update previous count
        setPreviousCompletedCount(completedCount);
      }
    }
  }, [missions]);

  const completedCount = getCompletedCount();
  const totalXpEarned = getTodaysMissionsXp();
  const allCompleted = missions.length > 0 && completedCount === missions.length;

  return (
    <div className="w-full">
      {/* Celebration effect */}
      <AnimatePresence>
        {showCelebration && <ConfettiCelebration />}
      </AnimatePresence>

      {/* Header with stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 mb-4"
        style={{ background: "var(--surface-hover)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} style={{ color: "var(--accent-light)" }} />
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              Today's Missions
            </h2>
          </div>

          {/* Completion badge */}
          {allCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: "var(--accent-glow)" }}
            >
              <CheckCircle2 size={14} style={{ color: "var(--accent-light)" }} />
              <span className="text-xs font-bold" style={{ color: "var(--accent-light)" }}>
                All Completed!
              </span>
            </motion.div>
          )}
        </div>

        {/* Progress stats */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Daily Progress
              </span>
              <span className="text-[10px] font-bold" style={{ color: "var(--accent-light)" }}>
                {completedCount}/{missions.length}
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--accent-light), var(--accent))",
                  boxShadow: "0 0 8px var(--accent-light)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${missions.length > 0 ? (completedCount / missions.length) * 100 : 0}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* XP earned */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-sm font-bold" style={{ color: "#fbbf24" }}>
              <Zap size={14} />
              <span>+{totalXpEarned} XP</span>
            </div>
            <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
              from missions
            </span>
          </div>
        </div>
      </motion.div>

      {/* Missions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
            >
              <MissionCard mission={mission} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {missions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p style={{ color: "var(--text-faint)" }}>Loading today's missions...</p>
        </motion.div>
      )}

      {/* All completed message */}
      {allCompleted && missions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 glass rounded-2xl p-4 text-center"
          style={{ background: "var(--accent-glow)" }}
        >
          <p className="text-sm font-bold" style={{ color: "var(--accent-light)" }}>
            🎉 You completed all missions today! Great job!
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            New missions will appear tomorrow at midnight.
          </p>
        </motion.div>
      )}
    </div>
  );
}
