"use client";
import React, { useState, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

const unixToDate = (ts: number): string => new Date(ts * 1000).toISOString();
const dateToUnix = (date: string): number => Math.floor(new Date(date).getTime() / 1000);

const formatDuration = (seconds: number): string => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
};

const timezones = [
    { name: 'UTC', offset: 0 }, { name: 'EST', offset: -5 }, { name: 'PST', offset: -8 },
    { name: 'CET', offset: 1 }, { name: 'JST', offset: 9 }, { name: 'IST', offset: 5.5 },
];

export default function TimeWizardPage() {
    const [unixInput, setUnixInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [now, setNow] = useState(Math.floor(Date.now() / 1000));
    const [ts1, setTs1] = useState('');
    const [ts2, setTs2] = useState('');

    const refreshNow = useCallback(() => setNow(Math.floor(Date.now() / 1000)), []);

    const convertedDate = unixInput ? unixToDate(Number(unixInput)) : '';
    const convertedUnix = dateInput ? dateToUnix(dateInput) : 0;
    const diff = ts1 && ts2 ? Math.abs(Number(ts1) - Number(ts2)) : 0;

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">⏰</span>
                    <div><h1 className="text-fluid-2xl text-neon-green font-bold">TIME_WIZARD</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">Unix Timestamp Converter</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-neon-green/50 to-transparent"></div>

                <PixelCard title="CURRENT_TIME" variant="primary">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-500 uppercase">Unix Timestamp</p>
                            <p className="text-2xl font-mono text-neon-green">{now}</p>
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-500 uppercase">ISO 8601</p>
                            <p className="text-sm font-mono text-cyber-pink">{unixToDate(now)}</p>
                        </div>
                        <PixelButton variant="neon" onClick={refreshNow}>🔄 REFRESH</PixelButton>
                        <PixelButton variant="retro" onClick={() => navigator.clipboard.writeText(now.toString())}>📋 COPY</PixelButton>
                    </div>
                </PixelCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <PixelCard title="UNIX → DATE" variant="glass">
                        <div className="flex flex-col gap-3">
                            <input value={unixInput} onChange={e => setUnixInput(e.target.value)} placeholder="Enter Unix timestamp..."
                                className="bg-black/60 border border-white/20 p-3 text-sm font-mono text-white focus:outline-none" />
                            {convertedDate && (
                                <div className="p-3 bg-black/40 border border-white/10">
                                    <p className="text-sm font-mono text-neon-green">{convertedDate}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">{new Date(Number(unixInput) * 1000).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </PixelCard>

                    <PixelCard title="DATE → UNIX" variant="glass">
                        <div className="flex flex-col gap-3">
                            <input type="datetime-local" value={dateInput} onChange={e => setDateInput(e.target.value)}
                                className="bg-black/60 border border-white/20 p-3 text-sm text-white focus:outline-none" />
                            {convertedUnix > 0 && (
                                <div className="p-3 bg-black/40 border border-white/10 cursor-pointer" onClick={() => navigator.clipboard.writeText(convertedUnix.toString())}>
                                    <p className="text-sm font-mono text-cyber-pink">{convertedUnix}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Click to copy</p>
                                </div>
                            )}
                        </div>
                    </PixelCard>
                </div>

                <PixelCard title="TIMESTAMP_DIFF" variant="glass">
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <input value={ts1} onChange={e => setTs1(e.target.value)} placeholder="Timestamp 1"
                                className="bg-black/60 border border-white/20 p-3 text-sm font-mono text-white focus:outline-none" />
                            <input value={ts2} onChange={e => setTs2(e.target.value)} placeholder="Timestamp 2"
                                className="bg-black/60 border border-white/20 p-3 text-sm font-mono text-white focus:outline-none" />
                        </div>
                        {diff > 0 && (
                            <div className="p-3 bg-black/40 border border-white/10">
                                <p className="text-sm font-mono text-retro-yellow">{diff} seconds</p>
                                <p className="text-[10px] text-gray-500 mt-1">{formatDuration(diff)}</p>
                            </div>
                        )}
                    </div>
                </PixelCard>

                <PixelCard title="TIMEZONE_REFERENCE" variant="glass">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {timezones.map(tz => {
                            const d = new Date((now + tz.offset * 3600) * 1000);
                            return (
                                <div key={tz.name} className="p-2 bg-black/40 border border-white/10 text-center">
                                    <p className="text-[10px] text-gray-500">{tz.name}</p>
                                    <p className="text-sm font-mono text-neon-green">{d.toISOString().slice(11, 19)}</p>
                                </div>
                            );
                        })}
                    </div>
                </PixelCard>

                <footer className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">"Mohon digunakan dengan bijak dan tidak merugikan pihak tertentu"</p>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">© 2026 Vinconium</p>
                </footer>
            </div>
        </main>
    );
}
