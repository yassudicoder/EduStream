"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/app/lib/gameStore";
import { AVAILABLE_LANGUAGES, getLessonsByLanguage } from "@/app/lib/lessons";
import { motion } from "framer-motion";
import { Flame, Award, Trophy, Swords, BookOpen, Star, Zap, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { DailyMissions } from "@/app/components/DailyMissions";

const XP_PER_LEVEL = 200;

function XPBar({ xp, level }: { xp: number; level: number }) {
  const currentLevelXP = XP_PER_LEVEL * (level - 1);
  const nextLevelXP = XP_PER_LEVEL * level;
  const pct = Math.min(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100, 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs" style={{ color: "var(--text-faint)" }}>
        <span>Level {level}</span>
        <span>{xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <motion.div className="h-full rounded-full" style={{ background: "var(--btn-grad)" }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
      </div>
    </div>
  );
}

const LANG_META: Record<string, { emoji: string; color: string; desc: string }> = {
  html:       { emoji: "🔗", color: "#f97316", desc: "Structure the web" },
  css:        { emoji: "🎨", color: "#8b5cf6", desc: "Style everything" },
  javascript: { emoji: "⚡", color: "#fbbf24", desc: "Make it interactive" },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, xp, level, streak, achievements, languages, activeSkin } = useGameStore();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);

  const skinEmojis: Record<string, string> = {
    default: "🧑‍💻", fire: "🔥", ice: "❄️", galaxy: "🌌", gold: "👑", shadow: "🥷", neon: "⚡"
  };

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-6xl mx-auto flex flex-col gap-8">

      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/avatar">
            <motion.div whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl glass card-shine cursor-pointer"
              style={{ border: "2px solid var(--accent)" }}>
              {skinEmojis[activeSkin] ?? "🧑‍💻"}
            </motion.div>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
              Welcome back, <span className="grad-text">{user.name}</span>!
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Level {level} · {xp.toLocaleString()} XP total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/leaderboard"
            className="glass rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105"
            style={{ color: "var(--text-muted)" }}>
            <Trophy size={13} style={{ color: "#fbbf24" }} /> Leaderboard
          </Link>
          <Link href="/arena"
            className="rounded-xl px-4 py-2 flex items-center gap-2 text-xs font-bold text-white transition-all hover:scale-105"
            style={{ background: "var(--btn-grad)" }}>
            <Swords size={13} /> Battle Arena
          </Link>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Star,   label: "Level",        value: String(level),                  color: "#a78bfa" },
          { icon: Zap,    label: "Total XP",      value: xp.toLocaleString(),            color: "#fbbf24" },
          { icon: Flame,  label: "Day Streak",    value: `${streak} 🔥`,                 color: "#f97316" },
          { icon: Award,  label: "Achievements",  value: `${unlockedAchievements.length}/${achievements.length}`, color: "#34d399" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass card-shine rounded-2xl p-4 flex flex-col gap-2">
            <Icon size={16} style={{ color }} />
            <p className="text-xl font-extrabold" style={{ color: "var(--text)" }}>{value}</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* XP progress */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="glass card-shine rounded-2xl p-5">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>XP Progress</p>
        <XPBar xp={xp} level={level} />
      </motion.div>

      {/* Daily Missions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <DailyMissions />
      </motion.div>

      {/* Language cards */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-faint)" }}>📖 Coding Lessons</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVAILABLE_LANGUAGES.map((lang, i) => {
            const lessons = getLessonsByLanguage(lang);
            const langData = languages[lang];
            const completed = langData?.lessons ? Object.values(langData.lessons).filter(l => l.completed).length : 0;
            const pct = lessons.length > 0 ? (completed / lessons.length) * 100 : 0;
            const meta = LANG_META[lang] ?? { emoji: "📄", color: "#888", desc: "" };
            const nextLesson = langData?.currentLesson ?? 0;

            return (
              <motion.div key={lang}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                className="glass card-shine rounded-2xl p-5 flex flex-col gap-4"
                style={{ border: `1px solid ${meta.color}22` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: meta.color + "22" }}>
                      {meta.emoji}
                    </div>
                    <div>
                      <p className="font-extrabold uppercase text-sm" style={{ color: "var(--text)" }}>{lang}</p>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{meta.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: meta.color }}>{Math.round(pct)}%</span>
                </div>

                <div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <motion.div className="h-full rounded-full"
                      style={{ background: meta.color }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: "var(--text-faint)" }}>{completed} / {lessons.length} lessons</p>
                </div>

                <Link href={`/learn/${lang}/${nextLesson}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                  style={{ background: meta.color }}>
                  <BookOpen size={13} />
                  {langData?.started ? "Continue" : "Start"} Learning
                  <ChevronRight size={13} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>🏅 Achievements</p>
          <span className="text-xs font-bold" style={{ color: "var(--accent-light)" }}>
            {unlockedAchievements.length} / {achievements.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map(a => (
            <motion.div key={a.id} whileHover={{ scale: a.unlockedAt ? 1.05 : 1 }}
              className="rounded-xl p-3 flex flex-col items-center gap-1.5 text-center transition-all"
              style={{
                background: a.unlockedAt ? "var(--accent-glow)" : "var(--surface)",
                border: `1px solid ${a.unlockedAt ? "var(--accent)" : "var(--border)"}`,
                opacity: a.unlockedAt ? 1 : 0.45,
              }}
            >
              <span className="text-2xl">{a.icon}</span>
              <p className="text-[10px] font-bold" style={{ color: "var(--text)" }}>{a.title}</p>
              <p className="text-[9px]" style={{ color: "var(--text-faint)" }}>{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: "/leaderboard", icon: Trophy, label: "View Leaderboard", desc: "See where you rank globally", color: "#fbbf24" },
          { href: "/arena",       icon: Swords, label: "Enter Arena",       desc: "Challenge others in battles",  color: "#f87171" },
          { href: "/avatar",      icon: User,   label: "Customize Avatar",  desc: "Change your skin & style",    color: "#a78bfa" },
        ].map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="glass card-shine rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: color + "22" }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{label}</p>
                <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{desc}</p>
              </div>
              <ChevronRight size={14} className="ml-auto" style={{ color: "var(--text-faint)" }} />
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </main>
  );
}
