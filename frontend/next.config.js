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
    
    // Vercel: Use serverless functions
    if (isVercel) {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    }
    
    // Local development: Proxy to local FastAPI server
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
  
  // Output standalone for Docker deployment
  output: 'standalone',
};

module.exports = nextConfig;