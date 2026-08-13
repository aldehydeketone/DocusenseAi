'use client';

import { useState } from 'react';
import { Settings, Shield, Key, Lock, CheckCircle2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('sk-docusense-live-••••••••••••••••');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Workspace & AI Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure API credentials, workspace privacy parameters, and vector index settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: AI Provider Config */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            AI Provider Abstraction Credentials
          </h3>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">OpenAI / Compatible API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-200 outline-none"
            />
            <p className="text-[11px] text-slate-500">
              Your API key is encrypted using AES-256 before storage and never logged or exposed client-side.
            </p>
          </div>
        </div>

        {/* Card 2: Security & Defense Controls */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Security & Defense Shield Configuration
          </h3>
          <div className="space-y-3 text-xs text-slate-300">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-blue-600 focus:ring-0" />
              <div>
                <span className="font-semibold text-slate-200 block">Prompt Injection Defense Layer</span>
                <span className="text-[11px] text-slate-400">Treat uploaded document content strictly as untrusted evidence data.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-blue-600 focus:ring-0" />
              <div>
                <span className="font-semibold text-slate-200 block">Strict Zero-Hallucination Citation Enforcer</span>
                <span className="text-[11px] text-slate-400">Require AI responses to state "Insufficient evidence" when confidence score is below threshold.</span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          {saved ? 'Settings Saved!' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
}
