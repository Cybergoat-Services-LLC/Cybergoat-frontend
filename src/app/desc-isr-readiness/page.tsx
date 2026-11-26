import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  ScaleIcon,
  SparklesIcon,
  LockClosedIcon,
  ServerIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Footer } from '../components/sections';

export const metadata = {
  title: 'UAE Sovereign Compliance Readiness | CyberGOAT GRC',
  description:
    "Evaluate your organization's readiness against DESC ISR v3.1, UAE Federal PDPL, and UAE IA through CyberGOAT's Sovereign AI GRC Platform with zero overseas data transfer.",
};

const FRAMEWORKS = [
  {
    icon: ShieldCheckIcon,
    title: 'DESC ISR v3.1',
    tagline: "Dubai's Information Security Regulation",
    domains: ['Governance & Asset Management', 'Access Control & Cryptography', 'Operations & Communications', 'Incident Response & Resilience'],
    color: 'border-[#00F0FF]/40 text-[#00F0FF]',
  },
  {
    icon: ScaleIcon,
    title: 'UAE Federal PDPL',
    tagline: 'Federal Decree-Law No. 45/2021 on Personal Data Protection',
    domains: ['Lawful Processing & Consent', 'Data Subject Rights', 'Breach Notification (72-Hour)', 'Cross-Border Transfer Controls'],
    color: 'border-[#2F57EF]/40 text-[#2F57EF]',
  },
  {
    icon: SparklesIcon,
    title: 'DESC AI Security',
    tagline: "Dubai's Framework for AI & GenAI Systems",
    domains: ['AI Model Governance', 'Prompt & Training Data Security', 'Human-in-the-Loop Oversight', 'Third-Party AI Supply Chain'],
    color: 'border-[#C664FF]/40 text-[#C664FF]',
  },
];

export default function DescIsrReadinessPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1A] text-gray-300 font-sans selection:bg-[#0DCAF0]/30 selection:text-white">
      {/* Header */}
      <nav className="fixed w-full z-50 top-0 bg-[#0A0F1A]/90 backdrop-blur-md border-b border-white/5 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to Home
          </Link>
          <Image
            src="/CG White logo_.PNG"
            alt="CyberGOAT"
            width={160}
            height={50}
            className="h-10 w-auto object-contain logo-bright-blue"
          />
          <Link
            href="/#interactive-demo"
            className="text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            Explore Live Demo
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 container mx-auto px-6 max-w-5xl">
        {/* Sovereign Notice Banner */}
        <div className="mb-8 p-4 rounded-2xl border border-[#00F0FF]/30 bg-[#05080F] flex items-center gap-4 text-left">
          <div className="p-3 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shrink-0">
            <LockClosedIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#00F0FF] font-bold">[DATA_SOVEREIGNTY_ENFORCED]</span>
            <p className="text-sm text-gray-300">
              In strict accordance with UAE PDPL and DESC ISR data residency mandates, policy document evaluations are conducted entirely within sovereign GCC cloud or on-premises infrastructure. Unmanaged public uploads have been retired.
            </p>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C664FF]/30 bg-[#C664FF]/10 text-[#C664FF] text-xs font-semibold mb-6">
            <ServerIcon className="w-4 h-4 text-[#C664FF]" />
            <span>Sovereign Regional Continuous Compliance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Continuous GRC &amp; Audit Automation for UAE Frameworks
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Comply with DESC ISR, UAE IA, CBUAE, and UAE PDPL from a single unified workspace with Corrective RAG AI policy evaluation and guaranteed in-country data residency.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              href="/#interactive-demo"
              className="px-8 py-3.5 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2"
            >
              Test Drive Interactive Platform <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/971551846786?text=Hi%20CyberGOAT,%20we%20want%20to%20schedule%20a%20CISO%20walkthrough%20for%20UAE%20compliance"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-[#C664FF]/40 text-[#C664FF] font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#C664FF]/10 transition-all"
            >
              Book CISO Walkthrough
            </a>
          </div>
        </div>

        {/* Framework Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {FRAMEWORKS.map((fw) => (
            <div
              key={fw.title}
              className={`rounded-2xl border ${fw.color.split(' ')[0]} bg-[#05080F] p-6 text-left flex flex-col justify-between`}
            >
              <div>
                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-4 ${fw.color.split(' ')[1]}`}>
                  <fw.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{fw.title}</h3>
                <p className="text-xs text-gray-400 mb-6">{fw.tagline}</p>
                <div className="space-y-2 border-t border-white/5 pt-4">
                  {fw.domains.map((dom) => (
                    <div key={dom} className="text-xs text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                      <span>{dom}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
