import { NextResponse } from "next/server"
import { hashToken } from "@/lib/crypto-utils"
import type { ReportData } from "@/lib/reportData"
import { findReportByTokenHash } from "@/lib/d1-client"

interface Context {
  params: Promise<{ token: string }>
}

const ALLOWED_ORIGIN = "https://habit-report.vercel.app"

function getCorsHeaders(request: Request) {
  const origin = request.headers.get("origin") || ""
  const isAllowed = origin === ALLOWED_ORIGIN || origin.includes("localhost")
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  })
}

export async function GET(request: Request, context: Context) {
  const corsHeaders = getCorsHeaders(request)
  try {
    const { token: rawToken } = await context.params

    if (!rawToken || rawToken.length < 16) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "리포트를 찾을 수 없습니다." },
        { status: 404, headers: { ...corsHeaders, "Cache-Control": "no-store, no-cache, must-revalidate" } }
      )
    }

    // SHA-256 해시 계산
    const tokenHash = await hashToken(rawToken)

    const record = await findReportByTokenHash(tokenHash)

    if (!record) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "리포트를 찾을 수 없습니다." },
        { status: 404, headers: { ...corsHeaders, "Cache-Control": "no-store, no-cache, must-revalidate" } }
      )
    }

    const now = Math.floor(Date.now() / 1000)

    // 90일 보관 기간 만료 체크
    if (record.expires_at < now) {
      return NextResponse.json(
        { error: "EXPIRED", message: "리포트 열람 기간이 만료되었습니다." },
        { status: 410, headers: { ...corsHeaders, "Cache-Control": "no-store, no-cache, must-revalidate" } }
      )
    }

    const reportData = JSON.parse(record.report_data) as ReportData

    return NextResponse.json(
      { success: true, reportData },
      {
        status: 200,
        headers: {
          ...corsHeaders,
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
      { status: 500, headers: { ...corsHeaders, "Cache-Control": "no-store, no-cache, must-revalidate" } }
    )
  }
}
