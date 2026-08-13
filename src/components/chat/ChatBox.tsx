'use client';

import { useState } from 'react';
import { Document, Message, Citation } from '@/lib/types';
import { AIProvider } from '@/lib/ai/provider';
import { 
  Send, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Bot, 
  User, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

interface ChatBoxProps {
  documents: Document[];
  selectedDocId?: string;
}

export default function ChatBox({ documents, selectedDocId }: ChatBoxProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>(selectedDocId ? [selectedDocId] : []);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      conversationId: 'conv-default',
      sender: 'assistant',
      content: 'Welcome to DocuSense AI Document Chat! Ask any question about your uploaded documents, contracts, research papers, or invoices. Every answer is grounded strictly in source content with page-level citations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: [
        'Summarize the key findings in the TCET paper',
        'Compare base salary and non-compete clauses',
        'What are the upcoming invoice due dates?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      conversationId: 'conv-default',
      sender: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const ragResult = await AIProvider.queryDocuments(queryText, selectedDocs);

      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        conversationId: 'conv-default',
        sender: 'assistant',
        content: ragResult.answer,
        citations: ragResult.citations,
        suggestedFollowups: ragResult.suggestedFollowups,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleDocSelection = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header & Document Context Picker */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                DocuSense RAG Assistant
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Grounded
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Zero-hallucination vector retrieval with citations</p>
            </div>
          </div>
        </div>

        {/* Document Selection Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] text-slate-400 font-semibold mr-1 shrink-0">Context:</span>
          <button
            onClick={() => setSelectedDocs([])}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 ${
              selectedDocs.length === 0
                ? 'bg-blue-600 text-white font-semibold shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Documents ({documents.length})
          </button>
          {documents.map((doc) => {
            const isSelected = selectedDocs.includes(doc.id);
            return (
              <button
                key={doc.id}
                onClick={() => toggleDocSelection(doc.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 shrink-0 max-w-[200px] truncate ${
                  isSelected
                    ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <FileText className="w-3 h-3 text-slate-400" />
                <span className="truncate">{doc.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md'
                  : 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className="space-y-2 flex-1">
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-lg rounded-tr-none'
                    : 'glass-panel border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3" /> Grounded Source Citations ({msg.citations.length})
                    </div>
                    <div className="space-y-1.5">
                      {msg.citations.map((cit, idx) => (
                        <div
                          key={cit.id}
                          className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 text-[11px] text-slate-300 hover:border-blue-500/40 transition-colors group"
                        >
                          <div className="flex items-center justify-between font-medium text-slate-200 mb-1">
                            <span className="text-blue-400 font-bold font-mono">
                              [{idx + 1}] {cit.documentTitle}
                            </span>
                            <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded font-mono">
                              Page {cit.pageNumber} • {Math.round(cit.confidence * 100)}% match
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 italic line-clamp-2">"{cit.snippet}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Toolbar for Assistant Message */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center gap-3 text-[10px] text-slate-400 px-1">
                  <span>{msg.timestamp}</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    {copiedId === msg.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}

              {/* Suggested Follow-ups */}
              {msg.suggestedFollowups && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedFollowups.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSend(sug)}
                      className="text-[11px] bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-slate-800 hover:border-blue-500/40 px-3 py-1 rounded-full transition-all text-left"
                    >
                      💡 {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl glass-panel text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              Searching vector chunks & generating grounded response...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formInput = form.querySelector('input') as HTMLInputElement;
            const val = formInput?.value || input;
            if (val) handleSend(val);
          }}
          className="flex items-center gap-2"
        >
          <input
            name="query"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about selected documents..."
            className="flex-1 bg-slate-950 border border-slate-800 focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Prompt Injection Defensive Shield Active
          </span>
          <span>DocuSense AI RAG v2.4</span>
        </div>
      </div>
    </div>
  );
}
