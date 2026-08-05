"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { Answer, LikertScore, TypeCode } from "@/data/questions"
import { categories } from "@/data/questions"
import { calculateResult } from "@/lib/testLogic"
import type { TestResult } from "@/lib/testLogic"

interface TestState {
  name: string
  phone: string
  answers: Answer[]
  currentCategoryIndex: number
  finalType: TypeCode | null
  secondaryType: TypeCode | null
  dimensionScores: TestResult["dimensionScores"] | null
  typeFitScores: TestResult["typeFitScores"] | null
  ranking: TestResult["ranking"] | null
  referenceSignals: string[] | null
  resultId: string | null
  isComplete: boolean
}

interface TestContextType extends TestState {
  setParticipantInfo: (name: string, phone: string) => void
  answerQuestion: (questionId: string, score: LikertScore) => void
  nextCategory: () => void
  reset: () => void
  setResultId: (id: string) => void
  totalCategories: number
}

const TestContext = createContext<TestContextType | null>(null)

const initialState: TestState = {
  name: "",
  phone: "",
  answers: [],
  currentCategoryIndex: 0,
  finalType: null,
  secondaryType: null,
  dimensionScores: null,
  typeFitScores: null,
  ranking: null,
  referenceSignals: null,
  resultId: null,
  isComplete: false,
}

export function TestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TestState>(initialState)

  const setParticipantInfo = useCallback((name: string, phone: string) => {
    setState((prev) => ({ ...prev, name, phone }))
  }, [])

  const answerQuestion = useCallback((questionId: string, score: LikertScore) => {
    setState((prev) => {
      const newAnswer: Answer = { questionId, value: score }
      const existingIndex = prev.answers.findIndex(a => a.questionId === questionId)
      
      let newAnswers = [...prev.answers]
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = newAnswer
      } else {
        newAnswers.push(newAnswer)
      }

      return { ...prev, answers: newAnswers }
    })
  }, [])

  const nextCategory = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentCategoryIndex + 1

      if (nextIndex >= categories.length) {
        const result = calculateResult(prev.answers)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("test-result", JSON.stringify({ ...result, answers: prev.answers }))
        }
        return { ...prev, ...result, isComplete: true }
      }

      return { ...prev, currentCategoryIndex: nextIndex }
    })
  }, [])

  const setResultId = useCallback((id: string) => {
    setState((prev) => ({ ...prev, resultId: id }))
  }, [])

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("test-result")
    }
    setState(initialState)
  }, [])

  return (
    <TestContext.Provider
      value={{
        ...state,
        setParticipantInfo,
        answerQuestion,
        nextCategory,
        reset,
        setResultId,
        totalCategories: categories.length,
      }}
    >
      {children}
    </TestContext.Provider>
  )
}

export function useTest() {
  const ctx = useContext(TestContext)
  if (!ctx) throw new Error("useTest must be used within TestProvider")
  return ctx
}
