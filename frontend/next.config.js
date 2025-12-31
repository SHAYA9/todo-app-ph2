/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Vercel deployment - rewrite API routes to serverless function
  async rewrites() {
    // In production (Vercel), proxy to serverless function
    // In development, proxy to local FastAPI server
    const apiUrl = process.env.VERCEL_ENV 
      ? '/api'  // Use Vercel serverless function
      : 'http://localhost:8000';  // Use local FastAPI server
    
    return [
      {
        source: '/api/:path*',
        destination: process.env.VERCEL_ENV 
          ? '/api/:path*'  // Route to Vercel serverless function
          : 'http://localhost:8000/:path*',  // Route to local backend
      },
    ];
  },
};

module.exports = nextConfig;