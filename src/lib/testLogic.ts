import type { TypeCode, Answer, ScoredQuestion, ReferenceQuestion } from "@/data/questions"
import { questions } from "@/data/questions"
import type { DimensionId } from "@/data/scoring"
import { typeProfiles, typeImportances } from "@/data/scoring"

export type DimensionScores = Record<DimensionId, number>
export type TypeScores = Record<TypeCode, number> // Now representing typeFitScores (0~100)
export type TypeRanking = Array<{ type: TypeCode; score: number }>

export interface TestResult {
  finalType: TypeCode
  secondaryType: TypeCode
  dimensionScores: DimensionScores
  typeFitScores: TypeScores
  ranking: TypeRanking
  referenceSignals: string[]
}

export function calculateDimensionRawScores(answers: Answer[]): DimensionScores {
  const scores: DimensionScores = {
    START: 0, PERSIST: 0, RECOVER: 0, ACHIEVE: 0,
    SOCIAL: 0, PERFECT: 0, EXPLORE: 0, STIMULUS: 0
  }

  const scoredQuestions = questions.filter(q => q.scoringRole === "TYPE_SCORE") as ScoredQuestion[]

  for (const question of scoredQuestions) {
    const answer = answers.find(a => a.questionId === question.id)
    if (!answer) continue

    const centeredScore = answer.value - 3

    for (const [dim, weight] of Object.entries(question.weights)) {
      if (weight !== undefined) {
        scores[dim as DimensionId] += centeredScore * weight
      }
    }
  }

  return scores
}

export function normalizeDimensionScores(rawScores: DimensionScores): DimensionScores {
  const maxAbsScores: DimensionScores = {
    START: 0, PERSIST: 0, RECOVER: 0, ACHIEVE: 0,
    SOCIAL: 0, PERFECT: 0, EXPLORE: 0, STIMULUS: 0
  }

  const scoredQuestions = questions.filter(q => q.scoringRole === "TYPE_SCORE") as ScoredQuestion[]

  for (const question of scoredQuestions) {
    for (const [dim, weight] of Object.entries(question.weights)) {
      if (weight !== undefined) {
        maxAbsScores[dim as DimensionId] += 2 * Math.abs(weight)
      }
    }
  }

  const result = {} as DimensionScores
  for (const dim of Object.keys(rawScores) as DimensionId[]) {
    const maxAbs = maxAbsScores[dim]
    result[dim] = maxAbs === 0
      ? 50
      : Math.max(0, Math.min(100, 50 + 50 * (rawScores[dim] / maxAbs)))
  }

  return result
}

export function calculateTypeFitScore(userScores: DimensionScores, typeCode: TypeCode): number {
  const profile = typeProfiles[typeCode]
  const importance = typeImportances[typeCode]

  let weightedDistanceSum = 0
  let importanceSum = 0

  for (const dim of Object.keys(userScores) as DimensionId[]) {
    const imp = importance[dim]
    if (imp <= 0) continue

    const distance = Math.abs(userScores[dim] - profile[dim])
    weightedDistanceSum += imp * distance
    importanceSum += imp
  }

  if (importanceSum === 0) return 0
  return Math.max(0, Math.min(100, 100 - (weightedDistanceSum / importanceSum)))
}

export function calculateRanking(userScores: DimensionScores): TypeRanking {
  const fitScores: Partial<TypeScores> = {}

  const typeCodes: TypeCode[] = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9"]
  for (const typeCode of typeCodes) {
    fitScores[typeCode] = calculateTypeFitScore(userScores, typeCode)
  }

  return (Object.entries(fitScores) as [TypeCode, number][])
    .map(([type, score]) => ({ type, score }))
    .sort((a, b) => {
      // 1. Sort by score
      if (Math.abs(a.score - b.score) > 0.1) {
        return b.score - a.score
      }
      return a.type.localeCompare(b.type)
    })
}

export function extractReferenceSignals(answers: Answer[]): string[] {
  const signals: string[] = []
  const refQuestions = questions.filter(q => q.scoringRole === "REFERENCE_ONLY" && !q.isSensitive) as ReferenceQuestion[]

  for (const question of refQuestions) {
    const answer = answers.find(a => a.questionId === question.id)
    if (answer && answer.value >= 4) { // Treat Likert 4, 5 as "true"
      if (question.signalTag) {
        signals.push(question.signalTag)
      }
    }
  }

  return Array.from(new Set(signals))
}

export function calculateResult(answers: Answer[]): TestResult {
  const rawScores = calculateDimensionRawScores(answers)
  const normalizedScores = normalizeDimensionScores(rawScores)
  
  const ranking = calculateRanking(normalizedScores)
  
  const typeFitScores = {} as TypeScores
  ranking.forEach(r => { typeFitScores[r.type] = r.score })
  
  const finalType = ranking[0].type
  let secondaryType = ranking[1].type
  if (secondaryType === finalType) {
    secondaryType = ranking[2].type
  }

  const referenceSignals = extractReferenceSignals(answers)

  return {
    finalType,
    secondaryType,
    dimensionScores: normalizedScores,
    typeFitScores,
    ranking,
    referenceSignals
  }
}
