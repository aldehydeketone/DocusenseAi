'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function Counter({ end, suffix = '', prefix = '', duration = 2, className = '' }: CounterProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        onUpdate={(latest) => {
          if (ref.current) {
            const el = ref.current as HTMLElement;
            const val = Math.round(Number(latest.opacity) * end);
            el.querySelector('[data-count]')!.textContent = val.toString();
          }
        }}
        transition={{ duration }}
      >
        <span data-count>0</span>
      </motion.span>
      {suffix}
    </span>
  );
}

interface GradientTextProps {
  text: string;
  className?: string;
  gradient?: string;
}

export default function GradientText({ text, className = '', gradient }: GradientTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`inline-block ${className}`}
      style={{
        background: gradient ?? 'linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {text}
    </motion.span>
  );
}
