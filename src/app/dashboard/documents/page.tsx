'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/context/StoreContext';
import { Files, FileText, Search, ExternalLink, Plus, Filter, Trash2, CheckCircle2 } from 'lucide-react';

export default function DocumentsPage() {
  const { documents, deleteDocument } = useStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDocs = documents.filter((doc) => {
    const matchesType = filterType === 'all' || doc.fileType === filterType;
    const matchesQuery = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const handleDelete = (id: string) => {
    deleteDocument(id);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Files className="w-5 h-5 text-blue-400" />
            Document Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage, inspect, and analyze all indexed PDF, DOCX, TXT, and CSV files in your workspace.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all group shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full uppercase">
                  {doc.fileType}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Indexed
                </span>
              </div>

              <Link href={`/dashboard/documents/${doc.id}`} className="block">
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2">
                  {doc.title}
                </h3>
              </Link>

              <p className="text-[11px] text-slate-400 font-mono">
                {doc.pageCount} Pages • {doc.chunkCount} Vector Chunks • {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
              </p>

              {doc.summaryTldr && (
                <p className="text-xs text-slate-400 italic line-clamp-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  "{doc.summaryTldr}"
                </p>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  title="Permanently Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link
                  href={`/dashboard/documents/${doc.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-xl shadow-md transition-colors"
                >
                  Inspect
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
