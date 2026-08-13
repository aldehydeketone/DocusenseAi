import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Upload, Cpu, Database, MessageSquare, ShieldCheck, ArrowRight, FileText, Sparkles, Search, GitCompare } from 'lucide-react';

export const metadata = {
  title: 'How It Works — DocuSense AI',
  description: 'Understand how DocuSense AI processes, indexes and reasons over your documents using RAG, OCR, and vector search.',
};

const PIPELINE_STEPS = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Your Document',
    desc: 'Drag-and-drop or browse to upload any PDF, DOCX, TXT or CSV file up to 50MB. AES-256 encryption is applied immediately on ingestion.',
    badge: 'Ingestion Layer',
    color: 'blue',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'OCR & Layout Analysis',
    desc: 'LayoutLMv3 reads every page — parsing tables, multi-column layouts, headers, and embedded figures that traditional parsers miss.',
    badge: 'Document AI',
    color: 'purple',
  },
  {
    step: '03',
    icon: Database,
    title: 'Vector Embedding & Indexing',
    desc: 'Text is semantically chunked and converted to 1536-dimensional vectors, stored in pgvector for sub-second cosine similarity retrieval.',
    badge: 'pgvector RAG',
    color: 'indigo',
  },
  {
    step: '04',
    icon: MessageSquare,
    title: 'Ask Questions & Get Cited Answers',
    desc: 'Your query retrieves the most relevant document chunks. An LLM then generates a precise answer grounded only in those chunks — with page citations.',
    badge: 'Zero Hallucination',
    color: 'emerald',
  },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Zero Hallucination Guarantee', desc: 'Every answer is grounded strictly in your uploaded documents. No fabrication.' },
  { icon: Search, title: 'Semantic & Keyword Search', desc: 'Search across all your documents using natural language queries or exact keywords.' },
  { icon: GitCompare, title: 'Side-by-Side Comparison', desc: 'Automatically detect differences in clauses, dates, and obligations across two documents.' },
  { icon: Sparkles, title: 'Structured Data Extraction', desc: 'Extract contracts, invoice line items, and research metadata into structured JSON/CSV.' },
  { icon: FileText, title: 'Smart Risk Insights', desc: 'AI automatically flags important dates, financial figures, risk clauses, and key entities.' },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue:    { bg: 'bg-blue-600/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  purple:  { bg: 'bg-purple-600/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  indigo:  { bg: 'bg-indigo-600/10',  border: 'border-indigo-500/20',  text: 'text-indigo-400',  badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  emerald: { bg: 'bg-emerald-600/10', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">

        {/* Hero Section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
            <Sparkles className="w-3.5 h-3.5" /> How DocuSense AI Works
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            From Document Upload to<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Grounded AI Reasoning
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            DocuSense AI transforms unstructured documents into a searchable, queryable knowledge base using a 4-stage processing pipeline — in seconds.
          </p>
        </div>

        {/* Pipeline Steps */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono text-center">Processing Pipeline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PIPELINE_STEPS.map((step) => {
              const Icon = step.icon;
              const c = colorMap[step.color];
              return (
                <div key={step.step} className={`glass-panel p-6 rounded-2xl border ${c.border} space-y-4 hover:shadow-xl transition-all`}>
                  <div className="flex items-start justify-between">
                    <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${c.badge}`}>{step.badge}</span>
                  </div>
                  <div>
                    <div className={`text-xs font-mono ${c.text} mb-1`}>Step {step.step}</div>
                    <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Core Features */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono text-center">Core Capabilities</h2>
          <div className="divide-y divide-slate-800/70 border border-slate-800 rounded-2xl overflow-hidden">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-5 hover:bg-slate-900/40 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-10 border-t border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Ready to try DocuSense AI?</h2>
          <p className="text-sm text-slate-400">Upload your first document and get AI-powered insights in under 60 seconds.</p>
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
