'use client';

import React from 'react';
import {
  ServerIcon,
  BuildingOffice2Icon,
  ShieldCheckIcon,
  LockClosedIcon,
  CpuChipIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const TIERS = [
  {
    tier: 'Tier 1',
    badge: 'Standard GCC Cloud',
    title: 'GCC Sovereign Cloud (me-central1)',
    location: 'Doha, Qatar (<20ms to UAE)',
    idealFor: 'Commercial enterprises, mid-market businesses, and non-critical SaaS buyers across the GCC.',
    color: 'border-[#00F0FF]/40 text-[#00F0FF]',
    glowColor: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]',
    bgBadge: 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30',
    icon: ServerIcon,
    features: [
      'Cloud Run + PostgreSQL 17 with Kernel-Enforced RLS',
      'Google Cloud me-central1 (GCC Regional Residency)',
      'Vertex AI Gemini 3.8 Flash in-region evaluation',
      'Encrypted evidence vault with customer-managed keys (CMEK)',
      'Instant tenant provisioning & continuous automated updates',
    ],
  },
  {
    tier: 'Tier 2',
    badge: 'UAE Regulated Sectors',
    title: 'In-Country UAE Sovereign Zone',
    location: 'Azure UAE North (Dubai) / AWS UAE (Abu Dhabi)',
    idealFor: 'CBUAE-regulated banks, Dubai Government entities (DESC ISR), and UAE healthcare providers.',
    color: 'border-[#C664FF]/40 text-[#C664FF]',
    glowColor: 'hover:shadow-[0_0_30px_rgba(198,100,255,0.2)]',
    bgBadge: 'bg-[#C664FF]/10 text-[#C664FF] border-[#C664FF]/30',
    icon: BuildingOffice2Icon,
    features: [
      '100% In-Country UAE Data & Compute Storage',
      'Zero cross-border network transit (strict DESC & CBUAE compliance)',
      'Isolated VPC tenant architecture with dedicated database instances',
      'Local UAE LLM inference endpoints (Azure UAE Private Models)',
      'Independent statutory audit readiness verification reports',
    ],
  },
  {
    tier: 'Tier 3',
    badge: 'Defense & Critical Infrastructure',
    title: 'Sovereign Air-Gapped / On-Prem vLLM',
    location: 'Customer Private Data Center / Sovereign VPC',
    idealFor: 'Defense, sovereign wealth funds, law enforcement, and critical national infrastructure.',
    color: 'border-[#22D3A8]/40 text-[#22D3A8]',
    glowColor: 'hover:shadow-[0_0_30px_rgba(34,211,168,0.2)]',
    bgBadge: 'bg-[#22D3A8]/10 text-[#22D3A8] border-[#22D3A8]/30',
    icon: CpuChipIcon,
    features: [
      'Self-Hosted vLLM Inference Engine (Llama 3.3, Qwen 2.5, UAE Jais)',
      'Zero external API egress & full air-gapped capability',
      'Runs directly on customer hardware or isolated bare-metal cloud',
      'Complete proprietary source code & local embedding pipeline',
      'Quarterly on-site compliance engine updates by CyberGOAT engineers',
    ],
  },
];

export default function SovereigntyTiersSection() {
  return (
    <section id="sovereignty" className="py-24 bg-[#0A0F1A] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#00F0FF]/10 to-[#C664FF]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono font-semibold mb-4">
            <LockClosedIcon className="w-4 h-4 text-[#00F0FF]" />
            <span>REGULATORY DATA SOVEREIGNTY ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Compliance Without Overseas Data Egress
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-400">
            Unlike US-based GRC platforms that export policy documents and employee records overseas, CyberGOAT offers a 3-tier sovereign deployment model built specifically for UAE and GCC statutory mandates.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TIERS.map((tier) => (
            <div
              key={tier.tier}
              className={`rounded-3xl border ${tier.color.split(' ')[0]} bg-[#05080F] p-8 flex flex-col justify-between transition-all duration-300 ${tier.glowColor}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${tier.bgBadge}`}>
                    {tier.badge}
                  </span>
                  <tier.icon className={`w-6 h-6 ${tier.color.split(' ')[1]}`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{tier.title}</h3>
                <p className="text-xs font-mono text-[#00F0FF] mb-4">{tier.location}</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">{tier.idealFor}</p>

                {/* Features List */}
                <div className="space-y-3 border-t border-white/5 pt-6">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <CheckCircleIcon className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <a
                  href={`https://wa.me/971551846786?text=Hi%20CyberGOAT,%20we%20want%20to%20inquire%20about%20the%20${encodeURIComponent(
                    tier.title
                  )}%20deployment%20option`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block py-3 text-center text-xs font-bold uppercase tracking-wider rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer"
                >
                  Inquire About {tier.tier}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
