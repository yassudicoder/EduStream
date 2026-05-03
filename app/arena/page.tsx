"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Users, Trophy, Timer as TimerIcon, Code, Brain, Zap, Play, CheckCircle, XCircle, Flame } from "lucide-react";
import { RankBadge } from "@/app/components/RankBadge";
import { RankTier } from "@/app/lib/rankStore";

type Mode = "1v1" | "group" | "tournament";
type Category = "coding" | "dsa" | "quiz";
type Phase = "lobby" | "battle" | "result";

interface Opponent {
  name: string;
  avatar: string;
  level: number;
  rating: number;
  rank: RankTier;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimit: number; // seconds
  options?: string[];
  answer?: string;
  starterCode?: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: "c1", category: "quiz", difficulty: "Easy", timeLimit: 30,
    title: "HTML Basics",
    description: "Which HTML tag is used to define an internal style sheet?",
    options: ["<css>", "<style>", "<script>", "<link>"],
    answer: "<style>",
  },
  {
    id: "c2", category: "quiz", difficulty: "Easy", timeLimit: 30,
    title: "JavaScript Types",
    description: "What does `typeof null` return in JavaScript?",
    options: ["null", "undefined", "object", "string"],
    answer: "object",
  },
  {
    id: "c3", category: "dsa", difficulty: "Medium", timeLimit: 120,
    title: "Two Sum",
    description: "Given an array of integers and a target, return indices of two numbers that add up to target.\n\nExample: nums=[2,7,11,15], target=9 → [0,1]",
    options: ["O(n²) brute force", "O(n) hash map", "O(n log n) sort", "O(1) constant"],
    answer: "O(n) hash map",
  },
  {
    id: "c4", category: "coding", difficulty: "Easy", timeLimit: 90,
    title: "FizzBuzz",
    description: "Write a function that returns 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for both, else the number.",
    starterCode: "function fizzBuzz(n) {\n  // your code here\n}",
    answer: "FizzBuzz",
  },
  {
    id: "c5", category: "dsa", difficulty: "Hard", timeLimit: 180,
    title: "Valid Parentheses",
    description: "Given a string of brackets '()[]{}'.  Determine if the input string is valid.\n\nA string is valid if every open bracket is closed in the correct order.",
    options: ["Stack", "Queue", "Array", "Recursion"],
    answer: "Stack",
  },
  {
    id: "c6", category: "quiz", difficulty: "Medium", timeLimit: 45,
    title: "Big O Notation",
    description: "What is the time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    answer: "O(log n)",
  },
];

const MOCK_OPPONENTS: Opponent[] = [
  { name: "CodeNinja_X", avatar: "🥷", level: 42, rating: 2100, rank: "diamond" },
  { name: "ByteWizard",  avatar: "🧙", level: 38, rating: 1950, rank: "diamond" },
  { name: "AlgoQueen",   avatar: "👑", level: 35, rating: 1880, rank: "platinum" },
  { name: "ReactRocket", avatar: "🚀", level: 31, rating: 1750, rank: "platinum" },
];

const DIFF_COLORS = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#f87171" };
const CAT_ICONS = { coding: Code, dsa: Brain, quiz: Zap };

function Timer({ seconds, total }: { seconds: number; total: number }) {
  const pct = (seconds / total) * 100;
  const color = seconds < 10 ? "#f87171" : seconds < 30 ? "#fbbf24" : "#34d399";
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.span
        className="text-3xl font-extrabold tabular-nums"
        style={{ color }}
        animate={seconds <= 5 ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5, repeat: seconds <= 5 ? Infinity : 0 }}
      >
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
      </motion.span>
      <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <motion.div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function ModeCard({ mode, icon: Icon, title, desc, players, onClick, active }:
  { mode: Mode; icon: any; title: string; desc: string; players: string; onClick: () => void; active: boolean }) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick}
      className="glass card-shine rounded-2xl p-5 flex flex-col gap-3 text-left transition-all duration-200 w-full"
      style={{ border: active ? "1px solid var(--accent)" : "1px solid var(--border)", boxShadow: active ? "0 0 24px var(--accent-glow)" : undefined }}
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--accent-glow)" }}>
          <Icon size={20} style={{ color: "var(--accent-light)" }} />
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "var(--surface-hover)", color: "var(--text-faint)" }}>{players}</span>
      </div>
      <div>
        <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
      </div>
      {active && <div className="text-xs font-bold" style={{ color: "var(--accent-light)" }}>✓ Selected</div>}
    </motion.button>
  );
}

export default function ArenaPage() {
  const [mode, setMode] = useState<Mode>("1v1");
  const [category, setCategory] = useState<Category>("quiz");
  const [phase, setPhase] = useState<Phase>("lobby");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [myProgress, setMyProgress] = useState(0);
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [groupSize, setGroupSize] = useState(4);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startBattle() {
    const pool = CHALLENGES.filter(c => c.category === category);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setChallenge(picked);
    setTimeLeft(picked.timeLimit);
    setSelected(null);
    setSubmitted(false);
    setCode(picked.starterCode ?? "");
    setOpponentProgress(0);
    setMyProgress(0);
    setResult(null);
    setPhase("battle");

    // Countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Simulate opponent progress
    const oppInterval = setInterval(() => {
      setOpponentProgress(p => {
        const next = p + Math.random() * 15;
        if (next >= 100) { clearInterval(oppInterval); return 100; }
        return next;
      });
    }, 800);
  }

  function handleTimeUp() {
    if (!submitted) submitAnswer(selected ?? "");
  }

  function submitAnswer(ans: string) {
    if (submitted || !challenge) return;
    clearInterval(timerRef.current!);
    setSubmitted(true);
    const correct = ans === challenge.answer;
    setMyProgress(correct ? 100 : 40);
    setTimeout(() => {
      const oppFinal = opponentProgress + Math.random() * 30;
      const myFinal = correct ? 100 : 40;
      setResult(myFinal > oppFinal ? "win" : myFinal === oppFinal ? "draw" : "lose");
      setPhase("result");
    }, 1200);
  }

  function findMatch() {
    setSearching(true);
    setTimeout(() => { setSearching(false); startBattle(); }, 2000);
  }

  const opponent = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-5xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent-light)" }}>
          <Swords size={13} />
          Battle Arena
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold" style={{ color: "var(--text)" }}>
          <span className="grad-text">Code. Fight. Win.</span>
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Challenge others in real-time coding battles, DSA duels & quiz wars.</p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── LOBBY ── */}
        {phase === "lobby" && (
          <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6">

            {/* Mode selection */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Battle Mode</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ModeCard mode="1v1" icon={Swords} title="1 vs 1 Duel" desc="Face off against one opponent. First to solve wins." players="2 players" onClick={() => setMode("1v1")} active={mode === "1v1"} />
                <ModeCard mode="group" icon={Users} title="Group Battle" desc="Compete in a group. Highest score takes the crown." players="2–8 players" onClick={() => setMode("group")} active={mode === "group"} />
                <ModeCard mode="tournament" icon={Trophy} title="Tournament" desc="Bracket-style elimination. Survive all rounds to win." players="8–16 players" onClick={() => setMode("tournament")} active={mode === "tournament"} />
              </div>
            </div>

            {/* Group size slider */}
            {mode === "group" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                className="glass rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>Group Size: <span style={{ color: "var(--accent-light)" }}>{groupSize} players</span></p>
                <input type="range" min={2} max={8} value={groupSize} onChange={e => setGroupSize(+e.target.value)}
                  className="w-full accent-violet-500 cursor-pointer" />
                <div className="flex justify-between text-[10px]" style={{ color: "var(--text-faint)" }}>
                  <span>2</span><span>4</span><span>6</span><span>8</span>
                </div>
              </motion.div>
            )}

            {/* Category */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Challenge Type</p>
              <div className="grid grid-cols-3 gap-3">
                {(["quiz", "dsa", "coding"] as Category[]).map(cat => {
                  const Icon = CAT_ICONS[cat];
                  const labels = { quiz: "Quiz Battle", dsa: "DSA Duel", coding: "Code War" };
                  const descs = { quiz: "MCQ speed rounds", dsa: "Algorithm challenges", coding: "Write real code" };
                  return (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className="glass card-shine rounded-2xl p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105"
                      style={{ border: category === cat ? "1px solid var(--accent)" : "1px solid var(--border)", boxShadow: category === cat ? "0 0 20px var(--accent-glow)" : undefined }}
                    >
                      <Icon size={22} style={{ color: category === cat ? "var(--accent-light)" : "var(--text-faint)" }} />
                      <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{labels[cat]}</p>
                      <p className="text-[10px] text-center" style={{ color: "var(--text-faint)" }}>{descs[cat]}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live rooms */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Live Rooms</p>
              <div className="flex flex-col gap-2">
                {MOCK_OPPONENTS.map((opp, i) => (
                  <motion.div key={opp.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opp.avatar}</span>
                      <div>
                        <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{opp.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Lv.{opp.level} · Rating {opp.rating}</p>
                        <div className="mt-1">
                          <RankBadge rank={opp.rank} size="sm" animated={false} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <button onClick={startBattle}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                        style={{ background: "var(--btn-grad)", color: "#fff" }}>
                        Challenge
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Find match button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={findMatch}
              disabled={searching}
              className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-3 transition-all"
              style={{ background: "var(--btn-grad)", boxShadow: "0 8px 32px var(--accent-glow)", opacity: searching ? 0.8 : 1 }}
            >
              {searching ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Zap size={18} /></motion.div>Finding Match...</>
              ) : (
                <><Play size={18} />Find Match — {mode.toUpperCase()}</>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* ── BATTLE ── */}
        {phase === "battle" && challenge && (
          <motion.div key="battle" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-5">

            {/* Battle header */}
            <div className="glass card-shine rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">😎</span>
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--text)" }}>You</p>
                  <div className="w-24 h-1.5 rounded-full overflow-hidden mt-1" style={{ background: "var(--border)" }}>
                    <motion.div className="h-full rounded-full bg-emerald-400" style={{ width: `${myProgress}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Timer seconds={timeLeft} total={challenge.timeLimit} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>VS</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{opponent.name}</p>
                  <div className="w-24 h-1.5 rounded-full overflow-hidden mt-1" style={{ background: "var(--border)" }}>
                    <motion.div className="h-full rounded-full bg-red-400" style={{ width: `${opponentProgress}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>
                <span className="text-3xl">{opponent.avatar}</span>
              </div>
            </div>

            {/* Challenge card */}
            <div className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {(() => { const Icon = CAT_ICONS[challenge.category]; return <Icon size={16} style={{ color: "var(--accent-light)" }} />; })()}
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent-light)" }}>{challenge.category}</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: DIFF_COLORS[challenge.difficulty] + "22", color: DIFF_COLORS[challenge.difficulty] }}>
                  {challenge.difficulty}
                </span>
              </div>
              <h2 className="text-lg font-extrabold" style={{ color: "var(--text)" }}>{challenge.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-muted)" }}>{challenge.description}</p>

              {/* Code editor for coding challenges */}
              {challenge.category === "coding" && (
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2 px-3 py-2" style={{ background: "var(--bg-subtle)" }}>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: "var(--text-faint)" }}>solution.js</span>
                  </div>
                  <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    rows={6}
                    className="w-full p-4 text-sm font-mono outline-none resize-none"
                    style={{ background: "var(--bg-subtle)", color: "var(--text)", caretColor: "var(--accent-light)" }}
                    disabled={submitted}
                  />
                </div>
              )}

              {/* MCQ options */}
              {challenge.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {challenge.options.map(opt => (
                    <motion.button key={opt} whileHover={{ scale: submitted ? 1 : 1.02 }} whileTap={{ scale: submitted ? 1 : 0.98 }}
                      onClick={() => !submitted && setSelected(opt)}
                      disabled={submitted}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200"
                      style={{
                        background: selected === opt ? "var(--accent-glow)" : "var(--surface)",
                        border: `1px solid ${selected === opt ? "var(--accent)" : "var(--border)"}`,
                        color: "var(--text)",
                      }}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Submit */}
              {!submitted && (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => submitAnswer(selected ?? code)}
                  disabled={!selected && !code.trim()}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ background: "var(--btn-grad)", boxShadow: "0 4px 20px var(--accent-glow)" }}
                >
                  <Zap size={15} /> Submit Answer
                </motion.button>
              )}

              {submitted && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 py-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Timer seconds={0} total={1} />
                  </motion.div>
                  <span className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>Waiting for result...</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {phase === "result" && result && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6">

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="glass card-shine rounded-3xl p-10 flex flex-col items-center gap-4 w-full max-w-md mx-auto text-center"
              style={{ border: `1px solid ${result === "win" ? "#34d399" : result === "lose" ? "#f87171" : "#fbbf24"}44` }}
            >
              <div className="text-7xl">
                {result === "win" ? "🏆" : result === "lose" ? "💀" : "🤝"}
              </div>
              <h2 className="text-3xl font-extrabold" style={{
                color: result === "win" ? "#34d399" : result === "lose" ? "#f87171" : "#fbbf24"
              }}>
                {result === "win" ? "Victory!" : result === "lose" ? "Defeated!" : "Draw!"}
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {result === "win"
                  ? "🎉 You crushed it! +75 XP earned."
                  : result === "lose"
                  ? "Keep practicing. You'll get them next time!"
                  : "Neck and neck! Both players earn +30 XP."}
              </p>

              {result === "win" && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(52,211,153,0.15)" }}>
                  <Flame size={14} style={{ color: "#34d399" }} />
                  <span className="text-sm font-bold" style={{ color: "#34d399" }}>+75 XP · Streak +1</span>
                </div>
              )}

              <div className="flex gap-3 w-full mt-2">
                <button onClick={() => setPhase("lobby")}
                  className="flex-1 py-3 rounded-xl text-sm font-bold glass transition-all hover:scale-105"
                  style={{ color: "var(--text-muted)" }}>
                  Back to Lobby
                </button>
                <button onClick={() => { setPhase("lobby"); setTimeout(findMatch, 100); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                  style={{ background: "var(--btn-grad)" }}>
                  Rematch ⚡
                </button>
              </div>
            </motion.div>

            {/* Challenge breakdown */}
            {challenge && (
              <div className="glass card-shine rounded-2xl p-5 w-full max-w-md mx-auto flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Challenge Breakdown</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Correct Answer</span>
                  <span className="text-sm font-bold px-2 py-0.5 rounded-lg" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>{challenge.answer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>Your Answer</span>
                  <div className="flex items-center gap-1">
                    {selected === challenge.answer
                      ? <CheckCircle size={14} style={{ color: "#34d399" }} />
                      : <XCircle size={14} style={{ color: "#f87171" }} />
                    }
                    <span className="text-sm font-bold" style={{ color: selected === challenge.answer ? "#34d399" : "#f87171" }}>
                      {selected ?? "No answer"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
