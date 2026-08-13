'use client';

import { useState, useRef } from 'react';
import { ProcessingPipeline } from '@/lib/processing/pipeline';
import { Document, ProcessingStatus } from '@/lib/types';
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: Document) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus>('uploading');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startProcessing(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startProcessing(e.target.files[0]);
    }
  };

  const startProcessing = async (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    setProgress(10);
    setStatus('uploading');

    try {
      const processedDoc = await ProcessingPipeline.processDocument(
        { name: file.name, size: file.size, type: file.type },
        (currentStatus, currentProgress) => {
          setStatus(currentStatus);
          setProgress(currentProgress);
        }
      );

      setTimeout(() => {
        onUploadSuccess(processedDoc);
        setIsProcessing(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error('Processing failed:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg glass-panel border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            Upload & Index Documents
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Drag & drop PDF, DOCX, TXT, CSV, or Image documents to automatically parse and vector index.
          </p>
        </div>

        {!isProcessing ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleChange}
              accept=".pdf,.docx,.txt,.csv,.png,.jpg,.jpeg"
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-lg shadow-blue-500/10">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              Click to upload or drag & drop file
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF, DOCX, TXT, CSV, PNG, JPG (Max 50MB per file)
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              <div className="flex-1 truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{fileName}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 capitalize">
                  Pipeline Status: <span className="text-blue-400">{status.replace('_', ' ')}</span>
                </p>
              </div>
              <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Indexing Progress</span>
                <span className="text-blue-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Pipeline Steps Indicator */}
            <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-center">
              <div className={`p-2 rounded-lg border ${progress >= 20 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                1. Text Extract
              </div>
              <div className={`p-2 rounded-lg border ${progress >= 50 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                2. Semantic Chunk
              </div>
              <div className={`p-2 rounded-lg border ${progress >= 80 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                3. Vector Embed
              </div>
              <div className={`p-2 rounded-lg border ${progress >= 100 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                4. Ready
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
