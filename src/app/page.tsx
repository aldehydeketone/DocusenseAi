'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SplitText from '@/components/reactbits/SplitText';
import BlurText from '@/components/reactbits/BlurText';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import TiltCard from '@/components/reactbits/TiltCard';
import MagneticButton from '@/components/reactbits/MagneticButton';
import Particles from '@/components/reactbits/Particles';
import Aurora from '@/components/reactbits/Aurora';
import StarBorder from '@/components/reactbits/StarBorder';
import ShinyText from '@/components/reactbits/ShinyText';
import GradientText from '@/components/reactbits/GradientText';
import FadeIn from '@/components/reactbits/FadeIn';
import {
  Sparkles,
  ArrowRight,
  FileText,
  ShieldCheck,
  Zap,
  GitCompare,
  Table,
  Lock,
  Bot,
  CheckCircle2,
  Search,
  Cpu,
  Database,
  Globe,
  ChevronRight,
  Code2,
  AlertTriangle,
  FileSearch,
  Check,
  Layers,
  ArrowUpRight
} from 'lucide-react';

const FEATURES = [
  {
    icon: Bot,
    color: 'blue',
    title: 'AI Document Chat',
    desc: 'Chat with single documents or entire collections. Get zero-hallucination answers grounded strictly in retrieved context with page-level citations.',
    spotlight: 'rgba(59,130,246,0.12)',
  },
  {
    icon: GitCompare,
    color: 'purple',
    title: 'Document Comparison',
    desc: 'Compare two or more contracts side-by-side. Automatically detect clause variances, missing obligations, and liability differences.',
    spotlight: 'rgba(168,85,247,0.12)',
  },
  {
    icon: Table,
    color: 'emerald',
    title: 'Structured Extraction',
    desc: 'Extract predefined schemas from contracts, invoices, and research papers directly into clean JSON or CSV formats.',
    spotlight: 'rgba(52,211,153,0.12)',
  },
  {
    icon: Search,
    color: 'indigo',
    title: 'Semantic Vector Search',
    desc: 'pgvector powered sub-second semantic search across your entire document corpus. Find exactly what you need instantly.',
    spotlight: 'rgba(99,102,241,0.12)',
  },
  {
    icon: ShieldCheck,
    color: 'rose',
    title: 'Risk Intelligence',
    desc: 'Automatic red-flag detection for non-compete clauses, IP indemnification, auto-renewal traps, and unlimited liability exposure.',
    spotlight: 'rgba(244,63,94,0.12)',
  },
  {
    icon: Lock,
    color: 'amber',
    title: 'Enterprise Security',
    desc: 'AES-256 workspace isolation. Documents never leave your private namespace. Zero training guarantee.',
    spotlight: 'rgba(251,191,36,0.12)',
  },
];

const STEPS = [
  { step: '01', title: 'Upload Documents', desc: 'Drag & drop PDFs, DOCX, TXT, CSV or scanned images into your private encrypted workspace.' },
  { step: '02', title: 'Process & Index', desc: 'OCR extraction, semantic chunking, and pgvector embeddings prepare your documents for AI-powered search.' },
  { step: '03', title: 'Ask Questions', desc: 'Query single or multi-document collections using natural language. Our RAG pipeline retrieves exact evidence.' },
  { step: '04', title: 'Grounded Answers', desc: 'Receive zero-hallucination answers with clickable page-level citations linking back to source documents.' },
];

const SANDBOX_DOCS = [
  {
    id: 'contract',
    name: 'Master_Service_Agreement.pdf',
    type: 'Legal NDA & Contract',
    pages: '14 Pages',
    question: 'What is the governing law, termination period, and liability cap?',
    answer: 'Governing law is Delaware, USA (§22.1). Termination requires 60 days written notice (§18.3). Total aggregate liability is strictly capped at fees paid in prior 12 months (§14.1).',
    citation: 'Section 14.1 • Page 8',
    citationSnippet: '"...In no event shall either party\'s total aggregate liability exceed the total amount paid in the twelve (12) months preceding the claim..."',
    riskBadge: 'Low Risk • Standard Cap',
    riskColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    json: {
      governing_law: 'Delaware, USA',
      liability_cap: '$1,200,000 max',
      notice_period_days: 60,
      auto_renewal: true
    }
  },
  {
    id: 'finance',
    name: 'Q4_Financial_Audit_2025.pdf',
    type: '10-K Financial Report',
    pages: '42 Pages',
    question: 'What was the YoY ARR growth rate and net dollar retention?',
    answer: 'ARR expanded by 142% YoY reaching $28.4 Million. Net Dollar Retention (NDR) reached 128% driven by enterprise expansion.',
    citation: 'Financial Highlights • Page 3',
    citationSnippet: '"...Annual Recurring Revenue (ARR) reached $28.4 million, representing a 142% YoY growth. Net Dollar Retention (NDR) maintained at 128%..."',
    riskBadge: 'High Growth • Audit Verified',
    riskColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    json: {
      arr: '$28.4M',
      yoy_growth: '142%',
      ndr: '128%',
      gross_margin: '79.4%'
    }
  },
  {
    id: 'research',
    name: 'Clinical_Trial_Phase3_Results.pdf',
    type: 'Biomedical Paper',
    pages: '28 Pages',
    question: 'What were the primary endpoint results and p-value significance?',
    answer: 'The primary endpoint achieved statistical significance (p < 0.001) with a 41% reduction in disease progression compared to placebo.',
    citation: 'Results & Findings • Page 12',
    citationSnippet: '"...Treatment cohort demonstrated a statistically significant 41% reduction in primary event risk (HR 0.59; 95% CI 0.48-0.72; p < 0.001)..."',
    riskBadge: 'Statistically Significant (p < 0.001)',
    riskColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    json: {
      p_value: '< 0.001',
      efficacy: '41% risk reduction',
      sample_size: 1420,
      phase: 'Phase III'
    }
  }
];

const colorMap: Record<string, { icon: string; bg: string; border: string; badge: string }> = {
  blue:    { icon: 'text-blue-400',    bg: 'bg-blue-600/20',    border: 'border-blue-500/30',    badge: 'bg-blue-500/10 text-blue-400' },
  purple:  { icon: 'text-purple-400',  bg: 'bg-purple-600/20',  border: 'border-purple-500/30',  badge: 'bg-purple-500/10 text-purple-400' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-400' },
  indigo:  { icon: 'text-indigo-400',  bg: 'bg-indigo-600/20',  border: 'border-indigo-500/30',  badge: 'bg-indigo-500/10 text-indigo-400' },
  rose:    { icon: 'text-rose-400',    bg: 'bg-rose-600/20',    border: 'border-rose-500/30',    badge: 'bg-rose-500/10 text-rose-400' },
  amber:   { icon: 'text-amber-400',   bg: 'bg-amber-600/20',   border: 'border-amber-500/30',   badge: 'bg-amber-500/10 text-amber-400' },
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const activeDoc = SANDBOX_DOCS[activeTab];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* ── TECHNICAL HERO SECTION ────────────────────────────── */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-800/60 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3rem_3rem]">
        {/* Aurora WebGL background */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-80 overflow-hidden">
          <Aurora
            colorStops={["#7cff67","#B497CF","#5227FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Headline & Action */}
            <div className="lg:col-span-6 space-y-8 text-left">

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15]">
                Reason Across High-Stakes Documents.{' '}
                <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent font-extrabold">
                  Grounded &amp; Verifiable.
                </span>
              </h1>

              {/* Value Proposition */}
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                The enterprise document intelligence platform engineered for legal, financial, and technical teams. Zero hallucinations, page-level citation auditing, and instant JSON extraction.
              </p>

              {/* Primary Call to Actions */}
              <AnimatedContent delay={0.4} direction="up">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <MagneticButton>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 px-7 py-3.5 rounded-xl shadow-xl shadow-blue-600/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Start Free Trial
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </MagneticButton>

                  <MagneticButton>
                    <Link
                      href="/dashboard/documents/doc-tcet-paper"
                      className="inline-flex items-center justify-center gap-2 text-base font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-7 py-3.5 rounded-xl transition-all"
                    >
                      <FileSearch className="w-4 h-4 text-blue-400" />
                      Explore Interactive Demo
                    </Link>
                  </MagneticButton>
                </div>
              </AnimatedContent>

              {/* Metrics Bar */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left font-mono">
                <div>
                  <div className="text-xl font-bold text-white">99.8%</div>
                  <div className="text-[11px] text-slate-400">Citation Accuracy</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">&lt;0.2s</div>
                  <div className="text-[11px] text-slate-400">pgvector Latency</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">AES-256</div>
                  <div className="text-[11px] text-slate-400">Isolated Workspace</div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interactive Document Intelligence Sandbox */}
            <div className="lg:col-span-6">
              <AnimatedContent delay={0.3} direction="up">
                <div className="glass-panel p-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-blue-950/60 backdrop-blur-2xl">
                  
                  {/* Sandbox Window Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/80 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 text-xs font-mono text-slate-400 font-semibold">Live Sandbox • DocuSense RAG Engine</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Grounded Proof
                    </div>
                  </div>

                  {/* Interactive Document Tabs */}
                  <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-1.5 gap-1.5 overflow-x-auto">
                    {SANDBOX_DOCS.map((doc, idx) => (
                      <button
                        key={doc.id}
                        onClick={() => setActiveTab(idx)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                          activeTab === idx
                            ? 'bg-blue-600 text-white font-semibold shadow-md'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{doc.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Document Analysis Viewer */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDoc.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="p-5 space-y-4 text-left bg-slate-950/60 min-h-[360px]"
                    >
                      {/* Document Meta Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                        <div>
                          <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                            <span>{activeDoc.name}</span>
                            <span className="text-[10px] font-mono text-slate-500">({activeDoc.pages})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{activeDoc.type}</div>
                        </div>
                        <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded border ${activeDoc.riskColor}`}>
                          {activeDoc.riskBadge}
                        </span>
                      </div>

                      {/* Natural Language Query */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5" /> Natural Language Query
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-200">
                          &quot;{activeDoc.question}&quot;
                        </div>
                      </div>

                      {/* Grounded RAG Answer */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Grounded RAG Answer
                          </span>
                          <span className="text-slate-500 font-normal">Citation: {activeDoc.citation}</span>
                        </div>
                        <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          {activeDoc.answer}
                        </div>
                      </div>

                      {/* Source Citation Proof Snippet */}
                      <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] font-mono text-blue-300 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-blue-400 font-bold uppercase">
                          <span>Verified Snippet [{activeDoc.citation}]</span>
                          <span>100% Match</span>
                        </div>
                        <p className="italic text-slate-300">{activeDoc.citationSnippet}</p>
                      </div>

                    </motion.div>
                  </AnimatePresence>

                  {/* Card Footer action */}
                  <div className="px-4 py-3 bg-slate-950/90 border-t border-slate-800/80 rounded-b-xl flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Try asking your own document</span>
                    <Link
                      href="/dashboard"
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold hover:underline"
                    >
                      Open Full Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              </AnimatedContent>
            </div>

          </div>
        </div>
      </section>

      {/* ── BENTO GRID CAPABILITIES ────────────────────────────── */}
      <section className="py-24 border-b border-slate-800/60 bg-slate-950 relative overflow-hidden">
        {/* Animated Mesh Ambient Glow Orbs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[150px] animate-mesh-1" />
          <div className="absolute bottom-10 -left-20 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[150px] animate-mesh-2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          
          <AnimatedContent direction="up">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Core Capabilities</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Architected for Enterprise Document Operations
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Purpose-built modules that eliminate manual review, accelerate legal auditing, and automate data extraction across complex files.
              </p>
            </div>
          </AnimatedContent>

          {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento 1: Document Comparison Engine (Spans 8 cols) */}
            <div className="md:col-span-8">
              <SpotlightCard className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all h-full bg-slate-900/60 backdrop-blur-xl group">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <GitCompare className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full font-semibold">
                      Side-by-Side Diffing
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      Multi-Contract Variance & Redline Comparison
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                      Compare Vendor MSA v1 vs Vendor MSA v2 in seconds. Automatically flag clause modifications, added indemnities, and modified payment windows.
                    </p>
                  </div>

                  {/* Simulated Diff Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-rose-400">Document A (Original)</div>
                      <p className="text-[11px] line-through text-slate-400">&quot;Notice period for termination without cause shall be 30 days...&quot;</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-emerald-400">Document B (Modified)</div>
                      <p className="text-[11px] font-semibold text-emerald-300">&quot;Notice period for termination without cause shall be 90 days with penalty...&quot;</p>
                    </div>
                  </div>

                </div>
              </SpotlightCard>
            </div>

            {/* Bento 2: Grounded Citations (Spans 4 cols) */}
            <div className="md:col-span-4">
              <SpotlightCard className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all h-full bg-slate-900/60 backdrop-blur-xl group">
                <div className="space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      Page-Level Source Citations
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Every answer links back to exact page numbers and highlighted text snippets. Zero hallucinations guaranteed.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs font-mono text-blue-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Audit trail verified against raw PDF vector embeddings.</span>
                  </div>
                </div>
              </SpotlightCard>
            </div>

            {/* Bento 3: Structured JSON Extractor (Spans 4 cols) */}
            <div className="md:col-span-4">
              <SpotlightCard className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all h-full bg-slate-900/60 backdrop-blur-xl group">
                <div className="space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Structured Data Extraction
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Extract key-value pairs, tables, and financial figures directly into clean JSON or CSV schemas.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                    <code>{`{ "net_revenue": "$42.8M", "ebitda": "24.1%", "compliance": true }`}</code>
                  </div>
                </div>
              </SpotlightCard>
            </div>

            {/* Bento 4: Automated Risk Intelligence (Spans 8 cols) */}
            <div className="md:col-span-8">
              <SpotlightCard className="glass-panel p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all h-full bg-slate-900/60 backdrop-blur-xl group">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full font-semibold">
                      Automated Auditing
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
                      Automated Risk Radar & Clause Flags
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                      Instantly highlight non-compete traps, unlimited liability exposures, auto-renewal locks, and missing indemnification clauses before signing.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {[
                      '⚠️ Unlimited Liability Detected',
                      '🔒 Auto-Renewal 60-Day Lock',
                      '⚖️ Non-Compete Scope Expanded',
                      '✅ IP Indemnity Verified'
                    ].map((flag) => (
                      <span key={flag} className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                        {flag}
                      </span>
                    ))}
                  </div>

                </div>
              </SpotlightCard>
            </div>

          </div>

        </div>
      </section>

      {/* ── WORKFLOW PIPELINE ────────────────────────────── */}
      <section className="py-24 border-b border-slate-800/60 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <AnimatedContent direction="up">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                End-to-End Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How DocuSense AI Processes Your Documents
              </h2>
              <p className="text-sm text-slate-400">
                A transparent 4-stage pipeline that guarantees speed, privacy, and precision.
              </p>
            </div>
          </AnimatedContent>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <AnimatedContent key={i} delay={i * 0.1} direction="up">
                <TiltCard className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-blue-500/40 transition-all h-full group text-left">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-3xl font-extrabold text-blue-500/30 group-hover:text-blue-400 transition-colors">
                        {s.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-bold text-base text-white">{s.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </TiltCard>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNICAL STACK ──────────────────────────────── */}
      <section className="py-16 border-b border-slate-800/60 bg-slate-950">
        <AnimatedContent direction="up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">
              ENTERPRISE SECURITY & INFRASTRUCTURE
            </span>
            <h2 className="text-xl font-bold text-slate-200">Built On Hardened Open Standards</h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: 'Next.js App Router', icon: Globe },
                { name: 'pgvector + PostgreSQL', icon: Database },
                { name: 'LayoutLMv3 OCR', icon: Cpu },
                { name: 'RAG Pipeline', icon: Bot },
                { name: 'AES-256 Encryption', icon: Lock },
                { name: 'Semantic Chunking', icon: FileText },
              ].map((tech) => {
                const TechIcon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs font-semibold text-slate-300"
                    whileHover={{ scale: 1.04, borderColor: 'rgba(59, 130, 246, 0.4)' }}
                  >
                    <TechIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>{tech.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </AnimatedContent>
      </section>

      {/* ── FINAL CTA BANNER ──────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          <AnimatedContent direction="up">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Transform How Your Team Reads Documents.
              </h2>
              <p className="text-base text-slate-400 max-w-xl mx-auto">
                No credit card required. Upload a contract or report and experience zero-hallucination document intelligence in seconds.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent delay={0.2} direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
                >
                  Launch Workspace Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticButton>
            </div>
          </AnimatedContent>
        </div>
      </section>

      <Footer />
    </div>
  );
}
