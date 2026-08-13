'use client';

import { useState } from 'react';
import { Document } from '@/lib/types';
import { AIProvider } from '@/lib/ai/provider';
import { GitCompare, FileText, ShieldCheck, ChevronDown, Play, AlertCircle } from 'lucide-react';

interface ComparisonViewProps {
  documents: Document[];
}

export default function ComparisonView({ documents }: ComparisonViewProps) {
  const [docAId, setDocAId] = useState<string>(documents[0]?.id || '');
  const [docBId, setDocBId] = useState<string>('');
  const [hasCompared, setHasCompared] = useState(false);
  const [comparing, setComparing] = useState(false);

  const docA = documents.find((d) => d.id === docAId);
  const docB = documents.find((d) => d.id === docBId);

  const differences = hasCompared && docA && docB ? AIProvider.compareDocuments(docA, docB) : [];

  const handleCompare = () => {
    if (!docAId || !docBId || docAId === docBId) return;
    setComparing(true);
    // Simulate brief loading
    setTimeout(() => {
      setHasCompared(true);
      setComparing(false);
    }, 800);
  };

  const handleReset = () => {
    setHasCompared(false);
    setDocBId('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-purple-400" />
            Side-by-Side Document Comparison
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Select two documents and click Compare to detect differences in terms, clauses, and obligations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20 font-mono">
          <ShieldCheck className="w-4 h-4" />
          Citation Grounded Comparison
        </div>
      </div>

      {/* Document Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document A Selector */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono text-blue-400 uppercase font-semibold mb-1">DOCUMENT A — Base</div>
          <div className="relative">
            <select
              value={docAId}
              onChange={(e) => { setDocAId(e.target.value); setHasCompared(false); }}
              className="w-full bg-slate-950 border border-slate-800 hover:border-blue-500/40 focus:border-blue-500/60 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none appearance-none pr-8 transition-colors"
            >
              <option value="">Select Document A...</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
          {docA && (
            <p className="text-[11px] text-slate-400 font-mono">{docA.pageCount} Pages • {docA.chunkCount} Chunks</p>
          )}
        </div>

        {/* Document B Selector */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono text-purple-400 uppercase font-semibold mb-1">DOCUMENT B — Compare With</div>
          <div className="relative">
            <select
              value={docBId}
              onChange={(e) => { setDocBId(e.target.value); setHasCompared(false); }}
              className="w-full bg-slate-950 border border-slate-800 hover:border-purple-500/40 focus:border-purple-500/60 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none appearance-none pr-8 transition-colors"
            >
              <option value="">Select Document B...</option>
              {documents
                .filter((d) => d.id !== docAId)
                .map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title}
                  </option>
                ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
          {docB && (
            <p className="text-[11px] text-slate-400 font-mono">{docB.pageCount} Pages • {docB.chunkCount} Chunks</p>
          )}
        </div>
      </div>

      {/* Compare Action Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleCompare}
          disabled={!docAId || !docBId || docAId === docBId || comparing}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {comparing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Comparison
            </>
          )}
        </button>
        {hasCompared && (
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Reset
          </button>
        )}
        {!docBId && (
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Select Document B to enable comparison
          </p>
        )}
      </div>

      {/* Comparison Results — Only shown after clicking Run Comparison */}
      {hasCompared && docA && docB && (
        <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              DETECTED CLAUSE DIFFERENCES ({differences.length})
            </span>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="text-blue-400">A: {docA.title.slice(0, 28)}...</span>
              <span className="text-purple-400">B: {docB.title.slice(0, 28)}...</span>
            </div>
          </div>

          {differences.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm text-slate-200 font-semibold">No significant differences detected.</p>
              <p className="text-xs text-slate-400">The two documents appear to have aligned terms and clauses.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {differences.map((diff, idx) => (
                <div key={idx} className="p-6 space-y-4 hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-[11px]">
                        #{idx + 1}
                      </span>
                      {diff.topic}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                        diff.differenceType === 'contradiction'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : diff.differenceType === 'clause'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {diff.differenceType}
                    </span>
                  </div>

                  {/* Side-by-Side Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Doc A */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/20 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[10px] text-blue-400">
                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Document A</span>
                        <span>Page {diff.citationDocA.page}</span>
                      </div>
                      <p className="font-bold text-white">{diff.docAValue}</p>
                      <p className="text-[11px] text-slate-400 italic">"{diff.citationDocA.snippet}"</p>
                    </div>

                    {/* Doc B */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/20 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[10px] text-purple-400">
                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Document B</span>
                        <span>Page {diff.citationDocB.page}</span>
                      </div>
                      <p className="font-bold text-white">{diff.docBValue}</p>
                      <p className="text-[11px] text-slate-400 italic">"{diff.citationDocB.snippet}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Placeholder before comparison */}
      {!hasCompared && (
        <div className="glass-panel rounded-2xl border-slate-800 p-12 text-center space-y-3">
          <GitCompare className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">Select two documents and click <span className="text-purple-400 font-semibold">Run Comparison</span> to begin analysis.</p>
          <p className="text-xs text-slate-600">The AI will identify differences in clauses, dates, financials, and obligations with citation-backed evidence.</p>
        </div>
      )}
    </div>
  );
}
