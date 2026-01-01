/** @type {import('next').NextConfig} */
const nextConfig = {
  // API rewrites for different deployment environments
  async rewrites() {
    // Detect deployment environment
    const isHuggingFace = process.env.SPACE_ID || process.env.SPACE_AUTHOR_NAME;
    const isVercel = process.env.VERCEL_ENV;
    
    // Hugging Face: Backend runs on same container at port 8000
    if (isHuggingFace) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*',
        },
      ];
    }
    
    // Vercel: Proxy to Railway backend
    if (isVercel) {
      return [
        {
          source: '/api/:path*',
          destination: 'https://todo-app-ph2-production.up.railway.app/:path*',
        },
      ];
    }
    
    // Local development: Use environment variable or Railway
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'https://todo-app-ph2-production.up.railway.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;