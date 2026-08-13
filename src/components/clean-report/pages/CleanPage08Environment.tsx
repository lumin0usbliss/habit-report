import type { ReportData } from "@/lib/reportData"

export function CleanPage08Environment({ reportData }: { reportData: ReportData }) {
  return (
    <div className="clean-page bg-white p-8 border border-neutral-200 rounded-2xl space-y-6 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          Page 08 — Habit Environment Guide
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">환경 설계 가이드</h2>
      </div>

      <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
        <p className="text-sm text-neutral-600 leading-relaxed">
          실행력을 높이기 위한 환경 세팅 조건 분석입니다.
        </p>
      </div>
    </div>
  )
}
