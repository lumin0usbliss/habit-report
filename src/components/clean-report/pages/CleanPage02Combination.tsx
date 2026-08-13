import type { ReportData } from "@/lib/reportData"
import { results } from "@/data/results"

export function CleanPage02Combination({ reportData }: { reportData: ReportData }) {
  const primary = results[reportData.primaryType]
  const secondary = results[reportData.secondaryType]

  return (
    <div className="clean-page bg-white p-8 border border-neutral-200 rounded-2xl space-y-6 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          Page 02 — Type Combination Analysis
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">유형 상호작용 분석</h2>
      </div>

      <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100 space-y-4">
        <h3 className="text-lg font-bold text-neutral-900">
          {primary?.name} × {secondary?.name} 시너지
        </h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          대표 성향인 <span className="font-semibold text-neutral-900">{primary?.name}</span>의 메커니즘과 보조 성향인 <span className="font-semibold text-neutral-900">{secondary?.name}</span>의 상호작용 분석 결과입니다.
        </p>
      </div>
    </div>
  )
}
