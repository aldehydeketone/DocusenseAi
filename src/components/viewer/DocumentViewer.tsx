'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Document } from '@/lib/types';
import {
  FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Download, Highlighter, FileCheck, Search, X, ChevronUp, ChevronDown,
} from 'lucide-react';

interface DocumentViewerProps {
  document: Document;
  highlightPage?: number;
}

// ── Per-page "raw" text content used for searching ──────────────────────────
function getPageContent(document: Document, page: number): string {
  if (page === 1) {
    return [
      'Executive Summary & Initial Declarations:',
      document.summaryQuick?.[0] ||
        'This document contains essential contractual obligations, compensation tiers, and restrictive covenants.',
      `This document has been parsed into ${document.chunkCount} vector embeddings. All claims extracted from this section map directly to vector indexes stored in pgvector.`,
    ].join(' ');
  }
  if (page === 2) {
    return [
      'Section 3 — Compensation & Financial Terms:',
      'Base compensation is set at $280,000 USD per annum with up to 20% annual performance incentive bonus.',
      'Financial figures are automatically recognized by Named Entity Recognition (NER) models and available in the Smart Insights tab.',
    ].join(' ');
  }
  return [
    `Section ${page} — Provisions & Standard Terms:`,
    'Standard legal and technical provisions. All paragraphs in this section have been normalized, tokenized, and indexed for semantic search and AI Q&A.',
    `Snippet Page ${page}: "Either party may terminate by providing written notice in accordance with governing state laws."`,
  ].join(' ');
}

// ── Highlight helper: wraps matched query in <mark> spans ──────────────────
function HighlightedText({
  text,
  query,
  currentMatchIdx,
  pageMatchStart,      // index of first global match that belongs to this page
}: {
  text: string;
  query: string;
  currentMatchIdx: number;
  pageMatchStart: number;
}) {
  if (!query.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  let localIdx = -1;

  return (
    <>
      {parts.map((part, i) => {
        if (regex.test(part)) {
          localIdx++;
          const globalIdx = pageMatchStart + localIdx;
          const isCurrent = globalIdx === currentMatchIdx;
          return (
            <mark
              key={i}
              data-match-idx={globalIdx}
              className={`rounded px-0.5 font-semibold transition-colors ${
                isCurrent
                  ? 'bg-orange-400 text-slate-900'
                  : 'bg-yellow-300 text-slate-900'
              }`}
            >
              {part}
            </mark>
          );
        }
        // Reset regex lastIndex between test calls
        regex.lastIndex = 0;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function DocumentViewer({ document, highlightPage = 1 }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(highlightPage);
  const [zoom, setZoom] = useState(100);

  // ── Search State ────────────────────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalPages = document.pageCount || 1;

  // ── Build per-page match info ───────────────────────────────────────────
  const pageMatchCounts: number[] = [];
  let totalMatches = 0;

  if (searchQuery.trim()) {
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    for (let p = 1; p <= totalPages; p++) {
      const content = getPageContent(document, p);
      const matches = content.match(regex) || [];
      pageMatchCounts.push(matches.length);
      totalMatches += matches.length;
    }
  }

  // pageMatchStart[p-1] = global index of the first match on page p
  const pageMatchStart: number[] = [];
  let acc = 0;
  for (let p = 0; p < totalPages; p++) {
    pageMatchStart.push(acc);
    acc += pageMatchCounts[p] || 0;
  }

  // ── Auto-jump to page of currentMatchIdx ───────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim() || totalMatches === 0) return;
    let runningTotal = 0;
    for (let p = 0; p < totalPages; p++) {
      runningTotal += pageMatchCounts[p] || 0;
      if (currentMatchIdx < runningTotal) {
        setCurrentPage(p + 1);
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMatchIdx, searchQuery]);

  // ── Scroll current match into view ────────────────────────────────────
  useEffect(() => {
    if (!contentRef.current) return;
    const mark = contentRef.current.querySelector(`[data-match-idx="${currentMatchIdx}"]`);
    if (mark) mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentMatchIdx, currentPage]);

  // ── Keyboard shortcut: Ctrl+F / Cmd+F ────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Focus input when search bar opens ────────────────────────────────
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  // ── Navigate matches ─────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (totalMatches === 0) return;
    setCurrentMatchIdx((i) => (i + 1) % totalMatches);
  }, [totalMatches]);

  const goPrev = useCallback(() => {
    if (totalMatches === 0) return;
    setCurrentMatchIdx((i) => (i - 1 + totalMatches) % totalMatches);
  }, [totalMatches]);

  // Reset match index when query changes
  useEffect(() => {
    setCurrentMatchIdx(0);
  }, [searchQuery]);

  // Handle Enter / Shift+Enter in search box
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.shiftKey ? goPrev() : goNext();
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  // ── Current page's match count & start ───────────────────────────────
  const thisPageStart = pageMatchStart[currentPage - 1] ?? 0;

  // ── Render page content ───────────────────────────────────────────────
  function renderPage() {
    const highlightProps = {
      query: searchQuery,
      currentMatchIdx,
      pageMatchStart: thisPageStart,
    };

    if (currentPage === 1) {
      const summary =
        document.summaryQuick?.[0] ||
        'This document contains essential contractual obligations, compensation tiers, and restrictive covenants.';
      const footer = `This document has been parsed into ${document.chunkCount} vector embeddings. All claims extracted from this section map directly to vector indexes stored in pgvector.`;
      return (
        <>
          <p className="font-semibold text-slate-200">
            <HighlightedText text="Executive Summary & Initial Declarations:" {...highlightProps} />
          </p>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 font-mono">
              <Highlighter className="w-4 h-4" />
              AI CITATION MARKER [PAGE 1 — SECTION 1.1]
            </div>
            <p className="text-xs">
              &ldquo;<HighlightedText text={summary} {...highlightProps} />&rdquo;
            </p>
          </div>
          <p className="text-slate-400 text-xs">
            <HighlightedText text={footer} {...highlightProps} />
          </p>
        </>
      );
    }

    if (currentPage === 2) {
      const comp =
        'Base compensation is set at $280,000 USD per annum with up to 20% annual performance incentive bonus.';
      const ner =
        'Financial figures are automatically recognized by Named Entity Recognition (NER) models and available in the Smart Insights tab.';
      return (
        <>
          <p className="font-semibold text-slate-200">
            <HighlightedText text="Section 3 — Compensation & Financial Terms:" {...highlightProps} />
          </p>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 font-mono">
              <Highlighter className="w-4 h-4" />
              AI CITATION MARKER [PAGE 2 — COMPENSATORY COVENANT]
            </div>
            <p className="text-xs">
              &ldquo;<HighlightedText text={comp} {...highlightProps} />&rdquo;
            </p>
          </div>
          <p className="text-slate-400 text-xs">
            <HighlightedText text={ner} {...highlightProps} />
          </p>
        </>
      );
    }

    const heading = `Section ${currentPage} — Provisions & Standard Terms:`;
    const body =
      'Standard legal and technical provisions. All paragraphs in this section have been normalized, tokenized, and indexed for semantic search and AI Q&A.';
    const snippet = `Snippet Page ${currentPage}: "Either party may terminate by providing written notice in accordance with governing state laws."`;
    return (
      <>
        <p className="font-semibold text-slate-200">
          <HighlightedText text={heading} {...highlightProps} />
        </p>
        <p className="text-xs text-slate-400">
          <HighlightedText text={body} {...highlightProps} />
        </p>
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <HighlightedText text={snippet} {...highlightProps} />
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="h-12 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
        <div className="flex items-center gap-2 truncate max-w-xs">
          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">{document.title}</span>
        </div>

        {/* Page Nav */}
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

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* 🔍 Search toggle */}
          <button
            onClick={() => {
              setSearchOpen((v) => !v);
              if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            title="Search in document (Ctrl+F)"
            className={`p-1.5 rounded-lg transition-colors ${
              searchOpen
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

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

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          <a
            href={`#download-${document.id}`}
            className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors text-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </a>
        </div>
      </div>

      {/* ── Search Bar (collapsible) ─────────────────────────────────────── */}
      {searchOpen && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs shrink-0">
          <Search className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder='Search in document… (Enter = next, Shift+Enter = prev)'
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 outline-none text-xs font-mono min-w-0"
            spellCheck={false}
          />

          {/* Match counter */}
          {searchQuery.trim() && (
            <span className="font-mono text-slate-400 shrink-0 text-[11px]">
              {totalMatches === 0 ? (
                <span className="text-red-400">No matches</span>
              ) : (
                <span>
                  <span className="text-orange-400 font-bold">{currentMatchIdx + 1}</span>
                  {' / '}
                  <span className="text-slate-300">{totalMatches}</span>
                </span>
              )}
            </span>
          )}

          {/* Prev / Next arrows */}
          <button
            onClick={goPrev}
            disabled={totalMatches === 0}
            title="Previous match (Shift+Enter)"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5 text-slate-300" />
          </button>
          <button
            onClick={goNext}
            disabled={totalMatches === 0}
            title="Next match (Enter)"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
          </button>

          {/* Close */}
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Main Canvas ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-6 flex justify-center bg-slate-900/40 relative">
        <div
          ref={contentRef}
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

          {/* Page Content */}
          <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-sans flex-1">
            {renderPage()}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>DocuSense AI Intelligent Viewer</span>
            <span className="font-mono">Page {currentPage} / {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
