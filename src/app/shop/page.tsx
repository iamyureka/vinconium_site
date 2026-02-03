import { GlitchText } from "@/components/GlitchText";
import { PixelCard } from "@/components/PixelCard";
import { PixelButton } from "@/components/PixelButton";
import Image from "next/image";

export default function ShopPage() {
    const items = [
        { name: "NEBULA_HOODIE_PRO", price: "55.00", type: "EQUIPMENT", thumb: "/project_1.png", rarity: "LEGENDARY", stats: "+15 SCIENCE" },
        { name: "PIXEL_CAP_V2", price: "25.00", type: "UPGRADE", thumb: "/project_2.png", rarity: "COMMON", stats: "+2 STYLE" },
        { name: "SCIENCE_POSTER_EXP", price: "30.00", type: "COLLECTIBLE", thumb: "/project_3.png", rarity: "RARE", stats: "+8 INT" },
        { name: "VINCO_OS_USB", price: "15.00", type: "DATA", thumb: "/project_1.png", rarity: "UNCOMMON", stats: "+5 LUCK" },
        { name: "CHRONO_DESK_MAT", price: "40.00", type: "EQUIPMENT", thumb: "/project_2.png", rarity: "EPIC", stats: "+12 FOCUS" },
        { name: "DECRYPTION_TEE", price: "28.00", type: "EQUIPMENT", thumb: "/project_3.png", rarity: "RARE", stats: "+6 CHARM" },
    ];

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-24 selection:bg-cyber-pink selection:text-white">

            <header className="flex flex-col items-center text-center gap-6 pt-24">
                <div className="inline-flex items-center gap-3 bg-pixel-gray border-4 border-black px-6 py-2 shadow-pixel-sm mb-4">
                    <span className="w-2 h-2 bg-neon-green animate-pulse"></span>
                    <p className="text-[10px] md:text-xs text-white/80 tracking-[0.5em] uppercase font-bold">The Science Merchant</p>
                    <span className="w-2 h-2 bg-neon-green animate-pulse"></span>
                </div>
                <GlitchText text="GEAR_SUPPLY" as="h1" className="text-fluid-hero tracking-tighter mix-blend-screen" />
                <p className="text-gray-500 max-w-3xl text-fluid-xs md:text-fluid-sm uppercase tracking-widest leading-loose">
                    High-performance hardware for the modern tech wizard.
                    All gear is authenticated by the Vinconium research sector.
                </p>
            </header>

            <section className="grid grid-cols-12 gap-6 md:gap-10">
                {items.map((item, i) => (
                    <div key={i} className={`col-span-12 sm:col-span-6 ${i % 4 === 0 || i % 4 === 3 ? 'lg:col-span-7' : 'lg:col-span-5'}`}>
                        <PixelCard
                            variant="glass"
                            title={`ITEM::${item.name}`}
                            noPadding
                            className="h-full flex flex-col overflow-hidden hover:scale-[1.01] transition-transform duration-300 group"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                                <div className={`md:col-span-5 bg-black/40 flex items-center justify-center p-8 relative overflow-hidden h-48 md:h-auto`}>
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
                                            className="object-contain image-rendering-pixelated grayscale-50 group-hover:grayscale-0"
                                        />
                                    </div>
                                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                                </div>

                                <div className="md:col-span-7 p-6 flex flex-col gap-6 border-t-4 md:border-t-0 md:border-l-4 border-black bg-pixel-gray/50">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{item.type}</span>
                                            <span className="text-[8px] border border-white/10 px-1 text-gray-600 font-bold uppercase">{item.stats}</span>
                                        </div>
                                        <h3 className="text-xl text-white font-bold tracking-tight">{item.name}</h3>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] text-gray-500 uppercase">
                                            <span>Condition:</span>
                                            <span className="text-neon-green">PRISTINE</span>
                                        </div>
                                        <div className="h-1 bg-white/5 w-full">
                                            <div className="h-full bg-neon-green/40 w-full animate-pulse"></div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-auto gap-4 pt-6 border-t border-white/5">
                                        <div className="flex flex-col leading-none">
                                            <span className="text-[8px] text-gray-500 uppercase font-bold mb-1">Price_Value</span>
                                            <span className="text-white font-bold text-fluid-lg tracking-tighter">${item.price}</span>
                                        </div>
                                        <PixelButton variant="pink" className="text-[10px] py-1.5 px-6">ADD_TO_INV</PixelButton>
                                    </div>
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
        </main>
    );
}
