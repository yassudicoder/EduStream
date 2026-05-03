"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRankStore } from "@/app/lib/rankStore";
import { RANK_CONFIGS } from "@/app/lib/rankStore";
import { Sparkles } from "lucide-react";

export function RankUpgradePopup() {
  const { rankUpgradeNotification, previousRank, currentRank, dismissRankNotification } =
    useRankStore();

  useEffect(() => {
    if (rankUpgradeNotification) {
      const timer = setTimeout(() => {
        dismissRankNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [rankUpgradeNotification, dismissRankNotification]);

  if (!rankUpgradeNotification || !previousRank) return null;

  const prevConfig = RANK_CONFIGS[previousRank];
  const newConfig = RANK_CONFIGS[currentRank];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: "spring" as const,
        stiffness: 100,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3 },
    },
  };

  const celebrationVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatDelay: 0.2,
      },
    },
  };

  const sparkleVariants = {
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      y: [0, -20],
    },
  };

  return (
    <AnimatePresence>
      {rankUpgradeNotification && (
        <motion.div
          className="fixed bottom-8 right-8 z-50 max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Background sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                variants={sparkleVariants}
                animate="animate"
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>

          {/* Main card */}
          <motion.div
            className="glass rounded-2xl p-6 backdrop-blur-md relative z-10 border"
            style={{ borderColor: newConfig.color }}
            variants={celebrationVariants}
            animate="animate"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <motion.span
                className="text-4xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
              >
                🎉
              </motion.span>
              <div className="flex-1">
                <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                  Rank Up!
                </h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  You've been promoted
                </p>
              </div>
            </div>

            {/* Rank progression */}
            <div className="flex items-center justify-between mb-4 px-2">
              {/* From rank */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">{prevConfig.icon}</span>
                <span className="text-xs font-semibold" style={{ color: prevConfig.color }}>
                  {prevConfig.shortName}
                </span>
              </div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <span className="text-2xl">→</span>
              </motion.div>

              {/* To rank */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl">{newConfig.icon}</span>
                <span className="text-xs font-semibold" style={{ color: newConfig.color }}>
                  {newConfig.shortName}
                </span>
              </div>
            </div>

            {/* Rank names */}
            <div className="flex items-center justify-between text-center mb-4">
              <span className="text-xs text-center flex-1" style={{ color: "var(--text-faint)" }}>
                {prevConfig.name}
              </span>
              <span className="text-xs text-center flex-1" style={{ color: newConfig.color }}>
                {newConfig.name}
              </span>
            </div>

            {/* Stats */}
            <div className="bg-surface rounded-lg p-3 flex items-center gap-2 text-sm">
              <Sparkles size={16} style={{ color: newConfig.color }} />
              <span style={{ color: "var(--text-muted)" }}>
                Keep grinding to reach the next rank!
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
