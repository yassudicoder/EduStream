# 🎯 Daily Missions System - Implementation Guide

## Overview

The Daily Missions system generates 3-5 unique missions every day for each user. Each mission has a specific objective (solve problems, win battles, complete lessons, etc.) with XP rewards and progress tracking.

**Key Features:**
- ✅ Daily mission generation with automatic reset at midnight
- ✅ 5 mission types: Problems, Battles, Lessons, Achievements, Streaks
- ✅ Real-time progress tracking with visual progress bars
- ✅ XP rewards that integrate with the leveling system
- ✅ Smooth animations and celebration effects on completion
- ✅ Toast notifications for mission milestones
- ✅ localStorage persistence

---

## 📁 Files Created

### Core System
- **`app/lib/missionStore.ts`** - Zustand store managing mission state, generation, and progress
- **`app/lib/useMissionIntegration.ts`** - Hook for tracking user actions (solve problem, win battle, etc.)

### UI Components
- **`app/components/MissionCard.tsx`** - Individual mission display with progress bar
- **`app/components/DailyMissions.tsx`** - Main missions panel (displayed on Dashboard)

---

## 🚀 Quick Start

### 1. Display Missions on Dashboard

The `DailyMissions` component is already integrated into the dashboard:

```tsx
// app/dashboard/page.tsx
import { DailyMissions } from "@/app/components/DailyMissions";

export default function DashboardPage() {
  return (
    <main>
      {/* ... other content ... */}
      <DailyMissions />
    </main>
  );
}
```

### 2. Track User Actions in Other Pages

Whenever a user performs an action (solves a problem, wins a battle), call the mission tracking functions:

```tsx
"use client";
import { useMissionIntegration } from "@/app/lib/useMissionIntegration";

export function ProblemsPage() {
  const { recordProblemSolved } = useMissionIntegration();

  const handleSolveProblem = async () => {
    // ... solve logic ...
    recordProblemSolved(1); // Increment "problems" missions by 1
  };

  return (
    // ... UI ...
  );
}
```

---

## 🎮 Mission Types

### 1. **Problems** 💻
Track coding problem solutions.

```tsx
const { recordProblemSolved } = useMissionIntegration();
recordProblemSolved(1); // +1 progress to problem missions
```

**Example missions:**
- "Code Champion" - Solve 2 problems → 50 XP
- "Problem Solver" - Solve 3 problems → 75 XP
- "Coding Marathon" - Solve 5 problems → 120 XP

---

### 2. **Battles** ⚔️
Track arena battle victories.

```tsx
const { recordBattleWon } = useMissionIntegration();
recordBattleWon(1); // +1 progress to battle missions
```

**Example missions:**
- "Battle Master" - Win 1 battle → 60 XP
- "Warrior's Path" - Win 2 battles → 100 XP
- "Arena Champion" - Win 3 battles → 150 XP

---

### 3. **Lessons** 📚
Track lesson completion.

```tsx
const { recordLessonCompleted } = useMissionIntegration();
recordLessonCompleted(1); // +1 progress to lesson missions
```

**Example missions:**
- "Knowledge Seeker" - Complete 1 lesson → 45 XP
- "Master Learner" - Complete 2 lessons → 80 XP

---

### 4. **Achievements** 🏆
Track achievement unlocks.

```tsx
const { recordAchievementUnlocked } = useMissionIntegration();
recordAchievementUnlocked(1); // +1 progress to achievement missions
```

**Example missions:**
- "Achievement Hunter" - Unlock 1 achievement → 55 XP

---

### 5. **Streak** 🔥
Track daily streak maintenance.

```tsx
const { recordStreakMaintained } = useMissionIntegration();
recordStreakMaintained(); // Mark streak mission as complete
```

**Example missions:**
- "Consistent Grinder" - Maintain your streak → 40 XP

---

## 🔧 API Reference

### Mission Store (`useMissionStore`)

#### **State**
```tsx
const missions = useMissionStore(s => s.missions);
const lastResetDate = useMissionStore(s => s.lastResetDate);
```

#### **Actions**

**Generate daily missions:**
```tsx
const generateDailyMissions = useMissionStore(s => s.generateDailyMissions);
generateDailyMissions(); // Creates 4-5 random missions for today
```

**Update progress:**
```tsx
const updateMissionProgress = useMissionStore(s => s.updateMissionProgress);
updateMissionProgress(missionId, increment); // Add to progress count
```

**Complete mission:**
```tsx
const completeMission = useMissionStore(s => s.completeMission);
completeMission(missionId); // Mark as completed, trigger rewards
```

**Get stats:**
```tsx
const getCompletedCount = useMissionStore(s => s.getCompletedCount);
const getTodaysMissionsXp = useMissionStore(s => s.getTodaysMissionsXp);

const completed = getCompletedCount(); // How many done today?
const totalXp = getTodaysMissionsXp(); // Total XP from missions
```

**Reset if needed:**
```tsx
const resetMissionsIfNeeded = useMissionStore(s => s.resetMissionsIfNeeded);
resetMissionsIfNeeded(); // Auto-generates new missions if it's a new day
```

---

## 🎨 UI Components

### MissionCard

Displays a single mission with progress bar and completion status.

```tsx
import { MissionCard } from "@/app/components/MissionCard";

<MissionCard mission={missionObject} />
```

**Features:**
- Progress bar animation
- Completion checkmark
- XP reward display
- Shimmer effect when completed
- Pulsing indicator for in-progress missions

---

### DailyMissions

Displays all missions with statistics and handles completion notifications.

```tsx
import { DailyMissions } from "@/app/components/DailyMissions";

<DailyMissions />
```

**Features:**
- Daily progress bar showing completion percentage
- Total XP earned display
- Auto-trigger celebration effects on completion
- Toast notifications for milestones
- "All completed" message
- Grid layout (1 col on mobile, 2-3 cols on desktop)

---

## 📊 Mission Data Structure

```typescript
interface Mission {
  id: string;                    // Unique ID
  type: MissionType;             // problems | battles | lessons | achievements | streak
  title: string;                 // "Code Champion"
  description: string;           // "Solve 2 coding problems"
  target: number;                // Goal: 2
  progress: number;              // Current: 0-2
  xpReward: number;              // 50 XP
  status: MissionStatus;         // pending | in-progress | completed
  emoji: string;                 // "💻"
  completedAt?: number;          // Timestamp when completed
}
```

---

## 🔄 Integration Examples

### Example 1: Problems Page

```tsx
"use client";
import { useMissionIntegration } from "@/app/lib/useMissionIntegration";

export function ProblemsPage() {
  const { recordProblemSolved } = useMissionIntegration();

  const handleSolveClick = async (problemId: string) => {
    try {
      // Verify solution and update score
      const result = await verifySolution(problemId);
      
      if (result.success) {
        // Record this in missions
        recordProblemSolved(1);
        // Add XP to user
        addXP(result.xp);
      }
    } catch (err) {
      console.error("Failed to solve", err);
    }
  };

  return (
    // ... UI ...
  );
}
```

---

### Example 2: Arena Page

```tsx
"use client";
import { useMissionIntegration } from "@/app/lib/useMissionIntegration";
import { useGameStore } from "@/app/lib/gameStore";

export function ArenaPage() {
  const { recordBattleWon } = useMissionIntegration();
  const addXP = useGameStore(s => s.addXP);

  const handleBattleVictory = async () => {
    // Battle logic...
    recordBattleWon(1);        // Update missions
    addXP(50);                 // Update XP
    showToast("Battle won! +1 mission progress");
  };

  return (
    // ... UI ...
  );
}
```

---

### Example 3: Learn Page

```tsx
"use client";
import { useMissionIntegration } from "@/app/lib/useMissionIntegration";

export function LearnPage() {
  const { recordLessonCompleted } = useMissionIntegration();

  const handleCompletLesson = () => {
    // Mark lesson as done
    updateLessonProgress();
    
    // Update missions
    recordLessonCompleted(1);
  };

  return (
    // ... UI ...
  );
}
```

---

### Example 4: Achievement Unlock

```tsx
"use client";
import { useMissionIntegration } from "@/app/lib/useMissionIntegration";

export function AchievementSystem() {
  const { recordAchievementUnlocked } = useMissionIntegration();

  const unlockAchievement = (achievementId: string) => {
    // Achievement logic...
    recordAchievementUnlocked(1);
  };

  return (
    // ... UI ...
  );
}
```

---

## ⏰ Daily Reset Logic

Missions automatically reset at midnight using a date-based key:

```typescript
function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

// Called on app initialization
resetMissionsIfNeeded(); // Checks if lastResetDate !== today and regenerates
```

---

## 🎉 Completion Rewards

When a mission is completed:

1. ✅ **Status changes to "completed"**
2. 💰 **XP is awarded** to user (integrated with game store)
3. 🔔 **Toast notification** shows mission completion
4. 🎊 **Celebration effect** triggers (confetti)
5. 📊 **Progress bars** update with animation

---

## 💾 Persistence

All mission data is stored in localStorage using Zustand's persist middleware:

**Key:** `edustream-missions`

Data persists across:
- Browser refreshes
- Session switches
- Device navigation

---

## 📈 Best Practices

### 1. **Call Mission Tracking at Right Time**
```tsx
// ✅ Good: After action is verified
handleSolveProblem = async () => {
  const result = await verifySolution();
  if (result.success) {
    recordProblemSolved(1); // Only record when success is verified
  }
};

// ❌ Bad: Before verification
recordProblemSolved(1);
verifySolution(); // Might fail!
```

### 2. **Batch Multiple Increments**
```tsx
// ✅ Good: If user solves 3 problems at once
recordProblemSolved(3);

// ❌ Avoid: Calling 3 times separately (less efficient)
recordProblemSolved(1);
recordProblemSolved(1);
recordProblemSolved(1);
```

### 3. **Initialize Missions on App Load**
```tsx
// app/layout.tsx or dashboard
useEffect(() => {
  resetMissionsIfNeeded(); // Check if new day and reset
  if (missions.length === 0) {
    generateDailyMissions(); // Generate if first time
  }
}, []);
```

---

## 🚨 Troubleshooting

### **Missions not generating**
- Check if `generateDailyMissions()` is called on first load
- Verify localStorage is not corrupted: `localStorage.clear()` and refresh

### **Progress not updating**
- Ensure `useMissionIntegration()` is called before action
- Check if mission `status` is already "completed" (won't increment beyond target)

### **Completion effect not showing**
- Verify `ConfettiCelebration` component is imported
- Check if `showCelebration` state triggers properly

### **Wrong XP rewards**
- Mission completion auto-adds XP via `addXP()` hook
- Check if `useGameStore` is properly connected

---

## 🎓 Advanced Customization

### Adding New Mission Type

1. Add to `MissionType` in `missionStore.ts`:
```typescript
export type MissionType = "problems" | "battles" | "streak" | "lessons" | "achievements" | "yourmissiontype";
```

2. Add template:
```typescript
const MISSION_TEMPLATES = [
  // ... existing ...
  {
    type: "yourmissiontype",
    title: "Your Title",
    description: "Your description",
    target: 1,
    xpReward: 50,
    emoji: "🎯",
  },
];
```

3. Add tracking function in `useMissionIntegration.ts`:
```typescript
const recordYourAction = (count: number = 1) => {
  missions.forEach((mission) => {
    if (mission.type === "yourmissiontype" && mission.status !== "completed") {
      updateMissionProgress(mission.id, count);
    }
  });
};
```

---

## 📚 Related Systems

- **XP System** - `app/lib/gameStore.ts` - Manages total XP and levels
- **Achievement System** - `app/lib/gameStore.ts` - Unlocks achievements
- **Streak System** - `app/lib/gameStore.ts` - Tracks daily login streaks
- **Toast Notifications** - `app/components/ToastSystem.tsx` - Shows feedback
- **Celebration Effects** - `app/components/CelebrationEffects.tsx` - Confetti animations

---

**Happy missions! 🚀✨**
