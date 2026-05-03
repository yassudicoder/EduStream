"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

// ─── Smooth Page Transitions ───
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Staggered Container ───
export function StaggerContainer({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Staggered Item ───
export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated Card ───
export function AnimatedCard({
  children,
  className = "",
  onClick,
  gradient = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  gradient?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl p-4 backdrop-blur-sm transition-all cursor-pointer ${className}`}
      style={{
        background: gradient ? "var(--btn-grad)" : "var(--surface)",
        border: `1px solid var(--border)`,
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// ─── Pulse Badge ───
export function PulseBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${className}`}
      style={{ background: "var(--accent-glow)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-2 animate-pulse" />
      {children}
    </motion.div>
  );
}

// ─── Glow Button ───
export function GlowButton({
  children,
  onClick,
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl font-bold text-white text-sm transition-all ${className}`}
      style={{
        background: !disabled ? "var(--btn-grad)" : "var(--border)",
        boxShadow: !disabled ? "0 8px 32px var(--accent-glow)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── Animated Progress Bar ───
export function AnimatedProgressBar({
  value,
  max = 100,
  height = "h-2",
  className = "",
}: {
  value: number;
  max?: number;
  height?: string;
  className?: string;
}) {
  const percentage = (value / max) * 100;
  return (
    <div className={`${height} rounded-full overflow-hidden w-full ${className}`} style={{ background: "var(--border)" }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: "var(--btn-grad)" }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percentage, 100)}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── Hover Lift Effect ───
export function HoverLift({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Shimmer Loading ───
export function ShimmerLoading({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-xl ${className}`}
      style={{
        background: `linear-gradient(90deg, var(--surface) 0%, var(--bg-subtle) 50%, var(--surface) 100%)`,
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

// ─── Number Counter ───
export function CounterAnimation({
  value,
  duration = 0.8,
  suffix = "",
  className = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <motion.div className={className}>
      {typeof value === "number" && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration }}
          >
            {value.toLocaleString()}
          </motion.span>
          {suffix}
        </motion.span>
      )}
    </motion.div>
  );
}

// ─── Animated Badge ───
export function AnimatedBadge({
  icon,
  label,
  color = "#a78bfa",
}: {
  icon: string | React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
      style={{
        background: `${color}20`,
        border: `1px solid ${color}`,
        color: color,
      }}
    >
      {typeof icon === "string" ? <span>{icon}</span> : icon}
      {label}
    </motion.div>
  );
}

// ─── Bounce In ───
export function BounceIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Slide In ───
export function SlideIn({
  children,
  direction = "left",
  delay = 0,
}: {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}) {
  const variants = {
    left: { x: -50, opacity: 0 },
    right: { x: 50, opacity: 0 },
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
  };

  return (
    <motion.div
      initial={variants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Rotate In ───
export function RotateIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ rotate: -20, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Fade In ───
export function FadeIn({
  children,
  duration = 0.5,
  delay = 0,
}: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
