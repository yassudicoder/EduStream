"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSkillTreeStore } from "@/app/lib/skillTreeStore";
import { useGameStore } from "@/app/lib/gameStore";
import { SkillNode } from "./SkillNode";
import { useToast } from "./ToastSystem";
import { Sparkles, TrendingUp, Lock } from "lucide-react";

export function SkillTree() {
  const skills = useSkillTreeStore((s) => s.skills);
  const userProgress = useSkillTreeStore((s) => s.userProgress);
  const initializeSkillTree = useSkillTreeStore((s) => s.initializeSkillTree);
  const getSkillStatus = useSkillTreeStore((s) => s.getSkillStatus);
  const getCompletionPercentage = useSkillTreeStore((s) => s.getCompletionPercentage);
  const completeSkill = useSkillTreeStore((s) => s.completeSkill);
  const getUnlockedSkills = useSkillTreeStore((s) => s.getUnlockedSkills);

  const xp = useGameStore((s) => s.xp);
  const level = useGameStore((s) => s.level);
  const { addToast } = useToast();

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize on mount
  useEffect(() => {
    initializeSkillTree();
  }, [initializeSkillTree]);

  // Organize skills by tier
  const getTierLayout = () => {
    const tiers: { [key: number]: string[] } = {};

    skills.forEach((skill) => {
      const tier = skill.prerequisiteIds.length === 0 ? 0 : 1 + skill.prerequisiteIds.length;
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier].push(skill.id);
    });

    return Object.entries(tiers).map(([_, skillIds]) => skillIds);
  };

  const tiers = getTierLayout();

  // SVG connections drawing
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = ""; // Clear previous lines

    const nodes = document.querySelectorAll("[data-skill-id]");
    const nodeMap = new Map<string, DOMRect>();

    nodes.forEach((node) => {
      const skillId = node.getAttribute("data-skill-id");
      if (skillId) {
        nodeMap.set(skillId, node.getBoundingClientRect());
      }
    });

    skills.forEach((skill) => {
      skill.prerequisiteIds.forEach((prereqId) => {
        const fromNode = nodeMap.get(prereqId);
        const toNode = nodeMap.get(skill.id);

        if (fromNode && toNode) {
          const fromX = fromNode.left + fromNode.width / 2 - svg.getBoundingClientRect().left;
          const fromY = fromNode.top + fromNode.height - svg.getBoundingClientRect().top;
          const toX = toNode.left + toNode.width / 2 - svg.getBoundingClientRect().left;
          const toY = toNode.top - svg.getBoundingClientRect().top;

          const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const d = `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2} ${toX} ${toY}`;

          const status = getSkillStatus(skill.id);
          const prereqStatus = getSkillStatus(prereqId);

          let strokeColor = "var(--border)";
          if (status === "locked") strokeColor = "#6b7280";
          if (prereqStatus === "completed") strokeColor = "#10b981";

          line.setAttribute("d", d);
          line.setAttribute("stroke", strokeColor);
          line.setAttribute("stroke-width", "2");
          line.setAttribute("fill", "none");
          line.setAttribute("stroke-linecap", "round");

          svg.appendChild(line);
        }
      });
    });
  }, [skills, getSkillStatus, userProgress]);

  const unlockedCount = getUnlockedSkills().length;
  const totalCount = skills.length;
  const completedCount = skills.filter((s) => getSkillStatus(s.id) === "completed").length;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 grid grid-cols-3 gap-3"
        style={{ background: "var(--surface-hover)" }}
      >
        {[
          { icon: Sparkles, label: "Skills Unlocked", value: unlockedCount, color: "#7c3aed" },
          { icon: TrendingUp, label: "Completed", value: completedCount, color: "#10b981" },
          { icon: Lock, label: "Locked", value: totalCount - unlockedCount, color: "#ef4444" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon size={16} style={{ color }} />
            <p className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
              {value}
            </p>
            <p className="text-[10px] text-center" style={{ color: "var(--text-faint)" }}>
              {label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Tree visualization */}
      <div className="relative w-full">
        {/* SVG for connections */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ minHeight: "100%" }}
        />

        {/* Tiers grid */}
        <div className="relative z-10 flex flex-col gap-12">
          {tiers.map((tierSkillIds, tierIndex) => (
            <motion.div
              key={tierIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tierIndex * 0.1 }}
              className="w-full"
            >
              {/* Tier label */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {tierIndex === 0 ? "Foundation" : tierIndex === 1 ? "Intermediate" : "Advanced"}
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              {/* Skills grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tierSkillIds.map((skillId, index) => {
                  const skill = skills.find((s) => s.id === skillId);
                  if (!skill) return null;

                  const status = getSkillStatus(skillId);
                  const completionPercentage = getCompletionPercentage(skillId);

                  return (
                    <motion.div
                      key={skillId}
                      data-skill-id={skillId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        if (status !== "locked") {
                          setSelectedSkill(skillId);
                          addToast(skill.description, "info", 3000);
                        }
                      }}
                    >
                      <SkillNode
                        skill={skill}
                        status={status}
                        completionPercentage={completionPercentage}
                        isClickable={status !== "locked"}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skill detail panel */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetailPanel
            skillId={selectedSkill}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </AnimatePresence>

      {/* Footer info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-4 text-center"
        style={{ background: "var(--surface)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Complete lessons to progress through the skill tree. Unlock new skills as you complete prerequisites.
        </p>
      </motion.div>
    </div>
  );
}

interface SkillDetailPanelProps {
  skillId: string;
  onClose: () => void;
}

function SkillDetailPanel({ skillId, onClose }: SkillDetailPanelProps) {
  const skill = useSkillTreeStore((s) => s.skills.find((sk) => sk.id === skillId));
  const status = useSkillTreeStore((s) => s.getSkillStatus(skillId));
  const completionPercentage = useSkillTreeStore((s) => s.getCompletionPercentage(skillId));

  if (!skill) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl p-6 max-w-md w-full"
        style={{ background: "var(--surface-hover)" }}
      >
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{skill.icon}</span>
          <div className="flex-1">
            <h2 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>
              {skill.name}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {skill.description}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
              Difficulty
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: skill.color + "22", color: skill.color }}>
              {skill.difficulty.charAt(0).toUpperCase() + skill.difficulty.slice(1)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
              Total Lessons
            </span>
            <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
              {skill.totalLessons}
            </span>
          </div>

          {status !== "locked" && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                Progress
              </span>
              <span className="text-sm font-bold" style={{ color: skill.color }}>
                {completionPercentage}%
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-105"
          style={{ background: skill.color }}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
