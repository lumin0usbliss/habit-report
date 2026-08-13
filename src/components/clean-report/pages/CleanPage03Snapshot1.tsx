import type { ReportData } from "@/lib/reportData"

export function CleanPage03Snapshot1({ reportData }: { reportData: ReportData }) {
  const topAnswers = reportData.answers.slice(0, 5)

  return (
    <div className="clean-page bg-white p-8 border border-neutral-200 rounded-2xl space-y-6 max-w-4xl mx-auto shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
          Page 03 — Response Snapshot Part 1
        </span>
        <h2 className="text-2xl font-bold text-neutral-900">응답 스냅샷 I</h2>
      </div>

      <div className="space-y-3">
        {topAnswers.map((ans, idx) => (
          <div key={ans.questionId || idx} className="p-4 bg-neutral-50 rounded-lg flex justify-between items-center text-sm">
            <span className="text-neutral-800 font-medium">{ans.question}</span>
            <span className="font-mono font-bold text-neutral-900 bg-white px-3 py-1 rounded border border-neutral-200">
              {ans.answer}점
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
