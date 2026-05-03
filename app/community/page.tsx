"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/app/lib/communityStore";
import { useGameStore } from "@/app/lib/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Search, Globe, Lock, Trophy, MessageSquare, Zap, ChevronRight, X, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  const router = useRouter();
  const { communities, joinedCommunityIds, createCommunity, joinCommunity } = useCommunityStore();
  const { user, level, xp } = useGameStore();
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [tab, setTab] = useState<"all" | "joined">("all");
  const [form, setForm] = useState({ name: "", college: "", description: "", emoji: "🏛️", color: "#7c3aed", isPrivate: false, tags: "" });

  const filtered = communities.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.college.toLowerCase().includes(q) || c.tags.some(t => t.includes(q));
    const matchTab = tab === "all" || joinedCommunityIds.includes(c.id);
    return matchSearch && matchTab;
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.college.trim()) return;
    const id = createCommunity({
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    if (user) {
      joinCommunity(id, { name: user.name, avatar: "🧑💻", xp, level, role: "admin", joinedAt: Date.now() });
    }
    setShowCreate(false);
    setForm({ name: "", college: "", description: "", emoji: "🏛️", color: "#7c3aed", isPrivate: false, tags: "" });
    router.push(`/community/${id}`);
  }

  function handleJoin(communityId: string) {
    if (!user) { router.push("/login"); return; }
    joinCommunity(communityId, { name: user.name, avatar: "🧑💻", xp, level, role: "member", joinedAt: Date.now() });
    router.push(`/community/${communityId}`);
  }

  const EMOJIS = ["🏛️","⚡","🌲","🔥","🚀","💡","🎯","🏆","🌊","🌌","🎓","💻","🧠","⚙️","🦁"];
  const COLORS = ["#7c3aed","#3b82f6","#10b981","#f59e0b","#ef4444","#ec4899","#f97316","#06b6d4","#00ff41"];

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-5xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={20} style={{ color: "var(--accent-light)" }} />
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>Student Communities</h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Join your college community. Discuss, compete, and grow together.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 shrink-0"
          style={{ background: "var(--btn-grad)", boxShadow: "0 4px 20px var(--accent-glow)" }}>
          <Plus size={15} /> Create Community
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3">
        {[
          { icon: <Users size={16} />, label: "Communities", value: communities.length, color: "#a78bfa" },
          { icon: <Trophy size={16} />, label: "Joined", value: joinedCommunityIds.length, color: "#fbbf24" },
          { icon: <MessageSquare size={16} />, label: "Total Posts", value: communities.reduce((a, c) => a + c.posts.length, 0), color: "#34d399" },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="glass card-shine rounded-2xl p-4 flex flex-col gap-2">
            <span style={{ color }}>{icon}</span>
            <p className="text-xl font-extrabold" style={{ color: "var(--text)" }}>{value}</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="glass rounded-xl flex items-center gap-2 px-4 py-2.5 flex-1">
          <Search size={14} style={{ color: "var(--text-faint)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by college, name, or topic..."
            className="bg-transparent outline-none text-sm flex-1" style={{ color: "var(--text)" }} />
        </div>
        <div className="glass rounded-xl p-1 flex gap-1">
          {(["all", "joined"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="relative px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all"
              style={{ color: tab === t ? "#fff" : "var(--text-muted)" }}>
              {tab === t && <motion.div layoutId="commTab" className="absolute inset-0 rounded-lg" style={{ background: "var(--btn-grad)" }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative z-10">{t === "all" ? "🌍 All" : "✅ Joined"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Community cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c, i) => {
          const isJoined = joinedCommunityIds.includes(c.id);
          return (
            <motion.div key={c.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass card-shine rounded-2xl p-5 flex flex-col gap-4"
              style={{ border: `1px solid ${c.color}22` }}>

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: c.color + "22", border: `1px solid ${c.color}44` }}>
                    {c.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold text-sm truncate" style={{ color: "var(--text)" }}>{c.name}</p>
                      {c.isPrivate && <Lock size={11} style={{ color: "var(--text-faint)" }} />}
                    </div>
                    <p className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>{c.college}</p>
                  </div>
                </div>
                {isJoined && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>Joined</span>
                )}
              </div>

              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>{c.description}</p>

              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-faint)" }}>
                <span className="flex items-center gap-1"><Users size={11} /> {c.memberCount}</span>
                <span className="flex items-center gap-1"><MessageSquare size={11} /> {c.posts.length} posts</span>
                <span className="flex items-center gap-1"><Globe size={11} /> {c.isPrivate ? "Private" : "Public"}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {c.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: c.color + "22", color: c.color }}>#{tag}</span>
                ))}
              </div>

              <div className="flex gap-2">
                {isJoined ? (
                  <Link href={`/community/${c.id}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                      style={{ background: c.color }}>
                      Open Community <ChevronRight size={13} />
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link href={`/community/${c.id}`} className="flex-1">
                      <button className="w-full py-2.5 rounded-xl text-xs font-bold glass transition-all hover:scale-105"
                        style={{ color: "var(--text-muted)" }}>
                        Preview
                      </button>
                    </Link>
                    <button onClick={() => handleJoin(c.id)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                      style={{ background: c.color }}>
                      + Join
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <p className="text-4xl mb-3">🏫</p>
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>
              {tab === "joined" ? "You haven't joined any communities yet." : "No communities found."}
            </p>
            <button onClick={() => setShowCreate(true)}
              className="mt-4 text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:scale-105"
              style={{ background: "var(--btn-grad)" }}>
              Create the first one!
            </button>
          </div>
        )}
      </div>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="glass card-shine rounded-3xl p-6 w-full max-w-md flex flex-col gap-5 pointer-events-auto"
                style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>

                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold" style={{ color: "var(--text)" }}>Create Community</h2>
                  <button onClick={() => setShowCreate(false)} className="glass rounded-xl p-2 transition-all hover:scale-105">
                    <X size={14} style={{ color: "var(--text-muted)" }} />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                  {/* Emoji + Color */}
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Icon</label>
                      <div className="flex flex-wrap gap-1.5 w-40">
                        {EMOJIS.map(e => (
                          <button key={e} type="button" onClick={() => setForm(f => ({ ...f, emoji: e }))}
                            className="w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: form.emoji === e ? "var(--accent-glow)" : "var(--surface)", border: `1px solid ${form.emoji === e ? "var(--accent)" : "var(--border)"}` }}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Color</label>
                      <div className="flex flex-wrap gap-1.5">
                        {COLORS.map(c => (
                          <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                            className="w-7 h-7 rounded-lg transition-all hover:scale-110"
                            style={{ background: c, border: form.color === c ? "2px solid white" : "2px solid transparent" }} />
                        ))}
                      </div>
                      {/* Preview */}
                      <div className="mt-2 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: form.color + "22", border: `1px solid ${form.color}44` }}>
                        {form.emoji}
                      </div>
                    </div>
                  </div>

                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Community name *" required
                    className="glass rounded-xl px-4 py-2.5 text-sm outline-none" style={{ color: "var(--text)" }} />

                  <input value={form.college} onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                    placeholder="College / University name *" required
                    className="glass rounded-xl px-4 py-2.5 text-sm outline-none" style={{ color: "var(--text)" }} />

                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="What is this community about?" rows={2}
                    className="glass rounded-xl px-4 py-2.5 text-sm outline-none resize-none" style={{ color: "var(--text)" }} />

                  <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="Tags: e.g. algorithms, web-dev, competitive"
                    className="glass rounded-xl px-4 py-2.5 text-sm outline-none" style={{ color: "var(--text)" }} />

                  <button type="button" onClick={() => setForm(f => ({ ...f, isPrivate: !f.isPrivate }))}
                    className="flex items-center justify-between px-4 py-3 glass rounded-xl transition-all">
                    <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                      {form.isPrivate ? "🔒 Private Community" : "🌍 Public Community"}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                      {form.isPrivate ? "Invite only" : "Anyone can join"}
                    </span>
                  </button>

                  <button type="submit"
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                    style={{ background: "var(--btn-grad)", boxShadow: "0 4px 20px var(--accent-glow)" }}>
                    🚀 Create Community
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
