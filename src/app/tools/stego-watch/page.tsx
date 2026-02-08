"use client";
import React, { useState, useRef, useCallback } from 'react';
import { PixelCard } from '@/components/PixelCard';
import { PixelButton } from '@/components/PixelButton';

interface ExifData {
    [key: string]: string | number | undefined;
}

const parseExif = async (file: File): Promise<ExifData> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data: ExifData = { fileName: file.name, fileSize: `${(file.size / 1024).toFixed(2)} KB`, fileType: file.type };
            const view = new DataView(e.target?.result as ArrayBuffer);
            if (view.getUint16(0) !== 0xFFD8) { resolve({ ...data, error: 'Not a valid JPEG' }); return; }
            let offset = 2;
            while (offset < view.byteLength) {
                if (view.getUint8(offset) !== 0xFF) break;
                const marker = view.getUint8(offset + 1);
                if (marker === 0xE1) {
                    const exifOffset = offset + 4;
                    const exifStr = String.fromCharCode(view.getUint8(exifOffset), view.getUint8(exifOffset + 1), view.getUint8(exifOffset + 2), view.getUint8(exifOffset + 3));
                    if (exifStr === 'Exif') {
                        data.hasExif = 'Yes';
                        const tiffOffset = exifOffset + 6;
                        const littleEndian = view.getUint16(tiffOffset) === 0x4949;
                        const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
                        const numEntries = view.getUint16(tiffOffset + ifdOffset, littleEndian);
                        for (let i = 0; i < numEntries; i++) {
                            const entryOffset = tiffOffset + ifdOffset + 2 + (i * 12);
                            const tag = view.getUint16(entryOffset, littleEndian);
                            const tagNames: Record<number, string> = {
                                0x010F: 'Make', 0x0110: 'Model', 0x0112: 'Orientation', 0x011A: 'XResolution',
                                0x011B: 'YResolution', 0x0128: 'ResolutionUnit', 0x0131: 'Software', 0x0132: 'DateTime'
                            };
                            if (tagNames[tag]) data[tagNames[tag]] = 'Present';
                        }
                    }
                    break;
                }
                offset += 2 + view.getUint16(offset + 2);
            }
            if (!data.hasExif) data.hasExif = 'No EXIF data found';
            resolve(data);
        };
        reader.readAsArrayBuffer(file);
    });
};

export default function StegoWatchPage() {
    const [exifData, setExifData] = useState<ExifData | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [bitPlane, setBitPlane] = useState<number>(0);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        setProcessedUrl(null);
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            const data = await parseExif(file);
            setExifData(data);
        } else {
            setExifData({ fileName: file.name, fileSize: `${(file.size / 1024).toFixed(2)} KB`, fileType: file.type, note: 'EXIF extraction works best with JPEG files' });
        }
    }, []);

    const extractBitPlane = useCallback(() => {
        if (!imageUrl || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const bit = (data[i] >> bitPlane) & 1;
                const value = bit * 255;
                data[i] = data[i + 1] = data[i + 2] = value;
            }
            ctx.putImageData(imageData, 0, 0);
            setProcessedUrl(canvas.toDataURL());
        };
        img.src = imageUrl;
    }, [imageUrl, bitPlane]);

    const invertColors = useCallback(() => {
        if (!imageUrl || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            ctx.putImageData(imageData, 0, 0);
            setProcessedUrl(canvas.toDataURL());
        };
        img.src = imageUrl;
    }, [imageUrl]);

    return (
        <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                <section className="flex items-center gap-4 pt-4">
                    <span className="text-4xl">🖼</span>
                    <div><h1 className="text-fluid-2xl text-cyber-pink font-bold">STEGO_WATCH</h1>
                        <p className="text-fluid-xs text-gray-500 uppercase tracking-widest">Image Forensics Toolkit</p></div>
                </section>
                <div className="h-[2px] bg-gradient-to-r from-cyber-pink/50 to-transparent"></div>

                <PixelCard title="IMAGE_ANALYZER" variant="primary">
                    <div className="flex flex-col gap-5">
                        <div className="border-2 border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-cyber-pink/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-cyber-pink'); }}
                            onDragLeave={e => e.currentTarget.classList.remove('border-cyber-pink')}
                            onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-cyber-pink'); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                            <span className="text-4xl block mb-2">📁</span>
                            <p className="text-sm text-gray-400">Drop image or click to upload</p>
                        </div>

                        {imageUrl && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Original</label>
                                    <div className="bg-black/40 border border-white/10 p-2 flex items-center justify-center">
                                        <img src={imageUrl} alt="Original" className="max-h-64 max-w-full object-contain" />
                                    </div>
                                </div>
                                {processedUrl && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest">Processed</label>
                                        <div className="bg-black/40 border border-white/10 p-2 flex items-center justify-center">
                                            <img src={processedUrl} alt="Processed" className="max-h-64 max-w-full object-contain" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {imageUrl && (
                            <div className="flex flex-wrap items-center gap-3 p-3 bg-black/40 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] text-gray-500 uppercase">Bit Plane:</label>
                                    <select value={bitPlane} onChange={e => setBitPlane(parseInt(e.target.value))} className="bg-black border border-white/20 px-2 py-1 text-sm text-white">
                                        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <option key={i} value={i}>Bit {i} {i === 0 ? '(LSB)' : i === 7 ? '(MSB)' : ''}</option>)}
                                    </select>
                                </div>
                                <PixelButton variant="pink" onClick={extractBitPlane}>🔬 EXTRACT BIT PLANE</PixelButton>
                                <PixelButton variant="neon" onClick={invertColors}>🔄 INVERT</PixelButton>
                            </div>
                        )}

                        <canvas ref={canvasRef} className="hidden" />

                        {exifData && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Metadata / EXIF</label>
                                <div className="bg-black/40 border border-white/10 p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {Object.entries(exifData).map(([key, val]) => (
                                        <div key={key} className="text-[10px]">
                                            <span className="text-gray-500">{key}: </span>
                                            <span className={`font-mono ${key === 'error' ? 'text-red-400' : 'text-cyber-pink'}`}>{String(val)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </PixelCard>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { title: 'LSB Analysis', desc: 'Bit 0 often hides steganographic data. Extract to reveal hidden messages.' },
                        { title: 'EXIF Data', desc: 'Metadata can reveal camera info, GPS coords, timestamps, and more.' },
                        { title: 'Color Channels', desc: 'Separate RGB channels to find data hidden in specific color planes.' },
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
