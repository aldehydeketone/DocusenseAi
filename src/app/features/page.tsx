'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import Link from 'next/link';
import {
  Bot,
  GitCompare,
  Code2,
  ShieldCheck,
  Zap,
  Search,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Terminal,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function FeaturesPage() {
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20 relative">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]" />
          <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />
        </div>

        {/* Section Header */}
        <AnimatedContent direction="up">
          <div className="text-center space-y-4 max-w-3xl mx-auto relative z-10">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Full-Stack Document Intelligence Engine</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Architected for Precision Document Reasoning
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              Explore how DocuSense AI parses unstructured PDFs, extracts verified RAG citations, diffs contract clauses, and guarantees zero-hallucination outputs.
            </p>
          </div>
        </AnimatedContent>

        {/* Asymmetrical Interactive Feature Grid with Live Embedded Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

          {/* Feature 1: Grounded RAG Engine (Large 7 cols) */}
          <div className="lg:col-span-7">
            <AnimatedContent delay={0.1} direction="up">
              <SpotlightCard
                className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all h-full bg-slate-900/70 backdrop-blur-2xl group flex flex-col justify-between space-y-6"
                spotlightColor="rgba(59,130,246,0.12)"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
                      <Bot className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full font-semibold">
                      pgvector RAG Architecture
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      Grounded RAG Document Reasoning &amp; Chat
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Ask natural language questions across massive document repositories. Answers are synthesized strictly from retrieved vector chunks with explicit page-level citation proofs.
                    </p>
                  </div>
                </div>

                {/* Embedded Interactive RAG Preview Widget */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-3 font-sans">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                      <Terminal className="w-3.5 h-3.5" /> Vector Context Retrieval
                    </span>
                    <span className="text-emerald-400">pgvector Cosine Sim: 0.982</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Q: What is the indemnification cap?</div>
                    <div className="font-medium text-slate-200">
                      &quot;Indemnification liability is strictly limited to 12 months preceding fees ($1.2M max).&quot;
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs font-mono text-blue-300 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Verified Citation [Master_Service_Agreement.pdf • Page 8]</span>
                    </span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">100% Match</span>
                  </div>
                </div>

              </SpotlightCard>
            </AnimatedContent>
          </div>

          {/* Feature 2: Side-by-Side Contract Comparison (5 cols) */}
          <div className="lg:col-span-5">
            <AnimatedContent delay={0.2} direction="up">
              <SpotlightCard
                className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-purple-500/30 transition-all h-full bg-slate-900/70 backdrop-blur-2xl group flex flex-col justify-between space-y-6"
                spotlightColor="rgba(168,85,247,0.12)"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
                      <GitCompare className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-semibold">
                      Automated Redlining
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      Side-by-Side Redline Diffing
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Compare multi-vendor proposals or agreement revisions in seconds. Automatically highlight clause modifications, added liabilities, and notice window shifts.
                    </p>
                  </div>
                </div>

                {/* Embedded Live Redline Diff Snippet */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-rose-400">Original Clause v1</div>
                    <p className="text-[11px] line-through text-slate-400">&quot;Termination notice without cause: 30 days...&quot;</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-emerald-400">Modified Clause v2</div>
                    <p className="text-[11px] font-semibold text-emerald-300">&quot;Termination notice without cause: 90 days + penalty...&quot;</p>
                  </div>
                </div>

              </SpotlightCard>
            </AnimatedContent>
          </div>

          {/* Feature 3: Structured Information Extraction (5 cols) */}
          <div className="lg:col-span-5">
            <AnimatedContent delay={0.3} direction="up">
              <SpotlightCard
                className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/30 transition-all h-full bg-slate-900/70 backdrop-blur-2xl group flex flex-col justify-between space-y-6"
                spotlightColor="rgba(52,211,153,0.12)"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-semibold">
                      Typed JSON / CSV Schemas
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Structured Schema Extraction
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Pass custom schemas for financial 10-Ks, invoices, or contracts. Extract typed data directly into clean JSON objects ready for downstream database ingestion.
                    </p>
                  </div>
                </div>

                {/* Embedded Live Code Block Widget */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 space-y-1">
                  <div className="text-[10px] text-slate-500 border-b border-slate-800/80 pb-2 mb-2 flex justify-between">
                    <span>extracted_schema.json</span>
                    <span className="text-emerald-500 font-bold">Validated ✓</span>
                  </div>
                  <code>{`{
  "governing_law": "Delaware, USA",
  "liability_cap": "$1,200,000",
  "notice_days": 60,
  "auto_renewal": true
}`}</code>
                </div>

              </SpotlightCard>
            </AnimatedContent>
          </div>

          {/* Feature 4: Prompt Injection Security Defense (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatedContent delay={0.4} direction="up">
              <SpotlightCard
                className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-rose-500/30 transition-all h-full bg-slate-900/70 backdrop-blur-2xl group flex flex-col justify-between space-y-6"
                spotlightColor="rgba(244,63,94,0.12)"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full font-semibold">
                      Zero-Trust Defensive Firewall
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-rose-300 transition-colors">
                      Adversarial Prompt Injection Defense Shield
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Protects enterprise systems against malicious prompt injections hidden inside uploaded PDFs or scanned documents. Text is strictly treated as untrusted evidence data.
                    </p>
                  </div>
                </div>

                {/* Embedded Live Security Firewall Console Widget */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-rose-400 border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Lock className="w-3.5 h-3.5" /> Adversarial Firewall Active
                    </span>
                    <span className="text-slate-400">Scan Latency: 4ms</span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-rose-950/20 border border-rose-500/20 text-rose-300 flex items-center justify-between">
                      <span>[DEFENDED] System instruction override attempt in PDF Chunk #14</span>
                      <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">BLOCKED</span>
                    </div>
                    <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                      <span>[PASSED] Verified legal contract text sanitized for RAG index</span>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">CLEAN</span>
                    </div>
                  </div>
                </div>

              </SpotlightCard>
            </AnimatedContent>
          </div>

        </div>

        {/* CTA Banner */}
        <AnimatedContent delay={0.5} direction="up">
          <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-slate-800 text-center space-y-6 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950 shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Ready to Experience Enterprise Document Intelligence?
              </h2>
              <p className="text-sm text-slate-400">
                Start testing with ready document collections or upload your own files in our private encrypted sandbox.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                Launch Document Command Center
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedContent>

      </main>

      <Footer />
    </div>
  );
}
