"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore, type Skin } from "@/app/lib/gameStore";
import { motion } from "framer-motion";
import { Lock, ChevronLeft, Star, Flame, Zap, Sparkles, Crown, Shield, Cloud } from "lucide-react";

const XP_PER_LEVEL = 200;

const SKINS: { id: Skin; label: string; emoji: string; desc: string; unlockLevel: number; gradient: string; icon: React.ReactNode }[] = [
  { id: "default", label: "Default",  emoji: "🧑💻", desc: "The classic coder",        unlockLevel: 1,  gradient: "linear-gradient(135deg,#60a5fa,#3b82f6)", icon: <Star size={20} /> },
  { id: "fire",    label: "Fire",     emoji: "🔥",   desc: "Blazing hot coder",        unlockLevel: 3,  gradient: "linear-gradient(135deg,#fb923c,#dc2626)", icon: <Flame size={20} /> },
  { id: "ice",     label: "Ice",      emoji: "❄️",   desc: "Cool under pressure",      unlockLevel: 5,  gradient: "linear-gradient(135deg,#67e8f9,#3b82f6)", icon: <Cloud size={20} /> },
  { id: "galaxy",  label: "Galaxy",   emoji: "🌌",   desc: "Out of this world",        unlockLevel: 8,  gradient: "linear-gradient(135deg,#c084fc,#ec4899)", icon: <Sparkles size={20} /> },
  { id: "gold",    label: "Gold",     emoji: "👑",   desc: "Elite champion",           unlockLevel: 12, gradient: "linear-gradient(135deg,#fde047,#f59e0b)", icon: <Crown size={20} /> },
  { id: "shadow",  label: "Shadow",   emoji: "🥷",   desc: "Silent and deadly",        unlockLevel: 15, gradient: "linear-gradient(135deg,#6b7280,#111827)", icon: <Shield size={20} /> },
  { id: "neon",    label: "Neon",     emoji: "⚡",   desc: "Electrifying presence",    unlockLevel: 20, gradient: "linear-gradient(135deg,#4ade80,#06b6d4)", icon: <Zap size={20} /> },
];

export default function AvatarPage() {
  const router = useRouter();
  const { user, level, xp, activeSkin, unlockedSkins, setSkin } = useGameStore();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  const currentLevelXP = XP_PER_LEVEL * (level - 1);
  const nextLevelXP = XP_PER_LEVEL * level;
  const pct = Math.min(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100, 100);
  const activeSkinData = SKINS.find(s => s.id === activeSkin)!;

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-5xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={() => router.push("/dashboard")}
          className="glass rounded-xl p-2 transition-all hover:scale-105">
          <ChevronLeft size={18} style={{ color: "var(--text-muted)" }} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Avatar Customization</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Unlock skins by leveling up</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Current avatar preview */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="glass card-shine rounded-2xl p-6 flex flex-col items-center gap-5 md:sticky md:top-28 h-fit">
          <p className="text-xs font-bold uppercase tracking-widest self-start" style={{ color: "var(--text-faint)" }}>Your Avatar</p>

          {/* Avatar circle */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl"
              style={{ background: activeSkinData.gradient, boxShadow: `0 0 40px var(--accent-glow)` }}>
              {activeSkinData.emoji}
            </div>
            {/* Level badge */}
            <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
              style={{ background: "var(--btn-grad)", border: "2px solid var(--bg)" }}>
              {level}
            </div>
          </motion.div>

          <div className="text-center">
            <p className="font-extrabold text-lg" style={{ color: "var(--text)" }}>{user.name}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{activeSkinData.label} Skin · Level {level}</p>
          </div>

          {/* XP bar */}
          <div className="w-full flex flex-col gap-1">
            <div className="flex justify-between text-[10px]" style={{ color: "var(--text-faint)" }}>
              <span>Level {level}</span><span>{Math.round(pct)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "var(--btn-grad)" }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
            </div>
            <p className="text-[10px] text-center" style={{ color: "var(--text-faint)" }}>
              {xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP to next level
            </p>
          </div>

          {/* Unlocked count */}
          <div className="glass rounded-xl px-4 py-2 text-center w-full">
            <p className="text-xs font-bold" style={{ color: "var(--accent-light)" }}>
              {unlockedSkins.length} / {SKINS.length} skins unlocked
            </p>
          </div>
        </motion.div>

        {/* Skins grid */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SKINS.map((skin, i) => {
            const isUnlocked = unlockedSkins.includes(skin.id);
            const isActive = activeSkin === skin.id;

            return (
              <motion.div key={skin.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                className="glass card-shine rounded-2xl p-5 flex flex-col gap-4 transition-all"
                style={{
                  border: isActive ? "1px solid var(--accent)" : "1px solid var(--border)",
                  boxShadow: isActive ? "0 0 24px var(--accent-glow)" : undefined,
                  opacity: isUnlocked ? 1 : 0.6,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: skin.gradient }}>
                      {skin.emoji}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm" style={{ color: "var(--text)" }}>{skin.label}</p>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{skin.desc}</p>
                    </div>
                  </div>
                  {isActive && (
                    <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="text-[10px] font-bold px-2 py-1 rounded-full"
                      style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}>
                      Active
                    </motion.span>
                  )}
                </div>

                {/* Gradient preview */}
                <div className="h-10 rounded-xl" style={{ background: skin.gradient }} />

                {/* Unlock info */}
                {!isUnlocked && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: "var(--surface-hover)" }}>
                    <Lock size={12} style={{ color: "var(--text-faint)" }} />
                    <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                      Unlock at Level {skin.unlockLevel}
                      {level < skin.unlockLevel && ` · ${skin.unlockLevel - level} levels away`}
                    </span>
                  </div>
                )}

                <motion.button
                  onClick={() => isUnlocked && setSkin(skin.id)}
                  disabled={!isUnlocked}
                  whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
                  whileTap={{ scale: isUnlocked ? 0.98 : 1 }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition-all disabled:cursor-not-allowed"
                  style={{
                    background: isActive ? "var(--btn-grad)" : isUnlocked ? "var(--surface-hover)" : "var(--border)",
                    color: isActive ? "#fff" : isUnlocked ? "var(--text-muted)" : "var(--text-faint)",
                  }}
                >
                  {isActive ? "✓ Currently Active" : isUnlocked ? "Select Skin" : <span className="flex items-center justify-center gap-1"><Lock size={11} /> Locked</span>}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}
