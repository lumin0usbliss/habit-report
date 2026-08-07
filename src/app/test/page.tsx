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
    <div className="flex-1 flex flex-col bg-[var(--color-hazzi-canvas)] min-h-screen pt-16 pb-20 sm:pb-32">
      <Header />
      <div ref={topRef} className="sticky top-16 z-40 bg-[var(--color-hazzi-canvas)]/90 backdrop-blur-md pt-3 px-3 pb-2.5 sm:pt-8 sm:px-6 sm:pb-4 border-b border-[var(--color-hazzi-gray-300)]">
        <div className="max-w-3xl mx-auto flex items-end justify-between gap-2 sm:gap-4 md:gap-8">
          <div className="shrink-0">
            <span className="font-[family-name:var(--font-space)] text-[var(--color-hazzi-magenta)] font-bold text-xs sm:text-sm tracking-widest block mb-0.5 sm:mb-1 uppercase">
              {currentCategory.englishLabel}
            </span>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold font-[family-name:var(--font-ibm-plex)] text-[var(--color-hazzi-ink)] whitespace-nowrap">
              {currentCategory.name}
            </h1>
          </div>
          
          <div className="flex-1 min-w-[80px] sm:min-w-[100px] max-w-sm px-1 sm:px-2 md:px-4 pb-0.5 sm:pb-1">
            <ProgressBar current={currentCategoryIndex} total={totalCategories} />
          </div>

          <div className="shrink-0 text-right pb-0.5 sm:pb-1">
            <span className="text-xs sm:text-sm font-mono text-[var(--color-hazzi-gray-500)] block mb-0.5 sm:mb-1">
              {currentCategoryIndex + 1} / {totalCategories}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-[var(--color-hazzi-ink)] whitespace-nowrap">
              {answeredCount} / {categoryQuestions.length} 완료
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-3 py-4 sm:px-4 sm:py-8 max-w-3xl mx-auto w-full gap-4 sm:gap-8">
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
      <div className="fixed bottom-0 left-0 right-0 p-2.5 sm:p-4 bg-white border-t border-[var(--color-hazzi-gray-300)] z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            type="button"
            onClick={prevCategory}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-lg transition-all ${
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
            className={`flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-lg transition-all ${
              allAnswered 
                ? "bg-[var(--color-hazzi-ink)] text-white hover:bg-black cursor-pointer shadow-lg transform hover:-translate-y-1" 
                : "bg-[var(--color-hazzi-gray-300)] text-[var(--color-hazzi-gray-500)] cursor-not-allowed"
            }`}
          >
            {currentCategoryIndex === totalCategories - 1 ? "결과 확인하기" : "다음 단계로"}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
