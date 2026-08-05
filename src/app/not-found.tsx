import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-neutral-900">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-neutral-600">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-600"
      >
        테스트 시작하기
      </Link>
    </div>
  )
}
