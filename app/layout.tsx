import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
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
    <html lang="en" className={`dark ${jakarta.variable} ${syne.variable} ${mono.variable}`}>
      <body
        className="antialiased"
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
