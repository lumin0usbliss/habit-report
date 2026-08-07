import type { Answer, Question, ScoredQuestion, TypeCode } from "@/data/questions"
import { questions, categories } from "@/data/questions"
import type { DimensionScores, TestResult } from "./testLogic"
import type { DimensionId } from "@/data/scoring"

export interface ReportAnswer {
  questionId: string
  categoryId?: string
  category: string
  questionNumber?: number
  question: string
  answer: number // rawAnswer (1..5)
  scoredAnswer?: number // calculated score considering reverse
  reverse: boolean
  relatedFactor?: string
  factorScore?: number
  influenceScore?: number
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

const typePrimaryDimensions: Record<TypeCode, DimensionId[]> = {
  T1: ["START", "PERSIST"],
  T2: ["START", "PERFECT"],
  T3: ["START", "STIMULUS"],
  T4: ["PERSIST", "ACHIEVE"],
  T5: ["PERSIST", "RECOVER"],
  T6: ["SOCIAL", "ACHIEVE"],
  T7: ["EXPLORE", "PERFECT"],
  T8: ["RECOVER", "STIMULUS"],
  T9: ["STIMULUS", "START"],
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
 * 각 문항의 영향도(influenceScore)를 계산하는 함수
 */
export function calculateInfluenceScore(
  question: Question,
  rawAnswer: number,
  dimensionScores: Record<DimensionId, number>,
  primaryType: TypeCode,
  secondaryType: TypeCode
): { scoredAnswer: number; relatedFactor: string; factorScore: number; influenceScore: number } {
  const reverse = isReverseQuestion(question)
  const scoredAnswer = reverse ? (6 - rawAnswer) : rawAnswer
  const responseExtremity = Math.abs(scoredAnswer - 3) // 0, 1, or 2

  let relatedFactor: DimensionId = "START"
  let maxWeight = 1.0

  if (question.scoringRole === "TYPE_SCORE" && question.weights) {
    let highestAbsWeight = 0
    for (const [dim, w] of Object.entries(question.weights)) {
      if (w !== undefined && Math.abs(w) > highestAbsWeight) {
        highestAbsWeight = Math.abs(w)
        relatedFactor = dim as DimensionId
        maxWeight = Math.abs(w)
      }
    }
  } else {
    if (question.categoryId === "cat2") relatedFactor = "START"
    else if (question.categoryId === "cat4") relatedFactor = "PERSIST"
    else if (question.categoryId === "cat5") relatedFactor = "ACHIEVE"
    else if (question.categoryId === "cat6") relatedFactor = "RECOVER"
    else if (question.categoryId === "cat7") relatedFactor = "SOCIAL"
  }

  const factorScore = dimensionScores[relatedFactor] ?? 50
  const factorDistinctiveness = Math.abs(factorScore - 50) / 50

  const primDims = typePrimaryDimensions[primaryType] || []
  const secDims = typePrimaryDimensions[secondaryType] || []
  let typeRelevance = 0
  if (primDims.includes(relatedFactor)) typeRelevance += 0.5
  if (secDims.includes(relatedFactor)) typeRelevance += 0.3

  let patternRelevance = 0
  if (rawAnswer === 5 || rawAnswer === 1) patternRelevance += 0.3

  const influenceScore = (responseExtremity * maxWeight * (1 + factorDistinctiveness)) + typeRelevance + patternRelevance

  return {
    scoredAnswer,
    relatedFactor,
    factorScore,
    influenceScore: Number(influenceScore.toFixed(2))
  }
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
    const categoryObj = categories.find((c) => c.id === q?.categoryId)
    const categoryName = categoryObj?.name || "기타"
    const categoryId = q?.categoryId || ""
    const questionNumber = q?.order || 0
    const reverse = q ? isReverseQuestion(q) : false
    
    let scoredAnswer: number = ans.value
    let relatedFactor = "START"
    let factorScore = 50
    let influenceScore = Math.abs(ans.value - 3)

    if (q && testResult.dimensionScores) {
      const calc = calculateInfluenceScore(
        q,
        ans.value,
        testResult.dimensionScores,
        testResult.finalType,
        testResult.secondaryType
      )
      scoredAnswer = calc.scoredAnswer
      relatedFactor = calc.relatedFactor
      factorScore = calc.factorScore
      influenceScore = calc.influenceScore
    }

    return {
      questionId: ans.questionId,
      categoryId,
      category: categoryName,
      questionNumber,
      question: q?.text || "",
      answer: ans.value, // rawAnswer
      scoredAnswer,
      reverse,
      relatedFactor,
      factorScore,
      influenceScore,
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
      pressure: testResult.dimensionScores.PERFECT,
      exploration: testResult.dimensionScores.EXPLORE,
      stimulation: testResult.dimensionScores.STIMULUS,
    },
    answers: reportAnswers,
  }
}

/**
 * 각 카테고리별로 influenceScore가 가장 높은 TOP 3 문항을 선정합니다.
 * Tie-breaker:
 * 1. influenceScore 높은 순
 * 2. responseExtremity (abs(scoredAnswer - 3)) 높은 순
 * 3. factorDistinctiveness (abs(factorScore - 50)) 높은 순
 * 4. questionNumber 오름차순 (원래 번호)
 */
export function getCategoryTopAnswers(
  reportData: ReportData,
  categoryId: string,
  limit = 3
): ReportAnswer[] {
  let categoryAnswers = reportData.answers.filter(
    (a) => a.categoryId === categoryId || a.category === categoryId
  )

  // Fallback if matching by categoryId yields nothing, match by category name index or prefix
  if (categoryAnswers.length === 0) {
    const allCategories = Array.from(new Set(reportData.answers.map(a => a.category)))
    if (categoryId === "cat1") categoryAnswers = reportData.answers.filter(a => a.category === allCategories[0])
    else if (categoryId === "cat2") categoryAnswers = reportData.answers.filter(a => a.category === allCategories[1])
    else if (categoryId === "cat6") categoryAnswers = reportData.answers.filter(a => a.category === allCategories[5] || a.category === allCategories[2])
    else if (categoryId === "cat7") categoryAnswers = reportData.answers.filter(a => a.category === allCategories[6] || a.category === allCategories[3])
  }

  const sorted = [...categoryAnswers].sort((a, b) => {
    const scoreA = a.influenceScore ?? Math.abs(a.answer - 3)
    const scoreB = b.influenceScore ?? Math.abs(b.answer - 3)
    if (scoreB !== scoreA) {
      return scoreB - scoreA
    }
    const extA = Math.abs((a.scoredAnswer ?? a.answer) - 3)
    const extB = Math.abs((b.scoredAnswer ?? b.answer) - 3)
    if (extB !== extA) {
      return extB - extA
    }
    const distA = Math.abs((a.factorScore ?? 50) - 50)
    const distB = Math.abs((b.factorScore ?? 50) - 50)
    if (distB !== distA) {
      return distB - distA
    }
    const qNumA = a.questionNumber ?? 99
    const qNumB = b.questionNumber ?? 99
    return qNumA - qNumB
  })

  const selected = sorted.slice(0, limit)

  if (typeof window !== "undefined") {
    console.log(`[QA Verification - Category: ${categoryId}] Selected Top ${limit} Questions:`)
    selected.forEach((ans) => {
      const qNumStr = ans.questionNumber ? `Q${String(ans.questionNumber).padStart(2, "0")}` : `ID:${ans.questionId}`
      console.log(`  ${qNumStr} (${ans.questionId}):`, {
        category: ans.category,
        questionNumber: ans.questionNumber ?? "N/A",
        questionId: ans.questionId,
        rawAnswer: ans.answer,
        scoredAnswer: ans.scoredAnswer ?? ans.answer,
        relatedFactor: ans.relatedFactor ?? "N/A",
        factorScore: ans.factorScore ?? 50,
        influenceScore: ans.influenceScore ?? Math.abs(ans.answer - 3),
      })
    })
  }

  return selected
}

/**
 * 대표 응답 문항 전체 추출 (하위 호환성용)
 */
export function getRepresentativeAnswers(reportData: ReportData): ReportAnswer[] {
  const representativeAnswers: ReportAnswer[] = []
  
  const groupedByCategory = reportData.answers.reduce((acc, curr) => {
    const catKey = curr.categoryId || curr.category || "cat1"
    if (!acc[catKey]) {
      acc[catKey] = []
    }
    acc[catKey].push(curr)
    return acc
  }, {} as Record<string, ReportAnswer[]>)

  for (const catId in groupedByCategory) {
    representativeAnswers.push(...getCategoryTopAnswers(reportData, catId, 3))
  }

  return representativeAnswers
}

