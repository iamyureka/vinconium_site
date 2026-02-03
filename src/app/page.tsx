import { GlitchText } from "@/components/GlitchText";
import { PixelButton } from "@/components/PixelButton";
import { PixelCard } from "@/components/PixelCard";
import Image from "next/image";
import { fetchLatestVideos } from "@/lib/youtube";

export default async function Home() {
  const CHANNEL_ID = "UCmOnc4ziXeC9zH7KdiRUg9Q";
  const youtubeVideos = await fetchLatestVideos(CHANNEL_ID);

  const latestDrops = youtubeVideos.slice(0, 3).map((vid, i) => ({
    id: vid.id,
    title: vid.title,
    rarity: i === 0 ? "NEW_TRANS" : "ARCHIVE",
    description: i === 0 ? "Newest transmission from the science sector." : "Verified data packet from previous cycles.",
    color: i === 0 ? "text-cyber-pink" : "text-neon-green",
    thumb: vid.thumbnail,
    url: vid.url
  }));

  return (
    <main className="max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-24 selection:bg-neon-green selection:text-black overflow-x-hidden">

      <section className="grid grid-cols-12 gap-6 pt-20 md:pt-48 lg:pt-36 items-center relative min-h-[300px]">


        <div className="col-span-12 lg:col-span-8 flex flex-col items-center lg:items-start gap-8 md:gap-16 relative z-10 w-full text-center lg:text-left">
          <div className="w-full px-4 flex flex-col items-center lg:items-start gap-8">
            <div className="flex flex-col gap-4 w-full max-w-fit lg:max-w-none">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="hidden lg:block h-[1px] w-6 bg-neon-green/40"></div>
                <span className="text-neon-green text-[9px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.3em] uppercase block animate-pulse whitespace-nowrap">
                  System_Link::Transmission.bin
                </span>
                <div className="hidden lg:block h-[1px] flex-1 min-w-[30px] bg-neon-green/20"></div>
              </div>
              <GlitchText
                text="VINCONIUM"
                as="h1"
                className="text-[clamp(1.5rem,9.5vw,14rem)] tracking-tighter leading-none text-white block select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              />
            </div>

            <div className="h-1.5 w-full max-w-xl bg-white/5 relative overflow-hidden shadow-inner mx-auto lg:mx-0">
              <div className="h-full bg-neon-green w-[88%] animate-pulse shadow-[0_0_20px_#39ff14]"></div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 w-full px-4">
            <PixelButton variant="neon" className="px-8 md:px-12 py-3 md:py-4 text-[10px] md:text-sm">BOOT_SYSTEM</PixelButton>
            <PixelButton variant="pink" className="px-8 md:px-12 py-3 md:py-4 text-[10px] md:text-sm">CORE_DATA</PixelButton>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 hidden lg:block relative z-0 h-full">
          <PixelCard variant="glass" title="SYS_DIAGNOSTICS_v2" className="animate-in fade-in zoom-in duration-1000 h-full bg-black/40 backdrop-blur-xl border-white/20">
            <div className="flex flex-col gap-4 md:gap-6 h-full">
              <div className="relative aspect-square w-full max-w-[150px] xl:max-w-[200px] mx-auto bg-black/40 border-[length:var(--border-width)] border-white/5 rounded-full overflow-hidden group shadow-[inset_0_0_20px_rgba(57,255,20,0.2)]">
                <div className="absolute inset-0 border-t border-white/10 top-1/2 -translate-y-1/2"></div>
                <div className="absolute inset-0 border-l border-white/10 left-1/2 -translate-x-1/2"></div>
                <div className="absolute inset-2 border-2 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-green/40 to-transparent origin-center animate-radar"></div>

                <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-neon-green shadow-[0_0_10px_#39ff14] animate-pulse"></div>
                <div className="absolute top-[60%] right-[25%] w-1.5 h-1.5 bg-cyber-pink shadow-[0_0_10px_#ff00ff] animate-pulse delay-700"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white/20 tracking-widest uppercase">Scanning...</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t-2 border-white/5 pt-4">
                <div className="space-y-1">
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Signal_Logic</p>
                  <div className="h-2 bg-black/40 border border-white/10 p-[1px]">
                    <div className="h-full bg-neon-green w-[75%] shadow-[0_0_5px_#39ff14]"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Data_Drift</p>
                  <div className="h-2 bg-black/40 border border-white/10 p-[1px]">
                    <div className="h-full bg-cyber-pink w-[32%] shadow-[0_0_5px_#ff00ff]"></div>
                  </div>
                </div>
              </div>

              <div className="flex-1 font-mono text-[9px] text-neon-green/80 bg-black/20 p-3 border border-white/5 space-y-1">
                <p className="text-white">&gt; INITIALIZING_SECTOR_LAB</p>
                <p>&gt; CALIBRATING_QUANTUM_DRIVE... [OK]</p>
                <p>&gt; SCANNING_PLAYFUL_DATA... 88%</p>
                <div className="pt-2 flex justify-between uppercase">
                  <span>TEMP: 42.0°C</span>
                  <span className="animate-pulse">● LIVE</span>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-4 md:gap-12">

        <div className="col-span-12 md:col-span-7">
          <PixelCard variant="primary" title="WIZARD_PROFILE" className="h-full">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-2 border-white/5 pb-6 gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <h2 className="text-base sm:text-2xl md:text-5xl text-retro-yellow font-bold tracking-tighter italic">PLAYER_STATS</h2>
                  <p className="text-[9px] text-white/40 tracking-[0.2em] uppercase font-mono">Profile_Secure_Sector</p>
                </div>
                <div className="bg-neon-green text-black px-4 py-2 font-black shadow-pixel text-[10px] tracking-widest uppercase">
                  WIZARD_OS V1.0
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 font-mono text-fluid-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 uppercase text-[10px] mb-1">Affiliation</p>
                    <p className="text-white border-b border-white/10 pb-1">Vinconium</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase text-[10px] mb-1">Primary Skill</p>
                    <p className="text-neon-green border-b border-white/10 pb-1">Tech Transmutation</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase text-[10px] mb-1">Secondary Skill</p>
                    <p className="text-cyber-pink border-b border-white/10 pb-1">Science Playgrounding</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="text-white/80 leading-relaxed">
                    I specialize in turning complex technological concepts and scientific mysteries into playful.
                  </p>
                  <div className="p-4 bg-black/40 border border-white/5 text-[10px] text-retro-yellow/80 leading-loose uppercase tracking-widest">
                    "If it isn't playful, it isn't science."
                  </div>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>

        <div className="col-span-12 md:col-span-5 flex flex-col gap-8">
          <PixelCard variant="glass" noPadding className="overflow-hidden group">
            <div className="relative aspect-video w-full">
              <Image
                src="/vinco_avatar.png"
                alt="Vinconium Avatar"
                fill
                className="object-cover image-rendering-pixelated group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4">
                <p className="text-fluid-lg text-white font-bold drop-shadow-md">VINCO</p>
                <p className="text-xs text-neon-green tracking-[0.3em] font-bold">LEVEL_99_ARCHITECT</p>
              </div>
            </div>
          </PixelCard>

          <div className="flex-1 border-[length:var(--border-width)] border-black bg-neon-green p-3 md:p-4 flex flex-col justify-between shadow-pixel">
            <div className="flex justify-between items-start">
              <span className="text-black font-black text-fluid-xl leading-none">99+</span>
              <span className="text-black text-[8px] md:text-[10px] border-[length:var(--border-width)] border-black font-bold px-1.5 md:px-2 py-0.5">ACTIVE_PROJECTS</span>
            </div>
            <div className="mt-4 md:mt-8">
              <div className="h-0.5 md:h-1 w-full bg-black/20 mb-2"></div>
              <p className="text-black text-[8px] md:text-[10px] font-bold tracking-widest uppercase truncate font-mono">Awaiting next transmission...</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8 md:gap-12">
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="h-[2px] sm:h-[4px] flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
          <h2 className="text-fluid-2xl text-center text-white shrink-0 uppercase tracking-tighter leading-none">
            Latest_Drops
          </h2>
          <div className="h-[2px] sm:h-[4px] flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-12">
          {latestDrops.map((vid) => (
            <div key={vid.id} className="col-span-12 md:col-span-6 lg:col-span-4 group">
              <PixelCard
                title={vid.title}
                noPadding
                className="h-full hover:-translate-y-4 hover:rotate-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="aspect-video bg-black relative overflow-hidden h-48 md:h-56">
                  <Image
                    src={vid.thumb}
                    alt={vid.title}
                    fill
                    className="object-cover image-rendering-pixelated opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/80 backdrop-blur-sm border border-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[7px] sm:text-[8px] font-bold tracking-widest text-white shadow-pixel-sm">
                    {vid.rarity}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>

                <div className="p-3 sm:p-6 flex-1 flex flex-col gap-3 sm:gap-4 bg-pixel-gray/50">
                  <p className="text-[9px] sm:text-[10px] text-gray-400 flex-1 leading-relaxed italic line-clamp-2">
                    {vid.description} {vid.title}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[8px] sm:text-[10px] font-bold ${vid.color} tracking-[0.1em] sm:tracking-[0.2em] uppercase shrink-0`}>Shorts</span>
                    <a href={vid.url} target="_blank" rel="noopener noreferrer">
                      <PixelButton variant="retro" className="text-[8px] sm:text-[10px] py-1 sm:py-1.5 px-4 sm:px-6">VIEW_DATA</PixelButton>
                    </a>
                  </div>
                </div>
              </PixelCard>
            </div>
          ))}
          {latestDrops.length === 0 && (
            <div className="col-span-12 py-12 text-center border-4 border-dashed border-white/10">
              <p className="text-gray-500 font-bold uppercase tracking-widest">Scanning for incoming transmissions...</p>
            </div>
          )}
        </div>
      </section>

      <footer className="w-full text-center text-gray-600 text-[10px] mt-12 pb-24 border-t border-white/5 pt-12">
        <p className="font-mono tracking-[0.4em] uppercase mb-2">
          Vinconium_os v1.0.0-stable
        </p>
        <p>© 2026 Vinconium</p>
      </footer>
    </main>
  );
}
