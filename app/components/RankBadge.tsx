"use client";

import { motion } from "framer-motion";
import { RankTier, RANK_CONFIGS } from "@/app/lib/rankStore";

interface RankBadgeProps {
  rank: RankTier;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  animated?: boolean;
  className?: string;
}

export function RankBadge({
  rank,
  size = "md",
  showName = false,
  animated = true,
  className = "",
}: RankBadgeProps) {
  const config = RANK_CONFIGS[rank];

  const sizeMap = {
    sm: { badge: "text-lg", container: "gap-1" },
    md: { badge: "text-2xl", container: "gap-2" },
    lg: { badge: "text-4xl", container: "gap-3" },
  };

  const sizeStyle = sizeMap[size];

  const badgeVariants = {
    initial: animated ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 1 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.1 },
  };

  return (
    <motion.div
      className={`flex items-center ${sizeStyle.container} ${className}`}
      variants={badgeVariants}
      initial="initial"
      animate="animate"
      whileHover={animated ? "hover" : undefined}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className={sizeStyle.badge}
        animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {config.icon}
      </motion.span>

      {showName && (
        <div className="flex flex-col">
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: config.color }}
          >
            {config.name}
          </span>
          <span className="text-xs font-semibold" style={{ color: "var(--text-faint)" }}>
            {config.shortName}
          </span>
        </div>
      )}
    </motion.div>
  );
}

interface RankDisplayProps {
  rank: RankTier;
  xp: number;
  layout?: "vertical" | "horizontal";
}

export function RankDisplay({ rank, xp, layout = "horizontal" }: RankDisplayProps) {
  const config = RANK_CONFIGS[rank];
  const rangeStart = config.minXP;
  const rangeEnd = config.maxXP === Infinity ? config.minXP + 50000 : config.maxXP;

  const current = xp - rangeStart;
  const needed = rangeEnd - rangeStart;
  const percent = Math.min((current / needed) * 100, 100);

  if (layout === "vertical") {
    return (
      <div className="flex flex-col gap-3">
        <RankBadge rank={rank} size="lg" showName animated />
        <div className="flex flex-col gap-1">
          <div className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            Rank Progress
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: config.color }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="text-xs" style={{ color: "var(--text-faint)" }}>
            {current.toLocaleString()} / {needed.toLocaleString()} XP
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <RankBadge rank={rank} size="md" animated={false} />
      <div className="flex-1">
        <div className="text-sm font-bold" style={{ color: config.color }}>
          {config.name} Rank
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: config.color }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
      <div className="text-xs text-right" style={{ color: "var(--text-faint)" }}>
        <div>{Math.round(percent)}%</div>
        <div>{current.toLocaleString()} XP</div>
      </div>
    </div>
  );
}
