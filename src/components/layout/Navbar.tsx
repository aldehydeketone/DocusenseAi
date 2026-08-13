'use client';

import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { FileText, Sparkles, Shield, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef, useCallback } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Magnetic effect on Launch App btn
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0,0)';
  }, []);

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'Architecture' },
  ];

  return (
    <>
      {/* Progress bar */}
      <ScrollProgressBar />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-blue-500/10 shadow-lg shadow-blue-950/20'
            : 'bg-slate-950/70 backdrop-blur-md border-b border-slate-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Logo />

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-300">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setActiveLink(label)}
                onMouseLeave={() => setActiveLink('')}
                className="relative py-1 hover:text-white transition-colors"
              >
                {label}
                <AnimatePresence>
                  {activeLink === label && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-blue-500 to-indigo-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            ))}

          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block text-[15px] font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>

            <div
              ref={btnRef}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              className="transition-transform duration-200 ease-out"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4.5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-500/40 active:scale-[0.97]"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                Launch App
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden md:hidden border-t border-slate-800 bg-slate-950/98"
            >
              <div className="px-4 py-4 flex flex-col gap-3">
                {navLinks.map(({ href, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      href={href}
                      className="text-sm font-medium text-slate-300 hover:text-white transition-colors block py-2"
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 rounded-xl mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <Sparkles className="w-4 h-4 text-blue-200" />
                  Launch App
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

// Inline scroll progress bar
function ScrollProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setWidth(isNaN(pct) ? 0 : pct);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[200] w-full h-[3px] bg-transparent">
      <motion.div
        className="h-full origin-left"
        style={{
          width: `${width}%`,
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
