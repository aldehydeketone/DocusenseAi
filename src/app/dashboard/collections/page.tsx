'use client';

import { INITIAL_COLLECTIONS } from '@/lib/db/store';
import { FolderKanban, Plus, MessageSquare, Files, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-400" />
            Document Collections
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Group related documents into collections and chat with an entire collection simultaneously.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all">
          <Plus className="w-4 h-4" /> Create Collection
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_COLLECTIONS.map((col) => (
          <div key={col.id} className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4 flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-xl">
            <div className="space-y-3">
              <span className={`inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${col.color}`}>
                {col.documentCount} Documents
              </span>
              <h3 className="font-bold text-base text-white">{col.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{col.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Created {new Date(col.createdAt).toLocaleDateString()}</span>
              <Link
                href="/dashboard/chat"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat Collection
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
