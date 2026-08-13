/**
 * Web Crypto API를 사용한 토큰 생성 및 SHA-256 해시 유틸리티
 */

/**
 * 32바이트(256비트)의 암호학적으로 안전한 무작위 헥스 문자열(64자리 rawToken) 생성
 */
export function generateRawToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * rawToken을 받아서 SHA-256 해시(64자리 헥스 문자열) 반환
 * D1 DB의 token_hash 칼럼에 저장하는 용도
 */
export async function hashToken(rawToken: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(rawToken)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}
