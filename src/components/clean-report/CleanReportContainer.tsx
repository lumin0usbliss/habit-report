"use client"

import type { ReportData } from "@/lib/reportData"
import { CleanReportTemplate } from "./CleanReportTemplate"

export function CleanReportContainer({ reportData }: { reportData: ReportData }) {
  const handlePrint = async () => {
    const originalTitle = document.title
    const today = new Date().toISOString().slice(0, 10)
    document.title = `습관성향_개인리포트_${today}`
    await document.fonts.ready
    window.print()
    document.title = originalTitle
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-8 px-4 flex flex-col items-center print:bg-white print:py-0 print:px-0">
      <div className="print:hidden max-w-4xl w-full mb-6 flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Personal Habit Report</h1>
          <p className="text-xs text-neutral-500 mt-1">개인 결과 분석 리포트입니다.</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shrink-0"
        >
          PDF로 저장 / 인쇄
        </button>
      </div>

      <div className="max-w-4xl w-full">
        <CleanReportTemplate reportData={reportData} />
      </div>
    </div>
  )
}
