'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const [scroll, setScroll] = useState(0);
  const spring = useSpring(scroll, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setScroll(isNaN(pct) ? 0 : pct * 100);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    spring.set(scroll);
  }, [scroll, spring]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] h-[3px] origin-left"
      style={{
        scaleX: spring.get() / 100,
        background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
        width: '100%',
        transformOrigin: 'left',
      }}
    />
  );
}
