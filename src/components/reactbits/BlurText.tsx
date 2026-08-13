'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function BlurText({ text, className = '', delay = 0, duration = 0.7 }: BlurTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, filter: 'blur(12px)', y: 8 }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{
            duration,
            delay: delay + i * 0.05,
            ease: 'easeOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
