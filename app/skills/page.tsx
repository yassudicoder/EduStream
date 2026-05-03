"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/app/lib/gameStore";
import { motion } from "framer-motion";
import { TreePine, Award, Zap } from "lucide-react";
import { SkillTree } from "@/app/components/SkillTree";

export default function SkillTreePage() {
  const router = useRouter();
  const { user, xp, level } = useGameStore();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <TreePine size={28} style={{ color: "var(--accent-light)" }} />
          <div>
            <h1 className="text-3xl font-extrabold" style={{ color: "var(--text)" }}>
              Skill Tree
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Master your coding journey one skill at a time
            </p>
          </div>
        </div>

        <motion.div
          className="glass rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "var(--surface-hover)" }}
        >
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm font-bold mb-1">
              <Zap size={14} style={{ color: "#fbbf24" }} />
              <span>{xp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award size={14} style={{ color: "var(--accent-light)" }} />
              <span>Level {level}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main skill tree */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SkillTree />
      </motion.div>

      {/* Quick tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          {
            icon: "🔓",
            title: "Unlock Skills",
            desc: "Complete prerequisite skills to unlock new ones",
          },
          {
            icon: "📈",
            title: "Progress Together",
            desc: "Complete lessons to increase your skill level",
          },
          {
            icon: "🏆",
            title: "Earn Rewards",
            desc: "Completing skills earns XP and achievements",
          },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="flex flex-col gap-2">
            <span className="text-3xl">{icon}</span>
            <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
              {title}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {desc}
            </p>
          </div>
        ))}
      </motion.div>
    </main>
  );
}
