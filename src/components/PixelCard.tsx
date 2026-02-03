import React from 'react';

interface PixelCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'primary' | 'secondary' | 'glass';
    title?: string;
    onClose?: () => void;
    noPadding?: boolean;
}

export function PixelCard({
    children,
    className = '',
    variant = 'default',
    title,
    onClose,
    noPadding = false
}: PixelCardProps) {
    const getBg = () => {
        if (variant === 'glass') return 'pixel-glass';
        if (variant === 'primary') return 'bg-deep-space';
        return 'bg-pixel-gray';
    };

    return (
        <div className={`
      border-[length:var(--border-width)] border-black 
      ${getBg()} 
      shadow-pixel 
      relative
      flex flex-col
      transition-all duration-300
      ${className}
    `}>
            {title && (
                <div className="bg-black text-[9px] md:text-xs text-white p-1.5 md:p-2 flex justify-between items-center border-b-[length:var(--border-width)] border-white/10 select-none">
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                        <div className="flex gap-1 shrink-0">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-retro-yellow"></div>
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-neon-green"></div>
                        </div>
                        <span className="font-bold tracking-widest uppercase truncate flex-1">{title}</span>
                    </div>
                    <div className="flex gap-1.5 md:gap-2 shrink-0 ml-2">
                        <button className="hidden sm:block hover:text-neon-green px-1 transition-colors">_</button>
                        <button className="hidden sm:block hover:text-retro-yellow px-1 transition-colors">□</button>
                        <button
                            onClick={onClose}
                            className="hover:text-cyber-pink px-1 font-bold transition-colors"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
            <div className={`${(title && !noPadding) ? 'p-2 sm:p-4 md:p-6' : 'p-0'} flex-1`}>
                {children}
            </div>
        </div>
    );
}
