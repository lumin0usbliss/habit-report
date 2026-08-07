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

import { generateReportData } from "@/lib/reportData"
import { Page01Profile } from "@/components/report/pages/Page01Profile"
import { Page02Combination } from "@/components/report/pages/Page02Combination"
import { Page03Snapshot1 } from "@/components/report/pages/Page03Snapshot1"
import { Page04BehaviorPattern } from "@/components/report/pages/Page04BehaviorPattern"
import { Page05FailureMap } from "@/components/report/pages/Page05FailureMap"
import { Page06FactorDetail } from "@/components/report/pages/Page06FactorDetail"
import { Page07Snapshot2 } from "@/components/report/pages/Page07Snapshot2"
import { Page08Environment } from "@/components/report/pages/Page08Environment"
import { Page09Prescription } from "@/components/report/pages/Page09Prescription"
import { Page10Plan } from "@/components/report/pages/Page10Plan"
import { Page11Summary } from "@/components/report/pages/Page11Summary"
import { Page12Blueprint } from "@/components/report/pages/Page12Blueprint"
import { ReportThumbnail } from "@/components/report/ReportThumbnail"

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
      <div className="flex-1 flex flex-col items-center pt-16 w-full">
        <ResultCard testResult={testResult} resultId={resultId} onRetry={handleRetry} />
        
        {/* 리포트 미리보기 섹션 */}
        <div className="w-full max-w-5xl mx-auto mt-24 px-4 pb-32">
           <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold mb-3 tracking-tight">12P PERSONAL HABIT REPORT</h2>
              <p className="text-gray-500 text-sm break-keep leading-relaxed font-medium">
                유형 조합 심층 분석 · 행동 패턴 분석 · 습관 이탈 방지 맵 · 맞춤 환경 가이드 · 개인 맞춤 처방 · 30일 실천 플랜
              </p>
           </div>

           <div className="flex flex-col gap-10">
              {/* Page01 - 전체 공개 */}
              <div className="w-full max-w-[650px] mx-auto shadow-xl shadow-gray-200/50 rounded-xl overflow-hidden">
                 <ReportThumbnail blur={false}>
                    <Page01Profile reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} />
                 </ReportThumbnail>
              </div>

              {/* Pages 02~12 - 잠금 썸네일 */}
              <div className="relative mt-8">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 px-2 lg:px-0">
                    <ReportThumbnail><Page02Combination reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page03Snapshot1 reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page04BehaviorPattern reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page05FailureMap reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page06FactorDetail reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page07Snapshot2 reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page08Environment reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page09Prescription reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page10Plan reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page11Summary reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                    <ReportThumbnail><Page12Blueprint reportData={generateReportData(resultId || "PREVIEW-001", testResult, testResult.answers)} /></ReportThumbnail>
                 </div>

                 {/* Locked Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/80 to-white/95 flex flex-col items-center justify-center pt-32 pb-8 z-10">
                     <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center max-w-sm mx-auto transform translate-y-12">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-5 border border-gray-200">
                           <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                           </svg>
                        </div>
                        <h3 className="text-[19px] font-bold text-gray-900 mb-3 break-keep">상세 분석은 전체 리포트에서 확인할 수 있어요</h3>
                        <p className="text-[13px] text-gray-500 mb-7 break-keep font-medium">나만의 응답 패턴 · 심층 행동 분석 · 맞춤 환경 가이드 · 30일 실천 플랜 등</p>
                        <button className="w-full bg-[var(--color-hazzi-magenta)] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-[var(--color-hazzi-magenta)]/30 hover:bg-pink-600 transition-all hover:-translate-y-0.5 active:translate-y-0">
                           12P 전체 리포트 열기
                        </button>
                     </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
