"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart2, RefreshCw, LogOut, ExternalLink, ChevronDown, ChevronUp, Users } from "lucide-react"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { getAllParticipants, getResultCounts } from "@/lib/supabase"
import type { TestResultRow } from "@/lib/supabase"
import { results } from "@/data/results"
import type { TypeCode } from "@/data/questions"

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, loading, logout } = useAdminAuth()
  const [participants, setParticipants] = useState<TestResultRow[]>([])
  const [counts, setCounts] = useState<Record<TypeCode, number> | null>(null)
  const [search, setSearch] = useState("")
  const [fetching, setFetching] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/admin/login")
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (isAuthenticated) fetchData()
  }, [isAuthenticated])

  const fetchData = async () => {
    setFetching(true)
    const [rows, c] = await Promise.all([getAllParticipants(), getResultCounts()])
    setParticipants(rows)
    setCounts(c)
    setFetching(false)
  }

  const handleLogout = () => {
    logout()
    router.replace("/admin/login")
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalCount = participants.length
  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.phone && p.phone.includes(search))
  )

  const siteUrl = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BarChart2 className="w-5 h-5 text-brand-400" />
          <h1 className="font-bold text-base">관리자 대시보드</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
            사이트로
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 col-span-2 md:col-span-1 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
              <Users className="w-3.5 h-3.5" />
              전체 참여자
            </div>
            <p className="text-3xl font-bold">{totalCount}</p>
          </div>
          {counts &&
            (Object.entries(counts) as [string, number][])
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([type, count]) => {
                const result = results[type as TypeCode]
                return (
                  <div key={type} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center`}>
                        <span className="text-white text-[10px] font-bold">{type}</span>
                      </div>
                      <span className="text-white/60 text-xs truncate">{result?.name || type}</span>
                    </div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-white/30 text-xs">
                      {totalCount > 0 ? Math.round((count / totalCount) * 100) : 0}%
                    </p>
                  </div>
                )
              })}
        </div>

        {/* Type distribution */}
        {counts && totalCount > 0 && (
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-8">
            <h2 className="text-xs font-semibold text-white/40 mb-4 uppercase tracking-wider">
              유형별 분포
            </h2>
            <div className="space-y-3">
              {(Object.entries(counts) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const result = results[type as TypeCode]
                  const pct = Math.round((count / totalCount) * 100)
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0`}>
                        <span className="text-white text-[10px] font-bold">{type}</span>
                      </div>
                      <span className="text-sm text-white/60 w-28 shrink-0 truncate">
                        {result?.name || type}
                      </span>
                      <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-white/40 w-8 text-right shrink-0">
                        {count}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Search + refresh */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="이름 또는 연락처 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-brand-400/50 transition-colors"
          />
          <button
            onClick={fetchData}
            disabled={fetching}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-white/10 text-xs text-white/30 uppercase tracking-wider">
            <span className="col-span-3">이름</span>
            <span className="col-span-3">연락처</span>
            <span className="col-span-3">유형</span>
            <span className="col-span-2">링크</span>
            <span className="col-span-1">일시</span>
          </div>

          {fetching && (
            <div className="py-12 text-center text-white/30 text-sm">불러오는 중...</div>
          )}

          {!fetching && filtered.length === 0 && (
            <div className="py-12 text-center text-white/30 text-sm">
              {search ? "검색 결과가 없어요" : "아직 참여자가 없어요"}
            </div>
          )}

          {!fetching &&
            filtered.map((p) => {
              const result = results[p.final_type]
              const isExpanded = expandedId === p.id
              const shareUrl = `${siteUrl}/result/${p.id}`
              const date = new Date(p.created_at)
              const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`

              return (
                <div key={p.id} className="border-b border-white/5 last:border-0">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    className="w-full grid grid-cols-12 gap-2 px-5 py-3.5 text-left hover:bg-white/5 transition-colors text-sm"
                  >
                    <span className="col-span-3 text-white font-medium truncate">{p.name}</span>
                    <span className="col-span-3 text-white/50 truncate">{p.phone || "—"}</span>
                    <span className="col-span-3">
                      <span className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0`}>
                          <span className="text-white text-[10px] font-bold">{p.final_type}</span>
                        </div>
                        <span className="text-white/70 truncate text-xs">{result?.name || p.final_type}</span>
                      </span>
                    </span>
                    <span className="col-span-2">
                      <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs transition-colors"
                      >
                        보기
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </span>
                    <span className="col-span-1 flex items-center justify-between">
                      <span className="text-white/30 text-xs">{dateStr}</span>
                      {isExpanded
                        ? <ChevronUp className="w-3.5 h-3.5 text-white/30" />
                        : <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                      }
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-4 bg-white/[0.02]">
                      <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">
                        유형별 점수 (최대 16점)
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {p.ranking.map(({ type, score }, idx) => {
                          const r = results[type]
                          return (
                            <div
                              key={type}
                              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${idx === 0 ? "bg-brand-400/15 border border-brand-400/25" : "bg-white/5"}`}
                            >
                              <div className={`w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0`}>
                                <span className="text-white text-[10px] font-bold">{type}</span>
                              </div>
                              <span className="text-white/60 truncate text-xs">{r?.name || type}</span>
                              <span className="ml-auto font-bold text-white text-sm">{score}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>

        {filtered.length > 0 && (
          <p className="text-white/20 text-xs mt-3 text-right">{filtered.length}명 표시</p>
        )}
      </div>
    </div>
  )
}
