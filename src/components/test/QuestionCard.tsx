"use client"

import type { Question, LikertScore } from "@/data/questions"
import { clsx } from "clsx"

interface QuestionCardProps {
  question: Question
  order: number
  selectedValue?: LikertScore
  onAnswer: (score: LikertScore) => void
}

const scores: LikertScore[] = [1, 2, 3, 4, 5]

const getCircleStyles = (score: LikertScore, isSelected: boolean) => {
  if (score === 1) {
    return {
      size: "w-12 h-12 sm:w-14 sm:h-14",
      color: isSelected ? "bg-rose-500 border-rose-500" : "bg-transparent border-rose-500",
    }
  }
  if (score === 2) {
    return {
      size: "w-10 h-10 sm:w-12 sm:h-12",
      color: isSelected ? "bg-rose-400 border-rose-400" : "bg-transparent border-rose-400",
    }
  }
  if (score === 3) {
    return {
      size: "w-8 h-8 sm:w-10 sm:h-10",
      color: isSelected ? "bg-gray-400 border-gray-400" : "bg-transparent border-gray-300",
    }
  }
  if (score === 4) {
    return {
      size: "w-10 h-10 sm:w-12 sm:h-12",
      color: isSelected ? "bg-blue-400 border-blue-400" : "bg-transparent border-blue-400",
    }
  }
  if (score === 5) {
    return {
      size: "w-12 h-12 sm:w-14 sm:h-14",
      color: isSelected ? "bg-blue-500 border-blue-500" : "bg-transparent border-blue-500",
    }
  }
  return { size: "", color: "" }
}

export function QuestionCard({
  question,
  order,
  selectedValue,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div className="w-full bg-white py-12 px-4 md:px-8 rounded-3xl border border-[var(--color-hazzi-gray-300)] shadow-sm flex flex-col items-center justify-center">
      <h2 className="text-lg md:text-xl font-[family-name:var(--font-ibm-plex)] font-bold text-center text-[var(--color-hazzi-ink)] mb-12 max-w-2xl break-keep leading-relaxed">
        {order}. {question.text}
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl gap-6 sm:gap-4">
        <span className="hidden sm:block text-rose-500 font-bold text-sm md:text-base w-24 text-right">
          전혀 아니다
        </span>
        
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <span className="sm:hidden text-rose-500 font-bold text-xs whitespace-nowrap">
            전혀 아니다
          </span>
          {scores.map((score) => {
            const isSelected = selectedValue === score
            const styles = getCircleStyles(score, isSelected)
            return (
              <button
                key={score}
                type="button"
                onClick={() => onAnswer(score)}
                className={clsx(
                  "rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer",
                  styles.size,
                  styles.color
                )}
                aria-label={`Score ${score}`}
              />
            )
          })}
          <span className="sm:hidden text-blue-500 font-bold text-xs whitespace-nowrap">
            매우 그렇다
          </span>
        </div>

        <span className="hidden sm:block text-blue-500 font-bold text-sm md:text-base w-24 text-left">
          매우 그렇다
        </span>
      </div>
    </div>
  )
}
