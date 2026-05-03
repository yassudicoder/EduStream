"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAdminStore } from "@/app/lib/adminStore";
import { motion } from "framer-motion";
import { ChevronLeft, BarChart3, Users, Trophy, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { Suspense } from "react";

function AnalyticsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const type = params.get("type");
  const { tournaments, tests } = useAdminStore();

  const item = type === "tournament"
    ? tournaments.find(t => t.id === id)
    : tests.find(t => t.id === id);

  if (!item) {
    // Show all analytics overview
    const allSubmissions = tests.flatMap(t => t.submissions.map(s => ({ ...s, testTitle: t.title })));
    const allParticipants = tournaments.flatMap(t => t.participants.map(p => ({ ...p, tournamentTitle: t.title })));

    return (
      <main className="min-h-screen px-4 pt-28 pb-20 max-w-5xl mx-auto flex flex-col gap-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="glass rounded-xl p-2 transition-all hover:scale-105">
            <ChevronLeft size={18} style={{ color: "var(--text-muted)" }} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Analytics Overview</h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>All events performance</p>
          </div>
        </motion.div>

        {/* Global stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Users size={16} />, label: "Total Submissions", value: allSubmissions.length, color: "#a78bfa" },
            { icon: <Trophy size={16} />, label: "Tournament Players", value: allParticipants.length, color: "#fbbf24" },
            { icon: <CheckCircle size={16} />, label: "Passed", value: allSubmissions.filter(s => s.passed).length, color: "#34d399" },
            { icon: <XCircle size={16} />, label: "Failed", value: allSubmissions.filter(s => !s.passed).length, color: "#f87171" },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="glass card-shine rounded-2xl p-4 flex flex-col gap-2">
              <span style={{ color }}>{icon}</span>
              <p className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>{value}</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Top performers across all tests */}
        <div className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>🏆 Top Performers (All Tests)</p>
          {allSubmissions.sort((a, b) => b.score - a.score).slice(0, 10).map((s, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
              <span className="text-lg font-extrabold w-6 text-center" style={{ color: i < 3 ? "#fbbf24" : "var(--text-faint)" }}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{s.name}</p>
                <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{s.testTitle}</p>
              </div>
              <span className="text-sm font-extrabold" style={{ color: s.passed ? "#34d399" : "#f87171" }}>{s.score}%</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: s.passed ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)", color: s.passed ? "#34d399" : "#f87171" }}>
                {s.passed ? "PASS" : "FAIL"}
              </span>
            </div>
          ))}
          {allSubmissions.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-faint)" }}>No submissions yet</p>
          )}
        </div>
      </main>
    );
  }

  const isTournament = "bracketType" in item;
  const submissions = isTournament ? [] : (item as any).submissions ?? [];
  const participants = isTournament ? (item as any).participants ?? [] : [];
  const data = isTournament ? participants : submissions;

  const avgScore = data.length > 0 ? Math.round(data.reduce((a: number, s: any) => a + s.score, 0) / data.length) : 0;
  const passCount = submissions.filter((s: any) => s.passed).length;
  const failCount = submissions.filter((s: any) => !s.passed).length;
  const avgTime = submissions.length > 0
    ? Math.round(submissions.reduce((a: number, s: any) => a + (s.timeTaken ?? 0), 0) / submissions.length)
    : 0;

  // Score distribution buckets
  const buckets = [
    { label: "0–20", min: 0, max: 20 },
    { label: "21–40", min: 21, max: 40 },
    { label: "41–60", min: 41, max: 60 },
    { label: "61–80", min: 61, max: 80 },
    { label: "81–100", min: 81, max: 100 },
  ].map(b => ({
    ...b,
    count: data.filter((s: any) => s.score >= b.min && s.score <= b.max).length,
  }));
  const maxBucket = Math.max(...buckets.map(b => b.count), 1);

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-5xl mx-auto flex flex-col gap-8">

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={() => router.push("/admin")} className="glass rounded-xl p-2 transition-all hover:scale-105">
          <ChevronLeft size={18} style={{ color: "var(--text-muted)" }} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>{item.title}</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {isTournament ? "Tournament" : "Test"} Analytics · {data.length} {isTournament ? "participants" : "submissions"}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Users size={16} />, label: isTournament ? "Participants" : "Submissions", value: data.length, color: "#a78bfa" },
          { icon: <TrendingUp size={16} />, label: "Avg Score", value: `${avgScore}%`, color: "#fbbf24" },
          ...(isTournament ? [] : [
            { icon: <CheckCircle size={16} />, label: "Passed", value: passCount, color: "#34d399" },
            { icon: <Clock size={16} />, label: "Avg Time", value: `${avgTime}m`, color: "#60a5fa" },
          ]),
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="glass card-shine rounded-2xl p-4 flex flex-col gap-2">
            <span style={{ color }}>{icon}</span>
            <p className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>{value}</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Score distribution chart */}
      <div className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>📊 Score Distribution</p>
        <div className="flex items-end gap-3 h-32">
          {buckets.map(b => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>{b.count}</span>
              <motion.div
                className="w-full rounded-t-lg"
                style={{ background: "var(--btn-grad)", minHeight: 4 }}
                initial={{ height: 0 }}
                animate={{ height: `${(b.count / maxBucket) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
              <span className="text-[9px]" style={{ color: "var(--text-faint)" }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pass/Fail pie (simple) */}
      {!isTournament && submissions.length > 0 && (
        <div className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>✅ Pass / Fail Breakdown</p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#34d399" }}>Passed</span>
                <span className="font-extrabold" style={{ color: "#34d399" }}>{passCount} ({Math.round((passCount / submissions.length) * 100)}%)</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "#34d399" }}
                  initial={{ width: 0 }} animate={{ width: `${(passCount / submissions.length) * 100}%` }} transition={{ duration: 0.8 }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#f87171" }}>Failed</span>
                <span className="font-extrabold" style={{ color: "#f87171" }}>{failCount} ({Math.round((failCount / submissions.length) * 100)}%)</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "#f87171" }}
                  initial={{ width: 0 }} animate={{ width: `${(failCount / submissions.length) * 100}%` }} transition={{ duration: 0.8, delay: 0.1 }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard table */}
      <div className="glass card-shine rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            🏅 {isTournament ? "Rankings" : "Submissions"}
          </p>
        </div>
        <div className="grid text-[10px] font-bold uppercase tracking-widest px-5 py-2"
          style={{ gridTemplateColumns: "2rem 1fr 5rem 5rem 5rem", color: "var(--text-faint)", borderBottom: "1px solid var(--border)" }}>
          <span>#</span><span>Name</span><span>Score</span>
          {isTournament ? <span>Rank</span> : <><span>Time</span><span>Status</span></>}
        </div>
        {data.sort((a: any, b: any) => b.score - a.score).map((s: any, i: number) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="grid items-center px-5 py-3 border-b transition-all hover:bg-white/5"
            style={{ gridTemplateColumns: "2rem 1fr 5rem 5rem 5rem", borderColor: "var(--border)" }}>
            <span className="text-sm font-extrabold" style={{ color: i < 3 ? "#fbbf24" : "var(--text-faint)" }}>{i + 1}</span>
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{s.name}</span>
            <span className="text-sm font-extrabold" style={{ color: "var(--accent-light)" }}>{s.score}%</span>
            {isTournament
              ? <span className="text-xs" style={{ color: "var(--text-muted)" }}>#{s.rank}</span>
              : <>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{s.timeTaken}m</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: s.passed ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)", color: s.passed ? "#34d399" : "#f87171" }}>
                    {s.passed ? "PASS" : "FAIL"}
                  </span>
                </>
            }
          </motion.div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-faint)" }}>No data yet</p>
        )}
      </div>
    </main>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--text-muted)" }}>Loading analytics...</p>
      </div>
    }>
      <AnalyticsContent />
    </Suspense>
  );
}
