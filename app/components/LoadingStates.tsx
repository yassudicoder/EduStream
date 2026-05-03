"use client";

import { motion } from "framer-motion";
import React from "react";
import { ShimmerLoading } from "./MotionComponents";

// Skeleton Loader Component
export function SkeletonLoader({
  count = 3,
  className = "h-12 rounded-lg mb-4",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerLoading key={i} className={className} />
      ))}
    </div>
  );
}

// Card Skeleton
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="glass rounded-2xl p-4 space-y-3"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ShimmerLoading className="h-8 w-8 rounded-lg" />
          <ShimmerLoading className="h-4 rounded-lg" />
          <ShimmerLoading className="h-4 w-2/3 rounded-lg" />
        </motion.div>
      ))}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          className="glass rounded-xl p-3 flex items-center gap-3"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        >
          <ShimmerLoading className="h-10 w-10 rounded-full shrink-0" />
          <ShimmerLoading className="h-4 flex-1 rounded-lg" />
          <ShimmerLoading className="h-4 w-20 rounded-lg" />
        </motion.div>
      ))}
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <motion.div
      className={`rounded-full ${sizes[size]}`}
      style={{
        background: "var(--btn-grad)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="rounded-full"
        style={{
          background: "var(--bg)",
          width: "90%",
          height: "90%",
        }}
      />
    </motion.div>
  );
}

// Pulse Skeleton
export function PulseSkeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`rounded-lg ${className}`}
      style={{ background: "var(--surface)" }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

// Loading overlay
export function LoadingOverlay({
  show = true,
  message = "Loading...",
}: {
  show?: boolean;
  message?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none"
      style={{ pointerEvents: show ? "auto" : "none" }}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <motion.p
          className="text-white font-semibold"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </div>
    </motion.div>
  );
}
