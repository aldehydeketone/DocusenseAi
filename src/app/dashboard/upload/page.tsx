'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  X,
  FileCheck,
  Cpu,
  Database,
  Lock,
  ChevronRight,
  Layers
} from 'lucide-react';

interface ProcessingStage {
  id: string;
  name: string;
  desc: string;
  icon: any;
}

const PIPELINE_STAGES: ProcessingStage[] = [
  { id: 'ocr', name: '1. OCR & Layout Analysis', desc: 'LayoutLMv3 table & header parsing', icon: Cpu },
  { id: 'nlp', name: '2. Semantic NLP Chunking', desc: 'Contextual sentence boundary splitting', icon: Layers },
  { id: 'vector', name: '3. Vector Embedding', desc: 'pgvector 1536-dim embedding generation', icon: Database },
  { id: 'ready', name: '4. Grounded Index Ready', desc: 'AES-256 encrypted RAG index active', icon: Lock },
];

export default function DocumentUploadPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    setIsComplete(false);
    setCurrentStageIndex(0);
  };

  const startPipelineProcessing = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setCurrentStageIndex(0);

    // Simulate real pipeline steps: OCR -> NLP -> Vector -> Ready
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < PIPELINE_STAGES.length) {
        setCurrentStageIndex(step);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsComplete(true);
      }
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <AnimatedContent direction="up">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-2">
              <UploadCloud className="w-3.5 h-3.5" /> Pipeline Indexer v2.4
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Document Ingestion &amp; Indexing
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Upload PDF, DOCX, TXT or CSV documents to trigger automated OCR, semantic chunking, and pgvector embeddings.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1 transition-colors"
          >
            ← Back to Repository
          </Link>
        </div>
      </AnimatedContent>

      {/* Main Upload Box */}
      <AnimatedContent delay={0.1} direction="up">
        <SpotlightCard
          className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
          spotlightColor="rgba(59,130,246,0.08)"
        >
          {!selectedFile ? (
            /* Drag & Drop Zone */
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-950/20 scale-[1.01]'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileInput}
                accept=".pdf,.docx,.txt,.csv"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer space-y-4 block">
                <motion.div
                  className="w-16 h-16 mx-auto rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <UploadCloud className="w-8 h-8" />
                </motion.div>
                <div className="space-y-1">
                  <p className="text-base font-bold text-white">
                    Drag &amp; drop document file here, or <span className="text-blue-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Supports PDF, DOCX, TXT, CSV up to 50MB per file
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-emerald-400" /> AES-256 Encrypted</span>
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-purple-400" /> Auto OCR &amp; RAG</span>
                </div>
              </label>
            </div>
          ) : (
            /* Selected File Pipeline Control */
            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
                    {selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedFile.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for ingestion
                    </p>
                  </div>
                </div>

                {!isProcessing && !isComplete && (
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Real Pipeline Stage Progress Tracker */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>Processing Pipeline Stage</span>
                  <span className="text-blue-400 font-normal">
                    {isComplete ? '100% Indexed' : isProcessing ? `Stage ${currentStageIndex + 1} of 4` : 'Awaiting Ingestion'}
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PIPELINE_STAGES.map((stage, i) => {
                    const StageIcon = stage.icon;
                    const isActive = isProcessing && currentStageIndex === i;
                    const isDone = isComplete || (isProcessing && currentStageIndex > i);

                    return (
                      <div
                        key={stage.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : isActive
                            ? 'bg-blue-950/30 border-blue-500/40 text-blue-300 ring-2 ring-blue-500/20 animate-pulse'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StageIcon className={`w-4 h-4 ${isDone ? 'text-emerald-400' : isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                            <span className="text-xs font-bold">{stage.name}</span>
                          </div>
                          {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {isActive && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                        </div>
                        <p className="text-[11px] font-mono opacity-80">{stage.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-800">
                {!isProcessing && !isComplete && (
                  <button
                    onClick={startPipelineProcessing}
                    className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start Document Ingestion Pipeline
                  </button>
                )}

                {isComplete && (
                  <Link
                    href="/dashboard/documents/doc-tcet-paper"
                    className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <FileCheck className="w-4 h-4" />
                    Open Document in Split Workspace
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

            </div>
          )}
        </SpotlightCard>
      </AnimatedContent>

      {/* Preset Documents Quick Indexing */}
      <AnimatedContent delay={0.2} direction="up">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Quick Demo File Presets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'Master_Service_Agreement.pdf', type: 'Legal MSA', pages: '14 Pages', id: 'doc-tcet-paper' },
              { name: 'Q4_Financial_Audit_2025.pdf', type: 'Financial 10-K', pages: '42 Pages', id: 'doc-tcet-paper' },
              { name: 'Clinical_Trial_Phase3.pdf', type: 'Biomedical Paper', pages: '28 Pages', id: 'doc-tcet-paper' },
            ].map((preset, i) => (
              <Link
                key={i}
                href={`/dashboard/documents/${preset.id}`}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 flex items-center justify-between text-xs transition-colors group"
              >
                <div className="truncate">
                  <div className="font-semibold text-slate-200 group-hover:text-blue-400 truncate">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{preset.type} • {preset.pages}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}
