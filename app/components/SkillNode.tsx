"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2, Zap } from "lucide-react";
import type { Skill, SkillStatus } from "@/app/lib/skillTreeStore";

interface SkillNodeProps {
  skill: Skill;
  status: SkillStatus;
  completionPercentage: number;
  onClick?: () => void;
  isClickable?: boolean;
}

export function SkillNode({
  skill,
  status,
  completionPercentage,
  onClick,
  isClickable = true,
}: SkillNodeProps) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isInProgress = status === "in-progress";

  const getBackgroundStyle = () => {
    if (isLocked) return { background: "var(--surface)", opacity: 0.5 };
    if (isCompleted) return { background: skill.color + "33", border: `2px solid ${skill.color}` };
    if (isInProgress) return { background: skill.color + "22", border: `2px solid ${skill.color}66` };
    return { background: skill.color + "11", border: `2px solid ${skill.color}88` };
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked || !isClickable}
      whileHover={!isLocked && isClickable ? { scale: 1.08 } : {}}
      whileTap={!isLocked && isClickable ? { scale: 0.95 } : {}}
      className="relative flex flex-col items-center w-full"
    >
      {/* Lock shine effect for locked nodes */}
      {isLocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: "var(--overlay)" }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Main node card */}
      <div
        className="relative w-full rounded-2xl p-4 flex flex-col gap-2 transition-all glass card-shine"
        style={{
          ...getBackgroundStyle(),
          cursor: isLocked || !isClickable ? "not-allowed" : "pointer",
        }}
      >
        {/* Completion shimmer for completed nodes */}
        {isCompleted && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent rounded-2xl"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ opacity: 0.1 }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-start justify-between gap-2">
          {/* Icon and name */}
          <div className="flex items-start gap-2 flex-1 text-left">
            <span className="text-2xl mt-1">{skill.icon}</span>
            <div className="min-w-0">
              <h3 className="font-bold text-sm leading-tight" style={{ color: "var(--text)" }}>
                {skill.name}
              </h3>
              <p className="text-[10px] leading-tight" style={{ color: "var(--text-muted)" }}>
                {skill.description}
              </p>
            </div>
          </div>

          {/* Status badge */}
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex-shrink-0"
            >
              <CheckCircle2 size={20} style={{ color: skill.color }} />
            </motion.div>
          ) : isLocked ? (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <Lock size={18} style={{ color: "var(--text-faint)" }} />
            </motion.div>
          ) : null}
        </div>

        {/* Progress bar */}
        {!isLocked && (
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Progress
              </span>
              <span className="text-[10px] font-bold" style={{ color: skill.color }}>
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: skill.color,
                  boxShadow: `0 0 8px ${skill.color}`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* XP requirement (for locked) or reward (for completed) */}
        <div className="relative z-10 flex items-center justify-between gap-2 text-[10px]">
          {isLocked ? (
            <>
              <span style={{ color: "var(--text-faint)" }}>Unlock requirement:</span>
              <div className="flex items-center gap-1" style={{ color: skill.color }}>
                <Zap size={12} />
                <span className="font-bold">{skill.requiredXP} XP</span>
              </div>
            </>
          ) : isCompleted ? (
            <span style={{ color: "var(--text-faint)" }} className="text-[9px]">
              ✨ Skill Mastered
            </span>
          ) : (
            <span style={{ color: "var(--text-muted)" }}>
              {skill.totalLessons} lessons • {skill.difficulty}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
