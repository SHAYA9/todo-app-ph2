import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskFLow by taskflow-xs",
  description: "Track your tasks efficiently with taskflow-xs's Todo App.",
};
export const metadata: Metadata = {
  title: "taskflow-xs | SHAYAN - Professional Web Development & AI Solutions",
  description: "taskflow-xs Track your todo efficiently, Stay orginaize and productive",
  keywords: [
    "todo-app",
    "todo app", 
    "taskflow-xs",
    "taskflow",
    "Xpertsphere",
    "AI chatbot development",
    "organized",
    "todo",
    "app",
    "stay productive",
    "expert sphere",
    "web development services",
    "Shayan the founder of xpertsphere",
    "Shayan Ali"
  ],
  creator: "Shayan Ali",
  authors: [{ name: "Shayan Ali" }],
  publisher: "taskflow-xs",
  
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
          ],
    apple: { url: '/f.png', type: 'image/png' },
       
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taskflow-xs.vercel.app/",
    title: "Taskflow-xs | SHAYAN - Professional Web Development & AI Solutions",
    description: "taskflow-xsX - Professional web development, AI chatbots, SEO optimization. Transform your business with expert digital solutions.",
    siteName: "Taskflow-xs | SHAYAN",
    
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
    canonical: "https://taskflow-xs.vercel.app"
  }
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://taskflow-xs.vercel.app/" />

        {/* 💡 Add Google Search Console Verification Meta Tag Here */}
        <meta
          name="google-site-verification"
          content="wpveJVhsOohhsSaHM8xWxPz19Txok241NnAgp_tRlAQ"
        />
      </head>

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
