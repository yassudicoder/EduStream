"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore, type Question, type Scope, type Difficulty, type QuestionType } from "@/app/lib/adminStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, Trash2, Globe, MapPin, Building2, GraduationCap, Code, Brain, Zap, Check, ToggleLeft, ToggleRight } from "lucide-react";

const SCOPES: { id: Scope; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "global",    label: "Global",    icon: <Globe size={14} />,         desc: "Open to everyone worldwide" },
  { id: "regional",  label: "Regional",  icon: <MapPin size={14} />,        desc: "Specific region or country" },
  { id: "company",   label: "Company",   icon: <Building2 size={14} />,     desc: "Internal company assessment" },
  { id: "classroom", label: "Classroom", icon: <GraduationCap size={14} />, desc: "School / university exam" },
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard", "Expert"];
const DIFF_COLORS: Record<Difficulty, string> = { Easy: "#34d399", Medium: "#fbbf24", Hard: "#f97316", Expert: "#f87171" };
const Q_TYPES: { id: QuestionType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "mcq",    label: "MCQ",    icon: <Zap size={14} />,   desc: "Multiple choice" },
  { id: "dsa",    label: "DSA",    icon: <Brain size={14} />, desc: "Algorithm problem" },
  { id: "coding", label: "Coding", icon: <Code size={14} />,  desc: "Write code" },
];

function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center justify-between w-full px-4 py-3 glass rounded-xl transition-all">
      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{label}</span>
      {value
        ? <ToggleRight size={22} style={{ color: "var(--accent-light)" }} />
        : <ToggleLeft size={22} style={{ color: "var(--text-faint)" }} />
      }
    </button>
  );
}

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
      testCases: form.type !== "mcq" ? [] : undefined,
    };
    onChange([...questions, q]);
    setAdding(false);
    setForm({ type: "mcq", difficulty: "Easy", points: 10, timeLimit: 60, tags: [], options: ["", "", "", ""], correctOption: 0 });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
          Questions ({questions.length}) · Total: {questions.reduce((a, q) => a + q.points, 0)} pts
        </p>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-white transition-all hover:scale-105"
          style={{ background: "var(--btn-grad)" }}>
          <Plus size={12} /> Add Question
        </button>
      </div>

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

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="glass card-shine rounded-2xl p-5 flex flex-col gap-4 overflow-hidden">
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>New Question</p>

            <div className="flex gap-2 flex-wrap">
              {Q_TYPES.map(qt => (
                <button key={qt.id} onClick={() => setForm(f => ({ ...f, type: qt.id }))}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: form.type === qt.id ? "var(--accent-glow)" : "var(--surface)",
                    border: `1px solid ${form.type === qt.id ? "var(--accent)" : "var(--border)"}`,
                    color: form.type === qt.id ? "var(--accent-light)" : "var(--text-muted)",
                  }}>
                  {qt.icon} {qt.label}
                  <span className="text-[9px] opacity-60">· {qt.desc}</span>
                </button>
              ))}
            </div>

            <input value={form.title ?? ""} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Question title" className="glass rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ color: "var(--text)" }} />

            <textarea value={form.description ?? ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Problem statement / question description..." rows={4}
              className="glass rounded-xl px-4 py-2.5 text-sm outline-none resize-none" style={{ color: "var(--text)" }} />

            {form.type === "mcq" && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold" style={{ color: "var(--text-faint)" }}>Answer Options (click ✓ to mark correct)</p>
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
                    }} placeholder={`Option ${i + 1}`}
                      className="glass rounded-xl px-3 py-2 text-xs outline-none flex-1" style={{ color: "var(--text)" }} />
                  </div>
                ))}
              </div>
            )}

            {form.type !== "mcq" && (
              <textarea value={form.starterCode ?? ""} onChange={e => setForm(f => ({ ...f, starterCode: e.target.value }))}
                placeholder="// Starter code (optional)" rows={3}
                className="rounded-xl px-4 py-2.5 text-xs outline-none resize-none font-mono"
                style={{ background: "var(--code-bg)", color: "#a6e3a1", border: "1px solid var(--border)" }} />
            )}

            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>Difficulty</p>
                <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Difficulty }))}
                  className="glass rounded-xl px-3 py-2 text-xs outline-none w-full" style={{ color: "var(--text)" }}>
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
                className="px-4 py-2.5 rounded-xl text-xs font-bold glass transition-all" style={{ color: "var(--text-muted)" }}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CreateTestPage() {
  const router = useRouter();
  const { createTest, creatorName, creatorEmail } = useAdminStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", scope: "classroom" as Scope,
    region: "", company: "", institution: "",
    maxParticipants: 100, duration: 60,
    startDate: "", endDate: "",
    questions: [] as Question[],
    passingScore: 60, showResults: true, allowRetake: false,
    tags: "", status: "draft" as const,
  });

  const STEPS = ["Basic Info", "Scope & Access", "Questions", "Settings & Launch"];
  const F = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  function handleCreate(status: "draft" | "open") {
    createTest({
      ...form,
      status,
      creatorName, creatorEmail,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    router.push("/admin");
  }

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-3xl mx-auto flex flex-col gap-8">

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={() => router.push("/admin")} className="glass rounded-xl p-2 transition-all hover:scale-105">
          <ChevronLeft size={18} style={{ color: "var(--text-muted)" }} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Create Test / Exam</h1>
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

        {/* Step 0 */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Test Details</p>
            <input value={form.title} onChange={e => F("title", e.target.value)}
              placeholder="e.g. CS101 Midterm Exam / React Developer Assessment"
              className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
            <textarea value={form.description} onChange={e => F("description", e.target.value)}
              placeholder="Describe the test, topics covered, eligibility..."
              rows={3} className="glass rounded-xl px-4 py-3 text-sm outline-none resize-none" style={{ color: "var(--text)" }} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>Duration (minutes)</p>
                <input type="number" value={form.duration} onChange={e => F("duration", +e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm outline-none w-full" style={{ color: "var(--text)" }} />
              </div>
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>Max Participants</p>
                <input type="number" value={form.maxParticipants} onChange={e => F("maxParticipants", +e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm outline-none w-full" style={{ color: "var(--text)" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>Start Date & Time</p>
                <input type="datetime-local" value={form.startDate} onChange={e => F("startDate", e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm outline-none w-full" style={{ color: "var(--text)" }} />
              </div>
              <div>
                <p className="text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>End Date & Time</p>
                <input type="datetime-local" value={form.endDate} onChange={e => F("endDate", e.target.value)}
                  className="glass rounded-xl px-4 py-3 text-sm outline-none w-full" style={{ color: "var(--text)" }} />
              </div>
            </div>
            <input value={form.tags} onChange={e => F("tags", e.target.value)}
              placeholder="Tags: e.g. cs101, midterm, javascript, hiring"
              className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
          </motion.div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Who can take this test?</p>
            <div className="grid grid-cols-2 gap-3">
              {SCOPES.map(s => (
                <button key={s.id} onClick={() => F("scope", s.id)}
                  className="flex flex-col gap-2 p-4 rounded-xl text-left transition-all hover:scale-105"
                  style={{
                    background: form.scope === s.id ? "var(--accent-glow)" : "var(--surface)",
                    border: `1px solid ${form.scope === s.id ? "var(--accent)" : "var(--border)"}`,
                  }}>
                  <span style={{ color: form.scope === s.id ? "var(--accent-light)" : "var(--text-faint)" }}>{s.icon}</span>
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{s.label}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{s.desc}</p>
                </button>
              ))}
            </div>
            {form.scope === "regional" && (
              <input value={form.region} onChange={e => F("region", e.target.value)}
                placeholder="Region / Country name" className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
            )}
            {form.scope === "company" && (
              <input value={form.company} onChange={e => F("company", e.target.value)}
                placeholder="Company name" className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
            )}
            {form.scope === "classroom" && (
              <input value={form.institution} onChange={e => F("institution", e.target.value)}
                placeholder="School / University name" className="glass rounded-xl px-4 py-3 text-sm outline-none" style={{ color: "var(--text)" }} />
            )}
          </motion.div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="glass card-shine rounded-2xl p-6">
            <QuestionBuilder questions={form.questions} onChange={q => F("questions", q)} />
          </motion.div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4">
            <div className="glass card-shine rounded-2xl p-6 flex flex-col gap-4">
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Test Settings</p>
              <div>
                <p className="text-[10px] mb-2" style={{ color: "var(--text-faint)" }}>Passing Score (%): {form.passingScore}%</p>
                <input type="range" min={0} max={100} value={form.passingScore} onChange={e => F("passingScore", +e.target.value)}
                  className="w-full accent-violet-500 cursor-pointer" />
                <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-faint)" }}>
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
              <Toggle value={form.showResults} onChange={v => F("showResults", v)} label="Show results to participants after submission" />
              <Toggle value={form.allowRetake} onChange={v => F("allowRetake", v)} label="Allow participants to retake the test" />
            </div>

            <div className="glass card-shine rounded-2xl p-6 flex flex-col gap-3">
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Summary</p>
              {[
                { label: "Title", value: form.title || "—" },
                { label: "Scope", value: form.scope },
                { label: "Duration", value: `${form.duration} minutes` },
                { label: "Questions", value: `${form.questions.length} questions` },
                { label: "Total Points", value: form.questions.reduce((a, q) => a + q.points, 0) },
                { label: "Passing Score", value: `${form.passingScore}%` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: "var(--border)" }}>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>{label}</span>
                  <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleCreate("draft")}
                className="flex-1 py-3 rounded-xl text-sm font-bold glass transition-all hover:scale-105"
                style={{ color: "var(--text-muted)" }}>
                Save as Draft
              </button>
              <button onClick={() => handleCreate("open")}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: "var(--btn-grad)", boxShadow: "0 4px 20px var(--accent-glow)" }}>
                🚀 Publish Test
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button onClick={() => step > 0 && setStep(s => s - 1)} disabled={step === 0}
          className="glass rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 disabled:opacity-30"
          style={{ color: "var(--text-muted)" }}>
          ← Back
        </button>
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.title.trim()}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-40"
            style={{ background: "var(--btn-grad)" }}>
            Next →
          </button>
        )}
      </div>
    </main>
  );
}
