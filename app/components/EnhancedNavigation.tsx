"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Swords,
  Trophy,
  Users,
  Palette,
  Menu,
  X,
  LogOut,
  Settings,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "../layout";

const MENU_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/learn", icon: BookOpen, label: "Learn" },
  { href: "/arena", icon: Swords, label: "Arena" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/avatar", icon: Users, label: "Avatar" },
  { href: "/admin", icon: Settings, label: "Creator Hub" },
];

export function EnhancedNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden lg:fixed left-0 top-0 h-screen w-64 z-40"
        style={{
          background: `linear-gradient(135deg, var(--bg) 0%, ${
            theme === "dark" ? "var(--bg-subtle)" : "var(--bg)"
          } 100%)`,
          borderRight: "1px solid var(--border)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="p-6 flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-2xl"
          >
            ⚡
          </motion.div>
          <h1 className="text-xl font-extrabold grad-text">EduStream</h1>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {MENU_ITEMS.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="relative px-4 py-3 rounded-lg flex items-center gap-3 transition-all cursor-pointer group"
                style={{
                  background: isActive(href) ? "var(--btn-grad)" : "transparent",
                  color: isActive(href) ? "white" : "var(--text-muted)",
                }}
              >
                {isActive(href) && (
                  <motion.div
                    layoutId="sidebarIndicator"
                    className="absolute left-0 top-0 h-full w-1 rounded-r-lg"
                    style={{ background: "var(--accent-light)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={18} />
                <span className="font-semibold text-sm">{label}</span>
                {isActive(href) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-auto"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  </motion.div>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-64 z-40"
              style={{
                background: "var(--bg)",
                borderRight: "1px solid var(--border)",
              }}
            >
              <div className="p-6 flex items-center gap-3">
                <div className="text-2xl">⚡</div>
                <h1 className="text-xl font-extrabold grad-text">EduStream</h1>
              </div>

              <nav className="mt-8 px-4 space-y-2">
                {MENU_ITEMS.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-3 rounded-lg flex items-center gap-3 transition-all cursor-pointer"
                      style={{
                        background: isActive(href) ? "var(--btn-grad)" : "var(--surface)",
                        color: isActive(href) ? "white" : "var(--text-muted)",
                      }}
                    >
                      <Icon size={18} />
                      <span className="font-semibold text-sm">{label}</span>
                    </motion.div>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Spacer */}
      <div className="hidden lg:block w-64" />
    </>
  );
}

// Theme Switcher Component
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: Array<{ id: string; label: string; emoji: string }> = [
    { id: "light", label: "Light", emoji: "☀️" },
    { id: "dark", label: "Dark", emoji: "🌙" },
    { id: "hacker", label: "Hacker", emoji: "💚" },
    { id: "cyberpunk", label: "Cyberpunk", emoji: "🤖" },
    { id: "ocean", label: "Ocean", emoji: "🌊" },
    { id: "sunset", label: "Sunset", emoji: "🌅" },
    { id: "aurora", label: "Aurora", emoji: "✨" },
    { id: "midnight", label: "Midnight", emoji: "🌠" },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-bold"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        <Palette size={16} />
        <span className="hidden sm:inline">{theme}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 p-3 rounded-xl z-50 grid grid-cols-2 gap-2"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(10px)",
              minWidth: "200px",
            }}
          >
            {themes.map(({ id, label, emoji }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTheme(id as any);
                  setIsOpen(false);
                }}
                className="p-2 rounded-lg text-center text-xs font-bold transition-all"
                style={{
                  background:
                    theme === id
                      ? "var(--btn-grad)"
                      : "var(--bg-subtle)",
                  color: theme === id ? "white" : "var(--text-muted)",
                  border: theme === id ? "1px solid var(--accent)" : "1px solid var(--border)",
                }}
              >
                <div className="text-lg mb-1">{emoji}</div>
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
