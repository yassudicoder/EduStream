"use client";

import { motion } from "framer-motion";
import { useGameStore, type Skin } from "@/app/lib/gameStore";
import { Sparkles, Crown, Flame, Zap, Shield, Star, Cloud } from "lucide-react";

export function Avatar() {
  const { level, xp, activeSkin, unlockedSkins } = useGameStore();
  const nextLevelXP = 200 * level;
  const currentLevelXP = 200 * (level - 1);
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  const skinColors: Record<Skin, string> = {
    default: "bg-gradient-to-b from-blue-400 to-blue-600",
    fire: "bg-gradient-to-b from-orange-400 to-red-600",
    ice: "bg-gradient-to-b from-cyan-300 to-blue-600",
    galaxy: "bg-gradient-to-b from-purple-400 to-pink-600",
    gold: "bg-gradient-to-b from-yellow-300 to-amber-600",
    shadow: "bg-gradient-to-b from-gray-700 to-gray-900",
    neon: "bg-gradient-to-b from-green-400 to-cyan-600",
    custom: "bg-gradient-to-b from-violet-400 to-blue-600",
  };

  const skinIcons: Record<Skin, React.ReactNode> = {
    default: <Star className="w-8 h-8" />,
    fire: <Flame className="w-8 h-8" />,
    ice: <Cloud className="w-8 h-8" />,
    galaxy: <Sparkles className="w-8 h-8" />,
    gold: <Crown className="w-8 h-8" />,
    shadow: <Shield className="w-8 h-8" />,
    neon: <Zap className="w-8 h-8" />,
    custom: <Sparkles className="w-8 h-8" />,
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Circle */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Level Badge */}
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg border-2 border-amber-600">
          {level}
        </div>

        {/* Main Avatar */}
        <div className={`w-32 h-32 ${skinColors[activeSkin]} rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative overflow-hidden`}>
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-white opacity-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Icon */}
          <motion.div
            className="text-white relative z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {skinIcons[activeSkin]}
          </motion.div>
        </div>
      </motion.div>

      {/* Level and XP Info */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Level {level}</h2>
        <p className="text-gray-600 dark:text-gray-300">Total XP: {xp.toLocaleString()}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Level {level}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          {xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP
        </p>
      </div>

      {/* Unlocked Skins Display */}
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Skins ({unlockedSkins.length})
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          {unlockedSkins.map((skin) => (
            <motion.button
              key={skin}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                activeSkin === skin ? "border-white shadow-lg" : "border-gray-400"
              } ${skinColors[skin]} text-white text-xs font-bold`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={skin}
            >
              {skin === activeSkin && "✓"}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
