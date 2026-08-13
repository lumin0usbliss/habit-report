import type { ReportData } from "@/lib/reportData"

export function CleanPage04BehaviorPattern({ reportData }: { reportData: ReportData }) {
  return (
    <div className="clean-page bg-white p-8 border border-neutral-200 rounded-2xl space-y-6 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          Page 04 — Behavior Pattern Analysis
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">행동 패턴 분석</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(reportData.scores).map(([key, score]) => (
          <div key={key} className="p-4 bg-neutral-50 rounded-xl text-center border border-neutral-100">
            <span className="text-xs text-neutral-500 uppercase font-mono">{key}</span>
            <div className="text-xl font-bold text-neutral-900 mt-1">{score}점</div>
          </div>
        ))}
      </div>
    </div>
  )
}
