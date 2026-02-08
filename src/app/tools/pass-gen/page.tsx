"use client";
import React, { useState, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

const charsets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: 'l1I0O',
};

const generatePassword = (length: number, options: Record<string, boolean>): string => {
    let chars = '';
    if (options.lowercase) chars += charsets.lowercase;
    if (options.uppercase) chars += charsets.uppercase;
    if (options.numbers) chars += charsets.numbers;
    if (options.symbols) chars += charsets.symbols;
    if (!options.ambiguous) {
        charsets.ambiguous.split('').forEach(c => chars = chars.replace(c, ''));
    }
    if (!chars) return '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, n => chars[n % chars.length]).join('');
};

const calcEntropy = (length: number, options: Record<string, boolean>): number => {
    let poolSize = 0;
    if (options.lowercase) poolSize += 26;
    if (options.uppercase) poolSize += 26;
    if (options.numbers) poolSize += 10;
    if (options.symbols) poolSize += 28;
    return poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;
};

const strengthLevel = (entropy: number): { text: string; color: string } => {
    if (entropy >= 128) return { text: 'EXCELLENT', color: 'text-neon-green' };
    if (entropy >= 80) return { text: 'STRONG', color: 'text-green-400' };
    if (entropy >= 60) return { text: 'GOOD', color: 'text-retro-yellow' };
    if (entropy >= 40) return { text: 'FAIR', color: 'text-orange-400' };
    return { text: 'WEAK', color: 'text-red-400' };
};

const generatePassphrase = (words: number): string => {
    const wordList = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa', 'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray', 'yankee', 'zulu', 'cyber', 'hacker', 'exploit', 'buffer', 'overflow', 'inject', 'shell', 'kernel', 'binary', 'crypto', 'cipher', 'encode', 'decode', 'packet', 'socket', 'proxy', 'tunnel', 'breach', 'access', 'vector', 'payload', 'zero', 'day', 'script', 'debug', 'memory', 'stack', 'heap'];
    const array = new Uint32Array(words);
    crypto.getRandomValues(array);
    return Array.from(array, n => wordList[n % wordList.length]).join('-');
};

export default function PassGenPage() {
    const [length, setLength] = useState(16);
    const [passwords, setPasswords] = useState<string[]>([]);
    const [passphrases, setPassphrases] = useState<string[]>([]);
    const [wordCount, setWordCount] = useState(4);
    const [options, setOptions] = useState({ lowercase: true, uppercase: true, numbers: true, symbols: true, ambiguous: false });

    const entropy = calcEntropy(length, options);
    const strength = strengthLevel(entropy);

    const handleGenerate = useCallback(() => {
        const newPws = Array.from({ length: 5 }, () => generatePassword(length, options));
        setPasswords(newPws);
    }, [length, options]);

    const handleGeneratePassphrases = useCallback(() => {
        const newPps = Array.from({ length: 5 }, () => generatePassphrase(wordCount));
        setPassphrases(newPps);
    }, [wordCount]);

    const toggleOption = (key: string) => setOptions(o => ({ ...o, [key]: !o[key as keyof typeof o] }));

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">🔑</span>
                    <div><h1 className="text-fluid-2xl text-retro-yellow font-bold">PASS_GEN</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">Secure Password Generator</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-retro-yellow/50 to-transparent"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <PixelCard title="RANDOM_PASSWORD" variant="primary">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <label className="text-[10px] text-gray-500 uppercase">Length:</label>
                                <input type="range" min="8" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="flex-1" />
                                <span className="text-sm font-mono text-neon-green w-8">{length}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(options).map(key => (
                                    <button key={key} onClick={() => toggleOption(key)}
                                        className={`px-3 py-1 text-[9px] font-bold border border-black cursor-pointer ${options[key as keyof typeof options] ? 'bg-retro-yellow text-black' : 'bg-black/40 text-gray-500'}`}>
                                        {key.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-black/40 border border-white/10">
                                <span className="text-[10px] text-gray-500 uppercase">Entropy:</span>
                                <span className="text-sm font-mono text-neon-green">{entropy} bits</span>
                                <span className={`text-[10px] font-bold ${strength.color}`}>{strength.text}</span>
                            </div>
                            <PixelButton variant="retro" onClick={handleGenerate}>⚡ GENERATE 5</PixelButton>
                            <div className="flex flex-col gap-2">
                                {passwords.map((pw, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-black/40 border border-white/10 cursor-pointer hover:bg-white/5"
                                        onClick={() => navigator.clipboard.writeText(pw)}>
                                        <span className="flex-1 text-sm font-mono text-neon-green break-all">{pw}</span>
                                        <span className="text-[10px] text-cyber-pink">📋</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PixelCard>

                    <PixelCard title="PASSPHRASE" variant="primary">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <label className="text-[10px] text-gray-500 uppercase">Words:</label>
                                <input type="range" min="3" max="8" value={wordCount} onChange={e => setWordCount(Number(e.target.value))} className="flex-1" />
                                <span className="text-sm font-mono text-cyber-pink w-8">{wordCount}</span>
                            </div>
                            <PixelButton variant="pink" onClick={handleGeneratePassphrases}>⚡ GENERATE 5</PixelButton>
                            <div className="flex flex-col gap-2">
                                {passphrases.map((pp, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-black/40 border border-white/10 cursor-pointer hover:bg-white/5"
                                        onClick={() => navigator.clipboard.writeText(pp)}>
                                        <span className="flex-1 text-sm font-mono text-cyber-pink break-all">{pp}</span>
                                        <span className="text-[10px] text-neon-green">📋</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PixelCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { title: 'Entropy', desc: 'Higher entropy = more secure. Aim for 80+ bits for important accounts.' },
                        { title: 'Passphrases', desc: 'Easier to remember, still secure. Use 4+ random words.' },
                        { title: 'Never Reuse', desc: 'Use unique passwords for every account. Use a password manager.' },
                    ].map(i => (
                        <div key={i.title} className="p-3 bg-pixel-gray/50 border-l-4 border-retro-yellow">
                            <h3 className="text-xs font-bold text-white">{i.title}</h3>
                            <p className="text-[9px] text-gray-400 mt-1">{i.desc}</p>
                        </div>
                    ))}
                </div>

                <footer className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">"Mohon digunakan dengan bijak dan tidak merugikan pihak tertentu"</p>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">© 2026 Vinconium</p>
                </footer>
            </div>
        </main>
    );
}
