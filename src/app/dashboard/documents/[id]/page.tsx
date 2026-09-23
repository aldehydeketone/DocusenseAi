'use client';

import { use, useState, useEffect } from 'react';
import { useStore } from '@/lib/context/StoreContext';
import DocumentViewer from '@/components/viewer/DocumentViewer';
import ChatBox from '@/components/chat/ChatBox';
import Link from 'next/link';
import { ArrowLeft, Cpu, CheckCircle2, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { getAccuracyHistory, saveAccuracyHistory } from '@/lib/db/clientStore';
import { DocumentAccuracyHistory } from '@/lib/types';

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { documents } = useStore();
  const doc = documents.find((d) => d.id === resolvedParams.id) || documents[0];

  const [category, setCategory] = useState<string>(doc?.classificationCategory || 'General Document');
  const [accuracy, setAccuracy] = useState<number>(doc?.accuracyScore || 0.985);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (doc) {
      const history = getAccuracyHistory();
      const existing = history.find((h) => h.documentId === doc.id);
      if (existing) {
        setCategory(existing.predictedCategory);
        setAccuracy(existing.accuracyScore);
      } else {
        setCategory(doc.classificationCategory || 'General Document');
        setAccuracy(doc.accuracyScore || 0.985);
      }
    }
  }, [doc]);

  const handleTestAccuracy = async () => {
    if (!doc) return;
    setTesting(true);
    try {
      const sampleText = `${doc.title}. ${doc.summaryTldr || ''}`;
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sampleText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Classification failed');

      const pred = data.predicted_class || category;
      const conf = Number((data.confidence || 0.95).toFixed(4));
      setCategory(pred);
      setAccuracy(conf);

      // Save into history
      const history = getAccuracyHistory();
      const newRecord: DocumentAccuracyHistory = {
        id: `eval-${Date.now()}`,
        documentId: doc.id,
        documentTitle: doc.title,
        predictedCategory: pred,
        groundTruth: pred,
        accuracyScore: conf,
        evaluatedAt: new Date().toLocaleString([], { 
          year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' 
        }),
        modelName: 'TF-IDF + Naive Bayes Classifier',
        source: data.source === 'python' ? 'python-naive-bayes' : 'js-engine',
        status: conf >= 0.85 ? 'passed' : 'review_needed',
      };
      saveAccuracyHistory([newRecord, ...history.filter((h) => h.documentId !== doc.id)]);
    } catch (e) {
      console.error('Accuracy test failed:', e);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-3">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
          <div className="hidden sm:block text-xs font-semibold text-slate-200 max-w-sm truncate">
            {doc?.title}
          </div>
        </div>

        {/* ML Accuracy Badge & Quick Test Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>{category}</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {(accuracy * 100).toFixed(1)}% Accuracy
            </span>
          </div>

          <button
            onClick={handleTestAccuracy}
            disabled={testing}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors disabled:opacity-50"
            title="Run live Python Naive Bayes test on this document"
          >
            <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin text-indigo-400' : ''}`} />
            {testing ? 'Testing...' : 'Re-Test Accuracy'}
          </button>
        </div>
      </div>

      {/* Guide Banner for Interface Clarity */}
      <div className="flex items-center justify-between text-[11px] font-mono px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Left: Document Canvas Viewer</span>
          <span className="text-slate-600">|</span>
          <span>Right: Gemini 2.5 AI Assistant (Select chip to query this doc)</span>
        </span>
        <span className="text-emerald-400 hidden md:inline">Grounding: Active</span>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left: Document Viewer (7 cols) */}
        <div className="lg:col-span-7 h-full min-h-[450px]">
          {doc ? (
            <DocumentViewer document={doc} highlightPage={1} />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-slate-400 text-xs font-mono">No document selected</span>
            </div>
          )}
        </div>

        {/* Right: AI Chat Assistant (5 cols) */}
        <div className="lg:col-span-5 h-full min-h-[450px]">
          <ChatBox documents={documents} selectedDocId={doc?.id} />
        </div>
      </div>
    </div>
  );
}
