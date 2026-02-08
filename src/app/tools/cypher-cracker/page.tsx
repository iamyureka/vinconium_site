"use client";

import React, { useState, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

const caesarShift = (text: string, shift: number): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
    });
};

const vigenereEncrypt = (text: string, key: string): string => {
    if (!key) return text;
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanKey) return text;
    let keyIndex = 0;
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    });
};

const vigenereDecrypt = (text: string, key: string): string => {
    if (!key) return text;
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanKey) return text;
    let keyIndex = 0;
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        keyIndex++;
        return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
};

const morseMap: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/', '.': '.-.-.-', ',': '--..--',
    '?': '..--..', '!': '-.-.--', "'": '.----.', '"': '.-..-.', '/': '-..-.',
    '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
    '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '@': '.--.-.'
};

const reverseMorseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));

const textToMorse = (text: string): string => {
    return text.toUpperCase().split('').map(char => morseMap[char] || char).join(' ');
};

const morseToText = (morse: string): string => {
    return morse.split(' ').map(code => reverseMorseMap[code] || code).join('');
};

const atbash = (text: string): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
        const base = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(base + (25 - (char.charCodeAt(0) - base)));
    });
};

const a1z26Encode = (text: string): string => {
    return text.toUpperCase().split('').map(char => {
        if (/[A-Z]/.test(char)) return (char.charCodeAt(0) - 64).toString();
        if (char === ' ') return '/';
        return char;
    }).join('-').replace(/-\/-/g, ' ');
};

const a1z26Decode = (text: string): string => {
    return text.split(' ').map(word =>
        word.split('-').map(num => {
            const n = parseInt(num);
            if (n >= 1 && n <= 26) return String.fromCharCode(n + 64);
            return num;
        }).join('')
    ).join(' ');
};

type CipherType = 'rot13' | 'caesar' | 'vigenere' | 'morse' | 'atbash' | 'a1z26';

export default function CypherCrackerPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [cipher, setCipher] = useState<CipherType>('rot13');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [caesarShiftVal, setCaesarShiftVal] = useState(13);
    const [vigenereKey, setVigenereKey] = useState('');
    const [bruteForceResults, setBruteForceResults] = useState<string[]>([]);

    const handleProcess = useCallback(() => {
        let result = '';
        setBruteForceResults([]);

        switch (cipher) {
            case 'rot13':
                result = caesarShift(input, 13);
                break;
            case 'caesar':
                result = caesarShift(input, mode === 'encode' ? caesarShiftVal : -caesarShiftVal);
                break;
            case 'vigenere':
                result = mode === 'encode' ? vigenereEncrypt(input, vigenereKey) : vigenereDecrypt(input, vigenereKey);
                break;
            case 'morse':
                result = mode === 'encode' ? textToMorse(input) : morseToText(input);
                break;
            case 'atbash':
                result = atbash(input);
                break;
            case 'a1z26':
                result = mode === 'encode' ? a1z26Encode(input) : a1z26Decode(input);
                break;
        }
        setOutput(result);
    }, [input, cipher, mode, caesarShiftVal, vigenereKey]);

    const handleBruteForce = () => {
        if (cipher === 'caesar' || cipher === 'rot13') {
            const results: string[] = [];
            for (let i = 1; i <= 25; i++) {
                results.push(`ROT${i}: ${caesarShift(input, -i)}`);
            }
            setBruteForceResults(results);
        }
    };

    const cipherTypes: { key: CipherType; label: string; icon: string }[] = [
        { key: 'rot13', label: 'ROT13', icon: '🔄' },
        { key: 'caesar', label: 'CAESAR', icon: '🏛️' },
        { key: 'vigenere', label: 'VIGENÈRE', icon: '🔐' },
        { key: 'morse', label: 'MORSE', icon: '📡' },
        { key: 'atbash', label: 'ATBASH', icon: '🪞' },
        { key: 'a1z26', label: 'A1Z26', icon: '🔢' },
    ];

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 md:gap-8">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 md:gap-8">
                <section className="flex flex-col gap-4 pt-4">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">🔓</span>
                        <div>
                            <h1 className="text-fluid-2xl text-cyber-pink font-bold tracking-tighter">CYPHER_CRACKER</h1>
                            <p className="text-fluid-xs text-gray-500 tracking-widest uppercase">Classical Cipher Toolkit</p>
                        </div>
                    </div>
                    <div className="h-[2px] bg-gradient-to-r from-cyber-pink/50 to-transparent"></div>
                </section>

                <PixelCard title="CIPHER_MATRIX" variant="primary" className="w-full">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap gap-2">
                            {cipherTypes.map(({ key, label, icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setCipher(key)}
                                    className={`
                                        px-3 py-1.5 text-[10px] font-bold tracking-wider
                                        border-[length:var(--border-width)] border-black
                                        transition-all cursor-pointer flex items-center gap-1.5
                                        ${cipher === key
                                            ? 'bg-cyber-pink text-white'
                                            : 'bg-pixel-gray text-white hover:bg-white/10'
                                        }
                                    `}
                                >
                                    <span>{icon}</span> {label}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 p-3 bg-black/40 border border-white/10">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Mode:</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setMode('encode')}
                                        className={`px-4 py-1 text-[10px] font-bold border-[length:var(--border-width)] border-black transition-all cursor-pointer ${mode === 'encode' ? 'bg-neon-green text-black' : 'bg-transparent text-white hover:bg-white/10'}`}
                                    >
                                        ENCODE
                                    </button>
                                    <button
                                        onClick={() => setMode('decode')}
                                        className={`px-4 py-1 text-[10px] font-bold border-[length:var(--border-width)] border-black transition-all cursor-pointer ${mode === 'decode' ? 'bg-cyber-pink text-white' : 'bg-transparent text-white hover:bg-white/10'}`}
                                    >
                                        DECODE
                                    </button>
                                </div>
                            </div>

                            {cipher === 'caesar' && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-500 uppercase">Shift:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="25"
                                        value={caesarShiftVal}
                                        onChange={(e) => setCaesarShiftVal(parseInt(e.target.value) || 13)}
                                        className="w-16 bg-black/60 border-[length:var(--border-width)] border-white/20 px-2 py-1 text-[10px] font-mono text-neon-green focus:border-neon-green focus:outline-none"
                                    />
                                </div>
                            )}

                            {cipher === 'vigenere' && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-500 uppercase">Key:</span>
                                    <input
                                        type="text"
                                        value={vigenereKey}
                                        onChange={(e) => setVigenereKey(e.target.value)}
                                        placeholder="Enter key..."
                                        className="w-32 bg-black/60 border-[length:var(--border-width)] border-white/20 px-2 py-1 text-[10px] font-mono text-neon-green placeholder-gray-600 focus:border-neon-green focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-neon-green"></span>
                                    Input Text
                                </label>
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={cipher === 'morse' && mode === 'decode' ? 'Enter morse code (use . and -, space between letters, / between words)...' : 'Enter text to process...'}
                                    className="w-full h-40 bg-black/60 border-[length:var(--border-width)] border-white/20 p-4 text-sm font-mono text-white placeholder-gray-600 focus:border-cyber-pink focus:outline-none resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-cyber-pink"></span>
                                    Output
                                </label>
                                <textarea
                                    value={output}
                                    readOnly
                                    placeholder="Output will appear here..."
                                    className="w-full h-40 bg-black/40 border-[length:var(--border-width)] border-white/10 p-4 text-sm font-mono text-cyber-pink placeholder-gray-700 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <PixelButton variant="pink" onClick={handleProcess}>
                                ⚡ PROCESS
                            </PixelButton>
                            {(cipher === 'caesar' || cipher === 'rot13') && (
                                <PixelButton variant="neon" onClick={handleBruteForce}>
                                    🔓 BRUTE FORCE
                                </PixelButton>
                            )}
                            <PixelButton variant="retro" onClick={() => navigator.clipboard.writeText(output)}>
                                📋 COPY
                            </PixelButton>
                            <PixelButton variant="retro" onClick={() => { setInput(''); setOutput(''); setBruteForceResults([]); }}>
                                🗑 CLEAR
                            </PixelButton>
                        </div>

                        {bruteForceResults.length > 0 && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-retro-yellow"></span>
                                    Brute Force Results (All 25 Shifts)
                                </label>
                                <div className="h-48 overflow-y-auto bg-black/40 border-[length:var(--border-width)] border-white/10 p-4">
                                    {bruteForceResults.map((result, i) => (
                                        <div key={i} className="text-[10px] font-mono text-gray-400 py-1 border-b border-white/5 hover:text-neon-green hover:bg-white/5 px-2 cursor-pointer transition-colors" onClick={() => setOutput(result.split(': ')[1])}>
                                            {result}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PixelCard>

                {cipher === 'morse' && (
                    <PixelCard title="MORSE_REFERENCE" variant="glass">
                        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2 text-center">
                            {Object.entries(morseMap).slice(0, 36).map(([char, code]) => (
                                <div key={char} className="p-2 bg-black/40 border border-white/10">
                                    <div className="text-sm font-bold text-white">{char}</div>
                                    <div className="text-[8px] text-cyber-pink font-mono">{code}</div>
                                </div>
                            ))}
                        </div>
                    </PixelCard>
                )}
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
