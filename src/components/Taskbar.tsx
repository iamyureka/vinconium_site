"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal } from './Terminal';

export function Taskbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);

    const navItems = [
        { label: 'HOME', href: '/', color: 'neon', icon: '⌂' },
        { label: 'VIDEOS', href: '/videos', color: 'pink', icon: '▶' },
        { label: 'SHOP', href: '/shop', color: 'retro', icon: '🛒' },
        { label: 'WRITE UP', href: '/write-up', color: 'neon', icon: '📄' },
    ];

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-[60] p-2 md:p-4 pointer-events-none">
                <div className="flex justify-center w-full max-w-4xl mx-auto pointer-events-auto">

                    {isMenuOpen && (
                        <div className="absolute top-21 left-4 right-4 md:left-auto md:right-auto md:w-64 bg-pixel-gray border-[length:var(--border-width)] border-black shadow-pixel-lg p-2 animate-in slide-in-from-top-4 duration-200">
                            <div className="bg-black text-white p-2 text-[10px] mb-2 font-bold flex justify-between border-b-[length:var(--border-width)] border-white/10">
                                <span>VINCO_OS MENU</span>
                                <button onClick={() => setIsMenuOpen(false)}>X</button>
                            </div>
                            <div className="flex flex-col gap-1 ">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`p-3 border-[length:var(--border-width)] border-transparent hover:border-black hover:bg-white hover:text-black flex items-center gap-3 text-xs font-bold transition-all ${pathname === item.href ? 'bg-white/10 border-white/20' : ''}`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="h-[1px] bg-white/10 my-1"></div>
                                <button
                                    onClick={() => {
                                        setIsTerminalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="p-3 border-[length:var(--border-width)] border-transparent hover:border-black hover:bg-neon-green hover:text-black flex items-center gap-3 text-xs font-bold transition-all"
                                >
                                    <span className="text-lg">⌨</span>
                                    TERMINAL
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-pixel-gray border-[length:var(--border-width)] border-black shadow-pixel-lg flex items-center p-1 md:p-2 gap-1 md:gap-4 w-full md:w-auto relative">

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`
              bg-neon-green text-black px-3 md:px-4 py-1.5 md:py-2 
              font-bold text-[10px] md:text-sm shadow-pixel-sm border-[length:var(--border-width)] border-black 
              active:translate-y-[2px] active:shadow-none transition-all
              flex items-center gap-2 shrink-0 sm:hidden
              ${isMenuOpen ? 'bg-white shadow-none translate-y-[2px]' : ''}
            `}
                        >
                            <span className="text-lg leading-none">❖</span>
                            <span>START_OS</span>
                        </button>

                        <div className="hidden sm:flex gap-1 md:gap-2 h-full">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const colorClass = item.color === 'neon' ? 'hover:bg-neon-green' :
                                    item.color === 'pink' ? 'hover:bg-cyber-pink' :
                                        'hover:bg-retro-yellow';

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                    px-3 md:px-6 py-1.5 md:py-2
                    border-[length:var(--border-width)] border-black
                    text-[10px] md:text-xs font-bold tracking-[0.1em]
                    transition-all duration-200 whitespace-nowrap
                    flex items-center gap-2
                    ${isActive ? 'bg-white text-black translate-y-[2px] shadow-none' : 'bg-black text-white ' + colorClass + ' hover:text-black shadow-pixel-sm'}
                  `}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => setIsTerminalOpen(true)}
                                className="px-3 md:px-4 py-1.5 md:py-2 bg-black text-neon-green border-[length:var(--border-width)] border-black font-bold text-[10px] md:text-xs shadow-pixel-sm hover:bg-neon-green hover:text-black transition-all"
                            >
                                TERMINAL
                            </button>
                        </div>

                        <div className="sm:hidden flex-1 px-4 text-center">
                            <span className="text-[9px] font-bold text-neon-green tracking-widest uppercase line-clamp-1">
                                {navItems.find(i => i.href === pathname)?.label || 'VINCONIUM'}
                            </span>
                        </div>

                        <div className="ml-auto flex items-center gap-2 md:gap-4 px-2 md:px-4 border-l-[length:var(--border-width)] border-black/20">
                            <div className="text-right hidden xs:block">
                                <p className="text-[7px] md:text-[8px] text-gray-500 font-bold">CORE_LOAD</p>
                                <p className="text-[9px] md:text-[10px] font-mono text-white/80">12%</p>
                            </div>
                            <Clock />
                        </div>
                    </div>
                </div>
            </div>

            {isTerminalOpen && (
                <Terminal onClose={() => setIsTerminalOpen(false)} />
            )}
        </>
    );
}

function Clock() {
    const [time, setTime] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-right border-l-[length:var(--border-width)] border-black/10 pl-2 md:pl-4">
            <p className="text-[7px] md:text-[8px] text-gray-500 font-bold uppercase">Time</p>
            <p className="text-[9px] md:text-xs font-mono text-white/90">
                {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}
            </p>
        </div>
    );
}
