"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal } from './Terminal';

export function Taskbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const toolsRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { label: 'HOME', href: '/', color: 'neon', icon: '⌂' },
        { label: 'VIDEOS', href: '/videos', color: 'pink', icon: '▶' },
        { label: 'SHOP', href: '/shop', color: 'retro', icon: '🛒' },
        { label: 'WRITE UP', href: '/write-up', color: 'neon', icon: '📄' },
    ];

    interface ToolItem {
        label: string;
        icon: string;
        href?: string;
        action?: () => void;
        color?: string;
    }

    const toolItems: ToolItem[] = [
        { label: 'TERMINAL', icon: '⌨', action: () => setIsTerminalOpen(true), color: 'neon' },
        { label: 'BASE_EXPLORER', icon: '📦', href: '/tools/base-explorer', color: 'neon' },
        { label: 'CYPHER_CRACKER', icon: '🔓', href: '/tools/cypher-cracker', color: 'pink' },
        { label: 'HASH_LAB', icon: '🔑', href: '/tools/hash-lab', color: 'neon' },
        { label: 'STEGO_WATCH', icon: '🖼', href: '/tools/stego-watch', color: 'pink' },
        { label: 'PWN_HELPER', icon: '⚡', href: '/tools/pwn-helper', color: 'retro' },
        { label: 'XOR_CRYPT', icon: '⊕', href: '/tools/xor-crypt', color: 'neon' },
        { label: 'JWT_DECODER', icon: '🎫', href: '/tools/jwt-decoder', color: 'pink' },
        { label: 'TEXT_TRANSFORM', icon: '✍️', href: '/tools/text-transform', color: 'retro' },
        { label: 'REGEX_LAB', icon: '🔬', href: '/tools/regex-lab', color: 'neon' },
        { label: 'IP_CALC', icon: '🌐', href: '/tools/ip-calc', color: 'pink' },
        { label: 'PASS_GEN', icon: '🎲', href: '/tools/pass-gen', color: 'retro' },
        { label: 'TIME_WIZARD', icon: '⏰', href: '/tools/time-wizard', color: 'neon' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
                setIsToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-[60] p-2 md:p-4 pointer-events-none">
                <div className="flex justify-center w-full max-w-4xl mx-auto pointer-events-auto">

                    <div className="bg-pixel-gray border-[length:var(--border-width)] border-black shadow-pixel-lg flex items-center p-1 md:p-2 gap-1 md:gap-4 w-full md:w-auto relative">
                        {isMenuOpen && (
                            <div className="absolute top-[calc(100%+8px)] left-0 right-0 md:right-auto md:w-64 bg-pixel-gray border-[length:var(--border-width)] border-black shadow-pixel-lg p-2 animate-in slide-in-from-top-4 duration-200 z-50">
                                <div className="bg-black text-white p-2 text-[10px] mb-2 font-bold flex justify-between border-b-[length:var(--border-width)] border-white/10">
                                    <span>VINCO_OS MENU</span>
                                    <button onClick={() => setIsMenuOpen(false)} className="hover:text-retro-yellow cursor-pointer">X</button>
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
                                    <div className="px-3 py-1 text-[8px] font-bold text-gray-500 uppercase tracking-widest">Tools</div>
                                    {toolItems.map((tool) => (
                                        tool.href ? (
                                            <Link
                                                key={tool.label}
                                                href={tool.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`p-3 border-[length:var(--border-width)] border-transparent hover:border-black hover:bg-white hover:text-black flex items-center gap-3 text-xs font-bold transition-all`}
                                            >
                                                <span className="text-lg">{tool.icon}</span>
                                                {tool.label}
                                            </Link>
                                        ) : (
                                            <button
                                                key={tool.label}
                                                onClick={() => {
                                                    tool.action?.();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="p-3 border-[length:var(--border-width)] border-transparent hover:border-black hover:bg-neon-green hover:text-black flex items-center gap-3 text-xs font-bold transition-all cursor-pointer w-full text-left"
                                            >
                                                <span className="text-lg">{tool.icon}</span>
                                                {tool.label}
                                            </button>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}

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
                            <div className="relative h-full" ref={toolsRef}>
                                <button
                                    onClick={() => setIsToolsOpen(!isToolsOpen)}
                                    className={`
                                        px-3 md:px-4 h-full
                                        bg-black text-neon-green border-[length:var(--border-width)] border-black 
                                        font-bold text-[10px] md:text-xs shadow-pixel-sm 
                                        hover:bg-neon-green hover:text-black transition-all
                                        flex items-center gap-2
                                        ${isToolsOpen ? 'bg-neon-green !text-black translate-y-[2px] shadow-none' : ''}
                                    `}
                                >
                                    TOOLS <span className="text-[8px] opacity-50">{isToolsOpen ? '▲' : '▼'}</span>
                                </button>

                                {isToolsOpen && (
                                    <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-pixel-gray border-[length:var(--border-width)] border-black shadow-pixel-lg p-1 animate-in slide-in-from-top-2 duration-200 z-50">
                                        <div className="bg-black text-white p-2 text-[8px] mb-1 font-bold flex justify-between border-b-[length:var(--border-width)] border-white/10">
                                            <span>SYSTEM_TOOLS</span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            {toolItems.map((tool) => (
                                                tool.href ? (
                                                    <Link
                                                        key={tool.label}
                                                        href={tool.href}
                                                        onClick={() => setIsToolsOpen(false)}
                                                        className="p-2 border-[length:var(--border-width)] border-transparent hover:border-black hover:bg-white hover:text-black flex items-center gap-2 text-[10px] font-bold transition-all text-white"
                                                    >
                                                        <span className="text-sm">{tool.icon}</span>
                                                        {tool.label}
                                                    </Link>
                                                ) : (
                                                    <button
                                                        key={tool.label}
                                                        onClick={() => {
                                                            tool.action?.();
                                                            setIsToolsOpen(false);
                                                        }}
                                                        className="p-2 border-[length:var(--border-width)] border-transparent hover:border-black hover:bg-neon-green hover:text-black flex items-center gap-2 text-[10px] font-bold transition-all cursor-pointer text-white w-full text-left"
                                                    >
                                                        <span className="text-sm">{tool.icon}</span>
                                                        {tool.label}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
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
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-right border-l-[length:var(--border-width)] border-black/10 pl-2 md:pl-4">
            <p className="text-[7px] md:text-[8px] text-gray-500 font-bold uppercase">Time</p>
            <p className="text-[9px] md:text-xs font-mono text-white/90">
                {mounted
                    ? `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
                    : "--:--"
                }
            </p>
        </div>
    );
}
