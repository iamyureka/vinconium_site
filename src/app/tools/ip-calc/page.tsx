"use client";
import React, { useState, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

const ipToLong = (ip: string): number => {
    const parts = ip.split('.').map(Number);
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
};

const longToIp = (long: number): string => {
    return [(long >>> 24) & 255, (long >>> 16) & 255, (long >>> 8) & 255, long & 255].join('.');
};

const cidrMask = (bits: number): number => bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;

interface SubnetInfo {
    network: string; broadcast: string; firstHost: string; lastHost: string;
    totalHosts: number; usableHosts: number; netmask: string; wildcardMask: string;
    cidr: number; class: string; isPrivate: boolean;
}

const calculateSubnet = (ip: string, cidr: number): SubnetInfo | null => {
    try {
        const ipLong = ipToLong(ip);
        const mask = cidrMask(cidr);
        const network = ipLong & mask;
        const broadcast = network | (~mask >>> 0);
        const totalHosts = Math.pow(2, 32 - cidr);
        const first = ip.split('.').map(Number)[0];

        return {
            network: longToIp(network), broadcast: longToIp(broadcast),
            firstHost: longToIp(network + 1), lastHost: longToIp(broadcast - 1),
            totalHosts, usableHosts: Math.max(0, totalHosts - 2),
            netmask: longToIp(mask), wildcardMask: longToIp(~mask >>> 0), cidr,
            class: first < 128 ? 'A' : first < 192 ? 'B' : first < 224 ? 'C' : first < 240 ? 'D' : 'E',
            isPrivate: (first === 10) || (first === 172 && ip.split('.')[1] >= '16' && ip.split('.')[1] <= '31') || (first === 192 && ip.split('.')[1] === '168')
        };
    } catch { return null; }
};

const ipToBinary = (ip: string): string => ip.split('.').map(n => parseInt(n).toString(2).padStart(8, '0')).join('.');
const ipToHex = (ip: string): string => '0x' + ip.split('.').map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
const ipToDecimal = (ip: string): string => ipToLong(ip).toString();

export default function IpCalcPage() {
    const [ip, setIp] = useState('192.168.1.100');
    const [cidr, setCidr] = useState(24);
    const [subnet, setSubnet] = useState<SubnetInfo | null>(null);

    const handleCalculate = useCallback(() => {
        const result = calculateSubnet(ip, cidr);
        setSubnet(result);
    }, [ip, cidr]);

    const commonSubnets = [
        { label: '/8 (Class A)', cidr: 8 }, { label: '/16 (Class B)', cidr: 16 },
        { label: '/24 (Class C)', cidr: 24 }, { label: '/25', cidr: 25 },
        { label: '/26', cidr: 26 }, { label: '/27', cidr: 27 },
        { label: '/28', cidr: 28 }, { label: '/29', cidr: 29 }, { label: '/30', cidr: 30 },
    ];

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">🌐</span>
                    <div><h1 className="text-fluid-2xl text-cyber-pink font-bold">IP_CALC</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">Network Subnet Calculator</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-cyber-pink/50 to-transparent"></div>

                <PixelCard title="SUBNET_CALCULATOR" variant="primary">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] text-gray-500 uppercase">IP Address:</label>
                                <input value={ip} onChange={e => setIp(e.target.value)} placeholder="192.168.1.100"
                                    className="w-40 bg-black/60 border border-white/20 px-3 py-2 text-sm font-mono text-white focus:outline-none" />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] text-gray-500 uppercase">CIDR:</label>
                                <input type="number" min="0" max="32" value={cidr} onChange={e => setCidr(Number(e.target.value))}
                                    className="w-16 bg-black/60 border border-white/20 px-3 py-2 text-sm font-mono text-white focus:outline-none" />
                            </div>
                            <PixelButton variant="pink" onClick={handleCalculate}>🔢 CALCULATE</PixelButton>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {commonSubnets.map(s => (
                                <button key={s.cidr} onClick={() => setCidr(s.cidr)}
                                    className={`px-2 py-1 text-[9px] border border-black cursor-pointer ${cidr === s.cidr ? 'bg-cyber-pink text-white' : 'bg-black/40 text-gray-400 hover:bg-white/10'}`}>
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </PixelCard>

                {subnet && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <PixelCard title="NETWORK_INFO" variant="glass">
                            <div className="grid gap-2">
                                {[
                                    { label: 'Network', value: subnet.network },
                                    { label: 'Broadcast', value: subnet.broadcast },
                                    { label: 'First Host', value: subnet.firstHost },
                                    { label: 'Last Host', value: subnet.lastHost },
                                    { label: 'Netmask', value: subnet.netmask },
                                    { label: 'Wildcard', value: subnet.wildcardMask },
                                ].map(item => (
                                    <div key={item.label} className="flex justify-between p-2 bg-black/40 border border-white/10">
                                        <span className="text-[10px] text-gray-500 uppercase">{item.label}</span>
                                        <span className="text-sm font-mono text-neon-green">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </PixelCard>
                        <PixelCard title="STATS" variant="glass">
                            <div className="grid gap-2">
                                <div className="flex justify-between p-2 bg-black/40 border border-white/10">
                                    <span className="text-[10px] text-gray-500 uppercase">Total IPs</span>
                                    <span className="text-sm font-mono text-retro-yellow">{subnet.totalHosts.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-black/40 border border-white/10">
                                    <span className="text-[10px] text-gray-500 uppercase">Usable Hosts</span>
                                    <span className="text-sm font-mono text-neon-green">{subnet.usableHosts.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-black/40 border border-white/10">
                                    <span className="text-[10px] text-gray-500 uppercase">Class</span>
                                    <span className="text-sm font-mono text-cyber-pink">{subnet.class}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-black/40 border border-white/10">
                                    <span className="text-[10px] text-gray-500 uppercase">Type</span>
                                    <span className={`text-sm font-mono ${subnet.isPrivate ? 'text-neon-green' : 'text-retro-yellow'}`}>
                                        {subnet.isPrivate ? '🏠 Private' : '🌍 Public'}
                                    </span>
                                </div>
                            </div>
                        </PixelCard>
                    </div>
                )}

                <PixelCard title="IP_FORMATS" variant="glass">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-black/40 border border-white/10">
                            <label className="text-[10px] text-gray-500 uppercase block mb-1">Binary</label>
                            <p className="text-[11px] font-mono text-neon-green break-all">{ipToBinary(ip)}</p>
                        </div>
                        <div className="p-3 bg-black/40 border border-white/10">
                            <label className="text-[10px] text-gray-500 uppercase block mb-1">Hexadecimal</label>
                            <p className="text-sm font-mono text-cyber-pink">{ipToHex(ip)}</p>
                        </div>
                        <div className="p-3 bg-black/40 border border-white/10">
                            <label className="text-[10px] text-gray-500 uppercase block mb-1">Decimal</label>
                            <p className="text-sm font-mono text-retro-yellow">{ipToDecimal(ip)}</p>
                        </div>
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
