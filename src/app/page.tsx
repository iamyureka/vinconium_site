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
    <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 md:gap-24 selection:bg-neon-green selection:text-black">
      <div className="max-w-7xl 2xl:max-w-screen-2xl mx-auto w-full flex flex-col gap-8 md:gap-24">
        <section className="flex flex-col gap-10 md:gap-16 pt-0 md:pt-8 pb-12 items-center border-b-4 border-white/5 relative">
          <div className="flex flex-col items-center lg:items-start gap-4 z-10">
            <div className="flex flex-col gap-4 md:gap-8 w-full">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="hidden lg:block h-[1px] w-6 bg-neon-green/40"></div>
                <span className="text-neon-green text-[8px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase block animate-pulse">
                  System_Link::Transmission.bin
                </span>
                <div className="h-[1px] flex-1 bg-neon-green/10"></div>
              </div>

              <GlitchText
                text="VINCONIUM"
                as="h1"
                className="text-[clamp(2rem,9vw,11rem)] leading-[0.8] text-white select-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] mx-auto lg:ml-0 text-center lg:text-left"
              />
            </div>

            <div className="w-full max-w-2xl flex flex-col gap-3">
              <div className="flex justify-between items-end text-[9px] sm:text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                <span>Terminal_Sync</span>
                <span className="text-neon-green">88%_Complete</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 relative overflow-hidden shadow-inner border border-white/5">
                <div className="h-full bg-neon-green w-[88%] animate-hp-pulse shadow-[0_0_15px_rgba(57,255,20,0.5)]"></div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex absolute right-0 bottom-12 flex-col items-end gap-1 font-mono text-[9px] text-gray-700 uppercase tracking-[0.2em] pointer-events-none">
            <span>Connection::Established</span>
            <span>Latent_Decryption::True</span>
            <span>Uptime::2.y.163.d</span>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-4 md:gap-12">
          <div className="col-span-12 md:col-span-7">
            <PixelCard variant="primary" title="WIZARD_PROFILE" className="h-full">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end border-b-2 border-white/5 pb-6 gap-4 sm:gap-6">
                  <div className="space-y-1 text-center md:text-left">
                    <h2 className="text-[clamp(1.2rem,5vw,3rem)] text-retro-yellow font-bold tracking-tighter italic leading-none">PLAYER_STATS</h2>
                    <p className="text-[clamp(8px,1.2vw,10px)] text-white/40 tracking-[0.2em] uppercase font-mono">Profile_Secure_Sector</p>
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
                      &quot;If it isn&apos;t playful, it isn&apos;t science.&quot;
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
      </div>
    </main>
  );
}