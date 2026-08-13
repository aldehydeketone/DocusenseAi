'use client';

import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { FileText, ShieldCheck, Lock } from 'lucide-react';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { motion } from 'motion/react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand col */}
          <AnimatedContent direction="up" delay={0} className="md:col-span-1">
            <div className="space-y-4">
              <Logo />
              <p className="text-xs text-slate-500 leading-relaxed">
                ChatGPT for your documents. Grounded document intelligence, page-level citations, structured extraction, and risk detection.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit"
              >
                <Lock className="w-3.5 h-3.5" />
                AES-256 Encrypted & Private Workspaces
              </motion.div>
            </div>
          </AnimatedContent>

          {/* Product Features */}
          <AnimatedContent direction="up" delay={0.1}>
            <div>
              <h4 className="font-semibold text-slate-300 mb-5 text-xs uppercase tracking-wider">Product Features</h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { href: '/dashboard/chat', label: 'AI Document Chat' },
                  { href: '/dashboard/extract', label: 'Structured Extraction' },
                  { href: '/dashboard/compare', label: 'Side-by-Side Comparison' },
                  { href: '/dashboard/insights', label: 'Smart Risk Insights' },
                  { href: '/dashboard/search', label: 'Semantic Vector Search' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="hover:text-blue-400 transition-colors hover:translate-x-0.5 inline-block"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedContent>

          {/* Architecture */}
          <AnimatedContent direction="up" delay={0.2}>
            <div>
              <h4 className="font-semibold text-slate-300 mb-5 text-xs uppercase tracking-wider">Architecture & Tech</h4>
              <ul className="space-y-2.5 text-xs text-slate-500">
                {[
                  'RAG Vector Retrieval Engine',
                  'Page-Level Citation Mapping',
                  'Prompt Injection Defensive Layer',
                  'LayoutLMv3 & Semantic Chunking',
                  'PostgreSQL pgvector Architecture',
                ].map((item) => (
                  <li key={item} className="hover:text-slate-400 transition-colors">{item}</li>
                ))}
              </ul>
            </div>
          </AnimatedContent>

          {/* Trust & Security */}
          <AnimatedContent direction="up" delay={0.3}>
            <div>
              <h4 className="font-semibold text-slate-300 mb-5 text-xs uppercase tracking-wider">Trust & Security</h4>
              <motion.div
                whileHover={{ borderColor: 'rgba(59,130,246,0.3)' }}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Zero Training Guarantee
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Uploaded documents are processed strictly within isolated user workspaces and are never used to train global LLM models.
                </p>
              </motion.div>
            </div>
          </AnimatedContent>
        </div>

        {/* Bottom */}
        <AnimatedContent direction="up" delay={0.4}>
          <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <p>© {year} DocuSense AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Security Overview'].map((item) => (
                <Link key={item} href="/" className="hover:text-slate-400 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </AnimatedContent>
      </div>
    </footer>
  );
}
