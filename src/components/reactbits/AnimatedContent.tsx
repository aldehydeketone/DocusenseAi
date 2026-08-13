'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface AnimatedContentProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  once?: boolean;
}

export default function AnimatedContent({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 40,
  once = true,
}: AnimatedContentProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px' });

  const initial: Record<string, number | string> = { opacity: 0 };
  if (direction === 'up') initial.y = distance;
  if (direction === 'down') initial.y = -distance;
  if (direction === 'left') initial.x = distance;
  if (direction === 'right') initial.x = -distance;

  const animate = inView ? { opacity: 1, x: 0, y: 0 } : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
