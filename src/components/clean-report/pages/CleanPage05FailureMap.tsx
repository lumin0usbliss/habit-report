import type { ReportData } from "@/lib/reportData"

export function CleanPage05FailureMap({ reportData }: { reportData: ReportData }) {
  return (
    <div className="clean-page bg-white p-8 border border-neutral-200 rounded-2xl space-y-6 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          Page 05 — Habit Failure Map
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">습관 실패 취약 지점</h2>
      </div>

      <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
        <p className="text-sm text-neutral-600 leading-relaxed">
          유형 특성상 반복되는 취약 지점 분석 정보가 포함되어 있습니다.
        </p>
      </div>
    </div>
  )
}
