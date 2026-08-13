import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/cf-api/:path*",
        destination: "https://hazzi-report.liso241215.workers.dev/api/:path*",
      },
    ]
  },
}

export default nextConfig
