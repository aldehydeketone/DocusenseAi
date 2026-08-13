import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Check, ShieldCheck, Zap } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16 relative">
        
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-10 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
        </div>

        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Transparent Predictable Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Engineered for Individuals &amp; High-Scale Teams
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Transparent plans with zero hidden fees. Scale document processing volume seamlessly.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          {/* Starter Plan */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 flex flex-col justify-between hover:border-slate-700 transition-all bg-slate-900/60 backdrop-blur-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For individual analysts exploring AI document chat.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs font-mono text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 10 Documents</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 100 AI Questions / month</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Page-Level Citation Auditing</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Standard PDF &amp; TXT Support</li>
              </ul>
            </div>
            <Link href="/dashboard" className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-semibold text-xs text-center text-slate-200 block transition-all">
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan - Highlighted */}
          <div className="glass-panel p-8 rounded-3xl border-2 border-blue-500/50 relative space-y-8 flex flex-col justify-between shadow-2xl shadow-blue-500/10 bg-slate-900/90 backdrop-blur-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Pro Professional</h3>
                <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 rounded">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-xs text-slate-400">For legal professionals, researchers &amp; financial auditing.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-xs font-mono text-slate-400">/ month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-200">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Documents &amp; Repositories</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited AI Grounded RAG Queries</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Side-by-Side Contract Redline Diffing</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Structured JSON &amp; CSV Schema Export</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Smart Risk Radar &amp; Clause Flags</li>
              </ul>
            </div>
            <Link href="/dashboard" className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-center text-white block shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01]">
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8 flex flex-col justify-between hover:border-slate-700 transition-all bg-slate-900/60 backdrop-blur-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise Team</h3>
                <p className="text-xs text-slate-400 mt-1">Dedicated cloud instance, custom SLA &amp; on-premise pgvector.</p>
              </div>
              <div className="text-4xl font-extrabold text-white">Custom</div>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Private Cloud / On-Premise Instance</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Dedicated Model Fine-Tuning</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Role-Based Access Control (RBAC)</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Audit Logging &amp; SOC2 Compliance</li>
              </ul>
            </div>
            <Link href="/dashboard" className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-semibold text-xs text-center text-slate-200 block transition-all">
              Contact Sales Team
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
