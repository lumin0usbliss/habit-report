import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { D1Database } from "@cloudflare/workers-types"
import fs from "fs"
import path from "path"

export interface ReportRecord {
  id: string
  token_hash: string
  report_data: string
  created_at: number
  expires_at: number
  email_status: string
  email_sent_at?: number | null
  brevo_message_id?: string | null
}

const LOCAL_D1_FILE = path.join(process.cwd(), ".local-data", "d1-reports.json")

function getLocalReports(): ReportRecord[] {
  try {
    if (fs.existsSync(LOCAL_D1_FILE)) {
      const content = fs.readFileSync(LOCAL_D1_FILE, "utf-8")
      return JSON.parse(content)
    }
  } catch (err) {
    console.error("[D1 Client] Local read error:", err)
  }
  return []
}

function saveLocalReports(reports: ReportRecord[]) {
  try {
    const dir = path.dirname(LOCAL_D1_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(LOCAL_D1_FILE, JSON.stringify(reports, null, 2), "utf-8")
  } catch (err) {
    console.error("[D1 Client] Local write error:", err)
  }
}

export async function insertReportRecord(record: ReportRecord): Promise<void> {
  let db: D1Database | null = null
  try {
    const { env } = await getCloudflareContext()
    db = env.DB
  } catch {
    // Non-workers runtime
  }

  if (db) {
    await db
      .prepare(
        `INSERT INTO reports (id, token_hash, report_data, created_at, expires_at, email_status)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(
        record.id,
        record.token_hash,
        record.report_data,
        record.created_at,
        record.expires_at,
        record.email_status
      )
      .run()
    console.log("[D1 Worker] Inserted report into Cloudflare D1:", record.id)
  } else {
    const reports = getLocalReports()
    const filtered = reports.filter((r) => r.id !== record.id && r.token_hash !== record.token_hash)
    filtered.push(record)
    saveLocalReports(filtered)
    console.log("[D1 Local Dev] Inserted report into local store:", record.id)
  }
}

export async function updateReportEmailStatus(
  id: string,
  status: string,
  sentAt?: number | null,
  brevoMessageId?: string | null
): Promise<void> {
  let db: D1Database | null = null
  try {
    const { env } = await getCloudflareContext()
    db = env.DB
  } catch {}

  if (db) {
    await db
      .prepare(
        `UPDATE reports 
         SET email_status = ?, email_sent_at = ?, brevo_message_id = ? 
         WHERE id = ?`
      )
      .bind(status, sentAt || null, brevoMessageId || null, id)
      .run()
    console.log("[D1 Worker] Updated email status:", id, status)
  } else {
    const reports = getLocalReports()
    const item = reports.find((r) => r.id === id)
    if (item) {
      item.email_status = status
      if (sentAt !== undefined) item.email_sent_at = sentAt
      if (brevoMessageId !== undefined) item.brevo_message_id = brevoMessageId
      saveLocalReports(reports)
      console.log("[D1 Local Dev] Updated email status locally:", id, status)
    }
  }
}

export async function findReportByTokenHash(
  tokenHash: string
): Promise<ReportRecord | null> {
  let db: D1Database | null = null
  try {
    const { env } = await getCloudflareContext()
    db = env.DB
  } catch {}

  if (db) {
    const { results } = await db
      .prepare("SELECT * FROM reports WHERE token_hash = ?")
      .bind(tokenHash)
      .all<ReportRecord>()

    if (results && results.length > 0) {
      return results[0]
    }
    return null
  } else {
    const reports = getLocalReports()
    const item = reports.find((r) => r.token_hash === tokenHash)
    return item || null
  }
}

export async function findReportById(
  id: string
): Promise<ReportRecord | null> {
  let db: D1Database | null = null
  try {
    const { env } = await getCloudflareContext()
    db = env.DB
  } catch {}

  if (db) {
    const { results } = await db
      .prepare("SELECT * FROM reports WHERE id = ?")
      .bind(id)
      .all<ReportRecord>()

    if (results && results.length > 0) {
      return results[0]
    }
    return null
  } else {
    const reports = getLocalReports()
    const item = reports.find((r) => r.id === id)
    return item || null
  }
}

export async function deleteExpiredReports(): Promise<{ deletedCount: number }> {
  const now = Math.floor(Date.now() / 1000)
  let db: D1Database | null = null
  try {
    const { env } = await getCloudflareContext()
    db = env.DB
  } catch {}

  if (db) {
    const res = await db
      .prepare("DELETE FROM reports WHERE expires_at < ?")
      .bind(now)
      .run()
    const count = res.meta?.changes || 0
    console.log(`[D1 Worker Cron] Deleted ${count} expired report records from D1.`)
    return { deletedCount: count }
  } else {
    const reports = getLocalReports()
    const valid = reports.filter((r) => r.expires_at >= now)
    const count = reports.length - valid.length
    if (count > 0) {
      saveLocalReports(valid)
    }
    console.log(`[D1 Local Dev Cron] Deleted ${count} expired report records from local store.`)
    return { deletedCount: count }
  }
}
