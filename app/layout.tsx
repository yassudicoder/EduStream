"use client";

import { createContext, useContext, useEffect, useState } from "react";
import "./globals.css";
import { Moon, Sun, Sparkles, Trophy, Swords, Home, Palette, LayoutDashboard, User, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export type ThemeName = "light" | "dark" | "hacker" | "cyberpunk" | "ocean" | "sunset" | "aurora" | "midnight" | "rose";

interface ThemeCtxType {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  mounted: boolean;
}

const ThemeCtx = createContext<ThemeCtxType>({ theme: "dark", setTheme: () => {}, mounted: false });
export const useTheme = () => useContext(ThemeCtx);

function applyTheme(t: ThemeName) {
  document.documentElement.setAttribute("data-theme", t);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("edu-theme") as ThemeName) || "dark";
    setThemeState(saved);
    applyTheme(saved);
    setMounted(true);
  }, []);

  function setTheme(t: ThemeName) {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem("edu-theme", t);
  }

  return (
    <ThemeCtx.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const THEME_OPTIONS: { id: ThemeName; label: string; emoji: string; preview: string }[] = [
  { id: "light",     label: "Light",     emoji: "☀️", preview: "#ffffff" },
  { id: "dark",      label: "Dark",      emoji: "🌑", preview: "#080810" },
  { id: "hacker",    label: "Hacker",    emoji: "💻", preview: "#000000" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "⚡", preview: "#0d0015" },
  { id: "ocean",     label: "Ocean",     emoji: "🌊", preview: "#020b18" },
  { id: "sunset",    label: "Sunset",    emoji: "🌅", preview: "#0f0500" },
  { id: "aurora",    label: "Aurora",    emoji: "🌌", preview: "#020810" },
  { id: "midnight",  label: "Midnight",  emoji: "🌙", preview: "#05050f" },
  { id: "rose",      label: "Rose",      emoji: "🌸", preview: "#0f0508" },
];

const ACCENT_COLORS: Record<ThemeName, string> = {
  light: "#6d28d9", dark: "#7c3aed", hacker: "#00ff41", cyberpunk: "#ff00ff",
  ocean: "#00b4ff", sunset: "#ff6b00", aurora: "#00ffb4", midnight: "#6666ff", rose: "#ff4d8d",
};

function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [showThemes, setShowThemes] = useState(false);

  // Read user from localStorage directly to avoid circular imports
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("edustream-game");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserName(parsed?.state?.user?.name ?? null);
      }
    } catch {}
  }, [pathname]);

  const NAV_LINKS = [
    { href: "/",            icon: Home,          label: "Home"        },
    { href: "/leaderboard", icon: Trophy,         label: "Leaderboard" },
    { href: "/arena",       icon: Swords,         label: "Arena"       },
    ...(userName ? [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" }] : []),
    { href: "/admin",       icon: Shield,         label: "Creator Hub" },
  ];

  function handleLogout() {
    try {
      const raw = localStorage.getItem("edustream-game");
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.state.user = null;
        localStorage.setItem("edustream-game", JSON.stringify(parsed));
      }
    } catch {}
    router.push("/login");
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Edu<span className="grad-text">Stream</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                color: pathname === href ? "var(--accent-light)" : "var(--text-muted)",
                background: pathname === href ? "var(--surface-hover)" : "transparent",
              }}
            >
              <Icon size={13} />{label}
            </Link>
          ))}
        </nav>

        {/* Right: theme + user */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme picker */}
          <div className="relative">
            <button onClick={() => setShowThemes(s => !s)}
              className="glass rounded-xl px-3 py-2 flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Palette size={13} style={{ color: "var(--accent-light)" }} />
              <span className="text-xs font-semibold hidden sm:block" style={{ color: "var(--text-muted)" }}>
                {THEME_OPTIONS.find(t => t.id === theme)?.emoji} Theme
              </span>
            </button>

            <AnimatePresence>
              {showThemes && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowThemes(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 glass rounded-2xl p-3 w-56 z-50"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: "var(--text-faint)" }}>Choose Theme</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {THEME_OPTIONS.map(opt => (
                        <button key={opt.id}
                          onClick={() => { setTheme(opt.id); setShowThemes(false); }}
                          className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl text-[10px] font-bold transition-all hover:scale-105"
                          style={{
                            background: theme === opt.id ? ACCENT_COLORS[opt.id] + "33" : "var(--surface-hover)",
                            border: `1px solid ${theme === opt.id ? ACCENT_COLORS[opt.id] : "transparent"}`,
                            color: "var(--text-muted)",
                          }}
                        >
                          <span className="text-lg">{opt.emoji}</span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Light/Dark quick toggle (only for light/dark themes) */}
          {(theme === "light" || theme === "dark") && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="glass rounded-xl p-2 transition-all hover:scale-105"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.18 }}
                >
                  {theme === "dark"
                    ? <Sun size={14} style={{ color: "#fbbf24" }} />
                    : <Moon size={14} style={{ color: "#818cf8" }} />
                  }
                </motion.div>
              </AnimatePresence>
            </button>
          )}

          {/* User avatar / login */}
          {userName ? (
            <div className="flex items-center gap-2">
              <Link href="/avatar" className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5 transition-all hover:scale-105">
                <User size={13} style={{ color: "var(--accent-light)" }} />
                <span className="text-xs font-semibold hidden sm:block" style={{ color: "var(--text-muted)" }}>{userName}</span>
              </Link>
              <button onClick={handleLogout} className="glass rounded-xl p-2 transition-all hover:scale-105">
                <LogOut size={13} style={{ color: "var(--text-faint)" }} />
              </button>
            </div>
          ) : (
            <Link href="/login"
              className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-all hover:scale-105"
              style={{ background: "var(--btn-grad)" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-center gap-1 mt-2 flex-wrap">
        {NAV_LINKS.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold glass transition-all"
            style={{ color: pathname === href ? "var(--accent-light)" : "var(--text-muted)" }}
          >
            <Icon size={12} />{label}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>EduStream — Learn. Compete. Level Up.</title>
        <meta name="description" content="ELI5 learning platform with gamification and live battles" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Apply theme before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('edu-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})()` }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {/* Animated mesh background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full blur-[140px]"
              style={{ background: "var(--blob1)" }}
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div className="absolute top-1/2 -right-48 w-[600px] h-[600px] rounded-full blur-[140px]"
              style={{ background: "var(--blob2)" }}
              animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div className="absolute -bottom-48 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px]"
              style={{ background: "var(--blob3)" }}
              animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
            <div className="absolute inset-0" style={{ background: "var(--overlay)" }} />
          </div>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
