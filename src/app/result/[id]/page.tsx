import { notFound } from "next/navigation"
import { getResultById } from "@/lib/supabase"
import { results } from "@/data/results"
import { ResultCard } from "@/components/test/ResultCard"
import { Footer } from "@/components/layout/Footer"
import type { TestResult } from "@/lib/testLogic"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const row = await getResultById(id)
  if (!row) return { title: "결과를 찾을 수 없어요" }
  const primary = results[row.final_type]
  return {
    title: `${row.name}님의 성향 결과 — ${primary.name}`,
    description: primary.oneLineSummary,
    openGraph: {
      title: `${primary.name} — 성향 결과`,
      description: primary.strengths.join(" ").slice(0, 100),
    },
  }
}

export default async function SharedResultPage({ params }: Props) {
  const { id } = await params
  const row = await getResultById(id)
  if (!row) notFound()

  const primary = results[row.final_type]
  const secondary = results[row.secondary_type]

  if (!primary || !secondary) notFound()

  const testResult: TestResult = {
    finalType: row.final_type,
    secondaryType: row.secondary_type,
    dimensionScores: row.dimension_scores,
    typeFitScores: row.type_fit_scores,
    ranking: row.ranking,
    referenceSignals: row.reference_signals,
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-hazzi-canvas)]">
      <div className="pt-10 pb-4 text-center">
        <p className="text-[var(--color-hazzi-gray-500)] text-sm font-[family-name:var(--font-ibm-plex)]">
          <span className="font-bold text-[var(--color-hazzi-ink)]">{row.name}</span>님의 성향 결과
        </p>
      </div>

      <div className="flex-1 flex items-start justify-center py-6">
        <ResultCard testResult={testResult} resultId={id} isSharedView />
      </div>

      <Footer />
    </div>
  )
}
