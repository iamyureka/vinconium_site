"use client";

import React from 'react';
import { PixelCard } from './PixelCard';
import { useTerminal } from '@/hooks/useTerminal';
import { TerminalProps } from '@/lib/terminal/types';

export function Terminal({ onClose }: TerminalProps) {
    const {
        input,
        setInput,
        history,
        theme,
        currentTheme,
        isProcessing,
        suggestion,
        inputRef,
        scrollRef,
        handleKeyDown,
        handleSubmit,
        isEasterEgg
    } = useTerminal(onClose);

    React.useEffect(() => {
        if (isEasterEgg) {
            const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const playSiren = () => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.connect(gain);
                gain.connect(audioCtx.destination);

                const now = audioCtx.currentTime;
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
                osc.frequency.exponentialRampToValueAtTime(440, now + 1.0);
                osc.frequency.exponentialRampToValueAtTime(880, now + 1.5);
                osc.frequency.exponentialRampToValueAtTime(440, now + 2.0);

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 3.0);

                osc.start();
                osc.stop(now + 3);
            };

            playSiren();

            const timer = setTimeout(() => {
                window.close();
                setTimeout(() => {
                    window.location.href = "about:blank";
                }, 500);
            }, 4000);
            return () => {
                clearTimeout(timer);
                audioCtx.close();
            };
        }
    }, [isEasterEgg]);

    const prompt = 'vinco@system:~$';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md pointer-events-auto overflow-hidden">
            <div className="w-full max-w-4xl h-full max-h-[85vh] md:max-h-[75vh] flex flex-col gap-2 md:gap-4 animate-in zoom-in duration-300">
                <PixelCard
                    title="VINCO_CORE_TERMINAL"
                    variant="primary"
                    onClose={onClose}
                    className={`w-full flex-1 overflow-hidden border-2 transition-colors duration-500 ${theme.bg} ${theme.border}`}
                >

                    <div
                        ref={scrollRef}
                        className={`flex-1 overflow-y-auto font-mono text-[10px] md:text-xs p-3 md:p-6 selection:bg-white selection:text-black scrollbar-thin scrollbar-thumb-white/10 ${theme.text} space-y-0`}
                        onClick={() => inputRef.current?.focus()}
                    >
                        {history.map((line, i) => {
                            return (
                                <div key={i} className={`whitespace-pre-wrap min-h-[1.2em] leading-tight ${line.startsWith('vinco@system') ? `${theme.accent} ${theme.glow}` : ''}`}>
                                    {line}
                                </div>
                            );
                        })}


                        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                            <span className={`shrink-0 font-bold ${theme.accent}`}>{prompt}</span>
                            <div className="flex-1 relative flex items-center">
                                {isProcessing && (
                                    <span className="absolute inset-0 opacity-50 animate-pulse z-10">PROCESSING_SIGNAL...</span>
                                )}

                                {!isProcessing && suggestion && (
                                    <div className="absolute inset-0 pointer-events-none flex items-center">
                                        <span className="opacity-0">{input}</span>
                                        <span className="opacity-20">{suggestion.slice(input.length)}</span>
                                    </div>
                                )}

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={`flex-1 bg-transparent border-none outline-none ${theme.text} ${theme.caret} font-mono placeholder:opacity-20 ${isProcessing ? 'opacity-0' : 'opacity-100'} relative z-10`}
                                    autoComplete="off"
                                    spellCheck="false"
                                    placeholder="Type 'help'..."
                                />
                            </div>
                        </form>
                    </div>
                </PixelCard>

                <div className={`p-3 md:p-4 ${theme.bg} border-2 ${theme.border} shadow-pixel flex justify-between items-center text-[7px] md:text-[9px] text-gray-500 uppercase tracking-[0.2em] animate-in slide-in-from-bottom-2 duration-500 delay-200`}>
                    <div className="flex gap-4 md:gap-8">
                        <span className="flex items-center gap-2">
                            <span className="opacity-30">LOC:</span> LAB_7
                        </span>
                        <span className="hidden xs:inline-flex items-center gap-2">
                            <span className="opacity-30">THEME:</span> {currentTheme}
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-2">
                            <span className="opacity-30">PID:</span> {1000 + history.length}
                        </span>
                    </div>
                    <span className={`animate-pulse flex items-center gap-2 font-bold ${theme.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.text.replace('text-', 'bg-')} ${theme.glow}`}></span>
                        ACTIVE_UPLINK
                    </span>
                </div>
            </div>
            {isEasterEgg && (
                <div className="fixed inset-0 z-[9999] bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in duration-300 font-pixel">
                    <PixelCard
                        title="SYSTEM_CRITICAL_FAILURE"
                        variant="primary"
                        className="w-full max-w-2xl border-2 border-red-600 shadow-[20px_20px_0_0_rgba(220,38,38,0.5)]"
                        noPadding
                    >
                        <div className="bg-red-600 p-4 border-b-2 border-black animate-pulse">
                            <div className="text-xl md:text-3xl font-black text-black text-center tracking-tighter">
                                [ GANTENG_OVERLOAD ]
                            </div>
                        </div>

                        <div className="p-8 md:p-12 flex flex-col items-center gap-10 bg-black text-center">
                            <div className="text-white text-lg md:text-2xl font-bold tracking-widest leading-relaxed">
                                CRITICAL: VISUAL_EXCELLENCE_MAXIMUM
                            </div>

                            <div className="space-y-4">
                                <div className="text-[10px] md:text-xs text-red-500 font-mono tracking-[0.2em] uppercase">
                                    &gt;&gt; ERROR: UNRECOVERABLE_CHARISMA
                                </div>
                                <p className="text-[11px] md:text-base text-gray-400 font-mono leading-relaxed">
                                    CORE STABILITY HAS DROPPED TO 0%.<br />
                                    THE SYSTEM CANNOT COPE WITH THIS LEVEL OF ATTRACTIVENESS.<br />
                                    FORCE_CLOSE_INITIATED...
                                </p>
                            </div>

                            <div className="text-red-600 font-bold animate-pulse text-base md:text-2xl tracking-[0.5em] pt-4">
                                GOODBYE_WORLD
                            </div>
                        </div>
                    </PixelCard>
                    <div className="fixed inset-0 pointer-events-none bg-red-500/5 animate-pulse"></div>
                </div>
            )}
        </div>
    );
}
