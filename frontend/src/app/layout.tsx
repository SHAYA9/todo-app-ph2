"use client";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { requestNotificationPermission } from "@/utils/notifications";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
