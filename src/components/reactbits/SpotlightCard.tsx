'use client';
import { useRef, useCallback } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(96,165,250,0.13)',
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--sx', `${x}px`);
    card.style.setProperty('--sy', `${y}px`);
    card.style.setProperty('--spotlight', spotlightColor);
  }, [spotlightColor]);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--spotlight', 'transparent');
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`spotlight-card relative overflow-hidden ${className}`}
      style={{ '--sx': '50%', '--sy': '50%', '--spotlight': 'transparent' } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
