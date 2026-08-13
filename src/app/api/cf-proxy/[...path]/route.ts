import { NextResponse } from "next/server"

const WORKER_BACKEND_URL = process.env.CLOUDFLARE_BACKEND_URL || "https://hazzi-report.liso241215.workers.dev"

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params
    const targetPath = path ? path.join("/") : ""
    const url = `${WORKER_BACKEND_URL}/api/${targetPath}`

    const bodyText = await request.text()
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyText,
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    console.error("cf-proxy POST error:", err)
    return NextResponse.json({ error: "PROXY_ERROR", message: err.message }, { status: 500 })
  }
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await context.params
    const targetPath = path ? path.join("/") : ""
    const url = `${WORKER_BACKEND_URL}/api/${targetPath}`

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    console.error("cf-proxy GET error:", err)
    return NextResponse.json({ error: "PROXY_ERROR", message: err.message }, { status: 500 })
  }
}
