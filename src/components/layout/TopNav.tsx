'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ShieldCheck, User, ChevronDown, Sparkles } from 'lucide-react';

export default function TopNav() {
  const [workspace, setWorkspace] = useState('Acme Corp Workspace');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Workspace Selector */}
      <div className="relative">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span>{workspace}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {showWorkspaceMenu && (
          <div className="absolute left-0 mt-2 w-56 glass-panel rounded-xl shadow-xl p-1.5 border border-slate-800 text-xs z-50">
            <div className="px-2 py-1.5 font-semibold text-[10px] text-slate-500 uppercase">Workspaces</div>
            <button
              onClick={() => { setWorkspace('Acme Corp Workspace'); setShowWorkspaceMenu(false); }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
            >
              Acme Corp Workspace
              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Active</span>
            </button>
            <button
              onClick={() => { setWorkspace('Legal & Compliance WS'); setShowWorkspaceMenu(false); }}
              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
            >
              Legal & Compliance WS
            </button>
          </div>
        )}
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden sm:block">
        <Link
          href="/dashboard/search"
          className="w-full flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-xs text-slate-400 transition-colors"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span>Ask questions or search across all documents...</span>
          <kbd className="ml-auto font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">⌘K</kbd>
        </Link>
      </div>

      {/* Right: Security Badge & User Avatar */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Zero-Knowledge Workspace
        </div>

        <button className="relative p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5 flex items-center justify-center text-white text-xs font-bold shadow-md">
            JD
          </div>
          <div className="hidden md:flex flex-col text-xs text-left">
            <span className="font-semibold text-slate-200">John Doe</span>
            <span className="text-[10px] text-slate-400">Workspace Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
}
