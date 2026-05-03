import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  type: "discussion" | "question" | "achievement" | "challenge";
  likes: number;
  replies: CommunityReply[];
  createdAt: number;
  tags: string[];
  likedBy: string[];
}

export interface CommunityReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: number;
  likes: number;
}

export interface CommunityMember {
  name: string;
  avatar: string;
  xp: number;
  level: number;
  role: "admin" | "moderator" | "member";
  joinedAt: number;
  verified: boolean;
  studentId?: string;
}

export type VerificationStatus = "none" | "pending" | "approved" | "rejected";

export interface JoinRequest {
  id: string;
  userName: string;
  userAvatar: string;
  studentId: string;
  idPhotoName: string;
  message: string;
  status: VerificationStatus;
  submittedAt: number;
}

export type BattleStatus = "open" | "live" | "ended";
export type BattleType = "1v1" | "group" | "college-war";

export interface CollegeBattle {
  id: string;
  title: string;
  challengerCollegeId: string;
  challengerCollegeName: string;
  challengerEmoji: string;
  opponentCollegeId: string;
  opponentCollegeName: string;
  opponentEmoji: string;
  battleType: BattleType;
  category: "dsa" | "coding" | "quiz" | "mixed";
  maxPlayersPerSide: number;
  challengerScore: number;
  opponentScore: number;
  status: BattleStatus;
  startDate: string;
  prize: string;
  createdAt: number;
  participants: { name: string; college: string; score: number }[];
}

export interface Community {
  id: string;
  name: string;
  college: string;
  description: string;
  emoji: string;
  color: string;
  memberCount: number;
  members: CommunityMember[];
  posts: CommunityPost[];
  createdAt: number;
  isPrivate: boolean;
  requiresVerification: boolean;
  tags: string[];
  activeChallengeId?: string;
  joinRequests: JoinRequest[];
  battles: CollegeBattle[];
}

export interface CommunityState {
  communities: Community[];
  joinedCommunityIds: string[];
  myVerificationStatus: Record<string, VerificationStatus>;

  createCommunity: (c: Omit<Community, "id" | "createdAt" | "memberCount" | "members" | "posts" | "joinRequests" | "battles">) => string;
  joinCommunity: (id: string, member: CommunityMember) => void;
  leaveCommunity: (id: string, memberName: string) => void;
  submitJoinRequest: (communityId: string, req: Omit<JoinRequest, "id" | "submittedAt" | "status">) => void;
  approveJoinRequest: (communityId: string, requestId: string, member: CommunityMember) => void;
  rejectJoinRequest: (communityId: string, requestId: string) => void;
  addPost: (communityId: string, post: Omit<CommunityPost, "id" | "createdAt" | "likes" | "replies" | "likedBy">) => void;
  likePost: (communityId: string, postId: string, userName: string) => void;
  addReply: (communityId: string, postId: string, reply: Omit<CommunityReply, "id" | "createdAt" | "likes">) => void;
  createBattle: (communityId: string, battle: Omit<CollegeBattle, "id" | "createdAt" | "challengerScore" | "opponentScore" | "participants">) => void;
  joinBattle: (communityId: string, battleId: string, participant: { name: string; college: string; score: number }) => void;
}

const MOCK_BATTLES: CollegeBattle[] = [
  {
    id: "b1",
    title: "MIT vs IIT Delhi — DSA Showdown",
    challengerCollegeId: "c1", challengerCollegeName: "MIT", challengerEmoji: "🏛️",
    opponentCollegeId: "c2", opponentCollegeName: "IIT Delhi", opponentEmoji: "⚡",
    battleType: "college-war", category: "dsa",
    maxPlayersPerSide: 10, challengerScore: 847, opponentScore: 792,
    status: "live", startDate: new Date().toISOString().split("T")[0],
    prize: "🏆 Bragging Rights + 500 XP each",
    createdAt: Date.now() - 86400000,
    participants: [
      { name: "AlgoQueen", college: "MIT", score: 285 },
      { name: "CodeNinja_X", college: "MIT", score: 270 },
      { name: "ReactRocket", college: "IIT Delhi", score: 260 },
      { name: "DataDragon", college: "IIT Delhi", score: 255 },
    ],
  },
  {
    id: "b2",
    title: "Stanford vs MIT — Web Dev Challenge",
    challengerCollegeId: "c3", challengerCollegeName: "Stanford", challengerEmoji: "🌲",
    opponentCollegeId: "c1", opponentCollegeName: "MIT", opponentEmoji: "🏛️",
    battleType: "group", category: "coding",
    maxPlayersPerSide: 5, challengerScore: 0, opponentScore: 0,
    status: "open", startDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    prize: "🎖️ 300 XP + Community Trophy",
    createdAt: Date.now() - 3600000,
    participants: [],
  },
];

const MOCK_COMMUNITIES: Community[] = [
  {
    id: "c1",
    name: "MIT Coders",
    college: "Massachusetts Institute of Technology",
    description: "Official coding community for MIT students. Discuss algorithms, share projects, and compete together!",
    emoji: "🏛️", color: "#a78bfa",
    memberCount: 342, isPrivate: true, requiresVerification: true,
    tags: ["algorithms", "research", "competitive"],
    createdAt: Date.now() - 86400000 * 30,
    activeChallengeId: "ch1",
    joinRequests: [
      { id: "jr1", userName: "NewStudent", userAvatar: "🧑💻", studentId: "MIT2024001", idPhotoName: "id_card.jpg", message: "I'm a sophomore at MIT studying CS.", status: "pending", submittedAt: Date.now() - 3600000 },
    ],
    battles: MOCK_BATTLES,
    members: [
      { name: "AlgoQueen", avatar: "👑", xp: 70100, level: 35, role: "admin", joinedAt: Date.now() - 86400000 * 30, verified: true, studentId: "MIT2023001" },
      { name: "CodeNinja_X", avatar: "🥷", xp: 84200, level: 42, role: "member", joinedAt: Date.now() - 86400000 * 20, verified: true, studentId: "MIT2022042" },
      { name: "ByteWizard", avatar: "🧙", xp: 76500, level: 38, role: "moderator", joinedAt: Date.now() - 86400000 * 25, verified: true, studentId: "MIT2023015" },
    ],
    posts: [
      {
        id: "p1", authorName: "AlgoQueen", authorAvatar: "👑", type: "discussion",
        content: "Just solved the Two Sum problem in O(n) using a hash map! Who else is grinding LeetCode this week? 💪",
        likes: 24, likedBy: ["ByteWizard", "CodeNinja_X"],
        replies: [
          { id: "r1", authorName: "ByteWizard", authorAvatar: "🧙", content: "Same! I'm on a 15-day streak. The hash map approach is so elegant.", createdAt: Date.now() - 3600000, likes: 5 },
          { id: "r2", authorName: "CodeNinja_X", authorAvatar: "🥷", content: "Try the sliding window problems next, they're 🔥", createdAt: Date.now() - 1800000, likes: 3 },
        ],
        tags: ["dsa", "leetcode"], createdAt: Date.now() - 7200000,
      },
      {
        id: "p2", authorName: "CodeNinja_X", authorAvatar: "🥷", type: "challenge",
        content: "🏆 COMMUNITY CHALLENGE: First person to solve all 5 DP problems on our arena this week gets 500 bonus XP! Who's in?",
        likes: 41, likedBy: [], replies: [], tags: ["challenge", "dp"], createdAt: Date.now() - 86400000,
      },
    ],
  },
  {
    id: "c2",
    name: "IIT Delhi Dev Club",
    college: "Indian Institute of Technology Delhi",
    description: "For IIT Delhi students passionate about competitive programming, web dev, and open source.",
    emoji: "⚡", color: "#f97316",
    memberCount: 218, isPrivate: true, requiresVerification: true,
    tags: ["competitive-programming", "web-dev", "open-source"],
    createdAt: Date.now() - 86400000 * 20,
    joinRequests: [],
    battles: MOCK_BATTLES,
    members: [
      { name: "ReactRocket", avatar: "🚀", xp: 62300, level: 31, role: "admin", joinedAt: Date.now() - 86400000 * 20, verified: true, studentId: "IITD2023031" },
      { name: "DataDragon", avatar: "🐉", xp: 58700, level: 29, role: "member", joinedAt: Date.now() - 86400000 * 15, verified: true, studentId: "IITD2023029" },
    ],
    posts: [
      {
        id: "p4", authorName: "ReactRocket", authorAvatar: "🚀", type: "question",
        content: "Anyone else preparing for ICPC? Looking for team members who are strong in graph theory and DP. DM me!",
        likes: 15, likedBy: [],
        replies: [{ id: "r3", authorName: "DataDragon", authorAvatar: "🐉", content: "I'm in! Strong in DP and segment trees.", createdAt: Date.now() - 3600000, likes: 2 }],
        tags: ["icpc", "team"], createdAt: Date.now() - 86400000 * 3,
      },
    ],
  },
  {
    id: "c3",
    name: "Stanford CS Circle",
    college: "Stanford University",
    description: "Stanford CS students sharing knowledge, projects, and competing in coding challenges.",
    emoji: "🌲", color: "#34d399",
    memberCount: 156, isPrivate: false, requiresVerification: false,
    tags: ["ml", "systems", "algorithms"],
    createdAt: Date.now() - 86400000 * 15,
    joinRequests: [],
    battles: MOCK_BATTLES.filter(b => b.challengerCollegeId === "c3" || b.opponentCollegeId === "c3"),
    members: [
      { name: "NeuralNomad", avatar: "🤖", xp: 48000, level: 24, role: "admin", joinedAt: Date.now() - 86400000 * 15, verified: true, studentId: "SU2023024" },
    ],
    posts: [],
  },
];

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      communities: MOCK_COMMUNITIES,
      joinedCommunityIds: [],
      myVerificationStatus: {},

      createCommunity: (c) => {
        const id = `comm_${Date.now()}`;
        set(s => ({
          communities: [...s.communities, { ...c, id, createdAt: Date.now(), memberCount: 1, members: [], posts: [], joinRequests: [], battles: [] }],
          joinedCommunityIds: [...s.joinedCommunityIds, id],
        }));
        return id;
      },

      joinCommunity: (id, member) => {
        set(s => ({
          communities: s.communities.map(c =>
            c.id === id && !c.members.find(m => m.name === member.name)
              ? { ...c, members: [...c.members, member], memberCount: c.memberCount + 1 }
              : c
          ),
          joinedCommunityIds: s.joinedCommunityIds.includes(id) ? s.joinedCommunityIds : [...s.joinedCommunityIds, id],
        }));
      },

      leaveCommunity: (id, memberName) => {
        set(s => ({
          communities: s.communities.map(c =>
            c.id === id ? { ...c, members: c.members.filter(m => m.name !== memberName), memberCount: Math.max(0, c.memberCount - 1) } : c
          ),
          joinedCommunityIds: s.joinedCommunityIds.filter(cid => cid !== id),
          myVerificationStatus: { ...s.myVerificationStatus, [id]: "none" },
        }));
      },

      submitJoinRequest: (communityId, req) => {
        const newReq: JoinRequest = { ...req, id: `jr_${Date.now()}`, submittedAt: Date.now(), status: "pending" };
        set(s => ({
          communities: s.communities.map(c =>
            c.id === communityId ? { ...c, joinRequests: [...c.joinRequests, newReq] } : c
          ),
          myVerificationStatus: { ...s.myVerificationStatus, [communityId]: "pending" },
        }));
      },

      approveJoinRequest: (communityId, requestId, member) => {
        set(s => ({
          communities: s.communities.map(c =>
            c.id === communityId ? {
              ...c,
              joinRequests: c.joinRequests.map(r => r.id === requestId ? { ...r, status: "approved" as const } : r),
              members: c.members.find(m => m.name === member.name) ? c.members : [...c.members, member],
              memberCount: c.members.find(m => m.name === member.name) ? c.memberCount : c.memberCount + 1,
            } : c
          ),
        }));
      },

      rejectJoinRequest: (communityId, requestId) => {
        set(s => ({
          communities: s.communities.map(c =>
            c.id === communityId ? {
              ...c,
              joinRequests: c.joinRequests.map(r => r.id === requestId ? { ...r, status: "rejected" as const } : r),
            } : c
          ),
        }));
      },

      addPost: (communityId, post) => {
        const newPost: CommunityPost = { ...post, id: `post_${Date.now()}`, createdAt: Date.now(), likes: 0, replies: [], likedBy: [] };
        set(s => ({ communities: s.communities.map(c => c.id === communityId ? { ...c, posts: [newPost, ...c.posts] } : c) }));
      },

      likePost: (communityId, postId, userName) => {
        set(s => ({
          communities: s.communities.map(c =>
            c.id === communityId ? {
              ...c, posts: c.posts.map(p =>
                p.id === postId && !p.likedBy.includes(userName) ? { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, userName] } : p
              ),
            } : c
          ),
        }));
      },

      addReply: (communityId, postId, reply) => {
        const newReply: CommunityReply = { ...reply, id: `reply_${Date.now()}`, createdAt: Date.now(), likes: 0 };
        set(s => ({
          communities: s.communities.map(c =>
            c.id === communityId ? {
              ...c, posts: c.posts.map(p => p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p),
            } : c
          ),
        }));
      },

      createBattle: (communityId, battle) => {
        const newBattle: CollegeBattle = { ...battle, id: `battle_${Date.now()}`, createdAt: Date.now(), challengerScore: 0, opponentScore: 0, participants: [] };
        set(s => ({
          communities: s.communities.map(c =>
            c.id === communityId ? { ...c, battles: [newBattle, ...c.battles] } : c
          ),
        }));
      },

      joinBattle: (communityId, battleId, participant) => {
        set(s => ({
          communities: s.communities.map(c =>
            c.id === communityId ? {
              ...c, battles: c.battles.map(b =>
                b.id === battleId && !b.participants.find(p => p.name === participant.name)
                  ? { ...b, participants: [...b.participants, participant] }
                  : b
              ),
            } : c
          ),
        }));
      },
    }),
    { name: "edustream-community" }
  )
);
