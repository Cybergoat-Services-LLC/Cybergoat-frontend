import React from 'react';
import {
  ShieldCheckIcon,
  CpuChipIcon,
  BriefcaseIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import RevealOnScroll from './RevealOnScroll';
import { ContactTrigger } from './interactive-buttons';

const OFFERINGS = [
  {
    title: 'Technical Audits & Vulnerability Assessments',
    icon: ShieldCheckIcon,
    subtext:
      'Deep-scope penetration testing, vulnerability assessments, and cloud infrastructure reviews conducted by certified technical auditors to identify and remediate security gaps.',
    badge: 'Technical Audit',
    color: 'border-[#00F0FF]/40 text-[#00F0FF]',
  },
  {
    title: 'Virtual CISO & Regulatory Advisory',
    icon: BriefcaseIcon,
    subtext:
      'On-demand executive security leadership combining automated DESC ISR & UAE PDPL gap analysis with tailored legal and GRC frameworks.',
    badge: 'vCISO & GRC',
    color: 'border-[#C664FF]/40 text-[#C664FF]',
  },
  {
    title: 'AI Security & Governance',
    icon: CpuChipIcon,
    subtext:
      'End-to-end evaluation of enterprise AI deployments, policy readiness scoring, and risk alignment with regional AI security standards.',
    badge: 'AI Governance',
    color: 'border-[#38BDF8]/40 text-[#38BDF8]',
  },
  {
    title: 'Security Awareness & Threat Simulations',
    icon: SparklesIcon,
    subtext:
      'Controlled phishing simulations and corporate security awareness frameworks designed to harden your human firewall against social engineering.',
    badge: 'Human Defense',
    color: 'border-[#E066FF]/40 text-[#E066FF]',
  },
];

export default function CorporateOfferingsSection() {
  return (
    <section className="py-24 bg-[#05080F] border-b border-white/5 relative z-20">
      <div className="container mx-auto px-6">
        <RevealOnScroll className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-[#00F0FF] uppercase">
            Enterprise Consulting Practices
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Tailored Security Architecture &amp; Advisory Capabilities
          </h3>
          <p className="text-lg text-gray-400">
            High-value cybersecurity consulting, AI governance, and GRC retainers tailored for enterprise organizations across the UAE and MENA region.
          </p>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {OFFERINGS.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <RevealOnScroll key={item.title} delay={idx * 0.1}>
                <div
                  className={`h-full bg-[#0A0F1A] border rounded-3xl p-8 glass-card hover:scale-[1.01] transition-all flex flex-col justify-between ${item.color}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white">
                        {item.badge}
                      </span>
                      <IconComp className="w-7 h-7" />
                    </div>
                    <h4 className="text-2xl font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.subtext}</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5">
                    <ContactTrigger className="w-full py-2.5 bg-white/5 hover:bg-[#2F57EF] text-white text-xs font-bold rounded-full transition-all border border-white/10 text-center cursor-pointer">
                      Inquire for Proposal
                    </ContactTrigger>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
