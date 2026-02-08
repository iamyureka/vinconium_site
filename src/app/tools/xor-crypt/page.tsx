"use client";
import React, { useState, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

const strToBytes = (str: string): number[] => Array.from(new TextEncoder().encode(str));
const bytesToStr = (bytes: number[]): string => new TextDecoder().decode(new Uint8Array(bytes));
const hexToBytes = (hex: string): number[] => {
    const clean = hex.replace(/\s|0x/g, '');
    const bytes: number[] = [];
    for (let i = 0; i < clean.length; i += 2) bytes.push(parseInt(clean.slice(i, i + 2), 16));
    return bytes;
};
const bytesToHex = (bytes: number[]): string => bytes.map(b => b.toString(16).padStart(2, '0')).join(' ');

const xorSingleByte = (data: number[], key: number): number[] => data.map(b => b ^ key);
const xorMultiByte = (data: number[], key: number[]): number[] => data.map((b, i) => b ^ key[i % key.length]);

const findSingleByteKey = (data: number[]): { key: number; score: number; result: string }[] => {
    const results: { key: number; score: number; result: string }[] = [];
    for (let key = 0; key < 256; key++) {
        const decoded = xorSingleByte(data, key);
        const text = bytesToStr(decoded);
        const printable = text.split('').filter(c => c.charCodeAt(0) >= 32 && c.charCodeAt(0) < 127).length;
        const score = printable / text.length;
        if (score > 0.7) results.push({ key, score, result: text });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 10);
};

const analyzeRepeatingXor = (data: number[]): number[] => {
    const distances: number[] = [];
    for (let keyLen = 2; keyLen <= Math.min(40, data.length / 2); keyLen++) {
        let totalDist = 0;
        const blocks = Math.floor(data.length / keyLen);
        for (let i = 0; i < blocks - 1; i++) {
            for (let j = 0; j < keyLen; j++) {
                let xor = data[i * keyLen + j] ^ data[(i + 1) * keyLen + j];
                while (xor) { totalDist += xor & 1; xor >>= 1; }
            }
        }
        distances.push(totalDist / (blocks - 1) / keyLen);
    }
    return distances.map((d, i) => ({ len: i + 2, dist: d }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5)
        .map(x => x.len);
};

type Mode = 'encrypt' | 'decrypt' | 'bruteforce' | 'analyze';
type InputFormat = 'text' | 'hex';

export default function XorCryptPage() {
    const [input, setInput] = useState('');
    const [key, setKey] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<Mode>('encrypt');
    const [inputFormat, setInputFormat] = useState<InputFormat>('text');
    const [keyFormat, setKeyFormat] = useState<InputFormat>('text');
    const [bruteResults, setBruteResults] = useState<{ key: number; score: number; result: string }[]>([]);
    const [keyLengths, setKeyLengths] = useState<number[]>([]);

    const getInputBytes = useCallback((): number[] => {
        try {
            return inputFormat === 'hex' ? hexToBytes(input) : strToBytes(input);
        } catch { return []; }
    }, [input, inputFormat]);

    const getKeyBytes = useCallback((): number[] => {
        try {
            return keyFormat === 'hex' ? hexToBytes(key) : strToBytes(key);
        } catch { return []; }
    }, [key, keyFormat]);

    const handleProcess = useCallback(() => {
        const data = getInputBytes();
        if (!data.length) { setOutput('Invalid input'); return; }

        if (mode === 'bruteforce') {
            const results = findSingleByteKey(data);
            setBruteResults(results);
            setOutput(results.length ? `Found ${results.length} candidates` : 'No likely keys found');
            return;
        }

        if (mode === 'analyze') {
            const lengths = analyzeRepeatingXor(data);
            setKeyLengths(lengths);
            setOutput(`Likely key lengths: ${lengths.join(', ')}`);
            return;
        }

        const keyBytes = getKeyBytes();
        if (!keyBytes.length) { setOutput('Invalid key'); return; }

        const result = keyBytes.length === 1
            ? xorSingleByte(data, keyBytes[0])
            : xorMultiByte(data, keyBytes);

        setOutput(inputFormat === 'hex' ? bytesToStr(result) : bytesToHex(result));
    }, [mode, getInputBytes, getKeyBytes, inputFormat]);

    const modes: { key: Mode; label: string; icon: string }[] = [
        { key: 'encrypt', label: 'XOR ENCRYPT', icon: '🔐' },
        { key: 'decrypt', label: 'XOR DECRYPT', icon: '🔓' },
        { key: 'bruteforce', label: 'BRUTE FORCE', icon: '💪' },
        { key: 'analyze', label: 'KEY ANALYSIS', icon: '🔍' },
    ];

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">⊕</span>
                    <div><h1 className="text-fluid-2xl text-neon-green font-bold">XOR_CRYPT</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">XOR Encryption Toolkit</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-neon-green/50 to-transparent"></div>

                <div className="flex flex-wrap gap-2">
                    {modes.map(m => (
                        <button key={m.key} onClick={() => { setMode(m.key); setBruteResults([]); setKeyLengths([]); }}
                            className={`px-4 py-2 text-[10px] font-bold border-[length:var(--border-width)] border-black cursor-pointer flex items-center gap-2 ${mode === m.key ? 'bg-neon-green text-black' : 'bg-pixel-gray text-white hover:bg-white/10'}`}>
                            <span>{m.icon}</span> {m.label}
                        </button>
                    ))}
                </div>

                <PixelCard title="XOR_ENGINE" variant="primary">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap gap-4 p-3 bg-black/40 border border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500 uppercase">Input Format:</span>
                                {(['text', 'hex'] as InputFormat[]).map(f => (
                                    <button key={f} onClick={() => setInputFormat(f)}
                                        className={`px-3 py-1 text-[10px] font-bold border border-black cursor-pointer ${inputFormat === f ? 'bg-cyber-pink text-white' : 'bg-transparent text-white hover:bg-white/10'}`}>
                                        {f.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            {(mode === 'encrypt' || mode === 'decrypt') && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-500 uppercase">Key Format:</span>
                                    {(['text', 'hex'] as InputFormat[]).map(f => (
                                        <button key={f} onClick={() => setKeyFormat(f)}
                                            className={`px-3 py-1 text-[10px] font-bold border border-black cursor-pointer ${keyFormat === f ? 'bg-retro-yellow text-black' : 'bg-transparent text-white hover:bg-white/10'}`}>
                                            {f.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Input Data</label>
                                <textarea value={input} onChange={e => setInput(e.target.value)}
                                    placeholder={inputFormat === 'hex' ? 'Enter hex bytes (e.g., 48 65 6c 6c 6f)...' : 'Enter text to XOR...'}
                                    className="w-full h-32 bg-black/60 border-[length:var(--border-width)] border-white/20 p-3 text-sm font-mono text-white placeholder-gray-600 focus:border-neon-green focus:outline-none resize-none" />
                            </div>
                            {(mode === 'encrypt' || mode === 'decrypt') && (
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">XOR Key</label>
                                    <input value={key} onChange={e => setKey(e.target.value)}
                                        placeholder={keyFormat === 'hex' ? 'Key in hex (e.g., 4b 45 59)...' : 'Enter XOR key...'}
                                        className="bg-black/60 border-[length:var(--border-width)] border-white/20 p-3 text-sm font-mono text-white placeholder-gray-600 focus:border-neon-green focus:outline-none" />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <PixelButton variant="neon" onClick={handleProcess}>⚡ PROCESS</PixelButton>
                            <PixelButton variant="retro" onClick={() => navigator.clipboard.writeText(output)}>📋 COPY</PixelButton>
                            <PixelButton variant="pink" onClick={() => { setInput(''); setKey(''); setOutput(''); setBruteResults([]); setKeyLengths([]); }}>🗑 CLEAR</PixelButton>
                        </div>

                        {output && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Output</label>
                                <div className="bg-black/40 border-[length:var(--border-width)] border-white/10 p-4 font-mono text-sm text-neon-green break-all">{output}</div>
                            </div>
                        )}

                        {bruteResults.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Brute Force Results</label>
                                <div className="max-h-64 overflow-y-auto bg-black/40 border border-white/10">
                                    {bruteResults.map((r, i) => (
                                        <div key={i} className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => { setKey(r.key.toString(16)); setKeyFormat('hex'); setOutput(r.result); }}>
                                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                <span>Key: 0x{r.key.toString(16).padStart(2, '0')} ({r.key})</span>
                                                <span>Score: {(r.score * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="text-sm font-mono text-cyber-pink truncate">{r.result}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {keyLengths.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Probable Key Lengths (Hamming Distance)</label>
                                <div className="flex gap-2">
                                    {keyLengths.map((len, i) => (
                                        <div key={i} className={`px-4 py-2 border border-white/20 ${i === 0 ? 'bg-neon-green/20 border-neon-green' : 'bg-black/40'}`}>
                                            <span className="text-lg font-bold text-white">{len}</span>
                                            <span className="text-[10px] text-gray-500 ml-1">bytes</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PixelCard>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { title: 'Single-Byte XOR', desc: 'Classic CTF challenge. Brute force all 256 possible keys and look for readable text.' },
                        { title: 'Multi-Byte XOR', desc: 'Repeating key XOR. Use Hamming distance to find key length, then break each position.' },
                        { title: 'Known Plaintext', desc: 'If you know part of the plaintext, XOR it with ciphertext to recover the key.' },
                    ].map(i => (
                        <div key={i.title} className="p-3 bg-pixel-gray/50 border-l-4 border-neon-green">
                            <h3 className="text-xs font-bold text-white">{i.title}</h3>
                            <p className="text-[9px] text-gray-400 mt-1">{i.desc}</p>
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
