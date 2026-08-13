'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitBy?: 'words' | 'chars';
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  splitBy = 'words',
}: SplitTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const items = splitBy === 'chars' ? text.split('') : text.split(' ');

  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={text}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: splitBy === 'words' ? '0.25em' : '0' }}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{
            duration,
            delay: delay + i * (splitBy === 'chars' ? 0.03 : 0.08),
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {item === ' ' ? '\u00A0' : item}
        </motion.span>
      ))}
    </span>
  );
}
