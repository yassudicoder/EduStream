"use client";

import { createContext, useContext, useEffect, useState } from "react";
import "./globals.css";
import { Moon, Sun, Sparkles, Trophy, Swords, Home, Palette, LayoutDashboard, User, LogOut, Shield, Users, Wand2, Settings, Bell, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ToastProvider } from "./components/ToastSystem";
import { LanguageProvider, useLanguage } from "./lib/useLanguage";
import { LANGUAGES } from "./lib/languages";

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
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

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
    { href: "/",            icon: Home,          label: t("nav.home")        },
    { href: "/leaderboard", icon: Trophy,         label: t("nav.leaderboard") },
    { href: "/arena",       icon: Swords,         label: t("nav.arena")       },
    { href: "/community",   icon: Users,          label: t("nav.community")   },
    ...(userName ? [{ href: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") }] : []),
    { href: "/studio",      icon: Wand2,          label: t("nav.studio")      },
    { href: "/admin",       icon: Shield,         label: t("nav.creator") },
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
    setShowSettings(false);
    router.push("/login");
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 relative">
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

        {/* Settings Icon - Top Right */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl transition-all shrink-0"
            style={{
              background: showSettings ? "var(--accent-glow)" : "var(--surface-hover)",
              color: "var(--accent-light)",
            }}
          >
            <Settings size={16} />
          </motion.button>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowSettings(false)}
                  className="fixed inset-0 z-40"
                />

                {/* Settings Dropdown */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 glass rounded-2xl p-4 w-80 z-50"
                  style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                >
                  {/* User Section */}
                  {userName && (
                    <div className="mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{ background: "var(--accent-glow)" }}
                        >
                          👤
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                            {userName}
                          </p>
                          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                            Logged In
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Theme Section */}
                  <div className="mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
                      🎨 {t("settings.themes")}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {THEME_OPTIONS.map(opt => (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTheme(opt.id)}
                          className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-[10px] font-bold transition-all"
                          style={{
                            background: theme === opt.id ? ACCENT_COLORS[opt.id] + "33" : "var(--surface)",
                            border: `1.5px solid ${theme === opt.id ? ACCENT_COLORS[opt.id] : "var(--border)"}`,
                            color: theme === opt.id ? ACCENT_COLORS[opt.id] : "var(--text-muted)",
                          }}
                        >
                          <span className="text-lg">{opt.emoji}</span>
                          <span>{opt.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Settings */}
                  <div className="mb-4 pb-4 space-y-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    {/* Dark/Light Toggle for custom themes */}
                    {!["hacker", "cyberpunk", "ocean", "sunset", "aurora", "midnight", "rose"].includes(theme) && (
                      <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                        style={{
                          background: "var(--surface-hover)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <motion.div
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {theme === "dark" ? (
                            <Sun size={16} style={{ color: "#fbbf24" }} />
                          ) : (
                            <Moon size={16} style={{ color: "#818cf8" }} />
                          )}
                        </motion.div>
                        <span className="text-xs font-semibold">
                          {theme === "dark" ? t("settings.light_mode") : t("settings.dark_mode")}
                        </span>
                      </button>
                    )}

                    {/* Notifications */}
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                      style={{
                        background: "var(--surface-hover)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Bell size={16} style={{ color: "#fbbf24" }} />
                      <span className="text-xs font-semibold">{t("settings.notifications")}</span>
                    </button>

                    {/* Language */}
                    <div className="relative">
                      <button
                        onClick={() => setShowLanguages(!showLanguages)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                        style={{
                          background: "var(--surface-hover)",
                          color: "var(--text-muted)",
                        }}
                      >
                        <Globe size={16} style={{ color: "#34d399" }} />
                        <span className="text-xs font-semibold flex-1 text-left">{LANGUAGES[language].nativeName}</span>
                        <motion.div
                          animate={{ rotate: showLanguages ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      </button>

                      {/* Language Dropdown */}
                      <AnimatePresence>
                        {showLanguages && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-1 glass rounded-lg p-2 z-50"
                            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                          >
                            <div className="grid grid-cols-2 gap-1 max-h-80 overflow-y-auto">
                              {Object.entries(LANGUAGES).map(([code, info]) => (
                                <button
                                  key={code}
                                  onClick={() => {
                                    setLanguage(code as any);
                                    setShowLanguages(false);
                                  }}
                                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all text-left"
                                  style={{
                                    background: language === code ? "var(--accent-glow)" : "var(--surface)",
                                    color: language === code ? "var(--accent-light)" : "var(--text-muted)",
                                    border: language === code ? `1px solid var(--accent-light)` : "1px solid var(--border)",
                                  }}
                                >
                                  <span className="text-lg">{info.flag}</span>
                                  <span>{info.nativeName}</span>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Avatar Link (if logged in) */}
                  {userName && (
                    <Link href="/avatar"
                      onClick={() => setShowSettings(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-2"
                      style={{
                        background: "var(--surface-hover)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <User size={16} style={{ color: "var(--accent-light)" }} />
                      <span className="text-xs font-semibold">{t("settings.profile")}</span>
                    </Link>
                  )}

                  {/* Logout Button (if logged in) or Login (if not) */}
                  {userName ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-semibold"
                      style={{
                        background: "#f87171",
                        color: "white",
                      }}
                    >
                      <LogOut size={16} />
                      <span className="text-xs">{t("settings.logout")}</span>
                    </motion.button>
                  ) : (
                    <Link href="/login"
                      onClick={() => setShowSettings(false)}
                      className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg transition-all font-semibold text-white text-xs"
                      style={{ background: "var(--btn-grad)" }}
                    >
                      {t("settings.login")}
                    </Link>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
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
          <LanguageProvider>
            <ToastProvider>
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
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
