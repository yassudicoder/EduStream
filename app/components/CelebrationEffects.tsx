"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  rotation: number;
  scale: number;
  duration: number;
}

export function ConfettiCelebration({
  trigger,
  emojis = ["🎉", "⭐", "🏆", "✨", "🎯"],
}: {
  trigger: boolean;
  emojis?: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCount = 30;

  useEffect(() => {
    if (!trigger) return;

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight / 2,
        delay: Math.random() * 0.1,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.8,
        duration: Math.random() * 0.5 + 1,
      });
    }

    // Auto-remove after animation
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [trigger]);

  if (!trigger) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 50 - 50;
        const rotation = Math.random() * 720;
        const duration = Math.random() * 2 + 2;
        const emoji = emojis[i % emojis.length];

        return (
          <motion.div
            key={i}
            initial={{ x: "50vw", y: "50vh", opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: `${50 + x - 50}vw`,
              y: `${50 + y}vh`,
              opacity: 0,
              scale: 0,
              rotate: rotation,
            }}
            transition={{
              duration,
              ease: "easeOut",
              delay: Math.random() * 0.2,
            }}
            className="absolute text-3xl"
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
}

// Achievement Pop Animation
export function AchievementPop({
  title,
  icon = "🏆",
  show,
  onComplete,
}: {
  title: string;
  icon?: string;
  show: boolean;
  onComplete?: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={show ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 50 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      onAnimationComplete={onComplete}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
    >
      <motion.div
        className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl px-8 py-6 shadow-2xl text-white text-center"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      >
        <div className="text-5xl mb-2">{icon}</div>
        <div className="text-sm font-bold uppercase tracking-wider">Achievement Unlocked!</div>
        <div className="text-xl font-extrabold mt-1">{title}</div>
      </motion.div>
    </motion.div>
  );
}

// Particle Burst Effect
export function ParticleBurst({
  trigger,
  emoji = "✨",
  count = 12,
}: {
  trigger: boolean;
  emoji?: string;
  count?: number;
}) {
  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const distance = 150;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        return (
          <motion.div
            key={i}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x,
              y,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: i * 0.02,
            }}
            className="absolute left-1/2 top-1/2 text-3xl"
          >
            {emoji}
          </motion.div>
        );
      })}
    </div>
  );
}
