// Example: How to Integrate New Components Into Existing Pages

// ═════════════════════════════════════════════════════════════
// EXAMPLE 1: Enhanced Dashboard with All Features
// ═════════════════════════════════════════════════════════════

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/app/lib/gameStore";
import { useToast } from "@/app/components/ToastSystem";
import { 
  PageTransition, 
  StaggerContainer, 
  StaggerItem,
  AnimatedCard,
  AnimatedProgressBar,
  CounterAnimation,
  GlowButton
} from "@/app/components/MotionComponents";
import { 
  ConfettiCelebration, 
  AchievementPop 
} from "@/app/components/CelebrationEffects";
import { CardSkeleton } from "@/app/components/LoadingStates";
import { motion } from "framer-motion";

export default function EnhancedDashboard() {
  const router = useRouter();
  const { user, xp, level, streak, achievements } = useGameStore();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [celebrateAchievement, setCelebrateAchievement] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

  useEffect(() => {
    if (!user) router.push("/login");
    
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, [user, router]);

  const handleCompleteLesson = () => {
    // Simulate lesson completion
    addToast("Lesson completed! +50 XP", "success");
    
    // Random chance of achievement
    if (Math.random() > 0.7) {
      setCelebrateAchievement(true);
      setUnlockedAchievement("First Victory");
      setTimeout(() => setCelebrateAchievement(false), 3000);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <main className="min-h-screen px-4 pt-28 pb-20 max-w-6xl mx-auto">
        <CardSkeleton count={3} />
      </main>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen px-4 pt-28 pb-20 max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Celebration Effects */}
        <ConfettiCelebration trigger={celebrateAchievement} />
        <AchievementPop 
          show={celebrateAchievement}
          title={unlockedAchievement || ""}
          icon="🏆"
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 style={{ color: "var(--text)" }} className="text-3xl font-bold">
            Welcome back, <span className="grad-text">{user.name}</span>!
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Level {level} • {xp.toLocaleString()} XP
          </p>
        </motion.div>

        {/* Stats Grid with Stagger */}
        <StaggerContainer delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Level", value: level, icon: "📊" },
              { label: "XP", value: xp.toLocaleString(), icon: "⚡" },
              { label: "Streak", value: `${streak} 🔥`, icon: "🔥" },
              { label: "Achievements", value: `${achievements.length}`, icon: "🏅" },
            ].map(({ label, value, icon }) => (
              <StaggerItem key={label}>
                <AnimatedCard>
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-2xl font-bold grad-text">{value}</div>
                  <p style={{ color: "var(--text-faint)" }} className="text-xs">
                    {label}
                  </p>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* Progress Section */}
        <AnimatedCard>
          <h2 className="font-bold mb-4">XP Progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {level}</span>
              <span style={{ color: "var(--accent-light)" }}>
                <CounterAnimation value={xp % 200} max={200} />
                / 200 XP
              </span>
            </div>
            <AnimatedProgressBar 
              value={xp % 200} 
              max={200}
              height="h-3"
            />
          </div>
        </AnimatedCard>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlowButton onClick={handleCompleteLesson}>
            ⚡ Complete Lesson
          </GlowButton>
          <GlowButton>🎯 Enter Arena</GlowButton>
          <GlowButton>📊 View Leaderboard</GlowButton>
        </div>
      </main>
    </PageTransition>
  );
}

// ═════════════════════════════════════════════════════════════
// EXAMPLE 2: Enhanced Login Form
// ═════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { useToast } from "@/app/components/ToastSystem";
import { 
  SmoothInput, 
  SmoothButton, 
  SmoothCheckbox 
} from "@/app/components/SmoothForms";
import { PageTransition } from "@/app/components/MotionComponents";
import { motion } from "framer-motion";

export default function EnhancedLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      addToast("Please fix the errors above", "error");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addToast("Welcome back! 🎉", "success");
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      addToast("Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <main className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass rounded-3xl p-8 space-y-6"
        >
          <div className="text-center">
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text)" }}
            >
              Welcome to EduStream
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              Sign in to continue learning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <SmoothInput
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(val) => {
                setEmail(val);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              error={errors.email}
              success={!errors.email && email.length > 0 && !validateEmail(email)}
              type="email"
            />

            <SmoothInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(val) => {
                setPassword(val);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              error={errors.password}
              type="password"
            />

            <SmoothCheckbox
              label="Remember me"
              checked={rememberMe}
              onChange={setRememberMe}
            />

            <SmoothButton
              type="submit"
              loading={loading}
              fullWidth
            >
              {loading ? "Signing in..." : "Sign In"}
            </SmoothButton>
          </form>

          <p style={{ color: "var(--text-muted)" }} className="text-center text-sm">
            Don't have an account? 
            <a href="/signup" className="underline ml-1">
              Sign up
            </a>
          </p>
        </motion.div>
      </main>
    </PageTransition>
  );
}

// ═════════════════════════════════════════════════════════════
// EXAMPLE 3: Challenge List with Animations
// ═════════════════════════════════════════════════════════════

"use client";

import { useState } from "react";
import { useToast } from "@/app/components/ToastSystem";
import {
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  GlowButton,
} from "@/app/components/MotionComponents";
import { CardSkeleton } from "@/app/components/LoadingStates";
import { motion } from "framer-motion";

export default function ChallengesPage() {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const { addToast } = useToast();

  // Simulate loading
  useState(() => {
    setTimeout(() => {
      setChallenges([
        { id: 1, title: "HTML Basics", difficulty: "Easy", xp: 50 },
        { id: 2, title: "CSS Grid", difficulty: "Medium", xp: 100 },
        { id: 3, title: "JavaScript Classes", difficulty: "Hard", xp: 200 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStartChallenge = (challenge: any) => {
    addToast(`Started: ${challenge.title}`, "info");
  };

  if (loading) return <CardSkeleton count={3} />;

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--text)" }}
      >
        Challenges
      </motion.h1>

      <StaggerContainer delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <StaggerItem key={challenge.id}>
              <AnimatedCard>
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">{challenge.title}</h3>
                  <div className="flex justify-between items-center">
                    <span style={{ color: "var(--accent)" }} className="text-sm font-semibold">
                      {challenge.difficulty}
                    </span>
                    <span style={{ color: "var(--accent-light)" }}>
                      +{challenge.xp} XP
                    </span>
                  </div>
                  <GlowButton onClick={() => handleStartChallenge(challenge)}>
                    Start Challenge
                  </GlowButton>
                </div>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </main>
  );
}

// ═════════════════════════════════════════════════════════════
// Export or copy these into your respective page files
// ═════════════════════════════════════════════════════════════
