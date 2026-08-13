'use client';

import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Files, 
  FolderKanban, 
  MessageSquare, 
  GitCompare, 
  Sparkles, 
  Search, 
  FileText, 
  Settings, 
  Plus, 
  ShieldAlert
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/documents', label: 'Documents', icon: Files },
  { href: '/dashboard/collections', label: 'Collections', icon: FolderKanban },
  { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/dashboard/extract', label: 'Extract Data', icon: Sparkles },
  { href: '/dashboard/compare', label: 'Compare', icon: GitCompare },
  { href: '/dashboard/insights', label: 'Insights', icon: ShieldAlert },
  { href: '/dashboard/search', label: 'Search', icon: Search },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onOpenUpload }: { onOpenUpload?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 bg-slate-950/95 flex flex-col h-screen sticky top-0 z-40">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Logo size="sm" />
      </div>

      {/* Upload Action CTA */}
      <div className="p-3">
        <button
          onClick={onOpenUpload}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs py-2.5 px-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 text-blue-200" />
          Upload Documents
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Main Navigation</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Storage Badge */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium mb-1">
          <span>Storage Used</span>
          <span className="text-blue-400">4.9 / 50 MB</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: '10%' }}></div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>4 Ready Documents</span>
          <span className="text-emerald-400 font-mono">100% Vector Indexed</span>
        </div>
      </div>
    </aside>
  );
}
