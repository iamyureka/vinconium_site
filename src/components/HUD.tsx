"use client";

import React, { useState, useEffect } from 'react';

export function HUD({ stats }: { stats?: { subscribers: string, totalViews: string, videoCount?: string } }) {
    const subscribers = stats?.subscribers || 'SCANNING...';
    const videoCount = stats?.videoCount || '---';
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 p-2 md:p-4 transition-all duration-300 pointer-events-none border-b-[length:var(--border-width)] ${isScrolled
            ? 'bg-background/90 backdrop-blur-sm border-white/5 shadow-lg'
            : 'bg-transparent border-transparent'
            }`}>
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto pointer-events-auto gap-1">
                <div className="flex items-center gap-1.5 bg-black/90 p-1.5 border-[length:var(--border-width)] border-white/10 shadow-pixel flex-1 md:flex-none">
                    <div className="w-6 h-6 md:w-10 md:h-10 bg-neon-green/10 shrink-0">
                        <img src="/logo.webp" alt="L" className="w-full h-full object-cover image-rendering-pixelated" />
                    </div>
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                        <span className="text-[8px] md:text-xs font-bold text-white truncate">VINCONIUM</span>
                        <div className="w-16 sm:w-24 md:w-40 h-1 bg-white/10">
                            <div className="bg-neon-green h-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-6 bg-black/90 p-1.5 sm:p-2 border-[length:var(--border-width)] border-white/10 shadow-pixel">
                    <div className="flex gap-2 sm:gap-4 items-center">
                        <div className="text-right">
                            <p className="text-[6px] sm:text-[7px] text-gray-500 font-bold uppercase">VID</p>
                            <p className="text-[8px] sm:text-[9px] text-retro-yellow font-bold leading-none">{videoCount}</p>
                        </div>
                        <div className="text-right border-l border-white/20 pl-2 sm:pl-4">
                            <p className="text-[6px] sm:text-[7px] text-gray-500 font-bold uppercase">SUBS</p>
                            <p className="text-[8px] sm:text-[9px] text-white font-bold leading-none">{subscribers}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 border-l border-white/20 pl-2 sm:pl-4">
                        <span className="w-1 h-1 bg-neon-green rounded-full animate-ping"></span>
                        <span className="text-[6px] sm:text-[8px] text-neon-green font-bold uppercase tracking-widest hidden xs:block">ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
