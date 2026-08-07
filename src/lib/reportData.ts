import type { Answer, Question, ScoredQuestion } from "@/data/questions"
import { questions, categories } from "@/data/questions"
import type { DimensionScores, TestResult } from "./testLogic"
import type { TypeCode } from "@/data/questions"

export interface ReportAnswer {
  questionId: string
  category: string
  question: string
  answer: number
  reverse: boolean
}

export interface ReportData {
  reportId: string
  reportDate: string
  primaryType: TypeCode
  secondaryType: TypeCode
  scores: {
    initiation: number
    persistence: number
    recovery: number
    achievement: number
    relationship: number
    pressure: number
    exploration: number
    stimulation: number
  }
  answers: ReportAnswer[]
}

/**
 * 역문항 여부를 판단하는 헬퍼 함수
 * 가중치들의 합이 음수이면 역문항으로 간주합니다.
 */
function isReverseQuestion(question: Question): boolean {
  if (question.scoringRole !== "TYPE_SCORE") return false
  
  const weights = (question as ScoredQuestion).weights
  let sum = 0
  for (const weight of Object.values(weights)) {
    if (weight !== undefined) {
      sum += weight
    }
  }
  return sum < 0
}

/**
 * 기존 TestResult와 Answer 배열을 받아서 ReportData 객체로 변환합니다.
 */
export function generateReportData(
  reportId: string,
  testResult: TestResult,
  userAnswers: Answer[]
): ReportData {
  const reportAnswers: ReportAnswer[] = userAnswers.map((ans) => {
    const q = questions.find((q) => q.id === ans.questionId)
    const category = categories.find((c) => c.id === q?.categoryId)?.name || "기타"
    
    return {
      questionId: ans.questionId,
      category: category,
      question: q?.text || "",
      answer: ans.value,
      reverse: q ? isReverseQuestion(q) : false,
    }
  })

  return {
    reportId,
    reportDate: new Date().toISOString(),
    primaryType: testResult.finalType,
    secondaryType: testResult.secondaryType,
    scores: {
      initiation: testResult.dimensionScores.START,
      persistence: testResult.dimensionScores.PERSIST,
      recovery: testResult.dimensionScores.RECOVER,
      achievement: testResult.dimensionScores.ACHIEVE,
      relationship: testResult.dimensionScores.SOCIAL,
      pressure: testResult.dimensionScores.PERFECT, // PERFECT is mapped to pressure here
      exploration: testResult.dimensionScores.EXPLORE,
      stimulation: testResult.dimensionScores.STIMULUS,
    },
    answers: reportAnswers,
  }
}

/**
 * 대표 응답 문항 선정 (각 카테고리별 최대 3문항)
 * 기준: Math.abs(answer - 3) 값이 큰 순서대로 정렬
 */
export function getRepresentativeAnswers(reportData: ReportData): ReportAnswer[] {
  const representativeAnswers: ReportAnswer[] = []
  
  // 카테고리별로 그룹화
  const groupedByCategory = reportData.answers.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = []
    }
    acc[curr.category].push(curr)
    return acc
  }, {} as Record<string, ReportAnswer[]>)

  // 각 카테고리별로 정렬 후 최대 3개 추출
  for (const category in groupedByCategory) {
    const sortedAnswers = groupedByCategory[category].sort((a, b) => {
      const distA = Math.abs(a.answer - 3)
      const distB = Math.abs(b.answer - 3)
      // 거리(dist)가 큰 순서대로 내림차순 정렬
      return distB - distA
    })
    
    representativeAnswers.push(...sortedAnswers.slice(0, 3))
  }

  return representativeAnswers
}
