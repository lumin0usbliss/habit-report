"use client"

import { useRef, useState } from "react"
import { Share2, ArrowRight, Download, AlertTriangle, Sparkles, CheckCircle2, CheckSquare, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import * as htmlToImage from "html-to-image"
import { jsPDF } from "jspdf"
import { results } from "@/data/results"
import type { TestResult } from "@/lib/testLogic"
import type { DimensionId } from "@/data/scoring"

interface ResultCardProps {
  testResult: TestResult
  resultId?: string | null
  onRetry?: () => void
  isSharedView?: boolean
}

const dimensionLabels: Record<DimensionId, { name: string; description: string }> = {
  START: { name: "시작력", description: "행동을 시작하는 속도" },
  PERSIST: { name: "지속력", description: "꾸준히 이어가는 힘" },
  RECOVER: { name: "회복력", description: "실패 후 다시 일어서는 힘" },
  ACHIEVE: { name: "목표 달성력", description: "결과를 만들어내는 능력" },
  SOCIAL: { name: "관계 지향성", description: "타인과의 상호작용" },
  PERFECT: { name: "완벽 지향성", description: "디테일과 완성도 추구" },
  EXPLORE: { name: "탐구력", description: "원리와 이유를 찾는 힘" },
  STIMULUS: { name: "자극 추구", description: "새로움과 변화를 즐김" },
}

const signalLabels: Record<string, string> = {
  IRREGULAR_SLEEP_TIME: "불규칙한 수면",
  IRREGULAR_MEALS: "불규칙한 식사",
  VARIABLE_SCHEDULE: "변동성 높은 일정",
  OUTSIDE_MOST_DAY: "외부 활동 위주",
  LONG_COMMUTE: "긴 출퇴근/통학 시간",
  MANY_APPOINTMENTS: "약속이 많음",
  MUCH_ALONE_TIME: "혼자 보내는 시간 많음",
  FEELS_TOO_BUSY: "바쁜 일상",
  LIVES_ALONE: "1인 가구",
  LIVES_DORM: "기숙사 생활",
  LIVES_WITH_FAMILY: "가족과 함께 생활",
  MANY_FIXED_SCHEDULES: "고정된 일정 많음",
  HAS_PART_TIME_WORK: "알바/부업 병행",
  REGULAR_EXERCISE: "규칙적인 운동",
  CLUB_OR_HOBBY: "취미/동아리 활동",
  BUSY_WEEKENDS: "바쁜 주말",
  CAREER_DIRECTION: "진로 고민",
  JOB_PREPARATION: "취업 준비",
  RELATIONSHIP_CONCERN: "인간관계 고민",
  FINANCE_CONCERN: "경제/소비 고민",
  HEALTH_CONCERN: "건강 관리 필요",
  TIME_MANAGEMENT: "시간 관리 고민",
  STUDY_HABIT: "공부 습관 희망",
  EXERCISE_HABIT: "운동 습관 희망",
  SELF_MANAGEMENT: "자기관리 희망",
  WANTS_CONSISTENCY: "꾸준함 희망",
  DOES_NOT_KNOW_FIRST_STEP: "시작이 막막함",
  FREQUENT_LATE_NIGHTS: "잦은 밤샘",
  STRESS_SPENDING: "스트레스성 소비",
  BODY_BASED_RECOVERY: "신체 활동으로 해소",
}

const signalPriority: Record<string, number> = {
  FREQUENT_LATE_NIGHTS: 3,
  STRESS_SPENDING: 3,
  CAREER_DIRECTION: 3,
  RELATIONSHIP_CONCERN: 3,
  HEALTH_CONCERN: 3,
  TIME_MANAGEMENT: 3,
  DOES_NOT_KNOW_FIRST_STEP: 3,
  IRREGULAR_SLEEP_TIME: 3,
  
  WANTS_CONSISTENCY: 2,
  SELF_MANAGEMENT: 2,
  STUDY_HABIT: 2,
  EXERCISE_HABIT: 2,
  FINANCE_CONCERN: 2,
  JOB_PREPARATION: 2,
  FEELS_TOO_BUSY: 2,
  IRREGULAR_MEALS: 2,
  BODY_BASED_RECOVERY: 2,
  LONG_COMMUTE: 2,
  VARIABLE_SCHEDULE: 2,

  OUTSIDE_MOST_DAY: 1,
  MANY_APPOINTMENTS: 1,
  MUCH_ALONE_TIME: 1,
  LIVES_ALONE: 1,
  LIVES_DORM: 1,
  LIVES_WITH_FAMILY: 1,
  MANY_FIXED_SCHEDULES: 1,
  HAS_PART_TIME_WORK: 1,
  REGULAR_EXERCISE: 1,
  CLUB_OR_HOBBY: 1,
  BUSY_WEEKENDS: 1,
}

export function ResultCard({
  testResult,
  resultId,
  onRetry,
  isSharedView = false,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [isDownloadingImage, setIsDownloadingImage] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const handleDownloadImage = async () => {
    if (!printRef.current) return
    try {
      setIsDownloadingImage(true)
      
      const filter = (node: HTMLElement) => {
        if (node?.getAttribute && node.getAttribute("data-html2canvas-ignore") === "true") {
          return false
        }
        return true
      }

      const imgData = await htmlToImage.toPng(printRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#F8F5F8',
        filter: filter,
      })
      
      const link = document.createElement("a")
      link.download = "hazzi_report.png"
      link.href = imgData
      link.click()

    } catch (error: any) {
      console.error("Failed to generate Image", error)
      alert("이미지 다운로드 중 오류가 발생했습니다: " + (error?.message || "알 수 없는 오류"))
    } finally {
      setIsDownloadingImage(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!printRef.current) return
    try {
      setIsDownloadingPdf(true)
      
      const filter = (node: HTMLElement) => {
        if (node?.getAttribute && node.getAttribute("data-html2canvas-ignore") === "true") {
          return false
        }
        return true
      }

      // html-to-image는 oklch 및 최신 CSS 필터를 더 잘 지원합니다.
      const imgData = await htmlToImage.toPng(printRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#F8F5F8',
        filter: filter,
      })
      
      const width = printRef.current.offsetWidth
      const height = printRef.current.offsetHeight
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [width, height]
      })
      
      pdf.addImage(imgData, "PNG", 0, 0, width, height)
      pdf.save("hazzi_report.pdf")
    } catch (error: any) {
      console.error("Failed to generate PDF", error)
      alert("PDF 다운로드 중 오류가 발생했습니다: " + (error?.message || "알 수 없는 오류"))
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const handleShare = async () => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const shareUrl = resultId ? `${origin}/result/${resultId}` : origin

    if (navigator.share) {
      try {
        await navigator.share({
          title: "HAZZI 습관 성향 테스트",
          text: "나의 습관 성향은 무엇일까요? 결과를 확인해보세요!",
          url: shareUrl,
        })
        return
      } catch {
        // fall through
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const el = document.createElement("textarea")
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const primary = results[testResult.finalType]
  const secondary = results[testResult.secondaryType]

  const topSignals = [...(testResult.referenceSignals || [])]
    .sort((a, b) => (signalPriority[b] || 0) - (signalPriority[a] || 0))
    .slice(0, 5)

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#F8F5F8]">
      <div ref={printRef} className="w-full px-4 py-12 font-[family-name:var(--font-ibm-plex)] bg-[#F8F5F8]">
      {/* Header Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <div className="inline-block border border-[var(--color-hazzi-ink)] rounded-full px-4 py-1.5 mb-8">
          <span className="text-sm font-bold font-[family-name:var(--font-space)] tracking-widest text-[var(--color-hazzi-ink)] uppercase">
            Your Habit Type
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 break-keep tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
          {primary.name}
        </h1>
        <p className="text-xl md:text-2xl text-[var(--color-hazzi-magenta)] font-bold mb-8">
          "{primary.oneLineSummary}"
        </p>

        {topSignals.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {topSignals
              .map(tag => signalLabels[tag])
              .filter(Boolean)
              .map(label => (
                <span key={label} className="px-3 py-1.5 bg-gray-100/80 backdrop-blur-sm text-sm font-semibold rounded-full text-gray-600 border border-gray-200">
                  #{label}
                </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Type Cards with Core Tendency */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden border border-gray-200 rounded-3xl p-8 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--color-hazzi-magenta)] to-pink-400" />
          <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider font-[family-name:var(--font-space)]">Primary</h3>
          <p className="text-2xl font-bold mb-4 break-keep">{primary.name}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {primary.keywords.map(k => (
              <span key={k} className="px-2.5 py-1 bg-gray-50 text-xs font-semibold rounded-md text-gray-700 border border-gray-100">
                {k}
              </span>
            ))}
          </div>
          <div className="mt-auto bg-[var(--color-hazzi-magenta)]/5 p-5 rounded-2xl border border-[var(--color-hazzi-magenta)]/10">
            <h4 className="text-[13px] font-bold text-[var(--color-hazzi-magenta)] mb-2 uppercase tracking-wider">핵심 성향</h4>
            <p className="text-[15px] text-gray-700 leading-relaxed font-medium break-keep">
              {primary.coreTendency}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative overflow-hidden border border-gray-200 rounded-3xl p-8 bg-white/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--color-hazzi-lime)] to-green-400" />
          <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider font-[family-name:var(--font-space)]">Secondary</h3>
          <p className="text-2xl font-bold mb-4 break-keep">{secondary.name}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {secondary.keywords.map(k => (
              <span key={k} className="px-2.5 py-1 bg-gray-50 text-xs font-semibold rounded-md text-gray-700 border border-gray-100">
                {k}
              </span>
            ))}
          </div>
          <div className="mt-auto bg-[var(--color-hazzi-lime)]/5 p-5 rounded-2xl border border-[var(--color-hazzi-lime)]/20">
            <h4 className="text-[13px] font-bold text-[var(--color-hazzi-lime)] mb-2 uppercase tracking-wider">보조 성향</h4>
            <p className="text-[15px] text-gray-700 leading-relaxed font-medium break-keep">
              {secondary.coreTendency}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Check Signals */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">이런 모습이 자주 나타나요</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {primary.checkSignals.map((signal, idx) => (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               key={idx} 
               className="flex items-start gap-3 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100"
             >
               <CheckSquare className="w-5 h-5 text-[var(--color-hazzi-magenta)] mt-0.5 shrink-0" />
               <p className="text-[15px] text-gray-700 font-medium leading-relaxed break-keep">{signal}</p>
             </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 8 Dimensions */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-2">상세 성향 분석</h2>
        <p className="text-gray-500 text-sm mb-8">8가지 축으로 분석한 나의 행동 특징입니다.</p>
        <div className="space-y-5 max-w-2xl mx-auto">
          {(Object.entries(testResult.dimensionScores) as [DimensionId, number][]).map(([dim, score], idx) => {
            const label = dimensionLabels[dim]
            return (
              <div key={dim} className="flex items-center gap-4">
                <div className="w-24 text-right shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 font-[family-name:var(--font-space)] block mb-0.5">
                    {dim}
                  </span>
                  <p className="text-sm font-bold text-gray-800">{label.name}</p>
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-gray-800 to-gray-600 rounded-full" 
                  />
                </div>
                <div className="w-10 text-sm font-bold font-[family-name:var(--font-space)] text-gray-600 text-right">
                  {Math.round(score)}
                </div>
              </div>
            )
          })}
        </div>
      </motion.section>

      {/* Strengths & Caution Points */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50 h-full"
        >
          <h3 className="flex items-center gap-2 font-bold mb-6 text-blue-600 text-lg">
             <Sparkles className="w-5 h-5"/> 나의 강점
          </h3>
          <ul className="space-y-4">
             {primary.strengths.map((s, idx) => ( 
               <li key={idx} className="flex gap-3 text-[15px] text-gray-700 font-medium leading-relaxed break-keep">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                 {s}
               </li> 
             ))}
          </ul>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-red-50/50 rounded-3xl p-8 border border-red-100/50 h-full"
        >
          <h3 className="flex items-center gap-2 font-bold mb-6 text-red-600 text-lg">
             <AlertTriangle className="w-5 h-5"/> 주의할 점
          </h3>
          <ul className="space-y-4">
             {primary.cautionPoints.map((s, idx) => ( 
               <li key={idx} className="flex gap-3 text-[15px] text-gray-700 font-medium leading-relaxed break-keep">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                 {s}
               </li> 
             ))}
          </ul>
        </motion.div>
      </div>





      {/* Strategies & 7 Days Plan */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">맞춤 실천 체크리스트</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Strategies as Cards */}
          {primary.strategies.map((strategy, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={`strategy-${idx}`} 
              className="group flex items-center gap-5 p-5 border border-gray-200 hover:border-gray-300 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md cursor-default"
            >
              <div className="w-14 h-14 shrink-0 bg-gray-50 group-hover:bg-[var(--color-hazzi-magenta)] group-hover:text-white transition-colors rounded-xl flex items-center justify-center font-[family-name:var(--font-space)] font-bold text-gray-400 text-lg">
                {(idx + 1).toString().padStart(2, '0')}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[16px] leading-relaxed break-keep">{strategy}</p>
              </div>
            </motion.div>
          ))}

          {/* 7 Days Plan Item */}
          {primary.sevenDayPlanTemplate.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (primary.strategies.length + idx) * 0.1 }}
              key={`plan-${item.day}`} 
              className="group flex items-center gap-5 p-5 border border-gray-200 hover:border-gray-300 rounded-2xl bg-white shadow-sm transition-all hover:shadow-md cursor-default"
            >
              <div className="w-14 h-14 shrink-0 bg-gray-50 group-hover:bg-[var(--color-hazzi-magenta)] group-hover:text-white transition-colors rounded-xl flex items-center justify-center font-[family-name:var(--font-space)] font-bold text-gray-400 text-lg">
                D-{item.day}
              </div>
              <div>
                <p className="font-bold text-[var(--color-hazzi-magenta)] mb-1 text-sm">추천 첫 단계</p>
                <p className="font-bold text-gray-900 mb-1.5 text-lg break-keep">{item.task}</p>
                <p className="text-sm text-gray-500 font-medium break-keep">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {!isSharedView && (
        <motion.div 
          data-html2canvas-ignore="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloadingImage}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-colors font-bold text-[15px] disabled:opacity-50"
          >
            <ImageIcon className="w-5 h-5" />
            {isDownloadingImage ? "저장 중..." : "이미지로 저장"}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-900 transition-colors font-bold text-[15px] disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isDownloadingPdf ? "저장 중..." : "PDF로 저장"}
          </button>
          
          {resultId && (
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-colors text-[15px] shadow-xl shadow-gray-900/20"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-hazzi-lime)]" />
                  링크가 복사됐어요
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  결과 공유하기
                </>
              )}
            </button>
          )}
        </motion.div>
      )}

      {isSharedView && (
        <div data-html2canvas-ignore="true" className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 text-white hover:bg-black transition-colors font-bold text-[15px] shadow-xl shadow-gray-900/20"
          >
            나도 테스트 해보기
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      )}
    </div>
    </div>
  )
}
