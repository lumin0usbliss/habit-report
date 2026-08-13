import type { ReportData } from "@/lib/reportData"

export function CleanPage10Plan({ reportData }: { reportData: ReportData }) {
  return (
    <div className="clean-page bg-white p-8 border border-neutral-200 rounded-2xl space-y-6 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          Page 10 — 30-Day Habit Plan
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">30일 습관 체계화 플랜</h2>
      </div>

      <div className="p-6 bg-neutral-50 rounded-xl border border-neutral-100">
        <p className="text-sm text-neutral-600 leading-relaxed">
          1주차부터 4주차까지의 정착 로드맵입니다.
        </p>
      </div>
    </div>
  )
}
