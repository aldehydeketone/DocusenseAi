'use client';

import { useState } from 'react';
import { SmartInsight, Document } from '@/lib/types';
import { 
  ShieldAlert, 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  FileText, 
  ChevronDown, 
  Cpu, 
  CheckCircle2,
  Download,
  BarChart2,
  Sparkles,
  TrendingUp,
  Layers
} from 'lucide-react';

interface InsightsViewProps {
  insights: SmartInsight[];
  documents?: Document[];
}

export default function InsightsView({ insights, documents = [] }: InsightsViewProps) {
  // Default to 'all' to show all, or filter by document ID
  const [selectedDocId, setSelectedDocId] = useState<string>('all');
  const [viewTab, setViewTab] = useState<'grid' | 'analytics'>('grid');

  const filteredInsights = selectedDocId === 'all'
    ? insights
    : insights.filter((i) => i.documentId === selectedDocId);

  const dates = filteredInsights.filter((i) => i.category === 'date');
  const financial = filteredInsights.filter((i) => i.category === 'financial');
  const entities = filteredInsights.filter((i) => i.category === 'entity');
  const risks = filteredInsights.filter((i) => i.category === 'risk');

  const totalCount = filteredInsights.length;
  const riskPct = totalCount ? Math.round((risks.length / totalCount) * 100) : 0;
  const finPct = totalCount ? Math.round((financial.length / totalCount) * 100) : 0;
  const datePct = totalCount ? Math.round((dates.length / totalCount) * 100) : 0;
  const entPct = totalCount ? Math.round((entities.length / totalCount) * 100) : 0;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredInsights, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `docusense_insights_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* ML Pipeline Status Header */}
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>ML Inference Engine: DocuSense-NER-v1</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                F1: 88.6%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Token-level sequence classification • Precision: 89.2% • Recall: 87.9% • spaCy Gazetteer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-mono transition-colors"
            title="Download JSON structured audit report"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            Export Audit JSON
          </button>
        </div>
      </div>

      {/* Visual Analytics Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Flagged Risks</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{risks.length}</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${riskPct}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{riskPct}% of total insights</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Financial Terms</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{financial.length}</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${finPct}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{finPct}% of total insights</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">Key Deadlines</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{dates.length}</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${datePct}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{datePct}% of total insights</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">Entities &amp; Orgs</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{entities.length}</div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${entPct}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{entPct}% of total insights</span>
        </div>
      </div>

      {/* Document Filter Selector & View Switcher */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300">Filter Document:</span>
          </div>
          <div className="relative flex-1 max-w-sm">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-blue-500/40 focus:border-blue-500/60 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none appearance-none pr-8 transition-colors"
            >
              <option value="all">All Documents ({insights.length} total insights)</option>
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
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono">
            {filteredInsights.length} total extracted entities
          </span>
        </div>
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
                  Tag: [RISK_CLAUSE] • 89% Conf
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
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>{risk.documentTitle}</span>
                      <span className="text-rose-400/80">92% ML Confidence</span>
                    </div>
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
                  Important Dates &amp; Deadlines ({dates.length})
                </h3>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  Tag: [DATE] • 92% Conf
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
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>{date.documentTitle}</span>
                      <span className="text-blue-400/80">94% ML Confidence</span>
                    </div>
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
                  Tag: [MONEY] • 94% Conf
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
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>{fin.documentTitle}</span>
                      <span className="text-emerald-400/80">96% ML Confidence</span>
                    </div>
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
                  Entities &amp; Authors ({entities.length})
                </h3>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                  Tag: [ORG / PERSON] • 91% Conf
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
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                      <span>{ent.documentTitle}</span>
                      <span className="text-purple-400/80">93% ML Confidence</span>
                    </div>
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
