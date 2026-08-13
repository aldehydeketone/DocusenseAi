'use client';

import { useState } from 'react';
import { Document } from '@/lib/types';
import { AIProvider } from '@/lib/ai/provider';
import { GitCompare, FileText, AlertTriangle, ArrowRight, ShieldCheck, Highlighter } from 'lucide-react';

interface ComparisonViewProps {
  documents: Document[];
}

export default function ComparisonView({ documents }: ComparisonViewProps) {
  const contractA = documents.find((d) => d.id === 'doc-contract-a') || documents[0];
  const contractB = documents.find((d) => d.id === 'doc-contract-b') || documents[1] || documents[0];

  const differences = AIProvider.compareDocuments(contractA, contractB);

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
            Compare terms, compensation, restrictive covenants, and risk clauses across multiple contracts with source citations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20 font-mono">
          <ShieldCheck className="w-4 h-4" />
          Citation Grounded Comparison
        </div>
      </div>

      {/* Selected Documents Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-blue-400 uppercase font-semibold">DOCUMENT A (BASE REPOSITORY)</div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" />
            {contractA?.title}
          </h4>
          <p className="text-[11px] text-slate-400">{contractA?.pageCount} Pages • {contractA?.chunkCount} Chunks</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-1">
          <div className="text-[10px] font-mono text-purple-400 uppercase font-semibold">DOCUMENT B (TARGET REPOSITORY)</div>
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-400" />
            {contractB?.title}
          </h4>
          <p className="text-[11px] text-slate-400">{contractB?.pageCount} Pages • {contractB?.chunkCount} Chunks</p>
        </div>
      </div>

      {/* Differences Matrix Table */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            DETECTED CLAUSE DIFFERENCES & CONTRADICTIONS ({differences.length})
          </span>
        </div>

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
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-blue-400">
                    <span>Document A Excerpt</span>
                    <span>Page {diff.citationDocA.page}</span>
                  </div>
                  <p className="font-bold text-white">{diff.docAValue}</p>
                  <p className="text-[11px] text-slate-400 italic">"{diff.citationDocA.snippet}"</p>
                </div>

                {/* Doc B */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-purple-400">
                    <span>Document B Excerpt</span>
                    <span>Page {diff.citationDocB.page}</span>
                  </div>
                  <p className="font-bold text-white">{diff.docBValue}</p>
                  <p className="text-[11px] text-slate-400 italic">"{diff.citationDocB.snippet}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
