"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/app/lib/gameStore";
import { getLesson, getLessonsByLanguage } from "@/app/lib/lessons";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, X, BookOpen } from "lucide-react";

interface LessonPageProps {
  params: Promise<{ lang: string; lessonId: string }>;
}

export default function LessonPage({ params: paramsPromise }: LessonPageProps) {
  const router = useRouter();
  const { user, completeLesson, languages } = useGameStore();
  const [step, setStep] = useState<"content" | "practice" | "quiz" | "result">("content");
  const [practiceAnswers, setPracticeAnswers] = useState<string[]>([]);
  const [practiceComplete, setPracticeComplete] = useState(false);
  const [quizProgress, setQuizProgress] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [params, setParams] = useState<{ lang: string; lessonId: string } | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    };
    unwrapParams();
  }, [paramsPromise]);

  const lang = params?.lang || "";
  const lessonId = params?.lessonId || "";
  const lesson = getLesson(lang, lessonId);
  const allLessons = getLessonsByLanguage(lang);
  const lessons = allLessons || [];
  const currentIndex = lessons.findIndex(l => l.id === lessonId);
  const nextLesson = lessons[currentIndex + 1];
  const prevLesson = lessons[currentIndex - 1];

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!params || !user) {
    return null;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Lesson not found</p>
      </div>
    );
  }

  const handleStartQuiz = () => {
    setAnswers(new Array(lesson.quiz.length).fill(-1));
    setStep("quiz");
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    lesson.quiz.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });
    const finalScore = Math.round((correctCount / lesson.quiz.length) * 100);
    setScore(finalScore);
    completeLesson(lang, lessonId, finalScore);
    setStep("result");
  };

  const currentQuestion = lesson.quiz[quizProgress];
  const allAnswered = answers.every(a => a !== -1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold">
                {lang}
              </p>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">{lesson.title}</h1>
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Lesson {currentIndex + 1} of {lessons.length}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === "content" && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Description */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <p className="text-gray-600 dark:text-gray-300">{lesson.description}</p>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-full ${
                        level <= lesson.level
                          ? "bg-amber-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Level {lesson.level} • {lesson.estimatedTime} min
                </span>
              </div>

              {/* Content Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  📚 Lesson Content
                </h2>
                <div className="prose prose-invert dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {lesson.content}
                  </p>
                </div>
              </div>

              {/* Code Example */}
              <div className="bg-gray-900 dark:bg-gray-950 rounded-xl shadow-md overflow-hidden">
                <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                  <p className="text-sm font-semibold text-gray-300">💻 Code Example</p>
                </div>
                <pre className="p-6 overflow-x-auto text-sm text-gray-100">
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>

              {/* Practice Button */}
              {lesson.practice && (
                <motion.button
                  onClick={() => {
                    setPracticeAnswers(new Array(lesson.practice!.blanks.length).fill(""));
                    setPracticeComplete(false);
                    setStep("practice");
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📝 Practice - Fill in the Blanks
                </motion.button>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-2">
                  {prevLesson && (
                    <motion.button
                      onClick={() => router.push(`/learn/${lang}/${prevLesson.id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </motion.button>
                  )}
                </div>

                <motion.button
                  onClick={handleStartQuiz}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Quiz
                  <ChevronRight className="w-4 h-4" />
                </motion.button>

                {nextLesson && (
                  <motion.button
                    onClick={() => router.push(`/learn/${lang}/${nextLesson.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {step === "practice" && lesson.practice && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Practice Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {lesson.practice.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {lesson.practice.description}
                </p>

                {/* Code with Blanks */}
                <div className="bg-gray-900 dark:bg-gray-950 rounded-lg overflow-hidden mb-6">
                  <div className="bg-gray-800 px-6 py-3 border-b border-gray-700">
                    <p className="text-sm font-semibold text-gray-300">📝 Fill in the blanks:</p>
                  </div>
                  <pre className="p-6 overflow-x-auto text-sm text-gray-100">
                    <code>
                      {lesson.practice.code.split("{blank}").map((part, idx) => (
                        <span key={idx}>
                          {part}
                          {idx < lesson.practice!.blanks.length && (
                            <input
                              type="text"
                              value={practiceAnswers[idx] || ""}
                              onChange={(e) => {
                                const newAnswers = [...practiceAnswers];
                                newAnswers[idx] = e.target.value;
                                setPracticeAnswers(newAnswers);
                              }}
                              placeholder={`Blank ${idx + 1}`}
                              title={lesson.practice!.blanks[idx].hint}
                              className="bg-yellow-200 text-gray-900 rounded px-2 py-1 w-32 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                          )}
                        </span>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Hints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {lesson.practice.blanks.map((blank, idx) => (
                    <div
                      key={blank.id}
                      className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                        Blank {idx + 1}: {blank.hint}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={() => {
                    const allCorrect = practiceAnswers.every((answer, idx) =>
                      answer.trim().toLowerCase() ===
                      lesson.practice!.blanks[idx].answer.trim().toLowerCase()
                    );
                    if (allCorrect) {
                      setPracticeComplete(true);
                    } else {
                      alert(
                        "Some answers are incorrect. Check the hints and try again!"
                      );
                    }
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Check Answers
                </motion.button>

                {/* Success Message */}
                {practiceComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <p className="text-green-700 dark:text-green-300 font-semibold">
                      ✅ Excellent! All answers are correct. Ready for the quiz?
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <motion.button
                  onClick={() => setStep("content")}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Content
                </motion.button>

                {practiceComplete && (
                  <motion.button
                    onClick={() => {
                      setAnswers(new Array(lesson.quiz.length).fill(-1));
                      setStep("quiz");
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Quiz
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {step === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-800 dark:text-white">
                    Question {quizProgress + 1} of {lesson.quiz.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {quizProgress + 1}/{lesson.quiz.length}
                  </p>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((quizProgress + 1) / lesson.quiz.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question */}
              <motion.div
                key={quizProgress}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
              >
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  {currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleAnswerSelect(quizProgress, idx)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition ${
                        answers[quizProgress] === idx
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[quizProgress] === idx
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-400"
                          }`}
                        >
                          {answers[quizProgress] === idx && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <motion.button
                  onClick={() => setQuizProgress(Math.max(0, quizProgress - 1))}
                  disabled={quizProgress === 0}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Previous
                </motion.button>

                <div className="flex gap-2">
                  {Array.from({ length: lesson.quiz.length }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuizProgress(idx)}
                      className={`w-8 h-8 rounded-full font-semibold transition ${
                        answers[idx] !== -1
                          ? "bg-green-500 text-white"
                          : idx === quizProgress
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {quizProgress === lesson.quiz.length - 1 ? (
                  <motion.button
                    onClick={handleSubmitQuiz}
                    disabled={!allAnswered}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Quiz
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setQuizProgress(quizProgress + 1)}
                    disabled={answers[quizProgress] === -1}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next Question
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Result Card */}
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-6">
                  {score >= 70 ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.6 }}
                      className="text-6xl mb-4"
                    >
                      🎉
                    </motion.div>
                  ) : (
                    <div className="text-6xl mb-4">📚</div>
                  )}
                </div>

                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {score >= 90 ? "Perfect!" : score >= 70 ? "Great Job!" : "Good Try!"}
                </h2>

                <div className="my-8">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {score}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {score >= 70
                      ? "Lesson completed! You can move to the next lesson."
                      : "Try again to improve your score!"}
                  </p>
                </div>

                {/* Answer Review */}
                <div className="mt-8 max-h-64 overflow-y-auto space-y-3 text-left">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Answer Review:
                  </p>
                  {lesson.quiz.map((q, idx) => {
                    const isCorrect = answers[idx] === q.correct;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${
                          isCorrect
                            ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500"
                            : "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                              Q{idx + 1}: {q.question}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Your answer: {q.options[answers[idx]]}
                            </p>
                            {!isCorrect && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Correct answer: {q.options[q.correct]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4">
                {score < 70 && (
                  <motion.button
                    onClick={() => {
                      setStep("quiz");
                      setQuizProgress(0);
                      setAnswers(new Array(lesson.quiz.length).fill(-1));
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </motion.button>
                )}

                {nextLesson && (
                  <motion.button
                    onClick={() => router.push(`/learn/${lang}/${nextLesson.id}`)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next Lesson →
                  </motion.button>
                )}

                <motion.button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Dashboard
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
