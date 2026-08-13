'use client';

import Link from 'next/link';
import { INITIAL_SMART_INSIGHTS } from '@/lib/db/store';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import TiltCard from '@/components/reactbits/TiltCard';
import BlurText from '@/components/reactbits/BlurText';
import { motion } from 'motion/react';
import { useStore } from '@/lib/context/StoreContext';
import {
  Files,
  FileCheck,
  MessageSquare,
  ShieldAlert,
  UploadCloud,
  ArrowRight,
  Sparkles,
  GitCompare,
  ExternalLink,
  Lock,
  Search,
  TrendingUp,
} from 'lucide-react';

const KPI_CARDS = [
  { label: 'Total Documents', value: '4', badge: '100% Fully Indexed', badgeIcon: FileCheck, color: 'blue', Icon: Files, spotlight: 'rgba(59,130,246,0.12)' },
  { label: 'Indexed Chunks', value: '62', badge: 'pgvector Embeddings', badgeIcon: Sparkles, color: 'purple', Icon: Sparkles, spotlight: 'rgba(168,85,247,0.12)' },
  { label: 'AI Queries Asked', value: '128', badge: 'Zero Hallucinations', badgeIcon: MessageSquare, color: 'emerald', Icon: MessageSquare, spotlight: 'rgba(52,211,153,0.12)' },
  { label: 'Storage Usage', value: '4.9 MB', badge: 'AES-256 Isolated', badgeIcon: Lock, color: 'rose', Icon: Lock, spotlight: 'rgba(244,63,94,0.1)' },
];

const colorMap: Record<string, { icon: string; bg: string; border: string; badge: string; glow: string }> = {
  blue:    { icon: 'text-blue-400',    bg: 'bg-blue-600/15',    border: 'border-blue-500/20',    badge: 'text-blue-400',    glow: 'shadow-blue-500/10' },
  purple:  { icon: 'text-purple-400',  bg: 'bg-purple-600/15',  border: 'border-purple-500/20',  badge: 'text-purple-400',  glow: 'shadow-purple-500/10' },
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-600/15', border: 'border-emerald-500/20', badge: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  rose:    { icon: 'text-rose-400',    bg: 'bg-rose-600/15',    border: 'border-rose-500/20',    badge: 'text-rose-400',    glow: 'shadow-rose-500/10' },
};

export default function DashboardPage() {
  const { documents } = useStore();
  // Only show flagged risks for documents currently in store (not deleted)
  const activeDocIds = new Set(documents.map((d) => d.id));
  const filteredInsights = INITIAL_SMART_INSIGHTS.filter((ins) => activeDocIds.has(ins.documentId));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <AnimatedContent direction="up" delay={0}>
        <SpotlightCard
          className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl shadow-blue-950/20"
          spotlightColor="rgba(59,130,246,0.08)"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono"
              >
                <Sparkles className="w-3.5 h-3.5" /> Workspace Overview
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, John 👋
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                <BlurText text="Your document repository contains 4 ready indexed documents, 62 vector chunks, and zero-hallucination grounded RAG citation search." delay={0.3} />
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/dashboard/chat"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-blue-200" />
                  Start AI Chat
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/dashboard/compare"
                  className="px-5 py-2.5 rounded-xl glass-panel border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-xs flex items-center gap-2 transition-colors"
                >
                  <GitCompare className="w-4 h-4 text-purple-400" />
                  Compare Contracts
                </Link>
              </motion.div>
            </div>
          </div>
        </SpotlightCard>
      </AnimatedContent>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((kpi, i) => {
          const c = colorMap[kpi.color];
          const Icon = kpi.Icon;
          const BadgeIcon = kpi.badgeIcon;
          return (
            <AnimatedContent key={i} delay={0.1 + i * 0.08} direction="up">
              <TiltCard maxTilt={6}>
                <SpotlightCard
                  className={`glass-panel p-6 rounded-2xl border border-slate-800 hover:${c.border} transition-all shadow-lg ${c.glow} h-full`}
                  spotlightColor={kpi.spotlight}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-xs font-medium">{kpi.label}</span>
                      <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
                        <Icon className={`w-4 h-4 ${c.icon}`} />
                      </motion.div>
                    </div>
                    <motion.div
                      className="text-3xl font-extrabold text-white"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200 }}
                    >
                      {kpi.label === 'Total Documents' ? documents.length : kpi.value}
                    </motion.div>
                    <div className={`text-[10px] ${c.badge} font-mono flex items-center gap-1`}>
                      <BadgeIcon className="w-3 h-3" />
                      {kpi.badge}
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </AnimatedContent>
          );
        })}
      </div>

      {/* Recent Documents & Flagged Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents Table */}
        <AnimatedContent className="lg:col-span-2" direction="left" delay={0.1}>
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl h-full">
            <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Files className="w-3.5 h-3.5 text-blue-400" />
                RECENT DOCUMENTS ({documents.length})
              </h3>
              <Link href="/dashboard/documents" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/50">
              {documents.slice(0, 4).map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="p-4 hover:bg-slate-900/40 transition-colors flex items-center justify-between text-xs gap-4 group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <motion.div
                      className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 font-mono font-bold text-[10px]"
                      whileHover={{ scale: 1.1, rotate: 3 }}
                    >
                      {doc.fileType.toUpperCase()}
                    </motion.div>
                    <div className="truncate">
                      <Link
                        href={`/dashboard/documents/${doc.id}`}
                        className="font-semibold text-slate-200 hover:text-blue-400 truncate block transition-colors"
                      >
                        {doc.title}
                      </Link>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {doc.pageCount} Pages • {doc.chunkCount} Chunks • {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Link
                        href={`/dashboard/documents/${doc.id}`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent text-slate-300 hover:text-blue-400 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedContent>

        {/* Flagged Risks */}
        <AnimatedContent direction="right" delay={0.2}>
          <div className="space-y-5">
            <SpotlightCard
              className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl"
              spotlightColor="rgba(244,63,94,0.08)"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  FLAGGED RISKS ({filteredInsights.length})
                </h3>
                <Link href="/dashboard/insights" className="text-[11px] text-blue-400 hover:text-blue-300 font-mono transition-colors">
                  Details →
                </Link>
              </div>

              <div className="space-y-3">
                {filteredInsights.slice(0, 3).map((ins, i) => (
                  <motion.div
                    key={ins.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/20 text-xs space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-200">{ins.label}</span>
                      <span className="text-[10px] text-rose-400 font-mono">Pg {ins.pageNumber}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono leading-relaxed">{ins.value}</p>
                  </motion.div>
                ))}
              </div>
            </SpotlightCard>

            {/* Quick actions */}
            <AnimatedContent direction="up" delay={0.4}>
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  Quick Actions
                </h3>
                {[
                  { href: '/dashboard/chat', icon: MessageSquare, label: 'AI Document Chat', color: 'text-blue-400' },
                  { href: '/dashboard/insights', icon: Search, label: 'Risk Insights', color: 'text-rose-400' },
                  { href: '/dashboard/upload', icon: UploadCloud, label: 'Upload Document', color: 'text-emerald-400' },
                ].map(({ href, icon: Icon, label, color }, i) => (
                  <motion.div key={i} whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Link
                      href={href}
                      className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-colors py-1.5"
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                      {label}
                      <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatedContent>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
