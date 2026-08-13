/**
 * Brevo Transactional Email Service Module
 */

export interface SendReportEmailParams {
  toEmail: string
  reportUrl: string
}

export interface SendReportEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendReportEmail(
  params: SendReportEmailParams
): Promise<SendReportEmailResult> {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "noreply@hazzi-report.com"
  const senderName = process.env.BREVO_SENDER_NAME || "습관 분석 리포트"

  if (!apiKey) {
    console.warn("[Brevo] BREVO_API_KEY is not configured in environment variables.")
    return {
      success: false,
      error: "BREVO_API_KEY가 서버 환경변수에 설정되지 않았습니다.",
    }
  }

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: params.toEmail }],
    subject: "개인 습관 분석 리포트가 도착했습니다",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 32px 16px; }
          .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 36px 28px; border: 1px solid #e4e4e7; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .title { font-size: 20px; font-weight: 700; color: #18181b; margin-bottom: 16px; line-height: 1.4; }
          .text { font-size: 15px; color: #52525b; line-height: 1.6; margin-bottom: 28px; }
          .btn-container { margin: 28px 0; text-align: center; }
          .btn { display: inline-block; background-color: #18181b; color: #ffffff !important; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 12px; text-decoration: none; }
          .footer-info { font-size: 13px; color: #71717a; background-color: #f4f4f5; padding: 16px; border-radius: 12px; margin-top: 28px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="title">개인 습관 분석 리포트가 도착했습니다</div>
          <div class="text">
            검사가 완료되었습니다.<br>
            아래 버튼을 눌러 개인 분석 리포트를 확인해 주세요.
          </div>
          <div class="btn-container">
            <a href="${params.reportUrl}" class="btn" target="_blank" rel="noopener noreferrer">내 리포트 확인하기</a>
          </div>
          <div class="footer-info">
            • 리포트 페이지에서 PDF 파일을 다운로드할 수 있습니다.<br>
            • 리포트 열람 기간: 발급일로부터 90일 (이후 자동 삭제)
          </div>
        </div>
      </body>
      </html>
    `,
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}))
      console.error("[Brevo Error]", res.status, errJson)
      return {
        success: false,
        error: errJson.message || `Brevo API HTTP ${res.status}`,
      }
    }

    const data = await res.json()
    return {
      success: true,
      messageId: data.messageId as string,
    }
  } catch (err: any) {
    console.error("[Brevo Exception]", err)
    return {
      success: false,
      error: err.message || "Brevo network error",
    }
  }
}
