"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Mission } from "@/app/lib/missionStore";

interface MissionCardProps {
  mission: Mission;
  onProgressUpdate?: () => void;
}

export function MissionCard({ mission, onProgressUpdate }: MissionCardProps) {
  const progressPercent = (mission.progress / mission.target) * 100;
  const isCompleted = mission.status === "completed";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden"
      style={{
        background: isCompleted ? "var(--accent-glow)" : "var(--surface-hover)",
        border: `1.5px solid ${isCompleted ? "var(--accent-light)" : "var(--border)"}`,
      }}
    >
      {/* Completion shimmer */}
      {isCompleted && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ opacity: 0.1 }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-2xl">{mission.emoji}</span>
          <div className="flex-1">
            <h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>
              {mission.title}
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {mission.description}
            </p>
          </div>
        </div>

        {/* Completion badge */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-light)" }}
          >
            <Check size={14} className="text-white" />
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
            Progress
          </span>
          <span className="text-[10px] font-bold" style={{ color: "var(--accent-light)" }}>
            {mission.progress}/{mission.target}
          </span>
        </div>

        {/* Progress bar background */}
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
          {/* Progress bar fill */}
          <motion.div
            className="h-full rounded-full"
            style={{
              background: isCompleted
                ? "linear-gradient(90deg, #34d399, #10b981)"
                : "linear-gradient(90deg, var(--accent-light), var(--accent))",
              boxShadow: isCompleted ? "0 0 12px #34d399" : "0 0 8px var(--accent-light)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* XP reward */}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          XP Reward
        </span>
        <motion.div
          animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm font-bold flex items-center gap-1"
          style={{ color: isCompleted ? "#fbbf24" : "var(--accent-light)" }}
        >
          <span>✨</span>
          <span>+{mission.xpReward} XP</span>
        </motion.div>
      </div>

      {/* Status indicator */}
      {mission.status === "in-progress" && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{ background: "var(--accent-light)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
