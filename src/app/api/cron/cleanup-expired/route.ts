import { NextResponse } from "next/server"
import { deleteExpiredReports } from "@/lib/d1-client"

export async function GET(request: Request) {
  return handleCleanup(request)
}

export async function POST(request: Request) {
  return handleCleanup(request)
}

async function handleCleanup(request: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET
    const url = new URL(request.url)
    const reqSecret =
      request.headers.get("x-cron-secret") || url.searchParams.get("secret")

    if (cronSecret && reqSecret !== cronSecret) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Cron secret mismatch" },
        { status: 401 }
      )
    }

    const { deletedCount } = await deleteExpiredReports()

    return NextResponse.json(
      {
        success: true,
        deletedCount,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  } catch (error: any) {
    console.error("[Cron Cleanup Error]", error)
    return NextResponse.json(
      { error: "SERVER_ERROR", message: error.message || "Failed to cleanup expired reports" },
      { status: 500 }
    )
  }
}
