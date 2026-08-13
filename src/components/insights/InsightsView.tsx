'use client';

import { SmartInsight } from '@/lib/types';
import { ShieldAlert, Calendar, DollarSign, Users, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface InsightsViewProps {
  insights: SmartInsight[];
}

export default function InsightsView({ insights }: InsightsViewProps) {
  const dates = insights.filter((i) => i.category === 'date');
  const financial = insights.filter((i) => i.category === 'financial');
  const entities = insights.filter((i) => i.category === 'entity');
  const risks = insights.filter((i) => i.category === 'risk');

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

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category 1: Potential Risk Flags */}
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
              </div>
            ))}
          </div>
        </div>

        {/* Category 2: Important Dates & Deadlines */}
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
              </div>
            ))}
          </div>
        </div>

        {/* Category 3: Financial Figures & Totals */}
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
              </div>
            ))}
          </div>
        </div>

        {/* Category 4: Named Entities & Key People */}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
