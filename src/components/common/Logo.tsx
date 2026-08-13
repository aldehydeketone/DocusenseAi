'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const scale = { sm: 1.6, md: 2.3, lg: 3.0 };
  const s = scale[size];
  const iconW = Math.round(28 * s);
  const iconH = Math.round(28 * s);

  const textClass = {
    sm: 'text-[24px]',
    md: 'text-[32px]',
    lg: 'text-[42px]',
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-[12px] group select-none ${className}`}
    >
      {/* ── Custom Geometric Lettermark ── */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{ width: iconW, height: iconH }}
        className="relative shrink-0"
      >
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={iconW}
          height={iconH}
          aria-hidden="true"
        >
          <defs>
            {/* Main gradient: deep navy → electric blue */}
            <linearGradient id="lg_main" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            {/* Accent glow */}
            <radialGradient id="lg_glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </radialGradient>
            <filter id="lg_blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
            </filter>
          </defs>

          {/* Glow layer behind */}
          <ellipse cx="14" cy="16" rx="10" ry="9" fill="url(#lg_glow)" filter="url(#lg_blur)" />

          {/* ── Shape: Hexagonal "D" lettermark prism ── */}
          {/* Back face (shadow layer) */}
          <path
            d="M5 9L14 4L23 9V19L14 24L5 19V9Z"
            fill="#0f172a"
            opacity="0.6"
          />
          {/* Front face */}
          <path
            d="M5 9L14 4L23 9V19L14 24L5 19V9Z"
            fill="url(#lg_main)"
            opacity="0.92"
          />

          {/* Inner cut: stylised "D" negative space */}
          <path
            d="M11 10.5H14.5C16.9853 10.5 19 12.5147 19 15C19 17.4853 16.9853 19.5 14.5 19.5H11V10.5Z"
            fill="#0f172a"
          />
          {/* Centre vertical bar */}
          <rect x="11" y="10.5" width="2" height="9" rx="1" fill="#e0f2fe" opacity="0.9" />

          {/* Live data node dot — bottom-right corner */}
          <circle cx="22" cy="22" r="2.8" fill="#0f172a" />
          <circle cx="22" cy="22" r="2" fill="#38BDF8" />
        </svg>

        {/* Ambient glow behind icon */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg scale-150 group-hover:bg-blue-400/35 transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none" />
      </motion.div>

      {/* ── Wordmark ── */}
      <span
        className={`font-bold tracking-[-0.03em] leading-none text-white ${textClass}`}
        style={{ fontFamily: 'var(--font-heading, inherit)' }}
      >
        Docu
        <span
          className="text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)' }}
        >
          Sense
        </span>
      </span>
    </Link>
  );
}
