"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore, type CustomTheme, type CustomAvatar } from "@/app/lib/gameStore";
import { useTheme } from "@/app/layout";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, User, Save, Eye, RotateCcw, Sparkles, Check, ChevronLeft } from "lucide-react";

const PRESET_EMOJIS = ["🧑💻","🥷","🧙","👑","🚀","🐉","🤖","🦊","🐺","🦁","🐯","🦅","🐉","👾","🤠","🧛","🧜","🧝","🦸","🦹","🎭","🎮","⚡","🔥","❄️","🌊","🌌","🌸","💎","🏆"];
const PRESET_ACCESSORIES = ["none","🎩","👓","🎧","👑","🎯","⚔️","🛡️","🌟","💫","🔮","🎪"];
const PRESET_COLORS = ["#7c3aed","#3b82f6","#10b981","#f59e0b","#ef4444","#ec4899","#06b6d4","#8b5cf6","#f97316","#84cc16","#00ff41","#ff00ff","#ffffff","#000000"];

const AVATAR_SHAPES = [
  { id: "circle" as const, label: "Circle", preview: "rounded-full" },
  { id: "rounded" as const, label: "Rounded", preview: "rounded-2xl" },
  { id: "hexagon" as const, label: "Hex", preview: "rounded-lg" },
];

function ColorSwatch({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-8 h-8 rounded-lg transition-all hover:scale-110 flex items-center justify-center"
      style={{ background: color, border: selected ? "2px solid white" : "2px solid transparent", boxShadow: selected ? `0 0 12px ${color}` : "none" }}>
      {selected && <Check size={12} className="text-white drop-shadow" />}
    </button>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0.5"
          style={{ background: "var(--surface)" }} />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="glass rounded-xl px-3 py-2 text-xs font-mono outline-none flex-1"
          style={{ color: "var(--text)" }} />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {PRESET_COLORS.map(c => (
          <ColorSwatch key={c} color={c} selected={value === c} onClick={() => onChange(c)} />
        ))}
      </div>
    </div>
  );
}

function AvatarPreview({ avatar, size = 80 }: { avatar: CustomAvatar; size?: number }) {
  const shapeClass = avatar.shape === "circle" ? "rounded-full" : avatar.shape === "rounded" ? "rounded-2xl" : "rounded-lg";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={`${shapeClass} flex items-center justify-center`}
        style={{
          width: size, height: size,
          background: avatar.bgColor,
          border: `3px solid ${avatar.borderColor}`,
          boxShadow: `0 0 ${size * 0.3}px ${avatar.borderColor}55`,
          fontSize: size * 0.45,
        }}>
        {avatar.emoji}
      </motion.div>
      {avatar.accessory !== "none" && (
        <span className="absolute -top-2 -right-2 text-lg">{avatar.accessory}</span>
      )}
    </div>
  );
}

function ThemePreview({ theme }: { theme: CustomTheme }) {
  return (
    <div className="rounded-2xl overflow-hidden border" style={{ background: theme.bg, borderColor: theme.accent + "44" }}>
      {/* Fake navbar */}
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: theme.surface, borderBottom: `1px solid ${theme.accent}22` }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md" style={{ background: `linear-gradient(135deg, ${theme.grad1}, ${theme.grad2})` }} />
          <span className="text-xs font-bold" style={{ color: theme.text }}>EduStream</span>
        </div>
        <div className="flex gap-1">
          {["Home","Arena","Hub"].map(l => (
            <span key={l} className="text-[9px] px-2 py-0.5 rounded-lg" style={{ color: theme.text + "88", background: theme.surface }}>{l}</span>
          ))}
        </div>
      </div>
      {/* Fake content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="rounded-xl p-3" style={{ background: theme.surface, border: `1px solid ${theme.accent}22` }}>
          <div className="h-2 w-24 rounded-full mb-2" style={{ background: `linear-gradient(135deg, ${theme.grad1}, ${theme.grad2})` }} />
          <div className="h-1.5 w-full rounded-full mb-1" style={{ background: theme.text + "22" }} />
          <div className="h-1.5 w-3/4 rounded-full" style={{ background: theme.text + "22" }} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl p-2.5 flex items-center gap-2" style={{ background: theme.surface, border: `1px solid ${theme.accent}22` }}>
            <div className="w-6 h-6 rounded-lg" style={{ background: theme.accent + "33" }} />
            <div className="h-1.5 flex-1 rounded-full" style={{ background: theme.text + "22" }} />
          </div>
          <div className="px-3 py-2 rounded-xl text-[9px] font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${theme.grad1}, ${theme.grad2})` }}>
            Action
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioPage() {
  const router = useRouter();
  const { user, customTheme, customAvatar, saveCustomTheme, saveCustomAvatar } = useGameStore();
  const { setTheme } = useTheme();
  const [tab, setTab] = useState<"theme" | "avatar">("theme");
  const [saved, setSaved] = useState(false);

  const [theme, setThemeState] = useState<CustomTheme>(customTheme ?? {
    name: "My Theme",
    bg: "#0a0a14",
    accent: "#7c3aed",
    text: "#f0f0ff",
    surface: "rgba(255,255,255,0.07)",
    grad1: "#a78bfa",
    grad2: "#60a5fa",
  });

  const [avatar, setAvatarState] = useState<CustomAvatar>(customAvatar ?? {
    emoji: "🧑💻",
    bgColor: "#7c3aed",
    borderColor: "#a78bfa",
    accessory: "none",
    shape: "circle",
  });

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  function handleSaveTheme() {
    saveCustomTheme(theme);
    // Apply custom theme via CSS vars
    const el = document.documentElement;
    el.setAttribute("data-theme", "dark"); // base
    el.style.setProperty("--bg", theme.bg);
    el.style.setProperty("--accent", theme.accent);
    el.style.setProperty("--accent-light", theme.accent);
    el.style.setProperty("--text", theme.text);
    el.style.setProperty("--surface", theme.surface);
    el.style.setProperty("--grad", `linear-gradient(135deg, ${theme.grad1}, ${theme.grad2})`);
    el.style.setProperty("--btn-grad", `linear-gradient(135deg, ${theme.grad1}, ${theme.grad2})`);
    el.style.setProperty("--accent-glow", theme.accent + "44");
    el.style.setProperty("--blob1", theme.grad1 + "33");
    el.style.setProperty("--blob2", theme.grad2 + "22");
    el.style.setProperty("--blob3", theme.accent + "18");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleSaveAvatar() {
    saveCustomAvatar(avatar);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setThemeState({ name: "My Theme", bg: "#0a0a14", accent: "#7c3aed", text: "#f0f0ff", surface: "rgba(255,255,255,0.07)", grad1: "#a78bfa", grad2: "#60a5fa" });
  }

  const TABS = [
    { id: "theme" as const, icon: Palette, label: "Theme Designer" },
    { id: "avatar" as const, icon: User, label: "Avatar Designer" },
  ];

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-6xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="glass rounded-xl p-2 transition-all hover:scale-105">
            <ChevronLeft size={18} style={{ color: "var(--text-muted)" }} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
              🎨 Creative Studio
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Design your own theme and avatar</p>
          </div>
        </div>
        <AnimatePresence>
          {saved && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: "rgba(52,211,153,0.2)", color: "#34d399", border: "1px solid #34d39944" }}>
              <Check size={14} /> Saved!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tabs */}
      <div className="glass rounded-2xl p-1 flex gap-1 self-start">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ color: tab === id ? "#fff" : "var(--text-muted)" }}>
            {tab === id && (
              <motion.div layoutId="studioTab" className="absolute inset-0 rounded-xl"
                style={{ background: "var(--btn-grad)" }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10 flex items-center gap-2"><Icon size={14} />{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── THEME DESIGNER ── */}
        {tab === "theme" && (
          <motion.div key="theme" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Controls */}
            <div className="flex flex-col gap-5">
              {/* Theme name */}
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-4">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Theme Identity</p>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Theme Name</label>
                  <input value={theme.name} onChange={e => setThemeState(t => ({ ...t, name: e.target.value }))}
                    placeholder="e.g. Midnight Violet"
                    className="glass rounded-xl px-4 py-2.5 text-sm outline-none" style={{ color: "var(--text)" }} />
                </div>
              </div>

              {/* Colors */}
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-5">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Colors</p>
                <ColorInput label="Background" value={theme.bg} onChange={v => setThemeState(t => ({ ...t, bg: v }))} />
                <ColorInput label="Accent / Primary" value={theme.accent} onChange={v => setThemeState(t => ({ ...t, accent: v }))} />
                <ColorInput label="Text Color" value={theme.text} onChange={v => setThemeState(t => ({ ...t, text: v }))} />
              </div>

              {/* Gradient */}
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-5">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Gradient</p>
                <div className="h-10 rounded-xl" style={{ background: `linear-gradient(135deg, ${theme.grad1}, ${theme.grad2})` }} />
                <ColorInput label="Gradient Start" value={theme.grad1} onChange={v => setThemeState(t => ({ ...t, grad1: v }))} />
                <ColorInput label="Gradient End" value={theme.grad2} onChange={v => setThemeState(t => ({ ...t, grad2: v }))} />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold glass transition-all hover:scale-105"
                  style={{ color: "var(--text-muted)" }}>
                  <RotateCcw size={13} /> Reset
                </button>
                <button onClick={handleSaveTheme}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                  style={{ background: "var(--btn-grad)", boxShadow: "0 4px 20px var(--accent-glow)" }}>
                  <Save size={14} /> Save & Apply Theme
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Eye size={14} style={{ color: "var(--accent-light)" }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Live Preview</p>
              </div>
              <motion.div animate={{ scale: [1, 1.002, 1] }} transition={{ duration: 3, repeat: Infinity }}>
                <ThemePreview theme={theme} />
              </motion.div>

              {/* Saved themes */}
              {customTheme && (
                <div className="glass card-shine rounded-2xl p-4 flex flex-col gap-3">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Your Saved Theme</p>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-16 rounded-lg" style={{ background: `linear-gradient(135deg, ${customTheme.grad1}, ${customTheme.grad2})` }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{customTheme.name}</p>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{customTheme.accent}</p>
                    </div>
                    <button onClick={() => setThemeState(customTheme)}
                      className="ml-auto text-xs font-bold px-3 py-1.5 rounded-xl glass transition-all hover:scale-105"
                      style={{ color: "var(--accent-light)" }}>
                      Load
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── AVATAR DESIGNER ── */}
        {tab === "avatar" && (
          <motion.div key="avatar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Controls */}
            <div className="flex flex-col gap-5">

              {/* Emoji picker */}
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Choose Emoji</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_EMOJIS.map(e => (
                    <button key={e} onClick={() => setAvatarState(a => ({ ...a, emoji: e }))}
                      className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: avatar.emoji === e ? "var(--accent-glow)" : "var(--surface)",
                        border: `1px solid ${avatar.emoji === e ? "var(--accent)" : "var(--border)"}`,
                      }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape */}
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Avatar Shape</p>
                <div className="flex gap-3">
                  {AVATAR_SHAPES.map(s => (
                    <button key={s.id} onClick={() => setAvatarState(a => ({ ...a, shape: s.id }))}
                      className="flex flex-col items-center gap-2 flex-1 py-3 transition-all hover:scale-105"
                      style={{
                        background: avatar.shape === s.id ? "var(--accent-glow)" : "var(--surface)",
                        border: `1px solid ${avatar.shape === s.id ? "var(--accent)" : "var(--border)"}`,
                        borderRadius: 12,
                      }}>
                      <div className={`w-8 h-8 ${s.preview}`} style={{ background: "var(--btn-grad)" }} />
                      <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-4">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Colors</p>
                <ColorInput label="Background Color" value={avatar.bgColor} onChange={v => setAvatarState(a => ({ ...a, bgColor: v }))} />
                <ColorInput label="Border / Glow Color" value={avatar.borderColor} onChange={v => setAvatarState(a => ({ ...a, borderColor: v }))} />
              </div>

              {/* Accessory */}
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Accessory</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_ACCESSORIES.map(acc => (
                    <button key={acc} onClick={() => setAvatarState(a => ({ ...a, accessory: acc }))}
                      className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: avatar.accessory === acc ? "var(--accent-glow)" : "var(--surface)",
                        border: `1px solid ${avatar.accessory === acc ? "var(--accent)" : "var(--border)"}`,
                      }}>
                      {acc === "none" ? "✕" : acc}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleSaveAvatar}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: "var(--btn-grad)", boxShadow: "0 4px 20px var(--accent-glow)" }}>
                <Save size={14} /> Save Avatar
              </button>
            </div>

            {/* Live Preview */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Eye size={14} style={{ color: "var(--accent-light)" }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Live Preview</p>
              </div>

              {/* Large preview */}
              <div className="glass card-shine rounded-2xl p-8 flex flex-col items-center gap-5">
                <AvatarPreview avatar={avatar} size={120} />
                <div className="text-center">
                  <p className="font-extrabold text-lg" style={{ color: "var(--text)" }}>{user.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Custom Avatar</p>
                </div>
              </div>

              {/* Size previews */}
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Size Previews</p>
                <div className="flex items-end gap-4">
                  {[80, 56, 40, 28].map(size => (
                    <div key={size} className="flex flex-col items-center gap-1">
                      <AvatarPreview avatar={avatar} size={size} />
                      <span className="text-[9px]" style={{ color: "var(--text-faint)" }}>{size}px</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navbar preview */}
              <div className="glass card-shine rounded-2xl p-4 flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-faint)" }}>In Navbar</p>
                <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 self-start">
                  <AvatarPreview avatar={avatar} size={24} />
                  <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{user.name}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
