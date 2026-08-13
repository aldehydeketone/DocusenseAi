'use client';

import { use } from 'react';
import { useStore } from '@/lib/context/StoreContext';
import DocumentViewer from '@/components/viewer/DocumentViewer';
import ChatBox from '@/components/chat/ChatBox';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { documents } = useStore();
  const doc = documents.find((d) => d.id === resolvedParams.id) || documents[0];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4">
      {/* Top Back Link */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/documents" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Documents Library
        </Link>
        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          Split Screen Mode (Canvas Viewer + AI Chat)
        </span>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left: Document Viewer (7 cols) */}
        <div className="lg:col-span-7 h-full min-h-[500px]">
          {doc ? (
            <DocumentViewer document={doc} highlightPage={1} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-xs font-mono">No document selected</span>
            </div>
          )}
        </div>

        {/* Right: AI Chat Assistant (5 cols) */}
        <div className="lg:col-span-5 h-full min-h-[500px]">
          <ChatBox documents={documents} selectedDocId={doc?.id} />
        </div>
      </div>
    </div>
  );
}
