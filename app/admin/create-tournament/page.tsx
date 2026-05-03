"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore, type Question, type BracketType, type Scope, type Difficulty, type QuestionType } from "@/app/lib/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Trash2, Trophy, Globe, MapPin, Building2, GraduationCap, Code, Brain, Zap, Check } from "lucide-react";

const BRACKET_TYPES: { id: BracketType; label: string; desc: string; emoji: string }[] = [
  { id: "single-elimination", label: "Single Elimination", desc: "Lose once and you're out", emoji: "⚔️" },
  { id: "double-elimination", label: "Double Elimination", desc: "Two losses to be eliminated", emoji: "🛡️" },
  { id: "round-robin", label: "Round Robin", desc: "Everyone plays everyone", emoji: "🔄" },
  { id: "swiss", label: "Swiss System", desc: "Paired by similar scores", emoji: "🇨🇭" },
];

const SCOPES: { id: Scope; label: string; icon: React.ReactNode }[] = [
  { id: "global", label: "Global", icon: <Globe size={14} /> },
  { id: "regional", label: "Regional", icon: <MapPin size={14} /> },
  { id: "company", label: "Company", icon: <Building2 size={14} /> },
  { id: "classroom", label: "Classroom", icon: <GraduationCap size={14} /> },
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard", "Expert"];
const DIFF_COLORS: Record<Difficulty, string> = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#f97316", Expert: "#f87171" };
const Q_TYPES: { id: QuestionType; label: string; icon: React.ReactNode }[] = [
  { id: "mcq", label: "MCQ", icon: <Zap size={14} /> },
  { id: "dsa", label: "DSA", icon: <Brain size={14} /> },
  { id: "coding", label: "Coding", icon: <Code size={14} /> },
];

function QuestionBuilder({ questions, onChange }: { questions: Question[]; onChange: (q: Question[]) => void }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<Question>>({
    type: "mcq", difficulty: "Easy", points: 10, timeLimit: 60, tags: [], options: ["", "", "", ""], correctOption: 0,
  });

  function addQuestion() {
    if (!form.title || !form.description) return;
    const q: Question = {
      id: `q_${Date.now()}`,
      type: form.type ?? "mcq",
      title: form.title ?? "",
      description: form.description ?? "",
      difficulty: form.difficulty ?? "Easy",
      points: form.points ?? 10,
      timeLimit: form.timeLimit ?? 60,
      tags: form.tags ?? [],
      options: form.type === "mcq" ? form.options : undefined,
      correctOption: form.type === "mcq" ? form.correctOption : undefined,
      starterCode: form.type !== "mcq" ? form.starterCode : undefined,
      testCases: form.type !== "mcq" ? (form.testCases ?? []) : undefined,
    };
    onChange([...questions, q]);
    setAdding(false);
    setForm({ type: "mcq", difficulty: "Easy", points: 10, timeLimit: 60, tags: [], options: ["", "", "", ""], correctOption: 0 });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          Questions ({questions.length})
        </p>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-white transition-all hover:scale-105"
          style={{ background: "var(--btn-grad)" }}>
          <Plus size={12} /> Add Question
        </button>
      </div>

      {/* Existing questions */}
      {questions.map((q, i) => (
        <div key={q.id} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: DIFF_COLORS[q.difficulty] + "22", color: DIFF_COLORS[q.difficulty] }}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{q.title}</p>
            <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>
              {q.type.toUpperCase()} · {q.difficulty} · {q.points} pts · {q.timeLimit}s
            </p>
          </div>
          <button onClick={() => onChange(questions.filter((_, idx) => idx !== i))}>
            <Trash2 size={13} style={{ color: "#f87171" }} />
          </button>
        </div>
      ))}

      {/* Add question form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="glass card-shine rounded-2xl p-5 flex flex-col gap-4 overflow-hidden">
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>New Question</p>

            {/* Type */}
            <div className="flex gap-2">
              {Q_TYPES.map(qt => (
                <button key={qt.id} onClick={() => setForm(f => ({ ...f, type: qt.id }))}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: form.type === qt.id ? "var(--accent-glow)" : "var(--surface)",
                    border: `1px solid ${form.type === qt.id ? "var(--accent)" : "var(--border)"}`,
                    color: form.type === qt.id ? "var(--accent-light)" : "var(--text-muted)",
                  }}>
                  {qt.icon} {qt.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <input value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Question title"
              className="glass rounded-xl px-4 py-2.5 text-sm outline-none w-full"
              style={{ color: "var(--text)" }} />

            {/* Description */}
            <textarea value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Full question description / problem statement..."
              rows={3} className="glass rounded-xl px-4 py-2.5 text-sm outline-none w-full resize-none"
              style={{ color: "var(--text)" }} />

            {/* MCQ options */}
            {form.type === "mcq" && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold" style={{ color: "var(--text-faint)" }}>Options (click to mark correct)</p>
                {(form.options ?? ["", "", "", ""]).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <button onClick={() => setForm(f => ({ ...f, correctOption: i }))}
                      className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                      style={{ borderColor: form.correctOption === i ? "#34d399" : "var(--border)", background: form.correctOption === i ? "#34d39922" : "transparent" }}>
                      {form.correctOption === i && <Check size={12} style={{ color: "#34d399" }} />}
                    </button>
                    <input value={opt} onChange={e => {
                      const opts = [...(form.options ?? ["", "", "", ""])];
                      opts[i] = e.target.value;
                      setForm(f => ({ ...f, options: opts }));
                    }}
                      placeholder={`Option ${i + 1}`}
                      className="glass rounded-xl px-3 py-2 text-xs outline-none flex-1"
                      style={{ color: "var(--text)" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Coding starter code */}
            {form.type !== "mcq" && (
              <textarea value={form.starterCode ?? ""} onChange={e => setForm(f => ({ ...f, starterCode: e.target.value }))}
                placeholder="Starter code (optional)..."
                rows={3} className="rounded-xl px-4 py-2.5 text-xs outline-none w-full resize-none font-mono"
                style={{ background: "var(--code-bg)", color: "#a6e3a1", border: "1px solid var(--border)" }} />
            )}

            {/* Difficulty + Points + Time */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>Difficulty</p>
                <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Difficulty }))}
                  className="glass rounded-xl px-3 py-2 text-xs outline-none w-full"
                  style={{ color: "var(--text)" }}>
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>Points</p>
                <input type="number" value={form.points} onChange={e => setForm(f => ({ ...f, points: +e.target.value }))}
                  className="glass rounded-xl px-3 py-2 text-xs outline-none w-full" style={{ color: "var(--text)" }} />
              </div>
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>Time (sec)</p>
                <input type="number" value={form.timeLimit} onChange={e => setForm(f => ({ ...f, timeLimit: +e.target.value }))}
                  className="glass rounded-xl px-3 py-2 text-xs outline-none w-full" style={{ color: "var(--text)" }} />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={addQuestion}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                style={{ background: "var(--btn-grad)" }}>
                Add Question
              </button>
              <button onClick={() => setAdding(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold glass transition-all"
                style={{ color: "var(--text-muted)" }}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CreateTournamentPage() {
  const router = useRouter();
  const { createTournament, creatorName, creatorEmail } = useAdminStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", bracketType: "single-elimination" as BracketType,
    scope: "global" as Scope, region: "", company: "",
    maxParticipants: 64, prizePool: "", startDate: "", endDate: "",
    questions: [] as Question[], tags: "", status: "draft" as const,
  });

  const STEPS = ["Basic Info", "Format & Scope", "Questions", "Review & Launch"];

  function handleCreate() {
    const id = createTournament({
      ...form,
      creatorName, creatorEmail,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    router.push("/admin");
  }

  const F = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-3xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={() => router.push("/admin")} className="glass rounded-xl p-2 transition-all hover:scale-105">
          <ChevronLeft size={18} style={{ color: "var(--text-muted)" }} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Create Tournament</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </div>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <button onClick={() => i < step && setStep(i)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: i <= step ? "var(--btn-grad)" : "var(--surface)",
                color: i <= step ? "#fff" : "var(--text-faint)",
                border: `1px solid ${i <= step ? "var(--accent)" : "var(--border)"}`,
              }}>
              {i < step ? <Check size={14} /> : i + 1}
            </button>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px" style={{ background: i < step ? "var(--accent)" : "var(--border)" }} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* Step 0: Basic Info */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Tournament Details</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Title *</label>
              <input value={form.title} onChange={e => F("title", e.target.value)}
                placeholder="e.g. Global DSA Championship 2025"
                className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Description *</label>
              <textarea value={form.description} onChange={e => F("description", e.target.value)}
                placeholder="Describe the tournament, rules, eligibility..."
                rows={4} className="glass rounded-xl px-4 py-3 text-sm outline-none resize-none" style={{ color: "var(--text)" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Prize Pool</label>
                <input value={form.prizePool} onChange={e => F("prizePool", e.target.value)}
                  placeholder="e.g. $5,000 or Job Interview"
                  className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Max Participants</label>
                <input type="number" value={form.maxParticipants} onChange={e => F("maxParticipants", +e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Start Date</label>
                <input type="date" value={form.startDate} onChange={e => F("startDate", e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>End Date</label>
                <input type="date" value={form.endDate} onChange={e => F("endDate", e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => F("tags", e.target.value)}
                placeholder="e.g. dsa, algorithms, global, hiring"
                className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
            </div>
          </motion.div>
        )}

        {/* Step 1: Format & Scope */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-5">
            <div className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Bracket Format</p>
              <div className="grid grid-cols-2 gap-3">
                {BRACKET_TYPES.map(bt => (
                  <button key={bt.id} onClick={() => F("bracketType", bt.id)}
                    className="flex flex-col gap-2 p-4 rounded-xl text-left transition-all hover:scale-105"
                    style={{
                      background: form.bracketType === bt.id ? "var(--accent-glow)" : "var(--surface)",
                      border: `1px solid ${form.bracketType === bt.id ? "var(--accent)" : "var(--border)"}`,
                    }}>
                    <span className="text-2xl">{bt.emoji}</span>
                    <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{bt.label}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{bt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Scope & Reach</p>
              <div className="grid grid-cols-2 gap-2">
                {SCOPES.map(s => (
                  <button key={s.id} onClick={() => F("scope", s.id)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: form.scope === s.id ? "var(--accent-glow)" : "var(--surface)",
                      border: `1px solid ${form.scope === s.id ? "var(--accent)" : "var(--border)"}`,
                      color: form.scope === s.id ? "var(--accent-light)" : "var(--text-muted)",
                    }}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
              {form.scope === "regional" && (
                <input value={form.region} onChange={e => F("region", e.target.value)}
                  placeholder="Region name (e.g. South Asia, Europe)"
                  className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
              )}
              {form.scope === "company" && (
                <input value={form.company} onChange={e => F("company", e.target.value)}
                  placeholder="Company name"
                  className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Questions */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="glass card-shine rounded-2xl p-6">
            <QuestionBuilder questions={form.questions} onChange={q => F("questions", q)} />
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="glass card-shine rounded-2xl p-6 flex flex-col gap-5">
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Review & Launch</p>
            {[
              { label: "Title", value: form.title || "—" },
              { label: "Bracket", value: form.bracketType },
              { label: "Scope", value: form.scope + (form.region ? ` · ${form.region}` : "") + (form.company ? ` · ${form.company}` : "") },
              { label: "Participants", value: `Max ${form.maxParticipants}` },
              { label: "Prize Pool", value: form.prizePool || "—" },
              { label: "Dates", value: `${form.startDate || "—"} → ${form.endDate || "—"}` },
              { label: "Questions", value: `${form.questions.length} questions` },
              { label: "Total Points", value: form.questions.reduce((a, q) => a + q.points, 0) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--border)" }}>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>{label}</span>
                <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{value}</span>
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <button onClick={() => { F("status", "draft"); handleCreate(); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold glass transition-all hover:scale-105"
                style={{ color: "var(--text-muted)" }}>
                Save as Draft
              </button>
              <button onClick={() => { F("status", "open"); handleCreate(); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: "var(--btn-grad)", boxShadow: "0 4px 20px var(--accent-glow)" }}>
                🚀 Launch Tournament
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => step > 0 && setStep(s => s - 1)} disabled={step === 0}
          className="glass rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 disabled:opacity-30"
          style={{ color: "var(--text-muted)" }}>
          ← Back
        </button>
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep(s => s + 1)}
            disabled={step === 0 && !form.title.trim()}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-40"
            style={{ background: "var(--btn-grad)" }}>
            Next →
          </button>
        )}
      </div>
    </main>
  );
}
