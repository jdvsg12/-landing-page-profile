/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    '/*': ['./content/**/*'],
    '/api/admin/*': ['./content/**/*'],
  },
}

export default nextConfig
