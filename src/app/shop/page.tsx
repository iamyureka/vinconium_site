'use client';

import { GlitchText } from "@/components/GlitchText";
import { PixelCard } from "@/components/PixelCard";
import { PixelButton } from "@/components/PixelButton";
import Image from "next/image";
import { WalletButton } from "@/components/WalletButton";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';

export default function ShopPage() {
    const { isConnected } = useAccount();
    const IPFS_BASE = "https://green-acute-bison-742.mypinata.cloud/ipfs/bafybeibosdxv6nwgrfkswczbff6ppelcoh6sv37gctg7qyrjbrqd2doani";
    const items = [
        { id: 1, name: "CHRONOS_CIRCUIT", price: "1", type: "UPGRADE", thumb: `${IPFS_BASE}/1.png`, rarity: "UNCOMMON", stats: "+2 STYLE", supply: 100 },
        { id: 2, name: "OLD_COMPUTER", price: "2", type: "EQUIPMENT", thumb: `${IPFS_BASE}/2.png`, rarity: "RARE", stats: "+8 INT", supply: 25 },
        { id: 3, name: "DISCOVERED_PLANET", price: "5", type: "EQUIPMENT", thumb: `${IPFS_BASE}/3.png`, rarity: "UNCOMMON", stats: "+15 SCIENCE", supply: 50 },
        { id: 4, name: "ANON", price: "10", type: "DATA", thumb: `${IPFS_BASE}/4.png`, rarity: "LEGENDARY", stats: "+5 AURA", supply: 9 },
    ];

    const { data: hash, error, isPending, writeContract } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const CONTRACT_ADDRESS = "0x0510A4c9faA2D5F46b810FF993a4a9b016350Ffa";
    const ABI = [
        {
            "inputs": [
                { "internalType": "uint256", "name": "id", "type": "uint256" },
                { "internalType": "uint256", "name": "amount", "type": "uint256" }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ] as const;

    const handleMint = (item: typeof items[0]) => {
        if (!isConnected) return;

        writeContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: ABI,
            functionName: 'mint',
            args: [BigInt(item.id), BigInt(1)],
            value: parseEther(item.price),
        });
    };

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-24 selection:bg-cyber-pink selection:text-white">

            <header className="flex flex-col items-center text-center gap-6 pt-0 md:pt-16">
                <div className="inline-flex items-center gap-3 bg-pixel-gray border-4 border-black px-6 py-2 shadow-pixel-sm mb-4">
                    <span className="w-2 h-2 bg-neon-green animate-pulse"></span>
                    <p className="text-[10px] md:text-xs text-white/80 tracking-[0.5em] uppercase font-bold">The Science Merchant</p>
                    <span className="w-2 h-2 bg-neon-green animate-pulse"></span>
                </div>
                <div className="flex flex-col items-center gap-12">
                    <GlitchText text="GEAR_SUPPLY" as="h1" className="text-fluid-hero tracking-tighter mix-blend-screen" />
                    <WalletButton />
                </div>

                {/* Transaction Feedback */}
                <div className="w-full max-w-md mt-4 font-bold text-[10px] uppercase">
                    {isPending && (
                        <div className="bg-blue-500/20 border-2 border-blue-500 px-4 py-2 text-blue-400 animate-pulse">
                            Requesting signature...
                        </div>
                    )}
                    {isConfirming && (
                        <div className="bg-yellow-500/20 border-2 border-yellow-500 px-4 py-2 text-yellow-400 animate-pulse">
                            Transaction confirming on-chain...
                        </div>
                    )}
                    {isSuccess && hash && (
                        <div className="bg-neon-green/20 border-2 border-neon-green px-4 py-2 text-neon-green">
                            Mint Successful!
                            <a
                                href={`https://sepolia.etherscan.io/tx/${hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="ml-2 underline block mt-1"
                            >
                                View Receipt on Explorer
                            </a>
                        </div>
                    )}
                    {error && (
                        <div className="bg-cyber-pink/20 border-2 border-cyber-pink px-4 py-2 text-cyber-pink">
                            Error: {error.message.includes('User rejected') ? 'Transaction Cancelled' : 'Minting Failed'}
                        </div>
                    )}
                </div>

                <p className="text-gray-500 max-w-3xl text-fluid-xs md:text-fluid-sm uppercase tracking-widest leading-loose">
                    Mintable items for your research.
                    All gear is authenticated by the Vinconium research sector.<br />
                    (Run on chain Ethereum Spoila (Testnet only))
                </p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {items.map((item, i) => (
                    <div key={i} className="group flex">
                        <PixelCard
                            variant="glass"
                            title={`ITEM::${item.name}`}
                            noPadding
                            className="h-full flex flex-col overflow-hidden hover:-translate-y-2 transition-all duration-300 w-full"
                        >
                            <div className="bg-black/40 flex items-center justify-center p-8 relative overflow-hidden aspect-square border-b-4 border-black group-hover:border-cyber-pink transition-colors">
                                <div className="absolute top-2 left-2 z-20">
                                    <span className={`text-[8px] font-bold px-2 py-0.5 border-2 border-black shadow-pixel-sm ${item.rarity === 'LEGENDARY' ? 'bg-retro-yellow text-black' :
                                        item.rarity === 'EPIC' ? 'bg-cyber-pink text-white' :
                                            item.rarity === 'RARE' ? 'bg-neon-green text-black' :
                                                'bg-white text-black'
                                        }`}>
                                        {item.rarity}
                                    </span>
                                </div>

                                <div className="relative w-full h-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <Image
                                        src={item.thumb}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-contain image-rendering-pixelated grayscale-50 group-hover:grayscale-0"
                                    />
                                </div>
                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                            </div>

                            <div className="p-4 md:p-6 flex-1 flex flex-col gap-4 bg-pixel-gray/50">
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">{item.type}</span>
                                        <span className="text-[8px] border border-white/10 px-1 text-gray-500 font-bold uppercase">{item.stats}</span>
                                    </div>
                                    <h3 className="text-base md:text-lg text-white font-bold tracking-tight group-hover:text-cyber-pink transition-colors">
                                        {item.name}
                                    </h3>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] text-gray-500 uppercase">
                                        <span>Status:</span>
                                        <div className="flex gap-2">
                                            <span className="text-gray-600">LIMIT_{item.supply}</span>
                                            <span className="text-neon-green">IN_STOCK</span>
                                        </div>
                                    </div>
                                    <div className="h-1 bg-white/5 w-full">
                                        <div className="h-full bg-cyber-pink/40 w-full animate-pulse"></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-auto gap-4 pt-6 border-t border-white/5">
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[8px] text-gray-500 uppercase font-bold mb-1">Value</span>
                                        <span className="text-white font-bold text-xl tracking-tighter">{item.price} ETH</span>
                                    </div>
                                    <PixelButton
                                        variant={isConnected ? "pink" : "retro"}
                                        className="text-[10px] py-1.5 px-6 whitespace-nowrap min-w-[120px]"
                                        onClick={() => handleMint(item)}
                                        disabled={isPending || isConfirming || !isConnected}
                                    >
                                        {!isConnected ? 'CONNECT' : (isPending || isConfirming) ? 'MINTING...' : 'MINT_NFT'}
                                    </PixelButton>
                                </div>
                            </div>
                        </PixelCard>
                    </div>
                ))}
            </section>

            <footer className="w-full mt-12 pb-32">
                <PixelCard variant="primary" className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 border-dashed border-4 border-white/10">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 border-2 border-dashed border-white/20 flex items-center justify-center text-white/20 text-xl font-bold">?</div>
                        <div>
                            <p className="text-white font-bold text-sm tracking-widest uppercase">Mystery Upgrade Slot</p>
                            <p className="text-[10px] text-gray-500 uppercase mt-1">Unlock at Science Level 100</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-[10px] font-mono tracking-[0.3em] uppercase hidden lg:block">Vinconium_Marketplace_v.1.1</p>
                </PixelCard>
            </footer>
        </main >
    );
}
