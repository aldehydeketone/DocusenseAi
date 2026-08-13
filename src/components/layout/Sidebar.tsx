'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Files, 
  MessageSquare, 
  GitCompare, 
  Sparkles, 
  Search, 
  Settings, 
  Plus, 
  ShieldAlert,
  X,
  Menu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/documents', label: 'Documents', icon: Files },
  { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/dashboard/extract', label: 'Extract Data', icon: Sparkles },
  { href: '/dashboard/compare', label: 'Compare', icon: GitCompare },
  { href: '/dashboard/insights', label: 'Insights', icon: ShieldAlert },
  { href: '/dashboard/search', label: 'Search', icon: Search },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function SidebarContent({ onOpenUpload, onClose }: { onOpenUpload?: () => void; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Logo size="sm" />
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Action CTA */}
      <div className="p-3">
        <button
          onClick={() => { onOpenUpload?.(); onClose?.(); }}
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
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
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
    </div>
  );
}

export default function Sidebar({ onOpenUpload }: { onOpenUpload?: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-slate-900/95 border border-slate-800 text-slate-300 hover:text-white shadow-xl transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 glass-panel border-r border-slate-800/80 bg-slate-950/98 z-50 shadow-2xl"
          >
            <SidebarContent onOpenUpload={onOpenUpload} onClose={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:flex w-64 glass-panel border-r border-slate-800/80 bg-slate-950/95 flex-col h-screen sticky top-0 z-40">
        <SidebarContent onOpenUpload={onOpenUpload} />
      </aside>
    </>
  );
}
