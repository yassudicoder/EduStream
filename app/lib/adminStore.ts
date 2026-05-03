import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuestionType = "mcq" | "coding" | "dsa";
export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";
export type TournamentStatus = "draft" | "open" | "live" | "ended";
export type TestStatus = "draft" | "open" | "live" | "ended";
export type BracketType = "single-elimination" | "double-elimination" | "round-robin" | "swiss";
export type Scope = "global" | "regional" | "company" | "classroom";

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  difficulty: Difficulty;
  points: number;
  timeLimit: number; // seconds
  options?: string[];       // for MCQ
  correctOption?: number;   // for MCQ
  starterCode?: string;     // for coding
  testCases?: { input: string; output: string; hidden: boolean }[];
  tags: string[];
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  creatorEmail: string;
  bracketType: BracketType;
  scope: Scope;
  region?: string;
  company?: string;
  maxParticipants: number;
  registeredCount: number;
  prizePool: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  questions: Question[];
  tags: string[];
  createdAt: number;
  participants: { name: string; score: number; rank: number }[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  creatorName: string;
  creatorEmail: string;
  scope: Scope;
  region?: string;
  company?: string;
  institution?: string;
  maxParticipants: number;
  registeredCount: number;
  duration: number; // minutes
  startDate: string;
  endDate: string;
  status: TestStatus;
  questions: Question[];
  passingScore: number; // percentage
  showResults: boolean;
  allowRetake: boolean;
  tags: string[];
  createdAt: number;
  submissions: { name: string; score: number; timeTaken: number; passed: boolean }[];
}

export interface AdminState {
  role: "creator" | "teacher" | "company" | null;
  creatorName: string;
  creatorEmail: string;
  tournaments: Tournament[];
  tests: Test[];

  setRole: (role: AdminState["role"], name: string, email: string) => void;
  createTournament: (t: Omit<Tournament, "id" | "createdAt" | "registeredCount" | "participants">) => string;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  createTest: (t: Omit<Test, "id" | "createdAt" | "registeredCount" | "submissions">) => string;
  updateTest: (id: string, updates: Partial<Test>) => void;
  deleteTest: (id: string) => void;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1", type: "mcq", title: "Big O of Binary Search", difficulty: "Easy", points: 10, timeLimit: 30,
    description: "What is the time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctOption: 2,
    tags: ["algorithms", "complexity"],
  },
  {
    id: "q2", type: "dsa", title: "Two Sum", difficulty: "Easy", points: 25, timeLimit: 900,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nExample: nums = [2,7,11,15], target = 9 → [0,1]",
    starterCode: "function twoSum(nums, target) {\n  // your code here\n}",
    testCases: [
      { input: "[2,7,11,15], 9", output: "[0,1]", hidden: false },
      { input: "[3,2,4], 6", output: "[1,2]", hidden: false },
      { input: "[3,3], 6", output: "[0,1]", hidden: true },
    ],
    tags: ["arrays", "hash-map"],
  },
  {
    id: "q3", type: "coding", title: "FizzBuzz", difficulty: "Easy", points: 15, timeLimit: 600,
    description: "Write a function that returns 'Fizz' for multiples of 3, 'Buzz' for multiples of 5, 'FizzBuzz' for both, else the number as string.",
    starterCode: "function fizzBuzz(n) {\n  // your code here\n}",
    testCases: [
      { input: "3", output: "Fizz", hidden: false },
      { input: "5", output: "Buzz", hidden: false },
      { input: "15", output: "FizzBuzz", hidden: true },
    ],
    tags: ["basics", "loops"],
  },
];

const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: "t1", title: "Global DSA Championship 2025", description: "The ultimate algorithmic battle for coders worldwide.",
    creatorName: "EduStream", creatorEmail: "admin@edustream.com",
    bracketType: "single-elimination", scope: "global", maxParticipants: 512, registeredCount: 347,
    prizePool: "$5,000", startDate: "2025-08-01", endDate: "2025-08-15",
    status: "open", questions: MOCK_QUESTIONS, tags: ["dsa", "algorithms", "global"],
    createdAt: Date.now() - 86400000 * 5,
    participants: [
      { name: "CodeNinja_X", score: 285, rank: 1 },
      { name: "ByteWizard", score: 270, rank: 2 },
      { name: "AlgoQueen", score: 255, rank: 3 },
    ],
  },
  {
    id: "t2", title: "React Hiring Challenge — TechCorp", description: "Top performers get fast-tracked to TechCorp interviews.",
    creatorName: "TechCorp HR", creatorEmail: "hr@techcorp.com",
    bracketType: "round-robin", scope: "company", company: "TechCorp", maxParticipants: 100, registeredCount: 67,
    prizePool: "Job Interview", startDate: "2025-07-20", endDate: "2025-07-25",
    status: "live", questions: MOCK_QUESTIONS.slice(0, 2), tags: ["react", "javascript", "hiring"],
    createdAt: Date.now() - 86400000 * 2,
    participants: [{ name: "ReactRocket", score: 95, rank: 1 }],
  },
];

const MOCK_TESTS: Test[] = [
  {
    id: "test1", title: "CS101 Midterm Exam", description: "Mid-semester assessment covering arrays, loops, and functions.",
    creatorName: "Prof. Smith", creatorEmail: "smith@university.edu",
    scope: "classroom", institution: "State University", maxParticipants: 60, registeredCount: 54,
    duration: 90, startDate: "2025-07-18", endDate: "2025-07-18",
    status: "ended", questions: MOCK_QUESTIONS, passingScore: 60, showResults: true, allowRetake: false,
    tags: ["cs101", "midterm", "university"],
    createdAt: Date.now() - 86400000 * 10,
    submissions: [
      { name: "Alice", score: 85, timeTaken: 72, passed: true },
      { name: "Bob", score: 55, timeTaken: 90, passed: false },
      { name: "Charlie", score: 92, timeTaken: 65, passed: true },
    ],
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      role: null,
      creatorName: "",
      creatorEmail: "",
      tournaments: MOCK_TOURNAMENTS,
      tests: MOCK_TESTS,

      setRole: (role, name, email) => set({ role, creatorName: name, creatorEmail: email }),

      createTournament: (t) => {
        const id = `t_${Date.now()}`;
        set(s => ({
          tournaments: [...s.tournaments, { ...t, id, createdAt: Date.now(), registeredCount: 0, participants: [] }],
        }));
        return id;
      },

      updateTournament: (id, updates) =>
        set(s => ({ tournaments: s.tournaments.map(t => t.id === id ? { ...t, ...updates } : t) })),

      deleteTournament: (id) =>
        set(s => ({ tournaments: s.tournaments.filter(t => t.id !== id) })),

      createTest: (t) => {
        const id = `test_${Date.now()}`;
        set(s => ({
          tests: [...s.tests, { ...t, id, createdAt: Date.now(), registeredCount: 0, submissions: [] }],
        }));
        return id;
      },

      updateTest: (id, updates) =>
        set(s => ({ tests: s.tests.map(t => t.id === id ? { ...t, ...updates } : t) })),

      deleteTest: (id) =>
        set(s => ({ tests: s.tests.filter(t => t.id !== id) })),
    }),
    { name: "edustream-admin" }
  )
);
