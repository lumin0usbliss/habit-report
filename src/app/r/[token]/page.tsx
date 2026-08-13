import type { Metadata } from "next"
import { hashToken } from "@/lib/crypto-utils"
import type { ReportData } from "@/lib/reportData"
import { findReportByTokenHash } from "@/lib/d1-client"
import { CleanReportContainer } from "@/components/clean-report/CleanReportContainer"

interface Props {
  params: Promise<{ token: string }>
}

export const metadata: Metadata = {
  title: "Personal Habit Profile Report",
  description: "습관 성향 개인 결과 분석 리포트",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Personal Habit Profile Report",
    description: "개인 습관 분석 리포트입니다.",
  },
}

async function getReportDataByToken(rawToken: string): Promise<{
  status: "OK" | "NOT_FOUND" | "EXPIRED" | "ERROR"
  reportData?: ReportData
}> {
  if (!rawToken || rawToken.length < 16) {
    return { status: "NOT_FOUND" }
  }

  try {
    const backendUrl = process.env.CLOUDFLARE_BACKEND_URL || "https://hazzi-report.soyoung739.workers.dev"
    const res = await fetch(`${backendUrl}/api/reports/${rawToken}`, {
      cache: "no-store",
    })

    if (res.status === 404) {
      return { status: "NOT_FOUND" }
    }
    if (res.status === 410) {
      return { status: "EXPIRED" }
    }

    if (!res.ok) {
      return { status: "ERROR" }
    }

    const data = await res.json()
    if (data.success && data.reportData) {
      return { status: "OK", reportData: data.reportData }
    }

    return { status: "NOT_FOUND" }
  } catch (error) {
    console.error("getReportDataByToken error:", error)
    return { status: "ERROR" }
  }
}

export default async function CleanReportPage({ params }: Props) {
  const { token } = await params
  const result = await getReportDataByToken(token)

  if (result.status === "EXPIRED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl mx-auto border border-amber-100">
            ⏳
          </div>
          <h1 className="text-xl font-bold text-neutral-900">리포트 열람 기간이 만료되었습니다</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            해당 개인 리포트는 90일 보관 기간이 경과되어 삭제 처리되었거나 접근할 수 없습니다.
          </p>
          <a
            href="/"
            className="inline-block pt-2 text-sm font-semibold text-neutral-900 underline hover:text-black"
          >
            새 테스트 시작하기
          </a>
        </div>
      </div>
    )
  }

  if (result.status !== "OK" || !result.reportData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4 text-center">
        <div className="p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm max-w-md w-full space-y-4">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-500 rounded-full flex items-center justify-center text-xl mx-auto">
            🔍
          </div>
          <h1 className="text-xl font-bold text-neutral-900">리포트를 찾을 수 없습니다</h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            올바르지 않거나 만료된 리포트 링크입니다. 주소를 다시 확인해 주세요.
          </p>
          <a
            href="/"
            className="inline-block pt-2 text-sm font-semibold text-neutral-900 underline hover:text-black"
          >
            홈으로 이동
          </a>
        </div>
      </div>
    )
  }

  return <CleanReportContainer reportData={result.reportData} />
}
