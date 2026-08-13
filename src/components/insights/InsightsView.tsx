'use client';

import { useState } from 'react';
import { SmartInsight, Document } from '@/lib/types';
import { ShieldAlert, Calendar, DollarSign, Users, AlertTriangle, FileText, ChevronDown } from 'lucide-react';

interface InsightsViewProps {
  insights: SmartInsight[];
  documents?: Document[];
}

export default function InsightsView({ insights, documents = [] }: InsightsViewProps) {
  // Default to 'all' to show all, or filter by document ID
  const [selectedDocId, setSelectedDocId] = useState<string>('all');

  const filteredInsights = selectedDocId === 'all'
    ? insights
    : insights.filter((i) => i.documentId === selectedDocId);

  const dates = filteredInsights.filter((i) => i.category === 'date');
  const financial = filteredInsights.filter((i) => i.category === 'financial');
  const entities = filteredInsights.filter((i) => i.category === 'entity');
  const risks = filteredInsights.filter((i) => i.category === 'risk');

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300">AI Risk & Insight Disclosure:</span>
          <p className="text-[11px] text-amber-200/80 leading-relaxed">
            DocuSense AI automatically flags dates, financial terms, entities, and potential risk clauses as informational suggestions. Always verify flagged obligations with licensed legal or financial counsel.
          </p>
        </div>
      </div>

      {/* Document Filter Selector */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Insights by Document:</span>
        </div>
        <div className="relative flex-1 max-w-sm">
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 hover:border-blue-500/40 focus:border-blue-500/60 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none appearance-none pr-8 transition-colors"
          >
            <option value="all">All Documents ({insights.length} insights)</option>
            {documents.map((doc) => {
              const count = insights.filter((i) => i.documentId === doc.id).length;
              return (
                <option key={doc.id} value={doc.id}>
                  {doc.title} ({count} insights)
                </option>
              );
            })}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
        </div>
        <span className="text-[11px] text-slate-500 font-mono shrink-0">
          Showing {filteredInsights.length} insight{filteredInsights.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filteredInsights.length === 0 ? (
        <div className="glass-panel rounded-2xl border border-slate-800 p-12 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">No insights found for selected document.</p>
          <p className="text-xs text-slate-600">Try selecting a different document or 'All Documents'.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category 1: Potential Risk Flags */}
          {risks.length > 0 && (
            <div className="glass-panel rounded-2xl border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Flagged Risk Clauses ({risks.length})
                </h3>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  High Severity
                </span>
              </div>
              <div className="space-y-3">
                {risks.map((risk) => (
                  <div key={risk.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300">{risk.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Page {risk.pageNumber}</span>
                    </div>
                    <div className="text-slate-200 font-semibold">{risk.value}</div>
                    <p className="text-[11px] text-slate-400 italic">"{risk.contextSnippet}"</p>
                    <div className="text-[10px] text-slate-500 font-mono">{risk.documentTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category 2: Important Dates */}
          {dates.length > 0 && (
            <div className="glass-panel rounded-2xl border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Important Dates & Deadlines ({dates.length})
                </h3>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Temporal Anchors
                </span>
              </div>
              <div className="space-y-3">
                {dates.map((date) => (
                  <div key={date.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-300">{date.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Page {date.pageNumber}</span>
                    </div>
                    <div className="text-slate-200 font-semibold font-mono text-xs">{date.value}</div>
                    <p className="text-[11px] text-slate-400 italic">"{date.contextSnippet}"</p>
                    <div className="text-[10px] text-slate-500 font-mono">{date.documentTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category 3: Financial Figures */}
          {financial.length > 0 && (
            <div className="glass-panel rounded-2xl border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Financial Information ({financial.length})
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Monetary Values
                </span>
              </div>
              <div className="space-y-3">
                {financial.map((fin) => (
                  <div key={fin.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300">{fin.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Page {fin.pageNumber}</span>
                    </div>
                    <div className="text-emerald-400 font-bold font-mono text-sm">{fin.value}</div>
                    <p className="text-[11px] text-slate-400 italic">"{fin.contextSnippet}"</p>
                    <div className="text-[10px] text-slate-500 font-mono">{fin.documentTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category 4: Named Entities */}
          {entities.length > 0 && (
            <div className="glass-panel rounded-2xl border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Entities & Authors ({entities.length})
                </h3>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  NER Extraction
                </span>
              </div>
              <div className="space-y-3">
                {entities.map((ent) => (
                  <div key={ent.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-300">{ent.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Page {ent.pageNumber}</span>
                    </div>
                    <div className="text-slate-200 font-semibold">{ent.value}</div>
                    <p className="text-[11px] text-slate-400 italic">"{ent.contextSnippet}"</p>
                    <div className="text-[10px] text-slate-500 font-mono">{ent.documentTitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
