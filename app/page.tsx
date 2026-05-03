"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy, Swords, BookOpen, ArrowRight, Zap, Users, Star, BarChart3, Flame } from "lucide-react";
import Link from "next/link";
import { useGameStore } from "./lib/gameStore";
import { StaggerContainer, StaggerItem, AnimatedCard, PulseBadge } from "./components/MotionComponents";

const EASE = "easeOut";

const FEATURES = [
  { icon: BookOpen, title: "Gamified Coding Lessons", desc: "Learn HTML, CSS, JavaScript from scratch. Level up as you complete lessons.", color: "#a78bfa", href: "/dashboard" },
  { icon: Swords,   title: "Battle Arena",            desc: "1v1 duels, group battles, tournaments. Compete in DSA, coding & quiz wars.", color: "#f87171", href: "/arena" },
  { icon: Trophy,   title: "Global Leaderboard",      desc: "Climb the ranks. Compete with coders worldwide. Show off your streak.", color: "#fbbf24", href: "/leaderboard" },
  { icon: Star,     title: "Avatar & Skins",          desc: "Unlock skins by leveling up. Customize your coder identity.", color: "#34d399", href: "/avatar" },
  { icon: Users,    title: "Creator Hub",             desc: "Teachers & companies can create tournaments, tests and analyze students.", color: "#60a5fa", href: "/admin" },
  { icon: Zap,      title: "Achievements",            desc: "Earn badges, maintain streaks, and unlock rewards as you grow.", color: "#f97316", href: "/dashboard" },
];

export default function Home() {
  const user = useGameStore(s => s.user);

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-5xl mx-auto flex flex-col gap-16">

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center flex flex-col items-center gap-6"
      >
        <PulseBadge className="inline-flex">
          Learn · Compete · Level Up
        </PulseBadge>

        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none"
          style={{ color: "var(--text)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Code Smarter.<br />
          <span className="grad-text">Win Together.</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg max-w-md leading-relaxed"
          style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          EduStream is a gamified coding platform where you learn, battle, and compete with coders worldwide.
        </motion.p>

        <motion.div
          className="flex items-center gap-3 flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {user ? (
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: "var(--btn-grad)", boxShadow: "0 8px 32px var(--accent-glow)" }}>
                Go to Dashboard <ArrowRight size={16} />
              </motion.div>
            </Link>
          ) : (
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: "var(--btn-grad)", boxShadow: "0 8px 32px var(--accent-glow)" }}>
                <Sparkles size={16} /> Get Started Free <ArrowRight size={16} />
              </motion.div>
            </Link>
          )}
          <Link href="/arena">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm glass"
              style={{ color: "var(--text-muted)" }}>
              <Swords size={16} /> Enter Arena
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats row with animation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-6 flex-wrap justify-center mt-2"
        >
          {[
            { value: "10K+", label: "Coders", icon: Users },
            { value: "500+", label: "Challenges", icon: BarChart3 },
            { value: "50+", label: "Tournaments", icon: Trophy },
            { value: "8", label: "Themes", icon: Sparkles },
          ].map(({ value, label, icon: Icon }, idx) => (
            <motion.div
              key={label}
              className="text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.45 + idx * 0.1, type: "spring", stiffness: 200 }}
            >
              <div className="flex items-center gap-2 justify-center mb-1">
                <Icon size={16} style={{ color: "var(--accent-light)" }} />
                <p className="text-2xl font-extrabold grad-text">{value}</p>
              </div>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features grid */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <motion.p
          className="text-xs font-bold uppercase tracking-widest text-center"
          style={{ color: "var(--text-faint)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Everything you need to grow as a coder
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, href }, i) => (
            <Link key={title} href={href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="glass card-shine rounded-2xl p-5 flex flex-col gap-3 cursor-pointer h-full group relative overflow-hidden"
                style={{ border: `1px solid ${color}18` }}
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                    filter: "blur(30px)",
                  }}
                />

                <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: color + "22" }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="relative z-10">
                  <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-faint)" }}>{desc}</p>
                </div>
                <div className="relative z-10 flex items-center gap-1 mt-auto text-xs font-bold group-hover:gap-2 transition-all"
                  style={{ color }}>
                  Explore <ArrowRight size={12} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass card-shine rounded-3xl p-10 flex flex-col items-center gap-5 text-center relative overflow-hidden"
        style={{ border: "1px solid var(--accent-glow)" }}
      >
        {/* Background animation */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ background: "var(--btn-grad)" }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.div
          className="text-5xl relative z-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚀
        </motion.div>

        <h2 className="text-3xl font-extrabold relative z-10" style={{ color: "var(--text)" }}>
          Ready to <span className="grad-text">Level Up?</span>
        </h2>

        <p className="text-sm max-w-sm relative z-10" style={{ color: "var(--text-muted)" }}>
          Join thousands of coders learning, competing, and growing every day.
        </p>

        <Link href={user ? "/dashboard" : "/login"}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white relative z-10"
            style={{ background: "var(--btn-grad)", boxShadow: "0 8px 40px var(--accent-glow)" }}
          >
            <Zap size={16} /> {user ? "Continue Learning" : "Start for Free"} <ArrowRight size={16} />
          </motion.div>
        </Link>
      </motion.section>
    </main>
  );
}
