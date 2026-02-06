import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinconium | Tech & Science",
  description: "Playful technology and science with Vinconium",
  icons: {
    icon: "/logo.webp",
  },
};

import { HUD } from "@/components/HUD";
import { Taskbar } from "@/components/Taskbar";
import { fetchChannelStats } from "@/lib/youtube";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stats = await fetchChannelStats("UCmOnc4ziXeC9zH7KdiRUg9Q");

  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${pressStart2P.variable} antialiased bg-deep-space text-white font-pixel relative min-h-screen overflow-x-hidden`}
      >
        <div className="crt-overlay"></div>
        <div className="crt-flicker fixed inset-0 pointer-events-none z-[9998] opacity-10"></div>

        <Taskbar />
        <div className="pt-32 pb-32">
          {children}
        </div>
        <HUD stats={stats} />
      </body>
    </html>
  );
}
