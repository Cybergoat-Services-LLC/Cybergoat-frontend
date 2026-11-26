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
  AcademicCapIcon,
  ArrowRightIcon,
  FingerPrintIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

type TabId = 'dashboard' | 'ai-review' | 'evidence' | 'registers' | 'workforce';

type WorkpaperDetail = {
  employee: string;
  role: string;
  credential: string;
  badgeId: string;
  partnerId: string;
  mappedControl: string;
  sha256Hash: string;
  verifiedAt: string;
};

export default function SaaSInteractiveDemo() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'overridden'>('pending');
  const [activeRiskFilter, setActiveRiskFilter] = useState<'all' | 'high' | 'critical'>('all');
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [activeWorkpaper, setActiveWorkpaper] = useState<WorkpaperDetail | null>(null);

  const handleRemediateFromDashboard = () => {
    setActiveTab('workforce');
    setHighlightedRow('tariq');
  };

  const handleSyncCredentials = () => {
    setSyncToast('3 Verified Credentials Ingested to Evidence Vault (DESC ISR Domain 9 & ISO A.6.3) • 1 Remediation Track Active (CCSE 78%).');
    setTimeout(() => {
      setSyncToast(null);
    }, 6000);
  };

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
            Explore the exact unified compliance views, Corrective RAG review gates, statutory registers, and accredited workforce competency tracking evaluated by GCC enterprise CISOs and regulatory auditors.
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
              onClick={() => {
                setActiveTab('dashboard');
                setHighlightedRow(null);
              }}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer shrink-0 ${
                activeTab === 'dashboard'
                  ? 'border-[#00F0FF] text-[#00F0FF] bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <TableCellsIcon className="w-4 h-4 text-[#00F0FF]" />
              1. Executive CISO Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('ai-review');
                setHighlightedRow(null);
              }}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer shrink-0 ${
                activeTab === 'ai-review'
                  ? 'border-[#C664FF] text-[#C664FF] bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <SparklesIcon className="w-4 h-4 text-[#C664FF]" />
              2. Corrective RAG Review Gate (HITL)
            </button>
            <button
              onClick={() => {
                setActiveTab('evidence');
                setHighlightedRow(null);
              }}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer shrink-0 ${
                activeTab === 'evidence'
                  ? 'border-[#22D3A8] text-[#22D3A8] bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheckIcon className="w-4 h-4 text-[#22D3A8]" />
              3. 5&times;5 Dynamic Risk Matrix
            </button>
            <button
              onClick={() => {
                setActiveTab('registers');
                setHighlightedRow(null);
              }}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer shrink-0 ${
                activeTab === 'registers'
                  ? 'border-[#F5B942] text-[#F5B942] bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <DocumentCheckIcon className="w-4 h-4 text-[#F5B942]" />
              4. UAE PDPL ROPA &amp; Breach Ledger
            </button>
            <button
              onClick={() => {
                setActiveTab('workforce');
                setHighlightedRow(null);
              }}
              className={`px-4 py-2.5 rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer shrink-0 ${
                activeTab === 'workforce'
                  ? 'border-[#00F0FF] text-[#00F0FF] bg-white/5 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-bold'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <AcademicCapIcon className="w-4 h-4 text-[#00F0FF]" />
              5. Workforce Compliance (ISR Domain 9 &amp; ISO A.6.3)
            </button>
          </div>

          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="p-6 space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Adopted Controls</span>
                  <div className="mt-1 text-2xl font-black text-white font-mono">1,671</div>
                  <div className="mt-1 text-[11px] text-[#00F0FF] flex items-center gap-1 font-mono">
                    <span>&uarr; 18 Frameworks Unified</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Compliance Readiness</span>
                  <div className="mt-1 text-2xl font-black text-[#22D3A8] font-mono">84.2%</div>
                  <div className="mt-1 text-[11px] text-gray-400">1,407 of 1,671 Satisfied</div>
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

              {/* Cross-Tab Remediation Alert Banner */}
              <div className="p-4 rounded-xl bg-[#FF5C7A]/10 border border-[#FF5C7A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF5C7A]/20 border border-[#FF5C7A]/40 flex items-center justify-center shrink-0">
                    <ExclamationTriangleIcon className="w-4 h-4 text-[#FF5C7A]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>1 Open Workforce Competency Gap Detected:</span>
                      <span className="text-[#FF5C7A] font-mono">DESC ISR Domain 9 / ISO 27001 Clause 7.2</span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Cloud infrastructure defense competence unfulfilled for Cloud Engineering lead (Tariq Mansoor).
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemediateFromDashboard}
                  className="px-4 py-2 bg-[#FF5C7A]/20 hover:bg-[#FF5C7A] text-[#FF5C7A] hover:text-white border border-[#FF5C7A]/40 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  Remediate in Workforce Vault <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
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
                    <span>HR Roles (Domain 9): 78%</span>
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
                    <span>Breach Readiness (Art. 9): Satisfied</span>
                  </div>
                </div>
              </div>

              {/* Callout */}
              <div className="p-4 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SparklesIcon className="w-5 h-5 text-[#00F0FF]" />
                  <span className="text-xs text-gray-300">
                    <strong>Unified Crosswalk Active:</strong> Satisfying 1 control in DESC ISR automatically resolves matching controls in ISO/IEC 27001:2022 and UAE IA Regulation v1.1.
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

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#05080F] border border-[#FF5C7A]/30">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-[#FF5C7A] font-bold">RSK-01 &bull; Critical</span>
                      <span className="text-gray-400">Score: 25 / 25</span>
                    </div>
                    <h5 className="text-sm font-bold text-white">Unencrypted Customer Backup in Cross-Border Transfer</h5>
                    <p className="text-xs text-gray-400 mt-1">
                      Violates UAE PDPL Article 22 &amp; DESC ISR Domain 5 Access Control. Linked to mitigating control ISR-CRY-01.
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

          {/* TAB 5: WORKFORCE COMPLIANCE (CLOSED-LOOP HUMAN GOVERNANCE) */}
          {activeTab === 'workforce' && (
            <div className="p-6 space-y-6">
              {/* Header & Verification Source Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <AcademicCapIcon className="w-5 h-5 text-[#00F0FF]" />
                    Workforce Compliance &amp; Accredited Role Competency
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Continuous monitoring of personnel competence under DESC ISR v3.1 Domain 9, UAE IA v1.1 M3, and ISO/IEC 27001:2022 Annex A.6.3 &amp; Clause 7.2.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#05080F] border border-white/10 text-[11px] font-mono text-gray-300">
                  <FingerPrintIcon className="w-4 h-4 text-[#C664FF]" />
                  <span>EC-Council Authorized Partner (ID: ECRS21832)</span>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Role Competency Coverage</span>
                  <div className="mt-1 text-2xl font-black text-[#22D3A8] font-mono">78%</div>
                  <div className="mt-1 text-[11px] text-gray-400">3 of 4 Core Roles Verified</div>
                </div>
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Expiring Credentials (90d)</span>
                  <div className="mt-1 text-2xl font-black text-[#F5B942] font-mono">1</div>
                  <div className="mt-1 text-[11px] text-[#F5B942]">IR Lead (ECIH v2)</div>
                </div>
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Audit Workpapers Linked</span>
                  <div className="mt-1 text-2xl font-black text-[#00F0FF] font-mono">14 / 18</div>
                  <div className="mt-1 text-[11px] text-[#00F0FF]">Cryptographic Hash Signed</div>
                </div>
                <div className="p-4 rounded-xl bg-[#05080F] border border-white/5">
                  <span className="text-xs text-gray-400">Active Remediation</span>
                  <div className="mt-1 text-2xl font-black text-[#FF5C7A] font-mono">1 Track</div>
                  <div className="mt-1 text-[11px] text-[#FF5C7A]">CCSE Cloud Labs 78%</div>
                </div>
              </div>

              {/* Toast Alert */}
              {syncToast && (
                <div className="p-3.5 rounded-xl bg-[#22D3A8]/15 border border-[#22D3A8]/40 text-xs text-[#22D3A8] flex items-center justify-between font-mono animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 shrink-0" />
                    <span>{syncToast}</span>
                  </div>
                  <button onClick={() => setSyncToast(null)} className="text-gray-400 hover:text-white">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Role-to-Control Evidence Table */}
              <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#05080F]">
                <table className="w-full text-left text-xs text-gray-300 font-sans">
                  <thead className="bg-[#0A0F1A] text-gray-400 font-mono text-[11px] border-b border-white/5">
                    <tr>
                      <th className="p-3">Staff Member &amp; Role</th>
                      <th className="p-3">Statutory Regulatory Control</th>
                      <th className="p-3">Accredited Pathway</th>
                      <th className="p-3">Verification ID / State</th>
                      <th className="p-3">Evidence Vault Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {/* Row 1: Layla Nasser */}
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">Layla Nasser</div>
                        <div className="text-[11px] text-gray-400">Chief Information Security Officer &amp; DPO</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] font-mono text-[10px]">
                          DESC ISR Domain 1 &amp; 9 &bull; ISO 27001 Clause 7.2 &bull; UAE PDPL Art. 10
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-200">EC-Council C|CISO</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-[#22D3A8] font-mono text-[11px]">
                          <CheckCircleIcon className="w-4 h-4 shrink-0" />
                          <span>Verified (#CC-94812)</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            setActiveWorkpaper({
                              employee: 'Layla Nasser',
                              role: 'Chief Information Security Officer & DPO',
                              credential: 'Certified Chief Information Security Officer (C|CISO)',
                              badgeId: 'CC-94812-ECR',
                              partnerId: 'ECRS21832',
                              mappedControl: 'DESC ISR v3.1 Domain 1 (Governance) & Domain 9 (Human Resources) • ISO/IEC 27001:2022 Clause 7.2 (Competence) • UAE PDPL Art. 10 (DPO)',
                              sha256Hash: '9f8a42b1c83d7e52003ea1489b12cf5081923ab98f12349071258671cbad3b21',
                              verifiedAt: '2026-10-14 09:15:22 UTC',
                            })
                          }
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#00F0FF]/15 text-[#00F0FF] border border-white/10 text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1"
                        >
                          <DocumentTextIcon className="w-3.5 h-3.5" /> View Workpaper
                        </button>
                      </td>
                    </tr>

                    {/* Row 2: Farhan Al-Maktoum */}
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">Farhan Al-Maktoum</div>
                        <div className="text-[11px] text-gray-400">Lead Security Operations Center (SOC) Analyst</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] font-mono text-[10px]">
                          DESC ISR Domain 9 &bull; UAE IA Regulation v1.1 M3
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-200">EC-Council CSA (SOC Analyst)</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-[#22D3A8] font-mono text-[11px]">
                          <CheckCircleIcon className="w-4 h-4 shrink-0" />
                          <span>Verified (#CSA-77104)</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            setActiveWorkpaper({
                              employee: 'Farhan Al-Maktoum',
                              role: 'Lead SOC Analyst',
                              credential: 'Certified SOC Analyst (CSA)',
                              badgeId: 'CSA-77104-ECR',
                              partnerId: 'ECRS21832',
                              mappedControl: 'DESC ISR v3.1 Domain 9 (Roles and Responsibilities of HR) • UAE IA Regulation v1.1 M3 (Awareness & Training)',
                              sha256Hash: '4d12bb590981ca347009ef129038ba4581290472190823904128941728348e09',
                              verifiedAt: '2026-09-28 14:40:11 UTC',
                            })
                          }
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#00F0FF]/15 text-[#00F0FF] border border-white/10 text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1"
                        >
                          <DocumentTextIcon className="w-3.5 h-3.5" /> View Workpaper
                        </button>
                      </td>
                    </tr>

                    {/* Row 3: Tariq Mansoor (Remediation Target) */}
                    <tr
                      id="tariq-row"
                      className={`transition-all ${
                        highlightedRow === 'tariq'
                          ? 'bg-[#FF5C7A]/15 border-l-4 border-l-[#FF5C7A] ring-1 ring-[#FF5C7A]/40'
                          : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>Tariq Mansoor</span>
                          {highlightedRow === 'tariq' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF5C7A] text-white font-mono animate-pulse">
                              Remediation Target
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400">Cloud Infrastructure Security Engineer</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#FF5C7A]/10 text-[#FF5C7A] font-mono text-[10px]">
                          Sovereign Cloud Security &bull; ISO/IEC 27017
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-200">EC-Council CCSE (Cloud Security)</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-[#F5B942] font-mono text-[11px]">
                          <ArrowPathIcon className="w-4 h-4 animate-spin shrink-0" />
                          <span>Enrolled &bull; iLabs 78% Complete</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded bg-[#FF5C7A]/20 text-[#FF5C7A] text-[11px] font-mono font-bold">
                          Gap Active &bull; In Progress
                        </span>
                      </td>
                    </tr>

                    {/* Row 4: Sara Al-Husseini */}
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">Sara Al-Husseini</div>
                        <div className="text-[11px] text-gray-400">Incident Response Team Lead</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] font-mono text-[10px]">
                          DESC ISR Domain 11 (Incidents) &bull; UAE PDPL Art. 9
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-200">EC-Council ECIH v2</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-[#F5B942] font-mono text-[11px]">
                          <CheckCircleIcon className="w-4 h-4 shrink-0 text-[#22D3A8]" />
                          <span>Verified (#ECIH-55219) &bull; Due in 90d</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() =>
                            setActiveWorkpaper({
                              employee: 'Sara Al-Husseini',
                              role: 'Incident Response Lead',
                              credential: 'EC-Council Certified Incident Handler (ECIH v2)',
                              badgeId: 'ECIH-55219-ECR',
                              partnerId: 'ECRS21832',
                              mappedControl: 'DESC ISR v3.1 Domain 11 (Information Security Incident Management) • UAE PDPL Article 9 (Breach Response Readiness)',
                              sha256Hash: '1a4fa09192837bc4491028374910283471092834710928347109283471097c88',
                              verifiedAt: '2026-08-11 11:20:00 UTC',
                            })
                          }
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#00F0FF]/15 text-[#00F0FF] border border-white/10 text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1"
                        >
                          <DocumentTextIcon className="w-3.5 h-3.5" /> View Workpaper
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
                <p className="text-xs text-gray-400">
                  Certifications awarded by EC-Council are authenticated via Partner ID <strong>ECRS21832</strong> and ingested as tamper-proof SHA-256 evidence workpapers.
                </p>
                <button
                  onClick={handleSyncCredentials}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2"
                >
                  <FingerPrintIcon className="w-4 h-4" /> Verify &amp; Ingest EC-Council Credentials to Vault
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auditor Workpaper Card Modal */}
      {activeWorkpaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0A0F1A] border border-[#00F0FF]/40 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="text-base font-bold text-white">Auditor Workpaper Evidence Record</h3>
              </div>
              <button
                onClick={() => setActiveWorkpaper(null)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-gray-300">
              <div className="p-3 rounded-lg bg-[#05080F] border border-white/5 space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">Subject Personnel:</span>
                <p className="font-bold text-white text-sm">{activeWorkpaper.employee}</p>
                <p className="text-gray-400">{activeWorkpaper.role}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#05080F] border border-white/5 space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">Accredited Credential &amp; Source:</span>
                <p className="font-bold text-[#00F0FF]">{activeWorkpaper.credential}</p>
                <p className="text-gray-400">Badge ID: {activeWorkpaper.badgeId} &bull; EC-Council Partner: {activeWorkpaper.partnerId}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#05080F] border border-white/5 space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">Mapped Statutory Regulatory Control:</span>
                <p className="text-[#22D3A8] font-bold">{activeWorkpaper.mappedControl}</p>
              </div>

              <div className="p-3 rounded-lg bg-[#05080F] border border-white/5 space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">Tamper-Proof SHA-256 Digest:</span>
                <p className="text-[11px] text-gray-400 break-all select-all font-mono">{activeWorkpaper.sha256Hash}</p>
                <p className="text-[10px] text-gray-500">Verified Timestamp: {activeWorkpaper.verifiedAt}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveWorkpaper(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Close Workpaper
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
