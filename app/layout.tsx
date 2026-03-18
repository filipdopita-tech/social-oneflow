import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social OneFlow – Content Planning Platform",
  description: "Premium content planning and scheduling platform for social media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#080810', color: '#F0F0FF', minHeight: '100vh' }}
      >
        <Sidebar />
        <TopBar />
        <main
          className="flex-1 overflow-auto"
          style={{ marginLeft: 64, marginTop: 64, minHeight: 'calc(100vh - 64px)' }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
