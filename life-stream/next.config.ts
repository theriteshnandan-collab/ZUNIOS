import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'img.clerk.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'pollinations.ai' },
      { protocol: 'https', hostname: '**.pollinations.ai' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https: blob:; script-src 'none'; sandbox;",
  },

  typescript: {
    ignoreBuildErrors: true, // User requested (Production "go-mode")
  },

  // 🔒 PRODUCTION SECURITY HEADERS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' // Tighten this as needed for Project VOX/OCULUS later
          }
        ]
      }
    ]
  }
};

export default nextConfig;