"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, Zap, Star, Crown, Medal, TrendingUp, Search } from "lucide-react";
import { RankTier, RANK_CONFIGS } from "@/app/lib/rankStore";
import { RankBadge as RankTierBadge } from "@/app/components/RankBadge";

type Tab = "global" | "weekly" | "friends";

interface Player {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  badge: string;
  change: number; // rank change
  lang: string;
  userRank: RankTier; // Bronze, Silver, Gold, Platinum, Diamond
}

const MOCK_PLAYERS: Player[] = [
  { rank: 1,  name: "CodeNinja_X",    avatar: "🥷", level: 42, xp: 84200, streak: 67, badge: "🏆", change: 0,  lang: "Python",     userRank: "diamond" },
  { rank: 2,  name: "ByteWizard",     avatar: "🧙", level: 38, xp: 76500, streak: 45, badge: "⚡", change: 1,  lang: "JavaScript", userRank: "diamond" },
  { rank: 3,  name: "AlgoQueen",      avatar: "👑", level: 35, xp: 70100, streak: 52, badge: "💎", change: -1, lang: "C++",        userRank: "platinum" },
  { rank: 4,  name: "ReactRocket",    avatar: "🚀", level: 31, xp: 62300, streak: 30, badge: "🔥", change: 2,  lang: "React",      userRank: "platinum" },
  { rank: 5,  name: "DataDragon",     avatar: "🐉", level: 29, xp: 58700, streak: 28, badge: "🌟", change: -1, lang: "Python",     userRank: "platinum" },
  { rank: 6,  name: "HackMaster99",   avatar: "💻", level: 27, xp: 54100, streak: 21, badge: "🎯", change: 3,  lang: "Go",         userRank: "gold" },
  { rank: 7,  name: "PixelCoder",     avatar: "🎮", level: 25, xp: 50200, streak: 19, badge: "🎨", change: 0,  lang: "CSS",        userRank: "gold" },
  { rank: 8,  name: "NeuralNomad",    avatar: "🤖", level: 24, xp: 48000, streak: 15, badge: "🧠", change: -2, lang: "Python",     userRank: "gold" },
  { rank: 9,  name: "CloudSurfer",    avatar: "☁️", level: 22, xp: 44500, streak: 12, badge: "⭐", change: 1,  lang: "TypeScript", userRank: "gold" },
  { rank: 10, name: "BinaryBeast",    avatar: "⚙️", level: 21, xp: 42100, streak: 10, badge: "🔩", change: 0,  lang: "Rust",       userRank: "silver" },
  { rank: 11, name: "LoopLegend",     avatar: "🔄", level: 20, xp: 40000, streak: 9,  badge: "🎖️", change: 2,  lang: "Java",       userRank: "silver" },
  { rank: 12, name: "StackSorcerer",  avatar: "🪄", level: 19, xp: 38200, streak: 8,  badge: "✨", change: -1, lang: "JavaScript", userRank: "silver" },
  { rank: 13, name: "GitGuru",        avatar: "🌿", level: 18, xp: 36100, streak: 7,  badge: "🌱", change: 4,  lang: "Shell",      userRank: "silver" },
  { rank: 14, name: "APIArtist",      avatar: "🎭", level: 17, xp: 34000, streak: 6,  badge: "🎪", change: -2, lang: "Node.js",    userRank: "silver" },
  { rank: 15, name: "You",            avatar: "😎", level: 5,  xp: 1200,  streak: 3,  badge: "🌟", change: 5,  lang: "HTML",       userRank: "bronze" },
];

const WEEKLY_PLAYERS: Player[] = [
  { rank: 1,  name: "SpeedCoder",   avatar: "⚡", level: 15, xp: 4200, streak: 7,  badge: "🥇", change: 8,  lang: "Python",     userRank: "silver" },
  { rank: 2,  name: "NightOwl_Dev", avatar: "🦉", level: 22, xp: 3800, streak: 5,  badge: "🥈", change: 3,  lang: "JavaScript", userRank: "silver" },
  { rank: 3,  name: "AlgoQueen",    avatar: "👑", level: 35, xp: 3500, streak: 7,  badge: "🥉", change: 0,  lang: "C++",        userRank: "platinum" },
  { rank: 4,  name: "You",          avatar: "😎", level: 5,  xp: 800,  streak: 3,  badge: "🌟", change: 12, lang: "HTML",       userRank: "bronze" },
  ...MOCK_PLAYERS.slice(3, 10).map((p, i) => ({ ...p, rank: i + 5, xp: Math.round(p.xp * 0.05) })),
];

const RANK_COLORS = ["#ffd700", "#c0c0c0", "#cd7f32"];
const RANK_ICONS = [Crown, Medal, Star];

function LeaderboardRankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const Icon = RANK_ICONS[rank - 1];
    return <Icon size={18} style={{ color: RANK_COLORS[rank - 1] }} />;
  }
  return <span className="text-sm font-bold" style={{ color: "var(--text-faint)" }}>#{rank}</span>;
}

function ChangeIndicator({ change }: { change: number }) {
  if (change === 0) return <span className="text-xs" style={{ color: "var(--text-faint)" }}>—</span>;
  return (
    <span className="text-xs font-bold flex items-center gap-0.5"
      style={{ color: change > 0 ? "#34d399" : "#f87171" }}>
      {change > 0 ? "▲" : "▼"}{Math.abs(change)}
    </span>
  );
}

function XPBar({ xp, max }: { xp: number; max: number }) {
  return (
    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--btn-grad)" }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min((xp / max) * 100, 100)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("global");
  const [search, setSearch] = useState("");

  const players = tab === "weekly" ? WEEKLY_PLAYERS : MOCK_PLAYERS;
  const maxXP = players[0]?.xp ?? 1;
  const filtered = players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-4xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent-light)" }}>
          <Trophy size={13} />
          Global Rankings
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--text)" }}>
          <span className="grad-text">Leaderboard</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Compete with coders worldwide. Climb the ranks.</p>
      </motion.div>

      {/* Tabs + Search */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="glass rounded-2xl p-1 flex gap-1">
          {(["global", "weekly", "friends"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="relative px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all"
              style={{ color: tab === t ? "#fff" : "var(--text-muted)" }}
            >
              {tab === t && (
                <motion.div layoutId="tabBg" className="absolute inset-0 rounded-xl"
                  style={{ background: "var(--btn-grad)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{t === "global" ? "🌍 Global" : t === "weekly" ? "📅 Weekly" : "👥 Friends"}</span>
            </button>
          ))}
        </div>
        <div className="glass rounded-xl flex items-center gap-2 px-3 py-2 w-full sm:w-56">
          <Search size={13} style={{ color: "var(--text-faint)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search player..."
            className="bg-transparent outline-none text-xs flex-1"
            style={{ color: "var(--text)" }}
          />
        </div>
      </motion.div>

      {/* Top 3 podium */}
      <AnimatePresence mode="wait">
        {tab !== "friends" && (
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-3 gap-3"
          >
            {[top3[1], top3[0], top3[2]].map((p, i) => {
              if (!p) return <div key={i} />;
              const isFirst = p.rank === 1;
              const heights = ["h-28", "h-36", "h-24"];
              return (
                <motion.div key={p.rank}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass card-shine rounded-2xl p-4 flex flex-col items-center justify-end gap-2 ${heights[i]} relative`}
                  style={{ border: isFirst ? `1px solid ${RANK_COLORS[0]}44` : undefined }}
                >
                  {isFirst && (
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-4 text-2xl">👑</motion.div>
                  )}
                  <div className="text-3xl">{p.avatar}</div>
                  <div className="text-center">
                    <p className="text-xs font-bold truncate max-w-[80px]" style={{ color: "var(--text)" }}>{p.name}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Lv.{p.level}</p>
                  </div>
                  {/* Position Badge */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: `${RANK_COLORS[p.rank - 1]}22` }}>
                    <LeaderboardRankBadge rank={p.rank} />
                  </div>
                  {/* Tier Badge */}
                  <RankTierBadge rank={p.userRank} size="sm" animated={false} />
                  <p className="text-xs font-bold" style={{ color: "var(--accent-light)" }}>{p.xp.toLocaleString()} XP</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="glass card-shine rounded-2xl overflow-hidden"
      >
        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest border-b"
          style={{ color: "var(--text-faint)", borderColor: "var(--border)" }}>
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-2 hidden sm:block">Lang</div>
          <div className="col-span-2">XP</div>
          <div className="col-span-1 hidden sm:block">Streak</div>
          <div className="col-span-1">Lvl</div>
          <div className="col-span-1">±</div>
        </div>

        {/* Rows */}
        {(tab === "friends"
          ? [{ rank: 1, name: "You", avatar: "😎", level: 5, xp: 1200, streak: 3, badge: "🌟", change: 0, lang: "HTML", userRank: "bronze" as RankTier } as Player]
          : filtered
        ).map((p, i) => {
          const isYou = p.name === "You";
          return (
            <motion.div key={p.rank}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b transition-all duration-200 hover:bg-white/5"
              style={{
                borderColor: "var(--border)",
                background: isYou ? "var(--accent-glow)" : undefined,
              }}
            >
              <div className="col-span-1 flex items-center justify-center w-7 h-7">
                <LeaderboardRankBadge rank={p.rank} />
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <span className="text-xl">{p.avatar}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold" style={{ color: isYou ? "var(--accent-light)" : "var(--text)" }}>
                    {p.name}{isYou && " (You)"}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <RankTierBadge rank={p.userRank} size="sm" animated={false} />
                  </div>
                </div>
              </div>
              <div className="col-span-2 hidden sm:block">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "var(--surface-hover)", color: "var(--text-muted)" }}>{p.lang}</span>
              </div>
              <div className="col-span-2 flex flex-col gap-1">
                <span className="text-xs font-bold" style={{ color: "var(--accent-light)" }}>{p.xp.toLocaleString()}</span>
                <XPBar xp={p.xp} max={maxXP} />
              </div>
              <div className="col-span-1 hidden sm:flex items-center gap-1">
                <Flame size={11} style={{ color: "#f97316" }} />
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{p.streak}</span>
              </div>
              <div className="col-span-1">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-lg"
                  style={{ background: "var(--surface-hover)", color: "var(--text-muted)" }}>
                  {p.level}
                </span>
              </div>
              <div className="col-span-1">
                <ChangeIndicator change={p.change} />
              </div>
            </motion.div>
          );
        })}

        {tab === "friends" && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              🤝 Invite friends to compete together!
            </p>
            <button className="mt-3 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:scale-105"
              style={{ background: "var(--btn-grad)", color: "#fff" }}>
              + Invite Friends
            </button>
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3">
        {[
          { icon: TrendingUp, label: "Your Rank",   value: "#15",    color: "#a78bfa" },
          { icon: Zap,        label: "Your XP",     value: "1,200",  color: "#fbbf24" },
          { icon: Flame,      label: "Streak",      value: "3 days", color: "#f97316" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass card-shine rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
            <Icon size={20} style={{ color }} />
            <p className="text-lg font-extrabold" style={{ color: "var(--text)" }}>{value}</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>{label}</p>
          </div>
        ))}
      </motion.div>
    </main>
  );
}
