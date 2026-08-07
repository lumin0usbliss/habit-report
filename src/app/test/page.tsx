"use client"

import { useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { TestProvider, useTest } from "@/context/TestContext"
import { questions, categories } from "@/data/questions"
import { QuestionCard } from "@/components/test/QuestionCard"
import { ProgressBar } from "@/components/test/ProgressBar"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function TestPage() {
  const { currentCategoryIndex, isComplete, finalType, answerQuestion, nextCategory, prevCategory, answers, totalCategories } = useTest()
  const router = useRouter()
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Redirect if no participant info
    const name = typeof window !== "undefined" ? sessionStorage.getItem("participant-name") : null
    if (!name) router.replace("/apply")
  }, [router])

  useEffect(() => {
    if (isComplete && finalType) {
      router.push("/result")
    }
  }, [isComplete, finalType, router])

  // Scroll to top when category changes
  useEffect(() => {
    if (topRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentCategoryIndex])

  const currentCategory = categories[currentCategoryIndex]
  
  const categoryQuestions = useMemo(() => {
    if (!currentCategory) return []
    return questions.filter(q => q.categoryId === currentCategory.id).sort((a, b) => a.order - b.order)
  }, [currentCategory])

  if (!currentCategory || categoryQuestions.length === 0) return null

  // Check if all questions in this category are answered
  const answeredCount = categoryQuestions.filter(q => answers.some(a => a.questionId === q.id)).length
  const allAnswered = answeredCount === categoryQuestions.length

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-hazzi-canvas)] min-h-screen pt-16 pb-32">
      <Header />
      <div ref={topRef} className="sticky top-16 z-40 bg-[var(--color-hazzi-canvas)]/90 backdrop-blur-md pt-8 px-6 pb-4 border-b border-[var(--color-hazzi-gray-300)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
          <div>
            <span className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-magenta)] font-bold text-sm tracking-widest block mb-1">
              {currentCategory.englishLabel}
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-ibm-plex)] text-[var(--color-hazzi-ink)]">
              {currentCategory.name}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-sm font-mono text-[var(--color-hazzi-gray-500)] block mb-1">
              {currentCategoryIndex + 1} / {totalCategories}
            </span>
            <span className="text-xs font-bold text-[var(--color-hazzi-ink)]">
              {answeredCount} / {categoryQuestions.length} 완료
            </span>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          <ProgressBar current={currentCategoryIndex} total={totalCategories} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-3xl mx-auto w-full gap-8">
        {categoryQuestions.map((question, index) => {
          const selectedAnswer = answers.find(a => a.questionId === question.id)
          return (
            <motion.div 
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-full"
            >
              <QuestionCard
                question={question}
                order={index + 1}
                selectedValue={selectedAnswer?.value}
                onAnswer={(score) => answerQuestion(question.id, score)}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Fixed bottom bar for Next/Prev buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-hazzi-gray-300)] z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            type="button"
            onClick={prevCategory}
            className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-lg transition-all ${
              currentCategoryIndex === 0 
                ? "invisible" 
                : "text-[var(--color-hazzi-gray-500)] hover:bg-[var(--color-hazzi-gray-100)] cursor-pointer"
            }`}
          >
            이전 단계로
          </button>
          
          <button
            type="button"
            disabled={!allAnswered}
            onClick={nextCategory}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              allAnswered 
                ? "bg-[var(--color-hazzi-ink)] text-white hover:bg-black cursor-pointer shadow-lg transform hover:-translate-y-1" 
                : "bg-[var(--color-hazzi-gray-300)] text-[var(--color-hazzi-gray-500)] cursor-not-allowed"
            }`}
          >
            {currentCategoryIndex === totalCategories - 1 ? "결과 확인하기" : "다음 단계로"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
