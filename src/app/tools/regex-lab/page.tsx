"use client";
import React, { useState, useCallback, useMemo } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

interface Match { text: string; index: number; groups: string[]; }

const presets = [
    { name: 'Email', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', flags: 'gi' },
    { name: 'URL', pattern: 'https?:\\/\\/[^\\s]+', flags: 'gi' },
    { name: 'IP', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
    { name: 'Hex', pattern: '#[0-9A-Fa-f]{6}\\b', flags: 'gi' },
    { name: 'JWT', pattern: 'eyJ[A-Za-z0-9_-]+\\.eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+', flags: 'g' },
    { name: 'CTF Flag', pattern: '[A-Za-z]+\\{[^}]+\\}', flags: 'gi' },
    { name: 'MD5', pattern: '\\b[a-f0-9]{32}\\b', flags: 'gi' },
    { name: 'UUID', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', flags: 'gi' },
];

export default function RegexLabPage() {
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState('gi');
    const [testText, setTestText] = useState('');
    const [replacement, setReplacement] = useState('');
    const [error, setError] = useState('');

    const regex = useMemo(() => {
        if (!pattern) return null;
        try { setError(''); return new RegExp(pattern, flags); }
        catch (e) { setError((e as Error).message); return null; }
    }, [pattern, flags]);

    const matches: Match[] = useMemo(() => {
        if (!regex || !testText) return [];
        const result: Match[] = [];
        let match;
        const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        while ((match = re.exec(testText)) !== null && result.length < 100) {
            result.push({ text: match[0], index: match.index, groups: match.slice(1) });
        }
        return result;
    }, [regex, testText]);

    const replacedText = useMemo(() => {
        if (!regex || !testText || !replacement) return '';
        try { return testText.replace(regex, replacement); } catch { return ''; }
    }, [regex, testText, replacement]);

    const applyPreset = useCallback((p: typeof presets[0]) => { setPattern(p.pattern); setFlags(p.flags); }, []);

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">🔬</span>
                    <div><h1 className="text-fluid-2xl text-neon-green font-bold">REGEX_LAB</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">Regular Expression Tester</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-neon-green/50 to-transparent"></div>

                <PixelCard title="PATTERN" variant="primary">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-center">
                            <span className="text-gray-500">/</span>
                            <input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="Enter regex..."
                                className="flex-1 bg-black/60 border border-white/20 px-3 py-2 text-sm font-mono text-neon-green focus:outline-none" />
                            <span className="text-gray-500">/</span>
                            {['g', 'i', 'm', 's'].map(f => (
                                <button key={f} onClick={() => setFlags(flags.includes(f) ? flags.replace(f, '') : flags + f)}
                                    className={`w-8 h-8 text-sm font-bold border border-black cursor-pointer ${flags.includes(f) ? 'bg-neon-green text-black' : 'bg-black/40 text-gray-500'}`}>{f}</button>
                            ))}
                        </div>
                        {error && <p className="text-sm text-red-400">⚠️ {error}</p>}
                        <div className="flex flex-wrap gap-2">
                            {presets.map(p => (
                                <button key={p.name} onClick={() => applyPreset(p)}
                                    className="px-2 py-1 text-[9px] bg-black/40 border border-white/20 text-cyber-pink hover:bg-white/10 cursor-pointer">{p.name}</button>
                            ))}
                        </div>
                    </div>
                </PixelCard>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <PixelCard title="TEST_STRING" variant="glass">
                        <textarea value={testText} onChange={e => setTestText(e.target.value)} placeholder="Enter text..."
                            className="w-full h-40 bg-black/60 border border-white/20 p-3 text-sm font-mono text-white resize-none focus:outline-none" />
                    </PixelCard>
                    <PixelCard title={`MATCHES (${matches.length})`} variant="glass">
                        <div className="h-40 overflow-auto bg-black/40 border border-white/10 p-2">
                            {matches.map((m, i) => (
                                <div key={i} className="text-sm font-mono p-1 border-b border-white/5">
                                    <span className="text-gray-500">{m.index}: </span>
                                    <span className="text-neon-green">{m.text}</span>
                                    {m.groups.length > 0 && <span className="text-cyber-pink ml-2">({m.groups.join(', ')})</span>}
                                </div>
                            ))}
                        </div>
                    </PixelCard>
                </div>

                <PixelCard title="REPLACE" variant="glass">
                    <div className="flex gap-3">
                        <input value={replacement} onChange={e => setReplacement(e.target.value)} placeholder="Replacement ($1, $2)..."
                            className="flex-1 bg-black/60 border border-white/20 px-3 py-2 text-sm font-mono text-white focus:outline-none" />
                        <PixelButton variant="retro" onClick={() => navigator.clipboard.writeText(replacedText)}>📋 COPY</PixelButton>
                    </div>
                    {replacedText && <div className="mt-3 bg-black/40 border border-white/10 p-3 text-sm font-mono text-cyber-pink max-h-24 overflow-auto">{replacedText}</div>}
                </PixelCard>

                <footer className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">"Mohon digunakan dengan bijak dan tidak merugikan pihak tertentu"</p>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">© 2026 Vinconium</p>
                </footer>
            </div>
        </main>
    );
}
