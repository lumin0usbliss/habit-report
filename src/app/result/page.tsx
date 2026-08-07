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
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { REPORT_ACCESS_CONFIG } from "@/lib/config"

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

const pagesConfig = [
  { id: 'export-page-01', title: '01_PERSONAL_HABIT_PROFILE_REPORT', component: Page01Profile },
  { id: 'export-page-02', title: '02_TYPE_COMBINATION_ANALYSIS', component: Page02Combination },
  { id: 'export-page-03', title: '03_MY_ANSWER_SNAPSHOT_1', component: Page03Snapshot1 },
  { id: 'export-page-04', title: '04_BEHAVIOR_PATTERN_ANALYSIS', component: Page04BehaviorPattern },
  { id: 'export-page-05', title: '05_HABIT_FAILURE_MAP', component: Page05FailureMap },
  { id: 'export-page-06', title: '06_8_FACTOR_DETAIL', component: Page06FactorDetail },
  { id: 'export-page-07', title: '07_MY_ANSWER_SNAPSHOT_2', component: Page07Snapshot2 },
  { id: 'export-page-08', title: '08_HABIT_ENVIRONMENT_GUIDE', component: Page08Environment },
  { id: 'export-page-09', title: '09_PERSONAL_HABIT_PRESCRIPTION', component: Page09Prescription },
  { id: 'export-page-10', title: '10_30_DAY_HABIT_PLAN', component: Page10Plan },
  { id: 'export-page-11', title: '11_ANALYSIS_SUMMARY', component: Page11Summary },
  { id: 'export-page-12', title: '12_MY_HABIT_BLUEPRINT', component: Page12Blueprint }
]

export default function ResultPage() {
  const router = useRouter()
  const [testResult, setTestResult] = useState<StoredResult | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)
  const [saving, setSaving] = useState(true)
  const [locked, setLocked] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [showPage01Modal, setShowPage01Modal] = useState(false)
  
  const offscreenRef = useRef<HTMLDivElement>(null)

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

  const handleDownload12PImages = async () => {
    if (!offscreenRef.current || !reportData || !testResult) return
    try {
      setIsDownloading(true)
      setDownloadProgress(0)
      
      await document.fonts.ready
      
      const zip = new JSZip()
      
      for (let i = 0; i < pagesConfig.length; i++) {
        setDownloadProgress(i + 1)
        const config = pagesConfig[i]
        const node = document.getElementById(config.id)
        if (!node) continue
        
        const dataUrl = await htmlToImage.toPng(node, {
          quality: 1,
          pixelRatio: 3,
          backgroundColor: '#ffffff'
        })
        
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "")
        zip.file(`${config.title}.png`, base64Data, { base64: true })
      }
      
      const content = await zip.generateAsync({ type: "blob" })
      const fileNameId = resultId || `HZ_${testResult.finalType}`
      saveAs(content, `HAZZI_Habit_Report_${fileNameId}_Images.zip`)
      
    } catch (err) {
      console.error("Image generation failed", err)
      alert("이미지 12장 생성에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  const handleOpenPdfReport = () => {
    window.open('/report?print=1', '_blank')
  }

  const handleOpenFullReport = () => {
    if (REPORT_ACCESS_CONFIG.freeFullReportDuringBeta) {
       router.push('/report')
    } else {
       router.push('/report')
    }
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
        {/* HAZZI HEADER / INTRO (Mobile Height Reduced ~20%) */}
        <section className="pt-20 pb-6 px-4 md:pt-24 md:pb-12 md:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2.5 sm:mb-4 tracking-tight leading-snug sm:leading-tight uppercase">
            12P PERSONAL<br />HABIT REPORT
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            나의 응답을 기반으로 생성된 개인 습관 분석<br/>
            <span className="text-[10px] sm:text-[11px] text-gray-400 mt-1.5 sm:mt-2 block tracking-wide">
              유형 조합 · 실제 응답 · 행동 패턴 · 실패 지점 · 환경 · 맞춤 처방 · 30일 플랜 · Blueprint
            </span>
          </p>
        </section>

        {/* PAGE 01 FULL REPORT PREVIEW */}
        <section className="w-full px-3 md:px-6 max-w-5xl mx-auto mb-10 sm:mb-16">
          <div 
            className="w-[93%] sm:w-full md:w-3/4 mx-auto relative shadow-md md:shadow-2xl rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 bg-white group cursor-pointer"
            onClick={() => setShowPage01Modal(true)}
          >
            <ReportThumbnail blur={false}>
               <div className="w-[794px] h-[1123px]">
                 <Page01Profile reportData={reportData} />
               </div>
            </ReportThumbnail>

            {/* Tap Zoom Hint Overlay for Mobile */}
            <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/75 hover:bg-black text-white text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md backdrop-blur-sm transition-transform active:scale-95">
              🔍 <span className="hidden xs:inline">터치하여 </span>크게 보기
            </div>
          </div>
        </section>

        {/* DESKTOP (sm+) LOCKED REPORT PREVIEW GRID */}
        <section className="hidden sm:block w-full px-4 md:px-6 max-w-6xl mx-auto mb-16 relative">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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

          {/* DESKTOP LOCK CTA OVERLAY */}
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
                    onClick={handleOpenFullReport}
                    className="w-full py-4 bg-[var(--color-hazzi-magenta)] text-white rounded-xl font-bold text-sm tracking-wide hover:bg-pink-600 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-pink-200 cursor-pointer"
                  >
                    12P 전체 리포트 열기
                  </button>
               </div>
            </div>
          )}
        </section>

        {/* MOBILE (<sm) STACKED LOCKED PREVIEW */}
        <section className="block sm:hidden w-full px-4 max-w-md mx-auto mb-8 relative">
          <div className="relative w-full h-[370px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-gray-50/70 to-pink-50/40 p-2 border border-gray-100/80 shadow-inner">
            
            {/* Stacked Cards Container */}
            <div className="relative w-full max-w-[250px] aspect-[210/297] flex items-center justify-center">
              
              {/* Card 4 (Backmost) */}
              <div 
                className="absolute inset-0 transform translate-x-4 -translate-y-3 rotate-3 opacity-80 scale-[0.88] shadow border border-gray-200/90 bg-white rounded-lg overflow-hidden cursor-pointer"
                onClick={handleOpenFullReport}
              >
                <ReportThumbnail blur={locked}>
                  <Page05FailureMap reportData={reportData} />
                </ReportThumbnail>
              </div>

              {/* Card 3 */}
              <div 
                className="absolute inset-0 transform -translate-x-3 -translate-y-1.5 -rotate-2 opacity-85 scale-[0.93] shadow-md border border-gray-200/90 bg-white rounded-lg overflow-hidden cursor-pointer"
                onClick={handleOpenFullReport}
              >
                <ReportThumbnail blur={locked}>
                  <Page04BehaviorPattern reportData={reportData} />
                </ReportThumbnail>
              </div>

              {/* Card 2 */}
              <div 
                className="absolute inset-0 transform translate-x-2 translate-y-1.5 rotate-1 opacity-90 scale-[0.97] shadow-lg border border-gray-200 bg-white rounded-lg overflow-hidden cursor-pointer"
                onClick={handleOpenFullReport}
              >
                <ReportThumbnail blur={locked}>
                  <Page03Snapshot1 reportData={reportData} />
                </ReportThumbnail>
              </div>

              {/* Card 1 (Frontmost) */}
              <div 
                className="absolute inset-0 transform -translate-x-0.5 translate-y-3 -rotate-1 opacity-95 shadow-xl border border-gray-300 bg-white rounded-lg overflow-hidden cursor-pointer"
                onClick={handleOpenFullReport}
              >
                <ReportThumbnail blur={locked}>
                  <Page02Combination reportData={reportData} />
                </ReportThumbnail>
              </div>

            </div>

            {/* MOBILE LOCK CTA OVERLAY */}
            {locked && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-b from-white/10 via-white/75 to-white/95 p-3.5 rounded-2xl">
                <div className="bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl p-4 shadow-xl shadow-pink-200/40 text-center w-full max-w-[260px]">
                  <div className="w-10 h-10 bg-pink-50 text-[var(--color-hazzi-magenta)] rounded-full flex items-center justify-center text-sm mx-auto mb-2 border border-pink-100 shadow-inner">
                    🔒
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1 tracking-tight">
                    상세 분석 11페이지가 남아 있어요
                  </h3>
                  <p className="text-gray-500 text-[10.5px] mb-3.5 leading-relaxed font-medium break-keep">
                    유형 조합부터 행동 패턴, 실패 지점,<br/>
                    맞춤 처방과 30일 플랜까지 확인해보세요.
                  </p>
                  <button 
                    onClick={handleOpenFullReport}
                    className="w-full py-2.5 bg-[var(--color-hazzi-magenta)] text-white rounded-xl font-bold text-xs tracking-wide hover:bg-pink-600 active:scale-98 transition-all shadow-md shadow-pink-200 cursor-pointer"
                  >
                    12P 전체 리포트 열기
                  </button>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* SAVE AREA */}
        <section className="pb-12 sm:pb-32 px-4 sm:px-6 text-center">
          {(locked && !REPORT_ACCESS_CONFIG.freeFullReportDuringBeta) ? (
             <div className="max-w-2xl mx-auto">
               <button 
                 onClick={() => {}} // Future logic for paid users
                 className="py-3.5 px-6 w-full max-w-sm border-2 border-[var(--color-hazzi-magenta)] bg-[var(--color-hazzi-magenta)] text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
               >
                 결제 후 전체 리포트 다운로드
               </button>
             </div>
          ) : (
            <div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full">
                <button 
                  onClick={handleDownload12PImages}
                  disabled={isDownloading}
                  className="py-3.5 px-2.5 w-full bg-white border-2 border-[var(--color-hazzi-magenta)] text-[var(--color-hazzi-magenta)] rounded-xl font-bold text-xs sm:text-[15px] tracking-wide hover:bg-pink-50 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isDownloading ? (
                    <span className="flex items-center justify-center gap-1.5">
                       <div className="w-3.5 h-3.5 border-2 border-[var(--color-hazzi-magenta)] border-t-transparent rounded-full animate-spin" />
                       <span className="text-[11px] sm:text-xs">
                         {downloadProgress > 0 ? `${downloadProgress}/12` : "생성 중..."}
                       </span>
                    </span>
                  ) : (
                    "12P 이미지 저장"
                  )}
                </button>
                
                <button 
                  onClick={handleOpenPdfReport}
                  disabled={isDownloading}
                  className="py-3.5 px-2.5 w-full bg-[var(--color-hazzi-magenta)] text-white border-2 border-[var(--color-hazzi-magenta)] rounded-xl font-bold text-xs sm:text-[15px] tracking-wide hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 flex items-center justify-center"
                >
                  12P PDF 저장
                </button>
              </div>
              
              {REPORT_ACCESS_CONFIG.freeFullReportDuringBeta && (
                 <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1">
                   현재 테스트 기간에는 전체 리포트를 무료로 저장할 수 있어요.
                 </p>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* FULLSCREEN MODAL FOR PAGE01 TAP TO ZOOM */}
      {showPage01Modal && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6"
          onClick={() => setShowPage01Modal(false)}
        >
          <div 
            className="relative w-full max-w-2xl flex flex-col items-center justify-center max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center mb-2 px-1 text-white">
              <span className="text-xs font-bold tracking-wider uppercase opacity-80">Page 01 Profile Preview</span>
              <button 
                onClick={() => setShowPage01Modal(false)}
                className="bg-white/20 hover:bg-white/40 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="w-full overflow-y-auto rounded-xl bg-white shadow-2xl p-1 max-h-[82vh]">
              <ReportThumbnail blur={false}>
                <div className="w-[794px] h-[1123px]">
                  <Page01Profile reportData={reportData} />
                </div>
              </ReportThumbnail>
            </div>
          </div>
        </div>
      )}

      {/* OFF-SCREEN RENDER FOR FULL 12P EXPORT (Ensures no blur and full quality) */}
      <div 
        ref={offscreenRef} 
        style={{ position: 'fixed', left: '-10000px', top: 0, width: '794px', pointerEvents: 'none' }}
      >
        {reportData && pagesConfig.map(config => {
           const PageComponent = config.component
           return (
             <div key={config.id} id={config.id} className="w-[794px] h-[1123px] bg-white">
                <PageComponent reportData={reportData} />
             </div>
           )
        })}
      </div>
    </div>
  )
}
