"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTest } from "@/context/TestContext"
import { Footer } from "@/components/layout/Footer"

export default function ApplyPage() {
  const router = useRouter()
  const { setParticipantInfo } = useTest()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeBeta, setAgreeBeta] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)
  
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; terms?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (name.length < 2 || name.length > 20) {
      newErrors.name = "이름이나 닉네임을 2~20자로 입력해주세요."
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요."
    }
    const phoneRegex = /^010-\d{4}-\d{4}$/
    if (!phoneRegex.test(phone)) {
      newErrors.phone = "휴대전화 번호를 010-0000-0000 양식으로 입력해주세요."
    }
    if (!agreePrivacy || !agreeBeta) {
      newErrors.terms = "필수 항목에 동의해야 테스트를 시작할 수 있습니다."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    let formatted = raw
    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`
    }
    setPhone(formatted)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("participant-email", email)
        sessionStorage.setItem("participant-name", name)
      }
      setParticipantInfo(name, phone)
      router.push("/test")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-hazzi-canvas)] font-[family-name:var(--font-ibm-plex)]">
      <header className="h-16 flex items-center px-4 border-b border-[var(--color-hazzi-gray-300)] bg-white">
        <div className="font-[family-name:var(--font-space)] font-bold text-xl text-[var(--color-hazzi-magenta)] mx-auto">
          HAZZI
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md bg-white p-6 md:p-8 rounded-3xl border border-[var(--color-hazzi-gray-300)] shadow-sm my-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-3 break-keep">
              HAZZI 베타테스트에 참여할<br/>정보를 입력해주세요.
            </h1>
            <p className="text-sm text-[var(--color-hazzi-gray-500)] break-keep leading-relaxed">
              입력한 이름은 결과 리포트에 표시되며, 이메일은 결과 저장과 리포트 전달을 위해 사용됩니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">이름 또는 닉네임 <span className="text-[var(--color-hazzi-magenta)]">*</span></label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="해찌"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-hazzi-gray-300)] focus:outline-none focus:border-[var(--color-hazzi-magenta)] transition-colors"
              />
              {errors.name && <p className="text-[var(--color-hazzi-magenta)] text-xs mt-2">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">이메일 주소 <span className="text-[var(--color-hazzi-magenta)]">*</span></label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hazzi@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-hazzi-gray-300)] focus:outline-none focus:border-[var(--color-hazzi-magenta)] transition-colors"
              />
              <p className="text-[var(--color-hazzi-gray-500)] text-xs mt-2">결과 확인과 PDF 전달 용도로만 사용합니다.</p>
              {errors.email && <p className="text-[var(--color-hazzi-magenta)] text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">휴대전화 번호 <span className="text-[var(--color-hazzi-magenta)]">*</span></label>
              <input 
                type="tel" 
                value={phone}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                maxLength={13}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-hazzi-gray-300)] focus:outline-none focus:border-[var(--color-hazzi-magenta)] transition-colors"
              />
              <p className="text-[var(--color-hazzi-gray-500)] text-xs mt-2">알림 및 안내 용도로 사용합니다.</p>
              {errors.phone && <p className="text-[var(--color-hazzi-magenta)] text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="border-t border-[var(--color-hazzi-gray-300)] pt-6 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreePrivacy}
                  onChange={e => setAgreePrivacy(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[var(--color-hazzi-gray-300)] text-[var(--color-hazzi-magenta)] focus:ring-[var(--color-hazzi-magenta)]"
                />
                <span className="text-sm">
                  [필수] 개인정보 수집 및 이용 동의
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreeBeta}
                  onChange={e => setAgreeBeta(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[var(--color-hazzi-gray-300)] text-[var(--color-hazzi-magenta)] focus:ring-[var(--color-hazzi-magenta)]"
                />
                <span className="text-sm">
                  [필수] 베타테스트 참여와 비식별 피드백 활용 동의
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={agreeMarketing}
                  onChange={e => setAgreeMarketing(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[var(--color-hazzi-gray-300)] text-[var(--color-hazzi-magenta)] focus:ring-[var(--color-hazzi-magenta)]"
                />
                <span className="text-sm text-[var(--color-hazzi-gray-500)]">
                  [선택] 정식 출시와 HAZZI 관련 소식 수신 동의
                </span>
              </label>
              
              {errors.terms && <p className="text-[var(--color-hazzi-magenta)] text-xs mt-2">{errors.terms}</p>}
            </div>

            <button 
              type="submit"
              className="w-full bg-[var(--color-hazzi-ink)] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
            >
              입력하고 테스트 시작하기
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
