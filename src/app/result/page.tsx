"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { results } from "@/data/results"
import { ResultCard } from "@/components/test/ResultCard"
import { saveTestResult } from "@/lib/supabase"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import type { TestResult } from "@/lib/testLogic"
import type { Answer } from "@/data/questions"

interface StoredResult extends TestResult {
  answers: Answer[]
}

export default function ResultPage() {
  const router = useRouter()
  const [testResult, setTestResult] = useState<StoredResult | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)
  const [saving, setSaving] = useState(true)

  useEffect(() => {
    const raw = sessionStorage.getItem("test-result")
    const name = sessionStorage.getItem("participant-name")
    if (!raw || !name) {
      router.replace("/")
      return
    }

    let parsed: StoredResult
    try {
      parsed = JSON.parse(raw) as StoredResult
    } catch {
      router.replace("/")
      return
    }

    if (!results[parsed.finalType] || !results[parsed.secondaryType]) {
      router.replace("/")
      return
    }

    setTestResult(parsed)

    const phone = sessionStorage.getItem("participant-phone") || undefined

    saveTestResult({
      name,
      phone,
      finalType: parsed.finalType,
      secondaryType: parsed.secondaryType,
      dimensionScores: parsed.dimensionScores,
      typeFitScores: parsed.typeFitScores,
      ranking: parsed.ranking,
      referenceSignals: parsed.referenceSignals,
      answers: parsed.answers,
    }).then((id) => {
      if (id) setResultId(id)
      setSaving(false)
    })
  }, [router])

  const handleRetry = () => {
    sessionStorage.removeItem("test-result")
    router.push("/")
  }

  if (!testResult || saving) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-500 text-sm">결과를 분석하고 있어요...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-hazzi-canvas)]">
      <Header />
      <div className="flex-1 flex items-center justify-center pt-16">
        <ResultCard testResult={testResult} resultId={resultId} onRetry={handleRetry} />
      </div>
      <Footer />
    </div>
  )
}
