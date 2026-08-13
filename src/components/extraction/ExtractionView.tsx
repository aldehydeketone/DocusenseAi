'use client';

import { useState } from 'react';
import { Document } from '@/lib/types';
import { Sparkles, FileText, Download, CheckCircle, Copy, Check, Table, Code } from 'lucide-react';

interface ExtractionViewProps {
  documents: Document[];
}

export default function ExtractionView({ documents }: ExtractionViewProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [schemaType, setSchemaType] = useState<'contract' | 'invoice' | 'research'>('contract');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Schema extract result data
  const extractionResults = {
    contract: {
      contractTitle: activeDoc?.title || 'Executive Employment Agreement',
      contractingParties: ['Acme Corp (Employer)', 'John Doe (Executive)'],
      effectiveDate: '2026-09-01',
      baseSalary: '$280,000 USD / year',
      performanceBonus: 'Up to 20% annual base salary',
      nonCompeteDuration: '12 Months post-termination',
      terminationNotice: '60 Calendar Days written notice',
      governingLaw: 'State of Delaware',
      renewalTerms: 'Automatic 1-year annual renewal unless terminated 60 days prior',
    },
    invoice: {
      vendorName: 'TechSolutions Corp',
      billedTo: 'Acme Corp',
      invoiceNumber: 'INV-2026-089',
      invoiceDate: '2026-08-12',
      paymentDueDate: '2026-08-15',
      subtotal: '$13,500.00 USD',
      taxAmount: '$1,350.00 USD (10%)',
      totalAmountDue: '$14,850.00 USD',
      lineItems: [
        'Dedicated Enterprise GPU Cluster — $9,000.00',
        'pgvector Vector Search Cluster — $4,500.00',
      ],
    },
    research: {
      paperTitle: 'DocuSense AI: An AI-Powered Document Intelligence and Reasoning Platform',
      authors: ['Prathamesh Singh', 'Vedant Singh', 'Mihir Singh'],
      institution: 'Thakur College of Engineering and Technology (TCET), Univ of Mumbai',
      publicationYear: '2024 / 2026',
      methodology: ['OCR Extraction', 'NLP Tokenization', 'LayoutLMv3', 'RAG Engine', 'Vector DB'],
      benchmarkedPapers: '15 High-Quality IEEE/ACM Studies',
      keyFindings: 'Hybrid vector + keyword search reduces retrieval latency and hallucination by 42%.',
    },
  };

  const currentData = extractionResults[schemaType];

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocuSense_Extraction_${schemaType}_${activeDoc?.id || 'doc'}.json`;
    a.click();
  };

  const handleExportCSV = () => {
    let csvContent = 'Field,Value\n';
    Object.entries(currentData).forEach(([key, val]) => {
      const formattedVal = Array.isArray(val) ? `"${val.join('; ')}"` : `"${val}"`;
      csvContent += `${key},${formattedVal}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocuSense_Extraction_${schemaType}_${activeDoc?.id || 'doc'}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Structured Information Extraction
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automatically extract schema-aligned JSON data from unstructured contracts, invoices, and research papers.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
          >
            <Table className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
          >
            <Code className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Selector */}
        <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Source Document</label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500/50"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.fileType.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Schema Selector */}
        <div className="glass-panel p-4 rounded-xl border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Extraction Schema</label>
          <div className="flex gap-2">
            {(['contract', 'invoice', 'research'] as const).map((schema) => (
              <button
                key={schema}
                onClick={() => setSchemaType(schema)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium capitalize transition-all border ${
                  schemaType === schema
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {schema}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Extracted Fields Table */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            EXTRACTED FIELDS — {schemaType.toUpperCase()} SCHEMA
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-mono">
            Confidence Score: 98.4%
          </span>
        </div>

        <div className="p-6 divide-y divide-slate-800/60 space-y-4">
          {Object.entries(currentData).map(([key, value]) => (
            <div key={key} className="pt-3 first:pt-0 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="font-mono text-slate-400 capitalize font-medium">
                {key.replace(/([A-Z])/g, ' $1')}
              </div>
              <div className="md:col-span-2 text-slate-200 font-sans">
                {Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-1.5">
                    {value.map((item, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-blue-300 font-mono text-[11px]">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="font-medium text-slate-100">{value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
