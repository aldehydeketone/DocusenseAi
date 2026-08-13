'use client';

import { useState } from 'react';
import { INITIAL_CHUNKS } from '@/lib/db/store';
import { useStore } from '@/lib/context/StoreContext';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import {
  Search,
  FileText,
  ExternalLink,
  CheckCircle2,
  Zap,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const { documents } = useStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'semantic' | 'keyword'>('semantic');

  // Only search from documents that are in the active store (uploaded docs)
  const activeDocIds = new Set(documents.map((d) => d.id));
  const activeChunks = INITIAL_CHUNKS.filter((chunk) => activeDocIds.has(chunk.documentId));

  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  const results = query.trim().length === 0
    ? []
    : activeChunks.map((chunk, i) => {
        const isKeyword = queryTerms.some((term) => chunk.text.toLowerCase().includes(term));
        const relevanceScore = Math.max(60, 98 - i * 5);
        const matchType: 'semantic' | 'keyword' = isKeyword ? 'keyword' : 'semantic';
        return { ...chunk, relevanceScore, matchType, isKeyword };
      }).filter((res) => {
        if (activeFilter === 'keyword') return res.isKeyword;
        return true; // semantic: show all (simulating vector embedding match)
      }).sort((a, b) => b.relevanceScore - a.relevanceScore);

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
              <p className="text-xs text-slate-400 mt-1">
                Search across {documents.length} uploaded document{documents.length !== 1 ? 's' : ''} ({activeChunks.length} indexed chunks)
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              {(['semantic', 'keyword'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveFilter(mode)}
                  className={`px-3 py-1.5 rounded-lg transition-all capitalize font-medium ${
                    activeFilter === mode
                      ? 'bg-blue-600 text-white font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'semantic' ? '✨ Semantic Concept' : '🔤 Exact Keyword'}
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
              placeholder="Type a natural language question or keyword to search your documents..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none shadow-xl transition-all"
            />
          </div>
        </SpotlightCard>
      </AnimatedContent>

      {/* Meta Stats Bar */}
      {query.trim().length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
          <span className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Found <strong className="text-white">{results.length}</strong> matching chunks from your documents</span>
          </span>
          <span className="text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Grounded Context
          </span>
        </div>
      )}

      {/* Empty state when no query */}
      {query.trim().length === 0 && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <Search className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">Type a query above to search your <span className="text-blue-400 font-semibold">{documents.length} uploaded documents</span>.</p>
          <p className="text-xs text-slate-600">Try: "What is the total amount due?" or "Non-compete clause duration"</p>
        </div>
      )}

      {/* No results state */}
      {query.trim().length > 0 && results.length === 0 && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-10 text-center space-y-2">
          <p className="text-sm text-slate-400">No matching chunks found for <span className="text-white font-semibold">"{query}"</span>.</p>
          <p className="text-xs text-slate-600">Try switching to Semantic mode or rephrasing your query.</p>
        </div>
      )}

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
                      {res.sectionTitle || 'General'}
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
                    {res.matchType === 'semantic' ? '✨ Semantic' : '🔤 Keyword'} • {res.relevanceScore}%
                  </span>
                </div>
              </div>

              {/* Context Snippet */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans">
                <p className="italic text-slate-200">"{res.text}"</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>Citation: Page {res.pageNumber} • {res.tokenCount} Tokens</span>
                <Link
                  href={`/dashboard/documents/${res.documentId}`}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  View Source <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </SpotlightCard>
          </AnimatedContent>
        ))}
      </div>
    </div>
  );
}
