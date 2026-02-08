"use client";
import React, { useState, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

const transformations = {
    reverse: (s: string) => s.split('').reverse().join(''),
    uppercase: (s: string) => s.toUpperCase(),
    lowercase: (s: string) => s.toLowerCase(),
    titlecase: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
    swapcase: (s: string) => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
    removeSpaces: (s: string) => s.replace(/\s/g, ''),
    removeNewlines: (s: string) => s.replace(/[\r\n]+/g, ' '),
    escapeHtml: (s: string) => s.replace(/[&<>"']/g, c => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' } as Record<string, string>)[c] || c)),
    unescapeHtml: (s: string) => s.replace(/&(amp|lt|gt|quot|#039);/g, (_, e) => (({ amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'" } as Record<string, string>)[e] || _)),
    urlEncode: (s: string) => encodeURIComponent(s),
    urlDecode: (s: string) => { try { return decodeURIComponent(s); } catch { return s; } },
    doubleUrlEncode: (s: string) => encodeURIComponent(encodeURIComponent(s)),
    unicodeEscape: (s: string) => s.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join(''),
    unicodeUnescape: (s: string) => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))),
    rot13: (s: string) => s.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() <= 'm' ? 13 : -13))),
    leetspeak: (s: string) => s.replace(/[aeiostl]/gi, c => (({ a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', l: '1' } as Record<string, string>)[c.toLowerCase()] || c)),
    charCount: (s: string) => `Characters: ${s.length}, Words: ${s.trim().split(/\s+/).filter(Boolean).length}, Lines: ${s.split('\n').length}`,
    sortLines: (s: string) => s.split('\n').sort().join('\n'),
    uniqueLines: (s: string) => [...new Set(s.split('\n'))].join('\n'),
    reverseLines: (s: string) => s.split('\n').reverse().join('\n'),
    numberedLines: (s: string) => s.split('\n').map((line, i) => `${(i + 1).toString().padStart(3, ' ')} | ${line}`).join('\n'),
    shuffleChars: (s: string) => s.split('').sort(() => Math.random() - 0.5).join(''),
    removeNonAscii: (s: string) => s.replace(/[^\x00-\x7F]/g, ''),
    extractNumbers: (s: string) => (s.match(/\d+/g) || []).join(' '),
    extractEmails: (s: string) => (s.match(/[\w.-]+@[\w.-]+\.\w+/g) || []).join('\n'),
    extractUrls: (s: string) => (s.match(/https?:\/\/[^\s]+/g) || []).join('\n'),
    stripTags: (s: string) => s.replace(/<[^>]*>/g, ''),
    jsonPrettify: (s: string) => { try { return JSON.stringify(JSON.parse(s), null, 2); } catch { return 'Invalid JSON'; } },
    jsonMinify: (s: string) => { try { return JSON.stringify(JSON.parse(s)); } catch { return 'Invalid JSON'; } },
};

type TransformKey = keyof typeof transformations;

const categories: { name: string; items: { key: TransformKey; label: string; icon: string }[] }[] = [
    {
        name: 'Case',
        items: [
            { key: 'uppercase', label: 'UPPERCASE', icon: '🔠' },
            { key: 'lowercase', label: 'lowercase', icon: '🔡' },
            { key: 'titlecase', label: 'Title Case', icon: '📝' },
            { key: 'swapcase', label: 'sWAP cASE', icon: '🔄' },
        ]
    },
    {
        name: 'Encoding',
        items: [
            { key: 'urlEncode', label: 'URL Encode', icon: '🔗' },
            { key: 'urlDecode', label: 'URL Decode', icon: '🔓' },
            { key: 'doubleUrlEncode', label: 'Double URL', icon: '🔗🔗' },
            { key: 'unicodeEscape', label: 'Unicode Esc', icon: '🌐' },
            { key: 'unicodeUnescape', label: 'Unicode Unesc', icon: '📖' },
        ]
    },
    {
        name: 'HTML',
        items: [
            { key: 'escapeHtml', label: 'Escape HTML', icon: '🛡️' },
            { key: 'unescapeHtml', label: 'Unescape HTML', icon: '📄' },
            { key: 'stripTags', label: 'Strip Tags', icon: '✂️' },
        ]
    },
    {
        name: 'Text',
        items: [
            { key: 'reverse', label: 'Reverse', icon: '↩️' },
            { key: 'rot13', label: 'ROT13', icon: '🔄' },
            { key: 'leetspeak', label: 'L33T', icon: '😎' },
            { key: 'removeSpaces', label: 'No Spaces', icon: '⬜' },
            { key: 'removeNewlines', label: 'No Newlines', icon: '📃' },
            { key: 'removeNonAscii', label: 'ASCII Only', icon: '🔤' },
        ]
    },
    {
        name: 'Lines',
        items: [
            { key: 'sortLines', label: 'Sort', icon: '📊' },
            { key: 'uniqueLines', label: 'Unique', icon: '✨' },
            { key: 'reverseLines', label: 'Reverse', icon: '🔃' },
            { key: 'numberedLines', label: 'Number', icon: '🔢' },
        ]
    },
    {
        name: 'Extract',
        items: [
            { key: 'extractNumbers', label: 'Numbers', icon: '🔢' },
            { key: 'extractEmails', label: 'Emails', icon: '📧' },
            { key: 'extractUrls', label: 'URLs', icon: '🔗' },
        ]
    },
    {
        name: 'JSON',
        items: [
            { key: 'jsonPrettify', label: 'Prettify', icon: '🎨' },
            { key: 'jsonMinify', label: 'Minify', icon: '📦' },
        ]
    },
    {
        name: 'Analysis',
        items: [
            { key: 'charCount', label: 'Count', icon: '📊' },
            { key: 'shuffleChars', label: 'Shuffle', icon: '🎲' },
        ]
    },
];

export default function TextTransformPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    const applyTransform = useCallback((key: TransformKey) => {
        const result = transformations[key](input);
        setOutput(result);
        setHistory(h => [key, ...h.slice(0, 9)]);
    }, [input]);

    const useOutput = () => {
        setInput(output);
        setOutput('');
    };

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">✍️</span>
                    <div><h1 className="text-fluid-2xl text-retro-yellow font-bold">TEXT_TRANSFORM</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">String Manipulation Suite</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-retro-yellow/50 to-transparent"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <PixelCard title="INPUT" variant="primary">
                            <textarea value={input} onChange={e => setInput(e.target.value)}
                                placeholder="Enter text to transform..."
                                className="w-full h-40 bg-black/60 border-[length:var(--border-width)] border-white/20 p-3 text-sm font-mono text-white placeholder-gray-600 focus:border-retro-yellow focus:outline-none resize-none" />
                        </PixelCard>

                        {output && (
                            <PixelCard title="OUTPUT" variant="glass">
                                <div className="flex flex-col gap-3">
                                    <textarea value={output} readOnly
                                        className="w-full h-40 bg-black/40 border-[length:var(--border-width)] border-white/10 p-3 text-sm font-mono text-neon-green resize-none" />
                                    <div className="flex gap-2">
                                        <PixelButton variant="neon" onClick={useOutput}>⬆️ USE AS INPUT</PixelButton>
                                        <PixelButton variant="retro" onClick={() => navigator.clipboard.writeText(output)}>📋 COPY</PixelButton>
                                    </div>
                                </div>
                            </PixelCard>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <PixelCard title="TRANSFORMS" variant="primary">
                            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                                {categories.map(cat => (
                                    <div key={cat.name}>
                                        <h3 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{cat.name}</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {cat.items.map(item => (
                                                <button key={item.key} onClick={() => applyTransform(item.key)}
                                                    className="px-2 py-1 text-[9px] font-bold bg-black/40 border border-white/20 text-white hover:bg-retro-yellow hover:text-black transition-colors cursor-pointer">
                                                    {item.icon} {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PixelCard>

                        {history.length > 0 && (
                            <PixelCard title="HISTORY" variant="glass">
                                <div className="flex flex-wrap gap-1">
                                    {history.map((h, i) => (
                                        <span key={i} className="px-2 py-1 text-[9px] bg-black/40 border border-white/10 text-gray-400">{h}</span>
                                    ))}
                                </div>
                            </PixelCard>
                        )}
                    </div>
                </div>

                <footer className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                        "Mohon digunakan dengan bijak dan tidak merugikan pihak tertentu"
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">© 2026 Vinconium</p>
                </footer>
            </div>
        </main>
    );
}
