'use client'

import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

import { HUD } from "@/components/HUD";
import { Taskbar } from "@/components/Taskbar";
import { emptyUser, getUsername, getUserStats } from "@/lib/user";
import { Web3Provider } from "@/components/Web3Provider";
import { PixelGalaxy } from "@/components/PixelGalaxy";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [stats, setStats] = useState(emptyUser)
  useEffect(() => {
    const username = getUsername() || ''
    getUserStats(username).then(v => setStats(v))

  }, [])

  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${pressStart2P.variable} antialiased bg-deep-space text-white font-pixel relative min-h-screen overflow-x-hidden`}
      >
        <Web3Provider>
          <PixelGalaxy />
          <div className="crt-overlay"></div>
          <div className="crt-flicker fixed inset-0 pointer-events-none z-[9998] opacity-10"></div>

          <Taskbar />
          <div className="pt-22 pb-32">
            {children}
          </div>
          <HUD stats={stats} />
        </Web3Provider>
      </body>
    </html>
  );
}
