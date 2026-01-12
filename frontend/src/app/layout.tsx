import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFlow by taskflow-xs | Todo App & Productivity Tool",
  description: "Track your tasks efficiently with TaskFlow. Stay organized, productive, and achieve more with our intuitive todo app.",
  keywords: [
    "taskflow-xs",
    "taskflow",
    "todo app",
    "productivity",
    "task management",
    "todo list",
    "productivity tool",
    "task tracker",
    "Shayan Ali",
    "web development",
    "AI solutions"
  ],
  creator: "Shayan Ali",
  authors: [{ name: "Shayan Ali" }],
  publisher: "taskflow-xs",
  
  icons: {
    icon: '/favicon.ico',
    apple: '/f.png',
  },
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taskflow-xs.vercel.app/",
    title: "TaskFlow by taskflow-xs | Professional Todo App",
    description: "Boost your productivity with TaskFlow - The ultimate todo app for efficient task management and organization.",
    siteName: "TaskFlow",
    images: [
      {
        url: '/og-image.png', // Add your OG image path here
        width: 1200,
        height: 630,
        alt: 'TaskFlow Todo App Preview',
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: "TaskFlow by taskflow-xs | Professional Todo App",
    description: "Boost your productivity with TaskFlow - The ultimate todo app for efficient task management.",
    images: ['/twitter-image.png'], // Add your Twitter image path here
    creator: '@taskflow_xs',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  alternates: {
    canonical: "https://taskflow-xs.vercel.app",
  },
  
  verification: {
    google: 'wpveJVhsOohhsSaHM8xWxPz19Txok241NnAgp_tRlAQ',
  },
  
  // Additional SEO improvements
  category: 'productivity',
  applicationName: 'TaskFlow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add additional meta tags for better SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        
        {/* Structured Data for better SEO - You can expand this */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TaskFlow",
              "url": "https://taskflow-xs.vercel.app",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Any",
              "description": "Task management and productivity application",
              "creator": {
                "@type": "Person",
                "name": "Shayan Ali"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
