"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { generateReportData, type ReportData } from "@/lib/reportData"
import type { TestResult } from "@/lib/testLogic"
import type { Answer } from "@/data/questions"
import { results } from "@/data/results"

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

interface StoredResult extends TestResult {
  answers: Answer[]
}

export default function ReportContainerPage() {
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    let parsed: StoredResult

    const raw = sessionStorage.getItem("test-result")
    if (!raw) {
      if (process.env.NODE_ENV === "development") {
         parsed = {
            finalType: "T1",
            secondaryType: "T7",
            dimensionScores: { START: 70, PERSIST: 40, RECOVER: 50, ACHIEVE: 60, SOCIAL: 30, PERFECT: 80, EXPLORE: 65, STIMULUS: 75 },
            typeFitScores: {} as any,
            ranking: [],
            referenceSignals: [],
            answers: [
               { questionId: "q1_1", value: 5 }, { questionId: "q1_2", value: 2 }, { questionId: "q1_3", value: 4 },
               { questionId: "q2_1", value: 1 }, { questionId: "q2_2", value: 5 }, { questionId: "q2_3", value: 3 },
               { questionId: "q3_1", value: 5 }, { questionId: "q3_2", value: 4 }, { questionId: "q3_3", value: 5 },
               { questionId: "q4_1", value: 2 }, { questionId: "q4_2", value: 3 }, { questionId: "q4_3", value: 1 }
            ]
         }
      } else {
         router.replace("/")
         return
      }
    } else {
      try {
        parsed = JSON.parse(raw) as StoredResult
      } catch {
        router.replace("/")
        return
      }
    }

    if (!results[parsed.finalType] || !results[parsed.secondaryType]) {
      router.replace("/")
      return
    }

    const reportId = `HZ-${new Date().toISOString().slice(2,10).replace(/-/g, '')}-001`
    const generated = generateReportData(reportId, parsed, parsed.answers)
    setReportData(generated)

    // Check if we need to auto-print
    if (typeof window !== "undefined" && window.location.search.includes("print=1")) {
      setIsPrinting(true)
      const originalTitle = document.title
      document.title = `HAZZI_Habit_Report_${reportId}`
      
      const triggerPrint = async () => {
         await document.fonts.ready
         requestAnimationFrame(() => {
           requestAnimationFrame(() => {
             setTimeout(() => {
               window.print()
               document.title = originalTitle
               setIsPrinting(false)
             }, 800) // Allow time for charts/images to fully paint
           })
         })
      }
      triggerPrint()
    }
  }, [router])

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F8]">
        <div className="w-8 h-8 border-2 border-[var(--color-hazzi-magenta)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3] py-8 flex flex-col items-center overflow-x-hidden">
      <div className="print:hidden mb-8 text-center shrink-0">
        <h1 className="text-2xl font-bold mb-2">Personal Habit Profile Report</h1>
        <p className="text-gray-500 text-sm">브라우저 인쇄(Ctrl+P)를 사용하여 PDF로 저장하세요. (여백 없음, 배경 그래픽 포함 선택)</p>
        {isPrinting && (
           <p className="text-[var(--color-hazzi-magenta)] font-bold mt-4 animate-pulse">
             PDF 저장 창을 준비하고 있습니다...
           </p>
        )}
      </div>

      {/* Adding print logic class that handles breaking */}
      <div className="report-preview flex flex-col items-center gap-8 pb-32 print:gap-0 print:pb-0">
        <div className="print:break-after-page"><Page01Profile reportData={reportData} /></div>
        <div className="print:break-after-page"><Page02Combination reportData={reportData} /></div>
        <div className="print:break-after-page"><Page03Snapshot1 reportData={reportData} /></div>
        <div className="print:break-after-page"><Page04BehaviorPattern reportData={reportData} /></div>
        <div className="print:break-after-page"><Page05FailureMap reportData={reportData} /></div>
        <div className="print:break-after-page"><Page06FactorDetail reportData={reportData} /></div>
        <div className="print:break-after-page"><Page07Snapshot2 reportData={reportData} /></div>
        <div className="print:break-after-page"><Page08Environment reportData={reportData} /></div>
        <div className="print:break-after-page"><Page09Prescription reportData={reportData} /></div>
        <div className="print:break-after-page"><Page10Plan reportData={reportData} /></div>
        <div className="print:break-after-page"><Page11Summary reportData={reportData} /></div>
        <div className="print:break-after-auto"><Page12Blueprint reportData={reportData} /></div>
      </div>
    </div>
  )
}
