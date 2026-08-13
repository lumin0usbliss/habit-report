import type { ReportData } from "@/lib/reportData"

export function CleanPage06FactorDetail({ reportData }: { reportData: ReportData }) {
  return (
    <div className="clean-page bg-white p-8 border border-neutral-200 rounded-2xl space-y-6 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          Page 06 — 8 Factor Detail Analysis
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">8개 핵심 요소 상세 분석</h2>
      </div>

      <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
        <p className="text-sm text-neutral-600 leading-relaxed">
          8개 습관 영역별 세부 진단 결과입니다.
        </p>
      </div>
    </div>
  )
}
