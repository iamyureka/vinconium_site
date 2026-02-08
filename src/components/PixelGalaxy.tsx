"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
    x: number;
    y: number;
    brightness: number;
    twinkleSpeed: number;
    twinklePhase: number;
    size: number;
    color: string;
}

interface SpiralStar {
    angle: number;
    distance: number;
    armIndex: number;
    speed: number;
    brightness: number;
    size: number;
    color: string;
}

export function PixelGalaxy() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const starsRef = useRef<Star[]>([]);
    const spiralStarsRef = useRef<SpiralStar[]>([]);
    const timeRef = useRef<number>(0);

    const colors = {
        background: "#090911ff",
        armLight: "#c8b8d0",
        armMid: "#8888aa",
        armDark: "#4a4a6a",
        starBright: "#ffffff",
        starDim: "#6688aa",
        starYellow: "#ffdd88",
        starBlue: "#5588cc",
        dustPurple: "#3a3058",
        dustBlue: "#282848",
    };

    const initStars = useCallback((width: number, height: number) => {
        const backgroundStars: Star[] = [];
        const starCount = Math.floor((width * height) / 800);

        for (let i = 0; i < starCount; i++) {
            const colorRoll = Math.random();
            let color = colors.starDim;
            if (colorRoll > 0.95) color = colors.starYellow;
            else if (colorRoll > 0.85) color = colors.starBlue;
            else if (colorRoll > 0.7) color = colors.starBright;

            backgroundStars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                brightness: Math.random(),
                twinkleSpeed: 0.5 + Math.random() * 2,
                twinklePhase: Math.random() * Math.PI * 2,
                size: Math.random() > 0.9 ? 2 : 1,
                color,
            });
        }
        starsRef.current = backgroundStars;

        const spiralStars: SpiralStar[] = [];
        const numArms = 2;
        const starsPerArm = 600;

        for (let arm = 0; arm < numArms; arm++) {
            for (let i = 0; i < starsPerArm; i++) {
                const progress = i / starsPerArm;
                const angle = progress * Math.PI * 3 + (arm * Math.PI);
                const distance = 20 + progress * Math.min(width, height) * 0.45;

                const scatter = (1 - progress * 0.5) * 30;

                const colorRoll = Math.random();
                let color = colors.armMid;
                if (colorRoll > 0.9) color = colors.starYellow;
                else if (colorRoll > 0.7) color = colors.armLight;
                else if (colorRoll > 0.4) color = colors.armDark;
                else if (colorRoll > 0.2) color = colors.dustPurple;

                spiralStars.push({
                    angle: angle + (Math.random() - 0.5) * 0.3,
                    distance: distance + (Math.random() - 0.5) * scatter,
                    armIndex: arm,
                    speed: 0.0003 + Math.random() * 0.0002,
                    brightness: 0.3 + Math.random() * 0.7,
                    size: Math.random() > 0.85 ? 3 : Math.random() > 0.5 ? 2 : 1,
                    color,
                });
            }
        }
        spiralStarsRef.current = spiralStars;
    }, [colors]);

    const drawPixel = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string,
        alpha: number = 1
    ) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
        ctx.globalAlpha = 1;
    };

    const drawCrossPixel = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: string,
        alpha: number = 1
    ) => {
        const px = Math.floor(x);
        const py = Math.floor(y);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillRect(px, py - 1, 1, 1);
        ctx.fillRect(px - 1, py, 3, 1);
        ctx.fillRect(px, py + 1, 1, 1);
        ctx.globalAlpha = alpha;
        ctx.fillRect(px, py, 1, 1);
        ctx.globalAlpha = 1;
    };

    const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
        timeRef.current += 1;
        const time = timeRef.current;

        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;

        starsRef.current.forEach((star) => {
            const twinkle = Math.sin(time * 0.02 * star.twinkleSpeed + star.twinklePhase);
            const alpha = 0.3 + (twinkle + 1) * 0.35 * star.brightness;

            if (star.size > 1 && alpha > 0.7) {
                drawCrossPixel(ctx, star.x, star.y, star.color, alpha);
            } else {
                drawPixel(ctx, star.x, star.y, star.size, star.color, alpha);
            }
        });

        const dustParticles = 200;
        for (let i = 0; i < dustParticles; i++) {
            const progress = i / dustParticles;
            const baseAngle = progress * Math.PI * 4 + time * 0.0002;
            const distance = 80 + progress * Math.min(width, height) * 0.35;

            for (let arm = 0; arm < 2; arm++) {
                const angle = baseAngle + arm * Math.PI;
                const scatter = 40;
                const px = centerX + Math.cos(angle) * distance + (Math.sin(i * 7) * scatter);
                const py = centerY + Math.sin(angle) * distance * 0.5 + (Math.cos(i * 11) * scatter * 0.5);
                const alpha = 0.15 + Math.sin(time * 0.01 + i) * 0.1;
                drawPixel(ctx, px, py, 2, colors.dustBlue, alpha);
            }
        }

        spiralStarsRef.current.forEach((star) => {
            const angle = star.angle + time * star.speed;
            const x = centerX + Math.cos(angle) * star.distance;
            const y = centerY + Math.sin(angle) * star.distance * 0.5;

            const twinkle = Math.sin(time * 0.03 + star.angle * 10);
            const alpha = star.brightness * (0.7 + twinkle * 0.3);

            if (star.size >= 2 && alpha > 0.6) {
                drawCrossPixel(ctx, x, y, star.color, alpha);
            } else {
                drawPixel(ctx, x, y, star.size, star.color, alpha);
            }
        });
    }, [colors]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateSize = () => {
            const dpr = 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.imageSmoothingEnabled = false;
            initStars(canvas.width, canvas.height);
        };

        updateSize();
        window.addEventListener("resize", updateSize);

        const animate = () => {
            draw(ctx, canvas.width, canvas.height);
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", updateSize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [draw, initStars]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{
                imageRendering: "pixelated",
                backgroundColor: colors.background,
            }}
        />
    );
}
