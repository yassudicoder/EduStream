"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/app/lib/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, ClipboardList, Users, BarChart3, Plus, Play, Eye,
  Trash2, Edit, Globe, Building2, GraduationCap, MapPin,
  Zap, Crown, ChevronRight, LogIn, Loader2, Mail, User, Shield
} from "lucide-react";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  draft: "#9090b0", open: "#34d399", live: "#f97316", ended: "#f87171",
};
const STATUS_BG: Record<string, string> = {
  draft: "rgba(144,144,176,0.15)", open: "rgba(52,211,153,0.15)",
  live: "rgba(249,115,22,0.15)", ended: "rgba(248,113,113,0.15)",
};
const SCOPE_ICONS: Record<string, React.ReactNode> = {
  global: <Globe size={13} />, regional: <MapPin size={13} />,
  company: <Building2 size={13} />, classroom: <GraduationCap size={13} />,
};

function StatCard({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="glass card-shine rounded-2xl p-5 flex flex-col gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + "22" }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>{value}</p>
        <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{label}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: "var(--text-faint)" }}>{sub}</p>}
      </div>
    </motion.div>
  );
}

function LoginPanel({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"creator" | "teacher" | "company">("creator");
  const [loading, setLoading] = useState(false);
  const setAdminRole = useAdminStore(s => s.setRole);

  const ROLES = [
    { id: "creator" as const, label: "Creator / Organizer", emoji: "🏆", desc: "Run tournaments & competitions" },
    { id: "teacher" as const, label: "Teacher / Professor", emoji: "🎓", desc: "Create tests & analyze students" },
    { id: "company" as const, label: "Company / Recruiter", emoji: "🏢", desc: "Find top coders for hiring" },
  ];

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setAdminRole(role, name.trim(), email.trim());
      onLogin();
      setLoading(false);
    }, 500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg glass card-shine rounded-3xl p-8 flex flex-col gap-6"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--btn-grad)" }}>
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>Creator Hub</h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Build tournaments, tests & competitions</p>
          </div>
        </div>

        {/* Role selector */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>I am a...</p>
          {ROLES.map(r => (
            <button key={r.id} onClick={() => setRole(r.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
              style={{
                background: role === r.id ? "var(--accent-glow)" : "var(--surface)",
                border: `1px solid ${role === r.id ? "var(--accent)" : "var(--border)"}`,
              }}>
              <span className="text-2xl">{r.emoji}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{r.label}</p>
                <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{r.desc}</p>
              </div>
              {role === r.id && <div className="ml-auto w-2 h-2 rounded-full" style={{ background: "var(--accent-light)" }} />}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="glow-border glass rounded-xl flex items-center gap-3 px-4 py-3">
            <User size={14} style={{ color: "var(--text-faint)" }} />
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name / organization"
              className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--text)" }} required />
          </div>
          <div className="glow-border glass rounded-xl flex items-center gap-3 px-4 py-3">
            <Mail size={14} style={{ color: "var(--text-faint)" }} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"
              className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--text)" }} required />
          </div>
          <motion.button type="submit" disabled={loading || !name.trim() || !email.trim()}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "var(--btn-grad)", boxShadow: "0 8px 32px var(--accent-glow)" }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><LogIn size={16} /> Enter Creator Hub</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { role, creatorName, tournaments, tests, deleteTournament, deleteTest, updateTournament, updateTest } = useAdminStore();
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "tournaments" | "tests">("overview");

  useEffect(() => {
    if (role) setLoggedIn(true);
  }, [role]);

  if (!loggedIn) return <LoginPanel onLogin={() => setLoggedIn(true)} />;

  const totalParticipants = tournaments.reduce((a, t) => a + t.registeredCount, 0)
    + tests.reduce((a, t) => a + t.registeredCount, 0);
  const liveTournaments = tournaments.filter(t => t.status === "live").length;
  const liveTests = tests.filter(t => t.status === "live").length;

  const TABS = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "tournaments" as const, label: "Tournaments", icon: Trophy },
    { id: "tests" as const, label: "Tests & Exams", icon: ClipboardList },
  ];

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-6xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "var(--btn-grad)" }}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
              Creator Hub
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Welcome, <span style={{ color: "var(--accent-light)" }}>{creatorName}</span> · {role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/create-tournament"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
            style={{ background: "var(--btn-grad)", boxShadow: "0 4px 20px var(--accent-glow)" }}>
            <Plus size={14} /> New Tournament
          </Link>
          <Link href="/admin/create-test"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold glass transition-all hover:scale-105"
            style={{ color: "var(--accent-light)" }}>
            <Plus size={14} /> New Test
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<Trophy size={18} />} label="Tournaments" value={tournaments.length} color="#fbbf24" sub={`${liveTournaments} live`} />
        <StatCard icon={<ClipboardList size={18} />} label="Tests & Exams" value={tests.length} color="#a78bfa" sub={`${liveTests} live`} />
        <StatCard icon={<Users size={18} />} label="Total Participants" value={totalParticipants.toLocaleString()} color="#34d399" />
        <StatCard icon={<Zap size={18} />} label="Questions Created" value={tournaments.reduce((a, t) => a + t.questions.length, 0) + tests.reduce((a, t) => a + t.questions.length, 0)} color="#f97316" />
      </motion.div>

      {/* Tabs */}
      <div className="glass rounded-2xl p-1 flex gap-1 self-start">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ color: activeTab === id ? "#fff" : "var(--text-muted)" }}>
            {activeTab === id && (
              <motion.div layoutId="adminTab" className="absolute inset-0 rounded-xl"
                style={{ background: "var(--btn-grad)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10 flex items-center gap-1.5"><Icon size={13} />{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-6">

            {/* Quick actions */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Quick Actions</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { href: "/admin/create-tournament", icon: Trophy, label: "Create Tournament", desc: "Set up brackets, prizes, rules", color: "#fbbf24" },
                  { href: "/admin/create-test", icon: ClipboardList, label: "Create Test / Exam", desc: "Build MCQ, DSA & coding tests", color: "#a78bfa" },
                  { href: "/admin/analytics", icon: BarChart3, label: "View Analytics", desc: "Student performance & rankings", color: "#34d399" },
                ].map(({ href, icon: Icon, label, desc, color }) => (
                  <Link key={href} href={href}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="glass card-shine rounded-2xl p-5 flex flex-col gap-3 cursor-pointer h-full">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "22" }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{label}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-faint)" }}>{desc}</p>
                      </div>
                      <ChevronRight size={14} className="mt-auto" style={{ color: "var(--text-faint)" }} />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Recent Activity</p>
              <div className="glass card-shine rounded-2xl overflow-hidden">
                {[...tournaments, ...tests]
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .slice(0, 5)
                  .map((item, i) => {
                    const isTournament = "bracketType" in item;
                    return (
                      <motion.div key={item.id}
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 px-5 py-3.5 border-b transition-all hover:bg-white/5"
                        style={{ borderColor: "var(--border)" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: isTournament ? "#fbbf2422" : "#a78bfa22" }}>
                          {isTournament ? <Trophy size={14} style={{ color: "#fbbf24" }} /> : <ClipboardList size={14} style={{ color: "#a78bfa" }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{item.title}</p>
                          <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                            {isTournament ? "Tournament" : "Test"} · {item.registeredCount} participants
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: STATUS_BG[item.status], color: STATUS_COLORS[item.status] }}>
                            {item.status}
                          </span>
                          {SCOPE_ICONS[item.scope]}
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── TOURNAMENTS ── */}
        {activeTab === "tournaments" && (
          <motion.div key="tournaments" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                {tournaments.length} Tournaments
              </p>
              <Link href="/admin/create-tournament"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-white transition-all hover:scale-105"
                style={{ background: "var(--btn-grad)" }}>
                <Plus size={13} /> Create New
              </Link>
            </div>

            {tournaments.map((t, i) => (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="glass card-shine rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: STATUS_BG[t.status], color: STATUS_COLORS[t.status] }}>
                        {t.status.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-faint)" }}>
                        {SCOPE_ICONS[t.scope]} {t.scope}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "var(--surface-hover)", color: "var(--text-faint)" }}>
                        {t.bracketType}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base" style={{ color: "var(--text)" }}>{t.title}</h3>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{t.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateTournament(t.id, { status: t.status === "draft" ? "open" : t.status === "open" ? "live" : "ended" })}
                      className="glass rounded-lg p-2 transition-all hover:scale-105" title="Change status">
                      <Play size={13} style={{ color: "var(--accent-light)" }} />
                    </button>
                    <Link href={`/admin/analytics?id=${t.id}&type=tournament`}
                      className="glass rounded-lg p-2 transition-all hover:scale-105">
                      <Eye size={13} style={{ color: "var(--text-muted)" }} />
                    </Link>
                    <button onClick={() => deleteTournament(t.id)}
                      className="glass rounded-lg p-2 transition-all hover:scale-105">
                      <Trash2 size={13} style={{ color: "#f87171" }} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Participants", value: `${t.registeredCount} / ${t.maxParticipants}` },
                    { label: "Questions", value: t.questions.length },
                    { label: "Prize Pool", value: t.prizePool },
                    { label: "Dates", value: `${t.startDate} → ${t.endDate}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl px-3 py-2" style={{ background: "var(--surface-hover)" }}>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{label}</p>
                      <p className="text-xs font-bold mt-0.5" style={{ color: "var(--text)" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>
                    <span>Registration</span>
                    <span>{Math.round((t.registeredCount / t.maxParticipants) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: "var(--btn-grad)", width: `${(t.registeredCount / t.maxParticipants) * 100}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {t.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}>#{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── TESTS ── */}
        {activeTab === "tests" && (
          <motion.div key="tests" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                {tests.length} Tests & Exams
              </p>
              <Link href="/admin/create-test"
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-white transition-all hover:scale-105"
                style={{ background: "var(--btn-grad)" }}>
                <Plus size={13} /> Create New
              </Link>
            </div>

            {tests.map((t, i) => (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="glass card-shine rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: STATUS_BG[t.status], color: STATUS_COLORS[t.status] }}>
                        {t.status.toUpperCase()}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-faint)" }}>
                        {SCOPE_ICONS[t.scope]} {t.scope}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base" style={{ color: "var(--text)" }}>{t.title}</h3>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-muted)" }}>{t.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateTest(t.id, { status: t.status === "draft" ? "open" : t.status === "open" ? "live" : "ended" })}
                      className="glass rounded-lg p-2 transition-all hover:scale-105">
                      <Play size={13} style={{ color: "var(--accent-light)" }} />
                    </button>
                    <Link href={`/admin/analytics?id=${t.id}&type=test`}
                      className="glass rounded-lg p-2 transition-all hover:scale-105">
                      <Eye size={13} style={{ color: "var(--text-muted)" }} />
                    </Link>
                    <button onClick={() => deleteTest(t.id)}
                      className="glass rounded-lg p-2 transition-all hover:scale-105">
                      <Trash2 size={13} style={{ color: "#f87171" }} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Participants", value: `${t.registeredCount} / ${t.maxParticipants}` },
                    { label: "Duration", value: `${t.duration} min` },
                    { label: "Questions", value: t.questions.length },
                    { label: "Pass Score", value: `${t.passingScore}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl px-3 py-2" style={{ background: "var(--surface-hover)" }}>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{label}</p>
                      <p className="text-xs font-bold mt-0.5" style={{ color: "var(--text)" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Submissions summary */}
                {t.submissions.length > 0 && (
                  <div className="flex items-center gap-4 px-3 py-2 rounded-xl" style={{ background: "var(--surface-hover)" }}>
                    <div className="text-center">
                      <p className="text-sm font-extrabold" style={{ color: "#34d399" }}>
                        {t.submissions.filter(s => s.passed).length}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Passed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-extrabold" style={{ color: "#f87171" }}>
                        {t.submissions.filter(s => !s.passed).length}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Failed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-extrabold" style={{ color: "var(--accent-light)" }}>
                        {t.submissions.length > 0
                          ? Math.round(t.submissions.reduce((a, s) => a + s.score, 0) / t.submissions.length)
                          : 0}%
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Avg Score</p>
                    </div>
                    <Link href={`/admin/analytics?id=${t.id}&type=test`}
                      className="ml-auto text-xs font-bold flex items-center gap-1 transition-all hover:scale-105"
                      style={{ color: "var(--accent-light)" }}>
                      Full Report <ChevronRight size={12} />
                    </Link>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {t.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}>#{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
