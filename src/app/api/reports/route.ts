import { NextResponse } from "next/server"
import { generateRawToken, hashToken } from "@/lib/crypto-utils"
import type { ReportData } from "@/lib/reportData"
import { sendReportEmail } from "@/lib/brevo"
import {
  insertReportRecord,
  updateReportEmailStatus,
  findReportById,
} from "@/lib/d1-client"
import { getCloudflareContext } from "@opennextjs/cloudflare"

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

export async function POST(request: Request) {
  const corsHeaders = getCorsHeaders(request)

  // Cloudflare D1 바인딩 존재 여부 검사 (Vercel에서는 getCloudflareContext가 null 또는 예외 발생)
  let hasD1 = false
  try {
    const cf = getCloudflareContext()
    if (cf?.env?.DB) {
      hasD1 = true
    }
  } catch {
    hasD1 = false
  }

  // Vercel 환경인 경우: D1이 장착된 Cloudflare Worker 백엔드 API로 자동 포워딩
  if (!hasD1) {
    try {
      const workerBackendUrl = process.env.CLOUDFLARE_BACKEND_URL || "https://hazzi-report.liso241215.workers.dev"
      const bodyText = await request.text()
      const cfRes = await fetch(`${workerBackendUrl}/api/reports`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyText,
      })

      const data = await cfRes.json()
      return NextResponse.json(data, { status: cfRes.status, headers: corsHeaders })
    } catch (err: any) {
      console.error("[Vercel Proxy Error]", err)
      return NextResponse.json(
        { error: "WORKER_BACKEND_PROXY_FAILED", message: err.message },
        { status: 500, headers: corsHeaders }
      )
    }
  }

  // Cloudflare Worker 환경인 경우: D1 저장 및 Brevo 메일 전송 직접 수행
  try {
    const body = await request.json()
    const { reportData, toEmail, idempotencyKey } = body as {
      reportData: ReportData
      toEmail?: string
      idempotencyKey?: string
    }

    if (!reportData || !reportData.primaryType) {
      return NextResponse.json(
        { error: "유효한 reportData가 없습니다." },
        { status: 400, headers: corsHeaders }
      )
    }

    // 이메일 및 개인 식별자(이름 등)를 절대 포함하지 않는 순수 리포트 데이터 정제
    const cleanReportData: ReportData = {
      reportId: reportData.reportId,
      reportDate: reportData.reportDate,
      primaryType: reportData.primaryType,
      secondaryType: reportData.secondaryType,
      scores: reportData.scores,
      answers: reportData.answers,
    }

    const reportId = idempotencyKey || reportData.reportId || crypto.randomUUID()
    const existingRecord = await findReportById(reportId)

    const siteUrl = process.env.PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://habit-report.vercel.app"

    // 서버 측 Idempotency 검증: 이미 전송 성공한 동일 요청인 경우 재발송 차단
    if (existingRecord && existingRecord.email_status === "sent") {
      console.log("[POST /api/reports] Idempotency match: Email already sent for report ID:", reportId)
      return NextResponse.json(
        {
          success: true,
          reportId,
          expiresAt: new Date(existingRecord.expires_at * 1000).toISOString(),
          emailSent: true,
          emailMessage: "입력하신 이메일로 리포트 링크를 전송했습니다.",
          idempotent: true,
        },
        { headers: corsHeaders }
      )
    }

    let id = reportId
    let rawToken: string
    let tokenHash: string
    let createdAt: number
    let expiresAt: number

    if (existingRecord) {
      // 기존 저장된 레코드가 있으나 메일 발송이 완료되지 않았던 경우 재활용
      id = existingRecord.id
      tokenHash = existingRecord.token_hash
      createdAt = existingRecord.created_at
      expiresAt = existingRecord.expires_at
      rawToken = ""
    } else {
      // 신규 리포트 생성 및 D1 기록
      rawToken = generateRawToken()
      tokenHash = await hashToken(rawToken)

      createdAt = Math.floor(Date.now() / 1000)
      const ninetyDaysSeconds = 90 * 24 * 60 * 60 // 90일
      expiresAt = createdAt + ninetyDaysSeconds

      const reportDataJson = JSON.stringify(cleanReportData)

      await insertReportRecord({
        id,
        token_hash: tokenHash,
        report_data: reportDataJson,
        created_at: createdAt,
        expires_at: expiresAt,
        email_status: "pending",
      })
    }

    let emailSent = false
    let emailMessage = "이메일 주소가 제공되지 않았습니다."

    // 이메일 발송 요청이 있는 경우 Brevo 발송 시도
    if (toEmail && typeof toEmail === "string" && toEmail.includes("@")) {
      if (!rawToken) {
        rawToken = generateRawToken()
        tokenHash = await hashToken(rawToken)
        await insertReportRecord({
          id,
          token_hash: tokenHash,
          report_data: JSON.stringify(cleanReportData),
          created_at: createdAt,
          expires_at: expiresAt,
          email_status: "pending",
        })
      }

      const reportUrl = `${siteUrl}/r/${rawToken}`

      const mailResult = await sendReportEmail({
        toEmail,
        reportUrl,
      })

      const now = Math.floor(Date.now() / 1000)

      if (mailResult.success) {
        emailSent = true
        emailMessage = "입력하신 이메일로 리포트 링크를 전송했습니다."

        await updateReportEmailStatus(id, "sent", now, mailResult.messageId || null)
      } else {
        emailSent = false
        emailMessage = "리포트는 정상적으로 생성되었지만 이메일 전송에 실패했습니다."

        await updateReportEmailStatus(id, "failed")
      }
    }

    return NextResponse.json(
      {
        success: true,
        reportId: id,
        expiresAt: new Date(expiresAt * 1000).toISOString(),
        emailSent,
        emailMessage,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    console.error("POST /api/reports error:", error)
    return NextResponse.json(
      { error: error.message || "리포트 생성 중 오류가 발생했습니다." },
      { status: 500, headers: corsHeaders }
    )
  }
}
