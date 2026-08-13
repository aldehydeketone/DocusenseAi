'use client';
import { useRef, useCallback } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as: Tag = 'button',
  href,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0, 0)';
    }
  }, []);

  const props = {
    ref: ref as React.RefObject<HTMLButtonElement>,
    onMouseMove,
    onMouseLeave,
    onClick,
    className: `transition-transform duration-300 ease-out ${className}`,
    ...(href ? { href } : {}),
  };

  // Always render as a div wrapper for magnetic effect compatibility
  return (
    <div
      ref={ref as unknown as React.RefObject<HTMLDivElement>}
      onMouseMove={onMouseMove as unknown as React.MouseEventHandler<HTMLDivElement>}
      onMouseLeave={onMouseLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
