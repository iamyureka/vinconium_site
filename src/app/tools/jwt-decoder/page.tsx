"use client";
import React, { useState, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

const base64UrlDecode = (str: string): string => {
    try {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
        return atob(padded);
    } catch { return ''; }
};

interface JWTData {
    header: Record<string, unknown> | null;
    payload: Record<string, unknown> | null;
    signature: string;
    isValid: boolean;
    errors: string[];
}

const decodeJWT = (token: string): JWTData => {
    const errors: string[] = [];
    const parts = token.trim().split('.');

    if (parts.length !== 3) {
        errors.push(`Invalid JWT structure: expected 3 parts, got ${parts.length}`);
        return { header: null, payload: null, signature: '', isValid: false, errors };
    }

    let header: Record<string, unknown> | null = null;
    let payload: Record<string, unknown> | null = null;

    try {
        header = JSON.parse(base64UrlDecode(parts[0]));
    } catch {
        errors.push('Failed to decode header');
    }

    try {
        payload = JSON.parse(base64UrlDecode(parts[1]));
    } catch {
        errors.push('Failed to decode payload');
    }

    return {
        header,
        payload,
        signature: parts[2],
        isValid: errors.length === 0,
        errors
    };
};

const formatTimestamp = (ts: number): string => {
    const date = new Date(ts * 1000);
    const now = new Date();
    const expired = date < now;
    return `${date.toLocaleString()} ${expired ? '(EXPIRED)' : '(valid)'}`;
};

const commonClaims: Record<string, string> = {
    iss: 'Issuer',
    sub: 'Subject',
    aud: 'Audience',
    exp: 'Expiration Time',
    nbf: 'Not Before',
    iat: 'Issued At',
    jti: 'JWT ID',
    name: 'Full Name',
    email: 'Email',
    role: 'Role',
    admin: 'Admin Status',
};

export default function JwtDecoderPage() {
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState<JWTData | null>(null);
    const [activeTab, setActiveTab] = useState<'header' | 'payload' | 'signature'>('payload');

    const handleDecode = useCallback(() => {
        if (!token.trim()) return;
        setDecoded(decodeJWT(token));
    }, [token]);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setToken(text);
        } catch { /* clipboard access denied */ }
    };

    const renderValue = (key: string, value: unknown): React.ReactNode => {
        if (typeof value === 'number' && ['exp', 'nbf', 'iat'].includes(key)) {
            return <span className="text-retro-yellow">{formatTimestamp(value)}</span>;
        }
        if (typeof value === 'boolean') {
            return <span className={value ? 'text-neon-green' : 'text-red-400'}>{value.toString()}</span>;
        }
        if (typeof value === 'object') {
            return <span className="text-cyber-pink">{JSON.stringify(value)}</span>;
        }
        return <span className="text-neon-green">{String(value)}</span>;
    };

    const sampleTokens = [
        { name: 'Basic JWT', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        { name: 'Admin JWT', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.v49Oqy4nI3qV9DLvq4NqKPbzPJJbJepY7IgYD-h24mo' },
    ];

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">🎫</span>
                    <div><h1 className="text-fluid-2xl text-cyber-pink font-bold">JWT_DECODER</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">JSON Web Token Analyzer</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-cyber-pink/50 to-transparent"></div>

                <PixelCard title="TOKEN_INPUT" variant="primary">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2 text-[10px]">
                            <span className="text-gray-500 uppercase">Try samples:</span>
                            {sampleTokens.map(s => (
                                <button key={s.name} onClick={() => setToken(s.token)}
                                    className="px-2 py-1 bg-black/40 border border-white/20 text-cyber-pink hover:bg-white/10 cursor-pointer">
                                    {s.name}
                                </button>
                            ))}
                        </div>
                        <textarea value={token} onChange={e => setToken(e.target.value)}
                            placeholder="Paste your JWT token here (eyJhbGciOiJ...)..."
                            className="w-full h-24 bg-black/60 border-[length:var(--border-width)] border-white/20 p-3 text-sm font-mono text-white placeholder-gray-600 focus:border-cyber-pink focus:outline-none resize-none" />
                        <div className="flex gap-3">
                            <PixelButton variant="pink" onClick={handleDecode}>🔍 DECODE</PixelButton>
                            <PixelButton variant="neon" onClick={handlePaste}>📋 PASTE</PixelButton>
                            <PixelButton variant="retro" onClick={() => { setToken(''); setDecoded(null); }}>🗑 CLEAR</PixelButton>
                        </div>
                    </div>
                </PixelCard>

                {decoded && (
                    <PixelCard title="DECODED_TOKEN" variant="glass">
                        <div className="flex flex-col gap-4">
                            {decoded.errors.length > 0 && (
                                <div className="p-3 bg-red-900/30 border border-red-500/50">
                                    {decoded.errors.map((e, i) => (
                                        <p key={i} className="text-sm text-red-400">⚠️ {e}</p>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2 border-b border-white/10">
                                {(['header', 'payload', 'signature'] as const).map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${activeTab === tab ? 'text-cyber-pink border-b-2 border-cyber-pink' : 'text-gray-500 hover:text-white'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'header' && decoded.header && (
                                <div className="grid gap-2">
                                    {Object.entries(decoded.header).map(([key, value]) => (
                                        <div key={key} className="flex items-start gap-3 p-2 bg-black/40 border border-white/10">
                                            <span className="text-[10px] text-gray-500 uppercase min-w-[80px]">{key}</span>
                                            <span className="text-sm font-mono text-neon-green">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'payload' && decoded.payload && (
                                <div className="grid gap-2">
                                    {Object.entries(decoded.payload).map(([key, value]) => (
                                        <div key={key} className="flex items-start gap-3 p-2 bg-black/40 border border-white/10">
                                            <div className="min-w-[100px]">
                                                <span className="text-[10px] text-gray-500 uppercase block">{key}</span>
                                                {commonClaims[key] && <span className="text-[8px] text-cyber-pink">{commonClaims[key]}</span>}
                                            </div>
                                            <div className="text-sm font-mono break-all">{renderValue(key, value)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'signature' && (
                                <div className="flex flex-col gap-3">
                                    <div className="p-3 bg-black/40 border border-white/10">
                                        <label className="text-[10px] text-gray-500 uppercase block mb-2">Signature (Base64URL)</label>
                                        <p className="text-sm font-mono text-retro-yellow break-all">{decoded.signature}</p>
                                    </div>
                                    <div className="p-3 bg-red-900/20 border border-red-500/30">
                                        <p className="text-[10px] text-red-400 uppercase">⚠️ Note: Signature verification requires the secret key (server-side only)</p>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-white/10 pt-4">
                                <label className="text-[10px] text-gray-500 uppercase block mb-2">Raw JSON</label>
                                <div className="bg-black/60 border border-white/10 p-4 font-mono text-[11px] overflow-x-auto">
                                    <pre className="text-neon-green">{JSON.stringify({ header: decoded.header, payload: decoded.payload }, null, 2)}</pre>
                                </div>
                            </div>
                        </div>
                    </PixelCard>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { title: 'JWT Structure', desc: 'Header.Payload.Signature - Base64URL encoded JSON objects split by dots.' },
                        { title: 'Common Vulns', desc: 'alg:none, weak secrets, kid injection, jku/x5u manipulation.' },
                        { title: 'CTF Tips', desc: 'Check for weak secrets like "secret", modify claims, forge signatures.' },
                    ].map(i => (
                        <div key={i.title} className="p-3 bg-pixel-gray/50 border-l-4 border-cyber-pink">
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
