import { createClient } from "@supabase/supabase-js"
import type { TypeCode, Answer } from "@/data/questions"
import type { TypeScores, TypeRanking, TestResult } from "@/lib/testLogic"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export interface TestResultRow {
  id: string
  name: string
  phone: string | null
  final_type: TypeCode
  secondary_type: TypeCode
  dimension_scores: TestResult["dimensionScores"]
  type_fit_scores: TestResult["typeFitScores"]
  ranking: TypeRanking
  reference_signals: string[]
  answers: Answer[]
  created_at: string
}

export interface SaveResultParams {
  name: string
  phone?: string
  finalType: TypeCode
  secondaryType: TypeCode
  dimensionScores: TestResult["dimensionScores"]
  typeFitScores: TestResult["typeFitScores"]
  ranking: TypeRanking
  referenceSignals: string[]
  answers: Answer[]
}

export async function saveTestResult(params: SaveResultParams): Promise<string | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from("test_results")
      .insert({
        name: params.name,
        phone: params.phone || null,
        final_type: params.finalType,
        secondary_type: params.secondaryType,
        dimension_scores: params.dimensionScores,
        type_fit_scores: params.typeFitScores,
        ranking: params.ranking,
        reference_signals: params.referenceSignals,
        answers: params.answers,
      })
      .select("id")
      .single()
    if (error || !data) return null
    return data.id as string
  } catch {
    return null
  }
}

export async function getResultById(id: string): Promise<TestResultRow | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from("test_results")
      .select("*")
      .eq("id", id)
      .single()
    if (error || !data) return null
    return data as TestResultRow
  } catch {
    return null
  }
}

export async function getResultCounts(): Promise<Record<TypeCode, number>> {
  const defaults = { T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0, T7: 0, T8: 0, T9: 0 } as Record<TypeCode, number>
  if (!supabase) return defaults
  try {
    const { data } = await supabase.from("test_results").select("final_type")
    if (!data) return defaults
    for (const row of data) {
      const t = row.final_type as TypeCode
      if (t in defaults) defaults[t]++
    }
    return defaults
  } catch {
    return defaults
  }
}

export async function getAllParticipants(): Promise<TestResultRow[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from("test_results")
      .select("*")
      .order("created_at", { ascending: false })
    if (error || !data) return []
    return data as TestResultRow[]
  } catch {
    return []
  }
}
