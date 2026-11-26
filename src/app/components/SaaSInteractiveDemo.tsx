'use client';

import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  SparklesIcon,
  DocumentCheckIcon,
  TableCellsIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ServerIcon,
  CpuChipIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type TabId = 'dashboard' | 'ai-review' | 'evidence' | 'registers';

export default function SaaSInteractiveDemo() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'overridden'>('pending');
  const [activeRiskFilter, setActiveRiskFilter] = useState<'all' | 'high' | 'critical'>('all');

  return (
    <section id="interactive-demo" className="py-20 bg-[#05080F] border-y border-white/5 relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono font-semibold text-[#00F0FF] mb-3">
            <span>[INTERACTIVE_SAAS_TOUR]</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <span>Zero-Risk Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Test Drive the Platform &mdash; Seeded with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#C664FF]">
              Meridian Gulf Holdings
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400">
            Explore the exact unified compliance views, Corrective RAG review gates, and statutory registers evaluated by GCC enterprise CISOs and regulatory auditors.
          </p>
        </div>

        {/* Mockup SaaS App Window */}
        <div className="rounded-2xl border border-white/10 bg-[#0A0F1A] shadow-2xl shadow-black/80 overflow-hidden">
          {/* Top Window Bar */}
          <div className="bg-[#05080F] px-4 py-3 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5C7A]" />
                <span className="w-3 h-3 rounded-full bg-[#F5B942]" />
                <span className="w-3 h-3 rounded-full bg-[#22D3A8]" />
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-400 pl-3 border-l border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                <span className="text-white font-medium">app.cybergoat.ae</span>
                <span className="text-gray-600">/</span>
                <span className="text-[#00F0FF]">tenant: meridian-gulf-holdings</span>
              </div>
            </div>

            {/* Persona Indicator */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400 hidden md:inline">Active Persona:</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0e1524] border border-white/10 text-gray-200">
                <div className="w-5 h-5 rounded-full bg-[#00F0FF]/20 border border-[#00F0FF]/40 flex items-center justify-center font-bold text-[10px] text-[#00F0FF]">
                  A
                </div>
                <span className="font-semibold">Amira Al Farsi</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] font-mono">
                  CISO / Admin
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-[#0A0F1A] px-4 pt-2 border-b border-white/10 flex items-center gap-2 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-[#00F0FF] text-[#00F0FF] bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <TableCellsIcon className="w-4 h-4 text-[#00F0FF]" />
              1. Executive CISO Dashboard (671 Controls)
            </button>
            <button
              onClick={() => setActiveTab('ai-review')}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === 'ai-review'
                  ? 'border-[#C664FF] text-[#C664FF] bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <SparklesIcon className="w-4 h-4 text-[#C664FF]" />
              2. Corrective RAG AI Review Gate (HITL)
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === 'evidence'
                  ? 'border-[#22D3A8] text-[#22D3A8] bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheckIcon className="w-4 h-4 text-[#22D3A8]" />
              3. 5&times;5 Dynamic Risk Matrix
            </button>
            <button
              onClick={() => setActiveTab('registers')}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === 'registers'
                  ? 'border-[#F5B942] text-[#F5B942] bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <DocumentCheckIcon className="w-4 h-4 text-[#F5B942]" />
              4. UAE PDPL ROPA &amp; Breach Ledger
            </button>
          </div>

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="p-6 space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Adopted Controls</span>
                  <div className="mt-1 text-2xl font-black text-white font-mono">671</div>
                  <div className="mt-1 text-[11px] text-[#00F0FF] flex items-center gap-1 font-mono">
                    <span>&uarr; 5 Frameworks Unified</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Compliance Readiness</span>
                  <div className="mt-1 text-2xl font-black text-[#22D3A8] font-mono">84.2%</div>
                  <div className="mt-1 text-[11px] text-gray-400">565 of 671 Satisfied</div>
                </div>
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">AI Pending Gate</span>
                  <div className="mt-1 text-2xl font-black text-[#F5B942] font-mono">14</div>
                  <div className="mt-1 text-[11px] text-[#F5B942]">Requires CISO Sign-off</div>
                </div>
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Sovereign Data Region</span>
                  <div className="mt-1 text-2xl font-black text-[#00F0FF] font-mono">me-central1</div>
                  <div className="mt-1 text-[11px] text-gray-400">Doha, Qatar (&lt;20ms UAE)</div>
                </div>
              </div>

              {/* Framework Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-xl bg-[#05080F] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>DESC ISR v3.1</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] font-mono">
                          Mandatory Dubai
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">Dubai Electronic Security Center Standard</div>
                    </div>
                    <span className="text-lg font-bold text-[#00F0FF] font-mono">91%</span>
                  </div>
                  <div className="w-full bg-[#0A0F1A] h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] h-2 rounded-full w-[91%]" />
                  </div>
                  <div className="text-[11px] text-gray-400 flex justify-between font-mono">
                    <span>Access Control: 100%</span>
                    <span>Crypto &amp; Cloud: 82%</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#05080F] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>UAE Federal PDPL</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C664FF]/15 text-[#C664FF] font-mono">
                          Law No. 45/2021
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">Personal Data Protection Law</div>
                    </div>
                    <span className="text-lg font-bold text-[#C664FF] font-mono">86%</span>
                  </div>
                  <div className="w-full bg-[#0A0F1A] h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-[#C664FF] to-[#E066FF] h-2 rounded-full w-[86%]" />
                  </div>
                  <div className="text-[11px] text-gray-400 flex justify-between font-mono">
                    <span>ROPA Article 30: 100%</span>
                    <span>72-Hr Breach Plan: Satisfied</span>
                  </div>
                </div>
              </div>

              {/* Callout */}
              <div className="p-4 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SparklesIcon className="w-5 h-5 text-[#00F0FF]" />
                  <span className="text-xs text-gray-300">
                    <strong>Unified Crosswalk Active:</strong> Satisfying 1 control in DESC ISR automatically resolves matching controls in ISO 27001 and UAE IA simultaneously.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('ai-review')}
                  className="text-xs font-bold text-[#00F0FF] hover:underline shrink-0 pl-4"
                >
                  Inspect AI Review Gate &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: AI REVIEW GATE */}
          {activeTab === 'ai-review' && (
            <div className="p-6 space-y-6">
              <div className="p-4 rounded-xl bg-[#05080F] border border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#00F0FF]">CONTROL: ISR-AC-04</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                      Multi-Factor Authentication &amp; Privileged Access
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    Enforce Hardware-backed or FIDO2 MFA for all administrative and privileged console access.
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">AI Confidence:</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#22D3A8]/20 border border-[#22D3A8]/40 text-[#22D3A8] font-mono text-xs font-bold">
                    94% High Confidence
                  </span>
                </div>
              </div>

              {/* Evidence Evaluation Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: AI Finding & Policy Citation */}
                <div className="p-5 rounded-xl bg-[#05080F] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#C664FF] flex items-center gap-1.5">
                      <CpuChipIcon className="w-4 h-4" /> CORRECTIVE RAG EVALUATION
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">Gemini 3.8 Flash &bull; me-central1</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#0A0F1A] border border-white/5 text-xs text-gray-300 leading-relaxed font-mono">
                    <p className="text-[#00F0FF] font-semibold mb-1">&ldquo;Policy Citation: Meridian-IAM-Policy-2026.pdf (Section 4.2.1)&rdquo;</p>
                    <p className="text-gray-400">
                      &quot;All privileged administrators accessing Cloud Console, Kubernetes clusters, and database management engines must authenticate via hardware security keys (FIDO2 / WebAuthn). Passwords alone are strictly prohibited.&quot;
                    </p>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1.5">
                    <p className="font-semibold text-white">Automated Observation:</p>
                    <p className="text-gray-400">
                      Policy text explicitly satisfies DESC ISR v3.1 Domain 5 Access Control criteria. Evidence document was cryptographic-hash verified in local GCC vault.
                    </p>
                  </div>
                </div>

                {/* Right: Human-In-The-Loop Action Box */}
                <div className="p-5 rounded-xl bg-[#05080F] border border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 mb-3">
                      <LockClosedIcon className="w-4 h-4 text-[#F5B942]" /> MANDATORY HUMAN REVIEW GATE
                    </span>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      CyberGOAT AI evaluates policies in seconds, but <strong>never auto-certifies</strong>. A human CISO or certified auditor must formally approve or override the finding for full audit defensibility.
                    </p>

                    <div className="mt-4 p-3 rounded-lg bg-[#0A0F1A] border border-white/5">
                      <div className="text-xs text-gray-400">Review State:</div>
                      <div className="text-sm font-bold font-mono mt-0.5 capitalize flex items-center gap-2">
                        {reviewStatus === 'pending' && <span className="text-[#F5B942]">&bull; Pending CISO Review</span>}
                        {reviewStatus === 'approved' && <span className="text-[#22D3A8]">&bull; Approved as Satisfied</span>}
                        {reviewStatus === 'overridden' && <span className="text-[#FF5C7A]">&bull; Overridden by Auditor</span>}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-6 flex gap-3">
                    <button
                      onClick={() => setReviewStatus('approved')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        reviewStatus === 'approved'
                          ? 'bg-[#22D3A8] text-black shadow-[0_0_15px_rgba(34,211,168,0.4)]'
                          : 'bg-[#22D3A8]/20 border border-[#22D3A8]/40 text-[#22D3A8] hover:bg-[#22D3A8]/30'
                      }`}
                    >
                      <CheckIcon className="w-4 h-4" /> Approve as-is
                    </button>
                    <button
                      onClick={() => setReviewStatus('overridden')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        reviewStatus === 'overridden'
                          ? 'bg-[#FF5C7A] text-white shadow-[0_0_15px_rgba(255,92,122,0.4)]'
                          : 'bg-[#FF5C7A]/20 border border-[#FF5C7A]/40 text-[#FF5C7A] hover:bg-[#FF5C7A]/30'
                      }`}
                    >
                      <XMarkIcon className="w-4 h-4" /> Override
                    </button>
                    <button
                      onClick={() => setReviewStatus('pending')}
                      className="p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white cursor-pointer"
                      title="Reset simulation"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC RISK HEATMAP */}
          {activeTab === 'evidence' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">5&times;5 Dynamic Risk Matrix &mdash; Meridian Gulf</h4>
                  <p className="text-xs text-gray-400">Risks auto-linked to controls, incidents, and audit findings.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-gray-400">Filter:</span>
                  <button
                    onClick={() => setActiveRiskFilter('all')}
                    className={`px-3 py-1 rounded-md cursor-pointer ${
                      activeRiskFilter === 'all' ? 'bg-[#00F0FF] text-black font-bold' : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    All (28)
                  </button>
                  <button
                    onClick={() => setActiveRiskFilter('high')}
                    className={`px-3 py-1 rounded-md cursor-pointer ${
                      activeRiskFilter === 'high' ? 'bg-[#F5B942] text-black font-bold' : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    High (7)
                  </button>
                  <button
                    onClick={() => setActiveRiskFilter('critical')}
                    className={`px-3 py-1 rounded-md cursor-pointer ${
                      activeRiskFilter === 'critical' ? 'bg-[#FF5C7A] text-white font-bold' : 'bg-white/5 text-gray-300'
                    }`}
                  >
                    Critical (2)
                  </button>
                </div>
              </div>

              {/* Matrix Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <div className="grid grid-cols-5 gap-1.5 aspect-square text-center font-mono text-[10px] text-gray-300 font-bold">
                    <div className="p-2 rounded bg-[#FF5C7A]/80 flex items-center justify-center">RSK-01</div>
                    <div className="p-2 rounded bg-[#FF5C7A]/60 flex items-center justify-center">RSK-04</div>
                    <div className="p-2 rounded bg-[#FF5C7A]/40 flex items-center justify-center">1</div>
                    <div className="p-2 rounded bg-[#F5B942]/60 flex items-center justify-center">2</div>
                    <div className="p-2 rounded bg-[#F5B942]/40 flex items-center justify-center">0</div>

                    <div className="p-2 rounded bg-[#FF5C7A]/60 flex items-center justify-center">RSK-08</div>
                    <div className="p-2 rounded bg-[#F5B942]/80 flex items-center justify-center">3</div>
                    <div className="p-2 rounded bg-[#F5B942]/60 flex items-center justify-center">1</div>
                    <div className="p-2 rounded bg-[#F5B942]/40 flex items-center justify-center">2</div>
                    <div className="p-2 rounded bg-[#22D3A8]/40 flex items-center justify-center">1</div>

                    <div className="p-2 rounded bg-[#F5B942]/60 flex items-center justify-center">1</div>
                    <div className="p-2 rounded bg-[#F5B942]/40 flex items-center justify-center">4</div>
                    <div className="p-2 rounded bg-[#22D3A8]/60 flex items-center justify-center">2</div>
                    <div className="p-2 rounded bg-[#22D3A8]/40 flex items-center justify-center">3</div>
                    <div className="p-2 rounded bg-[#22D3A8]/20 flex items-center justify-center">2</div>

                    <div className="p-2 rounded bg-[#F5B942]/40 flex items-center justify-center">0</div>
                    <div className="p-2 rounded bg-[#22D3A8]/60 flex items-center justify-center">2</div>
                    <div className="p-2 rounded bg-[#22D3A8]/40 flex items-center justify-center">1</div>
                    <div className="p-2 rounded bg-[#22D3A8]/20 flex items-center justify-center">1</div>
                    <div className="p-2 rounded bg-[#22D3A8]/10 flex items-center justify-center">0</div>

                    <div className="p-2 rounded bg-[#22D3A8]/40 flex items-center justify-center">0</div>
                    <div className="p-2 rounded bg-[#22D3A8]/20 flex items-center justify-center">0</div>
                    <div className="p-2 rounded bg-[#22D3A8]/10 flex items-center justify-center">1</div>
                    <div className="p-2 rounded bg-[#22D3A8]/10 flex items-center justify-center">0</div>
                    <div className="p-2 rounded bg-[#22D3A8]/5 flex items-center justify-center">0</div>
                  </div>
                  <div className="mt-3 flex justify-between text-[11px] text-gray-500 font-mono">
                    <span>&larr; Likelihood &rarr;</span>
                    <span>&larr; Impact &rarr;</span>
                  </div>
                </div>

                {/* Sample Risk Records */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#05080F] border border-[#FF5C7A]/30">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-[#FF5C7A] font-bold">RSK-01 &bull; Critical</span>
                      <span className="text-gray-400">Score: 25 / 25</span>
                    </div>
                    <h5 className="text-sm font-bold text-white">Unencrypted Customer Backup in Cross-Border Transfer</h5>
                    <p className="text-xs text-gray-400 mt-1">
                      Violates UAE PDPL Article 22 &amp; DESC ISR 9.2. Linked to mitigating control ISR-CRY-01.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#05080F] border border-[#F5B942]/30">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-[#F5B942] font-bold">RSK-04 &bull; High</span>
                      <span className="text-gray-400">Score: 16 / 25</span>
                    </div>
                    <h5 className="text-sm font-bold text-white">Contractor Privileged Access Stale Review</h5>
                    <p className="text-xs text-gray-400 mt-1">
                      Quarterly access review overdue by 12 days. Mitigating ticket assigned to Omar Haddad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROPA & STATUTORY REGISTERS */}
          {activeTab === 'registers' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">UAE Federal PDPL Statutory Registers</h4>
                  <p className="text-xs text-gray-400">
                    Article 30 Record of Processing Activities (ROPA) &amp; Append-Only Data Breach Ledger.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono font-bold">
                  Kernel RLS Append-Only
                </span>
              </div>

              {/* ROPA Table Preview */}
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#05080F]">
                <table className="w-full text-left text-xs text-gray-300 font-sans">
                  <thead className="bg-[#0A0F1A] text-gray-400 font-mono text-[11px] border-b border-white/5">
                    <tr>
                      <th className="p-3">Processing Activity</th>
                      <th className="p-3">Data Categories</th>
                      <th className="p-3">Lawful Basis (PDPL)</th>
                      <th className="p-3">Cross-Border Transfer</th>
                      <th className="p-3">DPIA Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="p-3 font-semibold text-white">Employee HR &amp; Payroll</td>
                      <td className="p-3">Emirates ID, IBAN, Salary</td>
                      <td className="p-3 font-mono text-[#00F0FF]">Contract Performance</td>
                      <td className="p-3 font-mono text-[#22D3A8]">None (In-Country UAE)</td>
                      <td className="p-3 text-[#22D3A8]">Satisfied</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">VIP Wealth Portal Telemetry</td>
                      <td className="p-3">Name, IP, Device Fingerprint</td>
                      <td className="p-3 font-mono text-[#00F0FF]">Explicit Consent</td>
                      <td className="p-3 font-mono text-[#00F0FF]">Adequate (GCC me-central1)</td>
                      <td className="p-3 text-[#22D3A8]">Satisfied</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">Third-Party SaaS Analytics</td>
                      <td className="p-3">Aggregated Browsing Logs</td>
                      <td className="p-3 font-mono text-[#00F0FF]">Legitimate Interest</td>
                      <td className="p-3 font-mono text-[#F5B942]">SCC Contract Executed</td>
                      <td className="p-3 text-[#F5B942]">Annual Review Due</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
