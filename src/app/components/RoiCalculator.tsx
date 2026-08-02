'use client';

import React, { useState } from 'react';
import { SparklesIcon, ArrowTrendingUpIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { ContactTrigger } from './interactive-buttons';

// Authentic UAE & GCC Cybersecurity Compensation Benchmarks
// Sourced from Hays Middle East Salary Guide, Cooper Fitch UAE Salary Guide, and GulfTalent Cybersecurity Benchmarks
const GCC_SALARY_BENCHMARKS: Record<
  string,
  {
    roleTitle: string;
    rangeAed: string;
    avgSalaryAed: number;
    estimatedIncreaseAed: number;
    certCode: string;
    marketDemand: string;
  }
> = {
  'CEH v12': {
    roleTitle: 'Ethical Hacker / Penetration Tester / SOC L2',
    rangeAed: '18,000 - 25,000 AED',
    avgSalaryAed: 22000,
    estimatedIncreaseAed: 5500,
    certCode: 'EC-Council CEH v12',
    marketDemand: 'Very High (UAE Bank & Telecom SOCs)',
  },
  'CHFI v11': {
    roleTitle: 'Digital Forensics & Incident Response (DFIR) Specialist',
    rangeAed: '22,000 - 32,000 AED',
    avgSalaryAed: 27000,
    estimatedIncreaseAed: 7000,
    certCode: 'EC-Council CHFI v11',
    marketDemand: 'High (Law Enforcement & Financial Sector)',
  },
  'C|CISO': {
    roleTitle: 'Chief Information Security Officer / Head of Cyber Governance',
    rangeAed: '45,000 - 75,000 AED',
    avgSalaryAed: 60000,
    estimatedIncreaseAed: 16000,
    certCode: 'EC-Council C|CISO',
    marketDemand: 'Critical (Government & Enterprise Entities)',
  },
  'CISA': {
    roleTitle: 'IT Audit Manager / Senior Systems Auditor',
    rangeAed: '25,000 - 38,000 AED',
    avgSalaryAed: 30000,
    estimatedIncreaseAed: 6500,
    certCode: 'ISACA CISA Target',
    marketDemand: 'High (Big 4 & Banking Audit Teams)',
  },
  'CISSP': {
    roleTitle: 'Enterprise Cyber Security Architect',
    rangeAed: '35,000 - 52,000 AED',
    avgSalaryAed: 42000,
    estimatedIncreaseAed: 11000,
    certCode: 'ISC2 CISSP Target',
    marketDemand: 'Very High (Enterprise Zero Trust Migration)',
  },
};

export default function RoiCalculator() {
  const [selectedCert, setSelectedCert] = useState('C|CISO');
  const activeData = GCC_SALARY_BENCHMARKS[selectedCert];

  return (
    <section className="py-20 bg-[#05080F] border-y border-white/5 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            Authentic UAE / GCC Salary Benchmarks
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            GCC Cybersecurity Career &amp; Compensation Guide
          </h2>
          <p className="text-sm text-gray-400">
            Real compensation data based on the Hays Middle East Salary Guide, Cooper Fitch UAE Salary Survey, and GulfTalent benchmarks.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 items-center bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 sm:p-10 glass-card shadow-2xl">
          {/* Controls Column */}
          <div className="md:col-span-5 space-y-6">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400">
              Select Target Certification:
            </label>
            <div className="space-y-2.5">
              {Object.keys(GCC_SALARY_BENCHMARKS).map((certKey) => (
                <button
                  key={certKey}
                  onClick={() => setSelectedCert(certKey)}
                  className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between border ${
                    selectedCert === certKey
                      ? 'bg-gradient-to-r from-[#2F57EF] to-[#00F0FF] text-white border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span>{certKey}</span>
                  <span className="text-[10px] uppercase opacity-75">{GCC_SALARY_BENCHMARKS[certKey].certCode}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Column */}
          <div className="md:col-span-7 space-y-6 p-6 rounded-2xl bg-gradient-to-br from-[#05080F] to-[#0A1628] border border-[#00F0FF]/30 text-left">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Market Position</span>
                <h3 className="text-lg font-extrabold text-white text-[#00F0FF] mt-0.5">{activeData.roleTitle}</h3>
                <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Market Demand: {activeData.marketDemand}
                </span>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-[#00F0FF] shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] font-medium text-gray-400">UAE Monthly Range</span>
                <p className="text-xl font-extrabold text-white">{activeData.rangeAed}</p>
                <p className="text-[10px] text-gray-400">Monthly Tax-Free AED</p>
              </div>

              <div className="p-4 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 space-y-1">
                <span className="text-[11px] font-medium text-[#00F0FF]">Est. Salary Increase</span>
                <p className="text-xl font-extrabold text-[#00F0FF]">
                  +AED {activeData.estimatedIncreaseAed.toLocaleString()}
                  <span className="text-xs font-normal text-gray-300">/mo</span>
                </p>
                <p className="text-[10px] text-[#00F0FF]/80">Post-Certification Uplift</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2 text-[11px] text-gray-400">
              <InformationCircleIcon className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
              <span>
                <strong>Data Methodology Note:</strong> Benchmarks represent median UAE monthly salaries for full-time IT/Cybersecurity professionals based on Hays Middle East Salary Guide &amp; Cooper Fitch UAE reports.
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <ContactTrigger className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2">
                <SparklesIcon className="w-4 h-4 text-black" /> Inquire for Course Syllabus &amp; Batch Fees
              </ContactTrigger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
