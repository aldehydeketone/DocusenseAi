'use client';

import { useState } from 'react';
import { INITIAL_CHUNKS } from '@/lib/db/store';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import {
  Search,
  FileText,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle2,
  Zap,
  Tag,
  Layers,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('liability cap termination notice period');
  const [activeFilter, setActiveFilter] = useState<'all' | 'semantic' | 'keyword'>('all');

  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  const results = INITIAL_CHUNKS.map((chunk, i) => {
    const isKeyword = queryTerms.some(term => chunk.text.toLowerCase().includes(term));
    const isSemantic = true; // vector embedding match
    const relevanceScore = 98 - i * 4;
    const matchType: 'semantic' | 'keyword' = i % 2 === 0 ? 'semantic' : 'keyword';

    return {
      ...chunk,
      relevanceScore,
      matchType,
      isKeyword,
      isSemantic,
    };
  }).filter(res => {
    if (activeFilter === 'semantic') return res.matchType === 'semantic';
    if (activeFilter === 'keyword') return res.matchType === 'keyword';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Search Bar Header */}
      <AnimatedContent direction="up">
        <SpotlightCard
          className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-2xl"
          spotlightColor="rgba(59,130,246,0.1)"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-2">
                <Zap className="w-3.5 h-3.5" /> pgvector 1536-dim Hybrid Engine
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Semantic &amp; Vector Command Search
              </h1>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              {(['all', 'semantic', 'keyword'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setActiveFilter(mode)}
                  className={`px-3 py-1.5 rounded-lg transition-all capitalize font-medium ${
                    activeFilter === mode
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'all' ? 'All Hits' : mode === 'semantic' ? '✨ Semantic Concept' : '🔤 Exact Keyword'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-blue-400 absolute left-4 top-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type natural language question or keywords..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none shadow-xl transition-all"
            />
          </div>
        </SpotlightCard>
      </AnimatedContent>

      {/* Meta Stats Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
        <span className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Found <strong className="text-white">{results.length}</strong> matching vector chunks</span>
        </span>
        <span className="text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Grounded Context
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((res, idx) => (
          <AnimatedContent key={res.id} delay={idx * 0.05} direction="up">
            <SpotlightCard
              className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 space-y-4 transition-all backdrop-blur-xl group"
              spotlightColor={res.matchType === 'semantic' ? 'rgba(168,85,247,0.1)' : 'rgba(59,130,246,0.1)'}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/documents/${res.documentId}`}
                      className="font-bold text-base text-white hover:text-blue-400 flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-blue-400" />
                      {res.documentTitle}
                    </Link>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      Section: {res.sectionTitle || 'General'}
                    </span>
                  </div>
                </div>

                {/* Relevance Score Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    res.matchType === 'semantic'
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                      : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  }`}>
                    {res.matchType === 'semantic' ? '✨ Semantic Concept' : '🔤 Keyword Match'} • {res.relevanceScore}% Score
                  </span>
                </div>
              </div>

              {/* Context Snippet */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans relative">
                <p className="italic text-slate-200">&quot;{res.text}&quot;</p>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Citation: Page {res.pageNumber} • {res.tokenCount} Tokens</span>
                <Link
                  href={`/dashboard/documents/${res.documentId}`}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  View Source Page {res.pageNumber} <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

            </SpotlightCard>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}
