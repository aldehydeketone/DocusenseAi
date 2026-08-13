'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface StarBorderProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  color?: string;
  speed?: string;
}

export default function StarBorder({
  children,
  className = '',
  innerClassName = 'bg-transparent',
  color = '#60a5fa',
  speed = '4s',
}: StarBorderProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: 'backOut' }}
      className={`relative inline-flex items-center justify-center rounded-full ${className}`}
      style={{
        padding: '1.5px',
        background: `linear-gradient(var(--star-angle, 0deg), transparent 20%, ${color}80 50%, transparent 80%)`,
        animation: `star-spin ${speed} linear infinite`,
      }}
    >
      <span className={`relative z-10 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 ${innerClassName}`}>
        {children}
      </span>
    </motion.div>
  );
}
