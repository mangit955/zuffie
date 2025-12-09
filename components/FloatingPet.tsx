"use client";

import type React from "react";
import { useState, useRef } from "react";
import Image from "next/image";

export default function FloatingPet() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // Normalized cursor position (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    const strength = 20; // movement strength

    setPos({
      x: x * strength,
      y: y * strength,
    });
  };

  const handleLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    const now = Date.now();
    const cooldown = 1200; // ms between barks

    if (lastPlayedRef.current && now - lastPlayedRef.current < cooldown) {
      return; // too soon, skip
    }

    lastPlayedRef.current = now;

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore play errors (e.g., browser blocking)
      });
    }
  };

  const maxOffset = 20;
  const normX = pos.x / maxOffset; // -1 to 1
  const normY = pos.y / maxOffset; // -1 to 1

  const rotateY = normX * 6; // tilt left/right
  const rotateX = normY * -6; // tilt up/down
  const scale = 1 + (Math.abs(normX) + Math.abs(normY)) * 0.05; // subtle scale

  return (
    <div
      className="group relative flex h-96 w-96 items-center justify-center rounded-full 
                 bg-linear-to-br from-secondary/40 via-accent/20 to-primary/30 
                 shadow-[0_25px_60px_rgba(15,23,42,0.35)] overflow-hidden"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Audio element for husky sound */}
      <audio
        ref={audioRef}
        src="/sounds/husky.mp3" // 👈 make sure this path matches your file
        preload="auto"
      />

      {/* Soft glowing layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-tr 
                      from-accent/40 via-transparent to-primary/40 blur-2xl opacity-70 
                      group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Floating paw */}
      <div
        className="pointer-events-none absolute -top-2 -right-1 text-3xl opacity-70 
                      group-hover:translate-y-1 group-hover:translate-x-1 transition-transform duration-300"
      >
        🐾
      </div>

      <Image
        src="/d.png"
        alt="Dog"
        width={500}
        height={500}
        className="pointer-events-none drop-shadow-2xl transition-transform duration-200 ease-out transform-gpu"
        style={{
          transform: `
            translate3d(${pos.x}px, ${pos.y}px, 0)
            scale(${scale})
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
          `,
        }}
      />
    </div>
  );
}
