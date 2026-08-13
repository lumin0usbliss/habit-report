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
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [emailNotice, setEmailNotice] = useState<{ sent: boolean; message: string } | null>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  
  const offscreenRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const lockedPages = pagesConfig.slice(1)

  const maskEmail = (emailStr: string): string => {
    if (!emailStr || !emailStr.includes("@")) return "입력하신 이메일"
    const [local, domain] = emailStr.split("@")
    if (local.length <= 2) {
      return `${local[0]}*@${domain}`
    }
    const visible = local.slice(0, 2)
    const masked = "*".repeat(Math.max(2, local.length - 2))
    return `${visible}${masked}@${domain}`
  }

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const scrollLeft = container.scrollLeft
    const firstItem = container.firstElementChild as HTMLElement
    if (!firstItem) return
    const itemWidth = firstItem.offsetWidth || 240
    const stepWidth = itemWidth * 0.65
    const newIndex = Math.min(
      lockedPages.length - 1,
      Math.max(0, Math.round(scrollLeft / stepWidth))
    )
    if (newIndex !== activePageIndex) {
      setActivePageIndex(newIndex)
    }
  }

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

    const reportId = `HZ-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-001`
    const generated = generateReportData(reportId, parsed, parsed.answers)
    setReportData(generated)
    setSaving(false)

    // 세션 레벨 이미 전송 완료 상태 체크
    const sentFlag = sessionStorage.getItem("report-email-sent")
    if (sentFlag === "true") {
      setIsEmailSent(true)
      const email = sessionStorage.getItem("participant-email") || ""
      setEmailNotice({ sent: true, message: `${maskEmail(email)}으로 리포트를 전송했습니다.` })
    }
  }, [router])

  const handleSendReportEmail = async () => {
    if (isSendingEmail || isEmailSent || !reportData) return

    const email = sessionStorage.getItem("participant-email") || undefined

    // 세션별 고유 Idempotency Key 획득 또는 생성
    let idempotencyKey = sessionStorage.getItem("test-idempotency-key")
    if (!idempotencyKey) {
      idempotencyKey = `HZ-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      sessionStorage.setItem("test-idempotency-key", idempotencyKey)
    }

    setIsSendingEmail(true)
    setEmailNotice(null)

    try {
      const res = await fetch("/cf-api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportData, toEmail: email, idempotencyKey }),
      })
      const data = await res.json()

      if (data.success && data.emailSent) {
        setIsEmailSent(true)
        sessionStorage.setItem("report-email-sent", "true")
        const masked = maskEmail(email || "")
        setEmailNotice({ sent: true, message: `${masked}으로 리포트를 전송했습니다.` })
      } else {
        setIsEmailSent(false)
        setEmailNotice({
          sent: false,
          message: data.emailMessage || "메일 전송에 실패했습니다. 다시 시도해주세요.",
        })
      }
    } catch (err) {
      console.error("Failed to send report email", err)
      setIsEmailSent(false)
      setEmailNotice({
        sent: false,
        message: "메일 전송에 실패했습니다. 다시 시도해주세요.",
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

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

          {emailNotice && (
            <div className="mt-4 max-w-md mx-auto px-4 py-2.5 rounded-xl border text-xs font-semibold bg-white shadow-sm transition-all border-gray-200">
              <span className={emailNotice.sent ? "text-emerald-600" : "text-amber-600"}>
                {emailNotice.sent ? "✉️ " : "⚠️ "} {emailNotice.message}
              </span>
            </div>
          )}
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

        {/* MOBILE (<sm) HORIZONTAL OVERLAPPING CAROUSEL LOCKED PREVIEW */}
        <section className="block sm:hidden w-full mb-8 relative">
          
          {/* Carousel Scroll Container */}
          <div 
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="w-full overflow-x-auto scroll-smooth flex items-center pt-4 pb-4 pl-[15vw] pr-[15vw] scroll-snap-x-mandatory no-scrollbar"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
          >
            {lockedPages.map((config, idx) => {
              const PageComp = config.component
              const isActive = idx === activePageIndex

              return (
                <div 
                  key={config.id}
                  onClick={handleOpenFullReport}
                  className={`flex-none w-[70vw] max-w-[250px] aspect-[210/297] rounded-xl overflow-hidden border bg-white cursor-pointer transition-all duration-200 scroll-snap-align-center relative ${
                    idx > 0 ? '-ml-[25vw]' : ''
                  } ${
                    isActive 
                      ? 'z-20 scale-100 opacity-100 shadow-xl border-gray-300' 
                      : 'z-10 scale-[0.94] opacity-80 shadow-md border-gray-200'
                  }`}
                >
                  <ReportThumbnail blur={locked}>
                    <PageComp reportData={reportData} />
                  </ReportThumbnail>
                </div>
              )
            })}
          </div>

          {/* PAGE INDICATOR & SWIPE GUIDANCE */}
          <div className="flex flex-col items-center justify-center mt-2 mb-6 gap-1.5">
            <div className="bg-gray-900 text-white text-[11px] font-bold px-3.5 py-1 rounded-full tracking-widest font-[family-name:var(--font-space)] shadow-sm">
              {String(activePageIndex + 2).padStart(2, '0')} / 12
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">
              ← 좌우로 스와이프하여 미리보기 →
            </p>
          </div>

          {/* MOBILE LOCK CTA CARD (Separated Below Carousel) */}
          {locked && (
            <div className="w-full max-w-sm mx-auto px-4 mb-4">
              <div className="bg-white/95 backdrop-blur-md border border-gray-200/90 rounded-2xl p-5 shadow-xl shadow-pink-100 text-center w-full">
                <div className="w-11 h-11 bg-pink-50 text-[var(--color-hazzi-magenta)] rounded-full flex items-center justify-center text-base mx-auto mb-2.5 border border-pink-100 shadow-inner">
                  🔒
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 tracking-tight">
                  상세 분석 11페이지가 남아 있어요
                </h3>
                <p className="text-gray-500 text-[11px] mb-4 leading-relaxed font-medium break-keep">
                  유형 조합부터 행동 패턴, 습관 실패 지점,<br/>
                  맞춤 처방과 30일 플랜까지 확인해보세요.
                </p>
                <button 
                  onClick={handleOpenFullReport}
                  className="w-full py-3 bg-[var(--color-hazzi-magenta)] text-white rounded-xl font-bold text-xs tracking-wide hover:bg-pink-600 active:scale-98 transition-all shadow-md shadow-pink-200 cursor-pointer"
                >
                  12P 전체 리포트 열기
                </button>
              </div>
            </div>
          )}

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

              <div className="w-full mt-1">
                <button
                  onClick={handleSendReportEmail}
                  disabled={isSendingEmail || isEmailSent || isDownloading}
                  className={`py-3.5 px-4 w-full border-2 rounded-xl font-bold text-xs sm:text-[15px] tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isEmailSent
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold cursor-not-allowed shadow-none"
                      : "bg-[var(--color-hazzi-ink)] border-[var(--color-hazzi-ink)] text-white hover:bg-black"
                  }`}
                >
                  {isSendingEmail ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>메일을 보내는 중...</span>
                    </span>
                  ) : isEmailSent ? (
                    "✉️ 메일 전송 완료"
                  ) : (
                    "✉️ 메일로 리포트 보내기"
                  )}
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
