"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { results } from "@/data/results"
import { saveTestResult } from "@/lib/supabase"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import type { TestResult } from "@/lib/testLogic"
import type { Answer } from "@/data/questions"
import * as htmlToImage from "html-to-image"

interface StoredResult extends TestResult {
  answers: Answer[]
}

import { generateReportData, type ReportData } from "@/lib/reportData"
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
  const [locked, setLocked] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const page01Ref = useRef<HTMLDivElement>(null)

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
      if (id) {
        setResultId(id)
        setReportData(generateReportData(id, parsed, parsed.answers))
      } else {
        setReportData(generateReportData("PREVIEW-001", parsed, parsed.answers))
      }
      setSaving(false)
    })
  }, [router])

  const handleDownloadPage01 = async () => {
    if (!page01Ref.current) return
    try {
      setIsDownloading(true)
      
      // We need to temporarily un-scale the thumbnail to get a high-res screenshot
      const container = page01Ref.current
      const originalTransform = container.style.transform
      // Set to scale 1 so htmlToImage captures the full 794x1123 dimensions
      container.style.transform = 'scale(1)'
      
      const dataUrl = await htmlToImage.toPng(container, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      })
      
      // Restore scale
      container.style.transform = originalTransform
      
      const link = document.createElement("a")
      link.download = `HAZZI_REPORT_${testResult?.finalType}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Image generation failed", err)
      alert("이미지 저장에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleOpenPdfReport = () => {
    // Navigate to the print-friendly report page
    window.open('/report', '_blank')
  }

  if (!testResult || saving || !reportData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-screen">
        <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-neutral-500 text-sm">결과를 분석하고 있어요...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-hazzi-canvas)] font-[family-name:var(--font-sans)]">
      <Header />
      
      <main className="flex-1 flex flex-col w-full">
        {/* HAZZI HEADER / INTRO */}
        <section className="pt-24 pb-12 px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight uppercase">
            12P PERSONAL<br />HABIT REPORT
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            나의 응답을 기반으로 생성된 개인 습관 분석<br/>
            <span className="text-[11px] text-gray-400 mt-2 block tracking-wide">
              유형 조합 · 실제 응답 · 행동 패턴 · 실패 지점 · 환경 · 맞춤 처방 · 30일 플랜 · Blueprint
            </span>
          </p>
        </section>

        {/* PAGE 01 FULL REPORT PREVIEW */}
        <section className="w-full px-4 md:px-6 max-w-5xl mx-auto mb-16">
          <div className="w-full md:w-3/4 mx-auto relative shadow-2xl rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <ReportThumbnail blur={false}>
               <div ref={page01Ref} className="w-[794px] h-[1123px]">
                 <Page01Profile reportData={reportData} />
               </div>
            </ReportThumbnail>
          </div>
        </section>

        {/* PAGE 02~12 LOCKED REPORT PREVIEW */}
        <section className="w-full px-4 md:px-6 max-w-6xl mx-auto mb-16 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <ReportThumbnail blur={locked}><Page02Combination reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page03Snapshot1 reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page04BehaviorPattern reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page05FailureMap reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page06FactorDetail reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page07Snapshot2 reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page08Environment reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page09Prescription reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page10Plan reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page11Summary reportData={reportData} /></ReportThumbnail>
            <ReportThumbnail blur={locked}><Page12Blueprint reportData={reportData} /></ReportThumbnail>
          </div>

          {/* LOCK CTA OVERLAY */}
          {locked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-white/10 via-white/70 to-white/95 rounded-3xl pb-20">
               <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl p-8 shadow-2xl shadow-pink-100 text-center max-w-sm w-full mx-4 transform transition-all duration-300 translate-y-10">
                  <div className="w-14 h-14 bg-pink-50 text-[var(--color-hazzi-magenta)] rounded-full flex items-center justify-center text-xl mx-auto mb-5 border border-pink-100 shadow-inner">
                    🔒
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">상세 분석 11페이지가 남아 있어요</h3>
                  <p className="text-gray-500 text-[13px] mb-8 leading-relaxed font-medium break-keep">
                    유형 조합부터 행동 패턴, 습관 실패 지점,<br/>
                    맞춤 처방과 30일 실천 플랜까지 확인해보세요.
                  </p>
                  <button 
                    onClick={() => setLocked(false)}
                    className="w-full py-4 bg-[var(--color-hazzi-magenta)] text-white rounded-xl font-bold text-sm tracking-wide hover:bg-pink-600 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-pink-200"
                  >
                    12P 전체 리포트 열기
                  </button>
               </div>
            </div>
          )}
        </section>

        {/* SAVE AREA */}
        <section className="pb-32 px-6 text-center">
          {locked ? (
            <button 
              onClick={handleDownloadPage01}
              disabled={isDownloading}
              className="py-4 px-8 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  저장 중...
                </>
              ) : (
                "1P 결과 이미지 저장"
              )}
            </button>
          ) : (
            <button 
              onClick={handleOpenPdfReport}
              className="py-4 px-10 bg-gray-900 text-white rounded-xl font-bold text-sm tracking-wide hover:bg-black hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              12P PDF 저장 (출력하기)
            </button>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
