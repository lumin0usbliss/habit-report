import { NextResponse } from "next/server"
import { hashToken } from "@/lib/crypto-utils"
import type { ReportData } from "@/lib/reportData"
import { findReportByTokenHash } from "@/lib/d1-client"

interface Context {
  params: Promise<{ token: string }>
}

export async function GET(request: Request, context: Context) {
  try {
    const { token: rawToken } = await context.params

    if (!rawToken || rawToken.length < 16) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "리포트를 찾을 수 없습니다." },
        { status: 404, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      )
    }

    // SHA-256 해시 계산
    const tokenHash = await hashToken(rawToken)

    const record = await findReportByTokenHash(tokenHash)

    if (!record) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "리포트를 찾을 수 없습니다." },
        { status: 404, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      )
    }

    const now = Math.floor(Date.now() / 1000)

    // 90일 보관 기간 만료 체크
    if (record.expires_at < now) {
      return NextResponse.json(
        { error: "EXPIRED", message: "리포트 열람 기간이 만료되었습니다." },
        { status: 410, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      )
    }

    const reportData = JSON.parse(record.report_data) as ReportData

    return NextResponse.json(
      { success: true, reportData },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    )
  } catch (error: any) {
    console.error("GET /api/reports/[token] error:", error)
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "리포트 조회 중 오류가 발생했습니다." },
      { status: 500, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    )
  }
}
