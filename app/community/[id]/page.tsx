"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useCommunityStore } from "@/app/lib/communityStore";
import { useGameStore } from "@/app/lib/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, MessageSquare, Heart, Trophy, Users, Send,
  Zap, Plus, Globe, Lock, Swords, Crown, Flame
} from "lucide-react";

const POST_TYPES = [
  { id: "discussion", label: "Discussion", emoji: "💬" },
  { id: "question",   label: "Question",   emoji: "❓" },
  { id: "achievement",label: "Achievement",emoji: "🏆" },
  { id: "challenge",  label: "Challenge",  emoji: "⚔️" },
] as const;

const TYPE_COLORS: Record<string, string> = {
  discussion: "#a78bfa", question: "#60a5fa", achievement: "#fbbf24", challenge: "#f87171",
};

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { communities, joinedCommunityIds, joinCommunity, leaveCommunity, addPost, likePost, addReply } = useCommunityStore();
  const { user, xp, level } = useGameStore();
  const [tab, setTab] = useState<"feed" | "leaderboard" | "members">("feed");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"discussion" | "question" | "achievement" | "challenge">("discussion");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const community = communities.find(c => c.id === id);
  const isJoined = joinedCommunityIds.includes(id);

  if (!community) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🏫</p>
          <p style={{ color: "var(--text-muted)" }}>Community not found</p>
          <button onClick={() => router.push("/community")} className="mt-4 glass rounded-xl px-4 py-2 text-sm font-bold transition-all hover:scale-105" style={{ color: "var(--accent-light)" }}>
            Back to Communities
          </button>
        </div>
      </main>
    );
  }

  function handlePost() {
    if (!postContent.trim() || !user) return;
    addPost(id, { authorName: user.name, authorAvatar: "🧑💻", content: postContent, type: postType, tags: [], });
    setPostContent("");
  }

  function handleReply(postId: string) {
    if (!replyContent.trim() || !user) return;
    addReply(id, postId, { authorName: user.name, authorAvatar: "🧑💻", content: replyContent });
    setReplyContent("");
    setReplyingTo(null);
  }

  function handleJoinLeave() {
    if (!user) { router.push("/login"); return; }
    if (isJoined) {
      leaveCommunity(id, user.name);
    } else {
      joinCommunity(id, { name: user.name, avatar: "🧑💻", xp, level, role: "member", joinedAt: Date.now(), verified: false });
    }
  }

  const sortedMembers = [...community.members].sort((a, b) => b.xp - a.xp);

  return (
    <main className="min-h-screen px-4 pt-28 pb-20 max-w-5xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="glass card-shine rounded-2xl p-5 flex flex-col gap-4"
        style={{ border: `1px solid ${community.color}33` }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/community")} className="glass rounded-xl p-2 transition-all hover:scale-105">
              <ChevronLeft size={16} style={{ color: "var(--text-muted)" }} />
            </button>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: community.color + "22", border: `1px solid ${community.color}44` }}>
              {community.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold" style={{ color: "var(--text)" }}>{community.name}</h1>
                {community.isPrivate ? <Lock size={13} style={{ color: "var(--text-faint)" }} /> : <Globe size={13} style={{ color: "var(--text-faint)" }} />}
              </div>
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>{community.college}</p>
            </div>
          </div>
          <button onClick={handleJoinLeave}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 shrink-0"
            style={{
              background: isJoined ? "var(--surface)" : community.color,
              color: isJoined ? "var(--text-muted)" : "#fff",
              border: isJoined ? `1px solid var(--border)` : "none",
            }}>
            {isJoined ? "Leave" : "+ Join"}
          </button>
        </div>

        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{community.description}</p>

        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-faint)" }}>
          <span className="flex items-center gap-1"><Users size={12} /> {community.memberCount} members</span>
          <span className="flex items-center gap-1"><MessageSquare size={12} /> {community.posts.length} posts</span>
          <span className="flex items-center gap-1"><Flame size={12} /> Active</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {community.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: community.color + "22", color: community.color }}>#{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="glass rounded-2xl p-1 flex gap-1 self-start">
        {[
          { id: "feed" as const, icon: MessageSquare, label: "Feed" },
          { id: "leaderboard" as const, icon: Trophy, label: "Leaderboard" },
          { id: "members" as const, icon: Users, label: "Members" },
        ].map(({ id: tid, icon: Icon, label }) => (
          <button key={tid} onClick={() => setTab(tid)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ color: tab === tid ? "#fff" : "var(--text-muted)" }}>
            {tab === tid && <motion.div layoutId="commDetailTab" className="absolute inset-0 rounded-xl" style={{ background: community.color }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span className="relative z-10 flex items-center gap-1.5"><Icon size={12} />{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── FEED ── */}
        {tab === "feed" && (
          <motion.div key="feed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">

            {/* Post composer */}
            {isJoined && (
              <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex gap-2 flex-wrap">
                  {POST_TYPES.map(pt => (
                    <button key={pt.id} onClick={() => setPostType(pt.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: postType === pt.id ? TYPE_COLORS[pt.id] + "33" : "var(--surface)",
                        border: `1px solid ${postType === pt.id ? TYPE_COLORS[pt.id] : "var(--border)"}`,
                        color: postType === pt.id ? TYPE_COLORS[pt.id] : "var(--text-muted)",
                      }}>
                      {pt.emoji} {pt.label}
                    </button>
                  ))}
                </div>
                <textarea value={postContent} onChange={e => setPostContent(e.target.value)}
                  placeholder={`Share something with ${community.name}...`} rows={3}
                  className="glass rounded-xl px-4 py-3 text-sm outline-none resize-none w-full"
                  style={{ color: "var(--text)" }} />
                <div className="flex justify-end">
                  <button onClick={handlePost} disabled={!postContent.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 disabled:opacity-40"
                    style={{ background: community.color }}>
                    <Send size={13} /> Post
                  </button>
                </div>
              </div>
            )}

            {/* Posts */}
            {community.posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-sm" style={{ color: "var(--text-faint)" }}>No posts yet. Be the first to start a discussion!</p>
              </div>
            ) : (
              community.posts.map((post, i) => (
                <motion.div key={post.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass card-shine rounded-2xl p-5 flex flex-col gap-4">

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: "var(--surface-hover)" }}>
                        {post.authorAvatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{post.authorName}</p>
                        <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{timeAgo(post.createdAt)}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: TYPE_COLORS[post.type] + "22", color: TYPE_COLORS[post.type] }}>
                      {POST_TYPES.find(t => t.id === post.type)?.emoji} {post.type}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{post.content}</p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: "var(--surface-hover)", color: "var(--text-faint)" }}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <button onClick={() => user && likePost(id, post.id, user.name)}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105"
                      style={{ color: post.likedBy.includes(user?.name ?? "") ? "#f87171" : "var(--text-faint)" }}>
                      <Heart size={13} fill={post.likedBy.includes(user?.name ?? "") ? "#f87171" : "none"} />
                      {post.likes}
                    </button>
                    <button onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105"
                      style={{ color: "var(--text-faint)" }}>
                      <MessageSquare size={13} /> {post.replies.length} replies
                    </button>
                  </div>

                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="flex flex-col gap-2 pl-4 border-l-2" style={{ borderColor: community.color + "44" }}>
                      {post.replies.map(reply => (
                        <div key={reply.id} className="flex items-start gap-2">
                          <span className="text-base">{reply.authorAvatar}</span>
                          <div className="flex-1 rounded-xl px-3 py-2" style={{ background: "var(--surface-hover)" }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold" style={{ color: "var(--text)" }}>{reply.authorName}</span>
                              <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{timeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input */}
                  <AnimatePresence>
                    {replyingTo === post.id && isJoined && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="flex gap-2 overflow-hidden">
                        <input value={replyContent} onChange={e => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="glass rounded-xl px-3 py-2 text-xs outline-none flex-1"
                          style={{ color: "var(--text)" }}
                          onKeyDown={e => e.key === "Enter" && handleReply(post.id)} />
                        <button onClick={() => handleReply(post.id)} disabled={!replyContent.trim()}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 disabled:opacity-40"
                          style={{ background: community.color }}>
                          <Send size={12} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* ── LEADERBOARD ── */}
        {tab === "leaderboard" && (
          <motion.div key="lb" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col gap-4">

            <div className="glass card-shine rounded-2xl p-5 flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-faint)" }}>
                🏆 {community.name} Rankings
              </p>

              {/* Top 3 podium */}
              {sortedMembers.length >= 3 && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[sortedMembers[1], sortedMembers[0], sortedMembers[2]].map((m, i) => {
                    if (!m) return <div key={i} />;
                    const heights = ["h-24", "h-32", "h-20"];
                    const medals = ["🥈", "🥇", "🥉"];
                    return (
                      <motion.div key={m.name}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className={`glass rounded-2xl p-3 flex flex-col items-center justify-end gap-1 ${heights[i]}`}
                        style={{ border: i === 1 ? `1px solid ${community.color}66` : undefined }}>
                        <span className="text-2xl">{m.avatar}</span>
                        <p className="text-[10px] font-bold truncate w-full text-center" style={{ color: "var(--text)" }}>{m.name}</p>
                        <span className="text-lg">{medals[i]}</span>
                        <p className="text-[9px] font-bold" style={{ color: community.color }}>{m.xp.toLocaleString()} XP</p>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Full list */}
              {sortedMembers.map((m, i) => (
                <motion.div key={m.name}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all hover:bg-white/5"
                  style={{ background: m.name === user?.name ? community.color + "15" : undefined }}>
                  <span className="text-sm font-extrabold w-6 text-center" style={{ color: i < 3 ? "#fbbf24" : "var(--text-faint)" }}>{i + 1}</span>
                  <span className="text-xl">{m.avatar}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: m.name === user?.name ? community.color : "var(--text)" }}>
                      {m.name}{m.name === user?.name ? " (You)" : ""}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Level {m.level} · {m.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold" style={{ color: community.color }}>{m.xp.toLocaleString()}</p>
                    <p className="text-[9px]" style={{ color: "var(--text-faint)" }}>XP</p>
                  </div>
                </motion.div>
              ))}

              {sortedMembers.length === 0 && (
                <p className="text-sm text-center py-6" style={{ color: "var(--text-faint)" }}>No members yet</p>
              )}
            </div>

            {/* Challenge CTA */}
            <div className="glass card-shine rounded-2xl p-5 flex items-center gap-4"
              style={{ border: `1px solid ${community.color}33` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: community.color + "22" }}>⚔️</div>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: "var(--text)" }}>Community Challenge</p>
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>Compete with your community in the Arena</p>
              </div>
              <button onClick={() => router.push("/arena")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                style={{ background: community.color }}>
                <Swords size={13} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── MEMBERS ── */}
        {tab === "members" && (
          <motion.div key="members" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass card-shine rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                {community.memberCount} Members
              </p>
            </div>
            {community.members.map((m, i) => (
              <motion.div key={m.name}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 px-5 py-3.5 border-b transition-all hover:bg-white/5"
                style={{ borderColor: "var(--border)" }}>
                <span className="text-2xl">{m.avatar}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{m.name}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>Level {m.level} · Joined {timeAgo(m.joinedAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {m.role !== "member" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: community.color + "22", color: community.color }}>
                      {m.role === "admin" ? "👑 Admin" : "🛡️ Mod"}
                    </span>
                  )}
                  <span className="text-xs font-bold" style={{ color: community.color }}>{m.xp.toLocaleString()} XP</span>
                </div>
              </motion.div>
            ))}
            {community.members.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: "var(--text-faint)" }}>No members yet. Be the first to join!</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
