"use client"

import { useEffect, useState } from "react"
import { getResultCounts } from "@/lib/supabase"
import { results } from "@/data/results"
import type { TypeCode } from "@/data/questions"
import { Footer } from "@/components/layout/Footer"

/**
 * Ranking page — shows the participant type distribution.
 *
 * DESIGN NOTE: Neutral styling. Designer replaces card shape, bar style,
 * color-per-type treatment, motion. Data contract stays as-is.
 */

export default function RankingPage() {
  const [counts, setCounts] = useState<Record<TypeCode, number> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getResultCounts().then((c) => {
      setCounts(c)
      setLoading(false)
    })
  }, [])

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0
  const sorted = counts
    ? (Object.entries(counts) as [string, number][])
        .map(([t, c]) => ({ type: t as TypeCode, count: c }))
        .sort((a, b) => b.count - a.count)
    : []

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 px-6 py-12 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-center mb-1">성향 분포</h1>
        <p className="text-neutral-500 text-sm text-center mb-10">
          {total > 0
            ? `${total.toLocaleString()}명 참여`
            : "첫 번째 참여자가 되어보세요"}
        </p>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map(({ type, count }, idx) => {
              const result = results[type]
              const pct = total > 0 ? Math.round((count / total) * 100) : 0
              return (
                <div
                  key={type}
                  className="border border-neutral-200 rounded-md p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md border border-neutral-300 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-neutral-500">{type}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {result.name}
                      </p>
                      <p className="text-neutral-500 text-xs">
                        {count}명 · {pct}%
                      </p>
                    </div>
                    {idx === 0 && count > 0 && (
                      <span className="text-xs border border-neutral-300 text-neutral-700 px-2 py-0.5 rounded-full shrink-0">
                        1위
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-neutral-900 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href="/"
            className="text-neutral-500 text-sm hover:text-neutral-900 transition-colors"
          >
            ← 테스트 하러가기
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}
