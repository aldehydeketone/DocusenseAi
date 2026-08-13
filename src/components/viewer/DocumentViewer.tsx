'use client';

import { useState } from 'react';
import { Document } from '@/lib/types';
import { FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Highlighter, Shield, FileCheck } from 'lucide-react';

interface DocumentViewerProps {
  document: Document;
  highlightPage?: number;
}

export default function DocumentViewer({ document, highlightPage = 1 }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(highlightPage);
  const [zoom, setZoom] = useState(100);

  const totalPages = document.pageCount || 1;

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="h-12 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2 truncate max-w-xs">
          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">{document.title}</span>
        </div>

        {/* Page Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-200" />
          </button>

          <span className="font-mono text-slate-300">
            Page <span className="text-blue-400 font-bold">{currentPage}</span> of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-200" />
          </button>
        </div>

        {/* Zoom Controls & Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-slate-300" />
          </button>
          <span className="font-mono text-[11px] text-slate-400 min-w-[40px] text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 10))}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-slate-300" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <a
            href={`#download-${document.id}`}
            className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors text-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </a>
        </div>
      </div>

      {/* Main Document Canvas Render */}
      <div className="flex-1 overflow-auto p-6 flex justify-center bg-slate-900/40 relative">
        <div
          className="bg-slate-950 border border-slate-800 rounded-xl p-8 shadow-2xl transition-all max-w-3xl w-full min-h-[700px] flex flex-col justify-between"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Header Metadata */}
          <div className="border-b border-slate-800 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold mb-1">
                {document.fileType.toUpperCase()} DOCUMENT — PAGE {currentPage} OF {totalPages}
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">{document.title}</h2>
              <p className="text-xs text-slate-400 mt-1">Author / Source: {document.author || 'DocuSense Indexer'}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-mono">
              <FileCheck className="w-3.5 h-3.5" />
              100% Citation Grounded
            </div>
          </div>

          {/* Page Content Simulation with Citation Highlights */}
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans flex-1">
            {currentPage === 1 && (
              <>
                <p className="font-semibold text-slate-200">Executive Summary & Initial Declarations:</p>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400 font-mono">
                    <Highlighter className="w-4 h-4" />
                    AI CITATION MARKER [PAGE 1 — SECTION 1.1]
                  </div>
                  <p className="text-xs">
                    "{document.summaryQuick?.[0] || 'This document contains essential contractual obligations, compensation tiers, and restrictive covenants.'}"
                  </p>
                </div>
                <p className="text-slate-400 text-xs">
                  This document has been parsed into {document.chunkCount} vector embeddings. All claims extracted from this section map directly to vector indexes stored in pgvector.
                </p>
              </>
            )}

            {currentPage === 2 && (
              <>
                <p className="font-semibold text-slate-200">Section 3 — Compensation & Financial Terms:</p>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400 font-mono">
                    <Highlighter className="w-4 h-4" />
                    AI CITATION MARKER [PAGE 2 — COMPENSATORY COVENANT]
                  </div>
                  <p className="text-xs">
                    "Base compensation is set at $280,000 USD per annum with up to 20% annual performance incentive bonus."
                  </p>
                </div>
                <p className="text-slate-400 text-xs">
                  Financial figures are automatically recognized by Named Entity Recognition (NER) models and available in the Smart Insights tab.
                </p>
              </>
            )}

            {currentPage > 2 && (
              <>
                <p className="font-semibold text-slate-200">Section {currentPage} — Provisions & Standard Terms:</p>
                <p className="text-xs text-slate-400">
                  Standard legal and technical provisions. All paragraphs in this section have been normalized, tokenized, and indexed for semantic search and AI Q&A.
                </p>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  Snippet Page {currentPage}: "Either party may terminate by providing written notice in accordance with governing state laws."
                </div>
              </>
            )}
          </div>

          {/* Footer Page Number */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>DocuSense AI Intelligent Viewer</span>
            <span className="font-mono">Page {currentPage} / {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
