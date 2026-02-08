"use client";
import React, { useState, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

const rotateLeft = (n: number, s: number) => ((n << s) | (n >>> (32 - s))) >>> 0;

const md5 = (str: string): string => {
    const utf8 = unescape(encodeURIComponent(str));
    const words: number[] = [];
    for (let i = 0; i < utf8.length * 8; i += 8) words[i >> 5] |= (utf8.charCodeAt(i / 8) & 0xff) << (i % 32);
    const len = utf8.length * 8;
    words[len >> 5] |= 0x80 << (len % 32);
    words[(((len + 64) >>> 9) << 4) + 14] = len;
    let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
    const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
    const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000));
    for (let i = 0; i < words.length; i += 16) {
        let [aa, bb, cc, dd] = [a, b, c, d];
        for (let j = 0; j < 64; j++) {
            let f: number, g: number;
            if (j < 16) { f = (b & c) | (~b & d); g = j; }
            else if (j < 32) { f = (d & b) | (~d & c); g = (5 * j + 1) % 16; }
            else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16; }
            else { f = c ^ (b | ~d); g = (7 * j) % 16; }
            const temp = d; d = c; c = b;
            b = (b + rotateLeft((a + f + K[j] + (words[i + g] || 0)) >>> 0, S[(j >> 4) * 4 + (j % 4)])) >>> 0;
            a = temp;
        }
        a = (a + aa) >>> 0; b = (b + bb) >>> 0; c = (c + cc) >>> 0; d = (d + dd) >>> 0;
    }
    return [a, b, c, d].map(n => n.toString(16).padStart(8, '0').match(/../g)!.reverse().join('')).join('');
};

const sha1 = (str: string): string => {
    const utf8 = unescape(encodeURIComponent(str));
    const words: number[] = [];
    for (let i = 0; i < utf8.length * 8; i += 8) words[i >> 5] |= (utf8.charCodeAt(i / 8) & 0xff) << (24 - i % 32);
    const len = utf8.length * 8;
    words[len >> 5] |= 0x80 << (24 - len % 32);
    words[((len + 64 >> 9) << 4) + 15] = len;
    let [h0, h1, h2, h3, h4] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    for (let i = 0; i < words.length; i += 16) {
        const w: number[] = [];
        for (let j = 0; j < 80; j++) w[j] = j < 16 ? (words[i + j] || 0) : rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        let [a, b, c, d, e] = [h0, h1, h2, h3, h4];
        for (let j = 0; j < 80; j++) {
            const [f, k] = j < 20 ? [(b & c) | (~b & d), 0x5a827999] : j < 40 ? [b ^ c ^ d, 0x6ed9eba1] : j < 60 ? [(b & c) | (b & d) | (c & d), 0x8f1bbcdc] : [b ^ c ^ d, 0xca62c1d6];
            const temp = (rotateLeft(a, 5) + f + e + k + w[j]) >>> 0;
            e = d; d = c; c = rotateLeft(b, 30); b = a; a = temp;
        }
        h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
    }
    return [h0, h1, h2, h3, h4].map(n => n.toString(16).padStart(8, '0')).join('');
};

const sha256 = async (str: string): Promise<string> => {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const sha512 = async (str: string): Promise<string> => {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest('SHA-512', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateSalt = (len: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => chars[b % chars.length]).join('');
};

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512';

export default function HashLabPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [hashType, setHashType] = useState<HashType>('md5');
    const [salt, setSalt] = useState('');
    const [compareHash, setCompareHash] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const hash = useCallback(async () => {
        setIsLoading(true);
        const text = salt ? input + salt : input;
        let result = '';
        switch (hashType) {
            case 'md5': result = md5(text); break;
            case 'sha1': result = sha1(text); break;
            case 'sha256': result = await sha256(text); break;
            case 'sha512': result = await sha512(text); break;
        }
        setOutput(result);
        setIsLoading(false);
    }, [input, salt, hashType]);

    const hashTypes: { key: HashType; label: string; bits: number }[] = [
        { key: 'md5', label: 'MD5', bits: 128 },
        { key: 'sha1', label: 'SHA-1', bits: 160 },
        { key: 'sha256', label: 'SHA-256', bits: 256 },
        { key: 'sha512', label: 'SHA-512', bits: 512 },
    ];

    const isMatch = compareHash && output && compareHash.toLowerCase() === output.toLowerCase();

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">🔑</span>
                    <div><h1 className="text-fluid-2xl text-neon-green font-bold">HASH_LAB</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">Crypto Hash Generator</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-neon-green/50 to-transparent"></div>

                <PixelCard title="HASH_GENERATOR" variant="primary">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap gap-2">
                            {hashTypes.map(h => (
                                <button key={h.key} onClick={() => setHashType(h.key)}
                                    className={`px-4 py-2 text-[10px] font-bold border-[length:var(--border-width)] border-black cursor-pointer ${hashType === h.key ? 'bg-neon-green text-black' : 'bg-pixel-gray text-white hover:bg-white/10'}`}>
                                    {h.label} <span className="opacity-50">({h.bits}bit)</span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Input Text</label>
                                <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash..." className="w-full h-32 bg-black/60 border-[length:var(--border-width)] border-white/20 p-3 text-sm font-mono text-white placeholder-gray-600 focus:border-neon-green focus:outline-none resize-none" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest flex justify-between">
                                    <span>Salt (Optional)</span>
                                    <button onClick={() => setSalt(generateSalt(16))} className="text-neon-green hover:underline cursor-pointer">Generate</button>
                                </label>
                                <input value={salt} onChange={e => setSalt(e.target.value)} placeholder="Optional salt..." className="bg-black/60 border-[length:var(--border-width)] border-white/20 p-3 text-sm font-mono text-white placeholder-gray-600 focus:border-neon-green focus:outline-none" />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <PixelButton variant="neon" onClick={hash} disabled={isLoading}>{isLoading ? '⏳' : '⚡'} HASH</PixelButton>
                            <PixelButton variant="retro" onClick={() => navigator.clipboard.writeText(output)}>📋 COPY</PixelButton>
                            <PixelButton variant="pink" onClick={() => { setInput(''); setOutput(''); setSalt(''); setCompareHash(''); }}>🗑 CLEAR</PixelButton>
                        </div>

                        {output && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest">{hashType.toUpperCase()} Output</label>
                                <div className="bg-black/40 border-[length:var(--border-width)] border-white/10 p-4 font-mono text-sm text-neon-green break-all select-all">{output}</div>
                            </div>
                        )}

                        <div className="border-t border-white/10 pt-4">
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">Compare Hash</label>
                            <div className="flex gap-2">
                                <input value={compareHash} onChange={e => setCompareHash(e.target.value)} placeholder="Paste hash to compare..." className="flex-1 bg-black/60 border-[length:var(--border-width)] border-white/20 p-3 text-sm font-mono text-white placeholder-gray-600 focus:outline-none" />
                                {compareHash && output && (
                                    <div className={`px-4 py-2 border-[length:var(--border-width)] border-black font-bold text-sm flex items-center ${isMatch ? 'bg-neon-green text-black' : 'bg-red-600 text-white'}`}>
                                        {isMatch ? '✓ MATCH' : '✗ NO MATCH'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </PixelCard>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {hashTypes.map(h => (
                        <div key={h.key} className={`p-3 bg-pixel-gray/50 border-l-4 ${hashType === h.key ? 'border-neon-green' : 'border-white/20'}`}>
                            <h3 className="text-xs font-bold text-white">{h.label}</h3>
                            <p className="text-[9px] text-gray-500">{h.bits} bits / {h.bits / 4} hex chars</p>
                        </div>
                    ))}
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
