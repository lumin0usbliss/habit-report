import type { ReportData } from "@/lib/reportData"
import { results } from "@/data/results"

export function CleanPage01Profile({ reportData }: { reportData: ReportData }) {
  const primary = results[reportData.primaryType]
  const secondary = results[reportData.secondaryType]

  return (
    <div className="clean-page bg-white p-8 border border-neutral-200 rounded-2xl space-y-6 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          Page 01 — Personal Habit Profile
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">습관 성향 프로필</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
          <span className="text-xs text-neutral-500 font-medium uppercase">대표 습관 유형</span>
          <h3 className="text-xl font-bold text-neutral-900 mt-1">{primary?.name || reportData.primaryType}</h3>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{primary?.oneLineSummary}</p>
        </div>

        <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
          <span className="text-xs text-neutral-500 font-medium uppercase">보조 습관 유형</span>
          <h3 className="text-xl font-bold text-neutral-900 mt-1">{secondary?.name || reportData.secondaryType}</h3>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{secondary?.oneLineSummary}</p>
        </div>
      </div>
    </div>
  )
}
