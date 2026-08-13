import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileText, Layers, Shield, Cpu, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-16 space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono">
            Research & Architecture Specification
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            DocuSense AI: System Architecture & Research Foundation
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Based on the systematic research review <span className="text-white font-semibold italic">"DocuSense AI: An AI-Powered Document Intelligence and Reasoning Platform"</span> by Prathamesh Singh, Vedant Singh, and Mihir Singh (Thakur College of Engineering & Technology, Univ of Mumbai).
          </p>
        </div>

        {/* 5 Layer Architecture Card */}
        <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            The 5-Layer DocuSense AI Architecture
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-blue-400 font-bold">1. Collection</span>
              <p className="text-[11px] text-slate-400 font-sans">Multi-source PDF, DOCX, CSV, image acquisition.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold">2. Preprocess</span>
              <p className="text-[11px] text-slate-400 font-sans">OCR, image deskew, tokenization, lemmatization.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-purple-400 font-bold">3. Extraction</span>
              <p className="text-[11px] text-slate-400 font-sans">Named Entity Recognition (NER), semantic chunking.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-pink-400 font-bold">4. Analysis</span>
              <p className="text-[11px] text-slate-400 font-sans">LayoutLMv3 structural layout parsing.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold">5. Retrieval</span>
              <p className="text-[11px] text-slate-400 font-sans">pgvector similarity search & grounded RAG.</p>
            </div>
          </div>
        </div>

        {/* Paper Reference Note */}
        <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-xs space-y-3">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Preloaded Academic Reference Document
          </div>
          <p className="text-slate-300 leading-relaxed">
            The full 11-page research paper detailing the DocuSense AI platform architecture is preloaded in your workspace demo document library (<code className="text-blue-400 font-mono">DocuSense_AI_TCET_Paper.pdf</code>). You can chat with it, query section definitions, or extract author metadata immediately in the Dashboard.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
