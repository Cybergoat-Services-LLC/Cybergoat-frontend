import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  ScaleIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
  SparklesIcon,
  UserGroupIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import RevealOnScroll from '../components/RevealOnScroll';
import { Footer } from '../components/sections';
import DescIsrForm from './DescIsrForm';

export const metadata = {
  title: 'Free DESC ISR Readiness Score | CyberGOAT',
  description:
    "Upload your security policy documents and get a free preliminary readiness score against Dubai's DESC Information Security Regulation (ISR), reviewed by a certified CyberGOAT security professional.",
};

const DOMAINS = [
  {
    icon: ScaleIcon,
    title: 'Governance',
    desc: 'Policy structure, ownership, and how security accountability is documented across the organization.',
    color: 'border-[#00F0FF]/40 text-[#00F0FF]',
  },
  {
    icon: ArchiveBoxIcon,
    title: 'Information Asset Management',
    desc: 'Asset inventory, classification, and handling requirements for sensitive information.',
    color: 'border-[#2F57EF]/40 text-[#2F57EF]',
  },
  {
    icon: ExclamationTriangleIcon,
    title: 'Risk Management',
    desc: 'Risk assessment methodology, treatment plans, and how residual risk is tracked and reviewed.',
    color: 'border-[#C664FF]/40 text-[#C664FF]',
  },
  {
    icon: BellAlertIcon,
    title: 'Incident Response',
    desc: 'Detection, escalation, and response procedures - and whether they meet DESC reporting expectations.',
    color: 'border-[#38BDF8]/40 text-[#38BDF8]',
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
            width={220}
            height={70}
            priority
            className="h-12 w-auto object-contain logo-bright-blue"
          />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 cyber-grid cyber-scanline pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2F57EF] via-[#00F0FF] to-[#C664FF] blur-[120px] rounded-full mix-blend-screen opacity-40" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <RevealOnScroll className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-semibold mb-6 backdrop-blur-md">
              <span className="font-mono text-[11px] uppercase tracking-wider">[FREE ASSESSMENT]</span>
              <span className="w-1 h-1 rounded-full bg-[#00F0FF] animate-pulse" />
              <span>For UAE Security &amp; IT Leaders</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
              What&rsquo;s your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#00F0FF]">
                DESC ISR
              </span>{' '}
              readiness score?
            </h1>

            <p className="text-lg sm:text-xl text-white font-medium leading-relaxed max-w-2xl mx-auto">
              Upload your organization&rsquo;s security policy documents and get a free preliminary readiness
              score against Dubai&rsquo;s Information Security Regulation (ISR) &mdash; covering the four
              domains that matter most to security leadership.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Content: domains + disclosure + form */}
      <section className="pb-24">
        <div className="container mx-auto px-6 grid lg:grid-cols-5 gap-10 items-start">
          {/* Left column: value prop */}
          <div className="lg:col-span-3 space-y-10">
            <RevealOnScroll>
              <h2 className="text-sm font-bold tracking-widest text-[#0DCAF0] uppercase mb-4">
                What We Score
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {DOMAINS.map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <div
                      key={d.title}
                      className={`bg-[#05080F] border rounded-3xl p-6 glass-card hover:scale-[1.01] transition-all ${d.color}`}
                    >
                      <div className="flex items-center gap-2 mb-2 font-extrabold text-sm">
                        <Icon className="w-5 h-5" />
                        <span>{d.title}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{d.desc}</p>
                    </div>
                  );
                })}
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <h2 className="text-sm font-bold tracking-widest text-[#0DCAF0] uppercase mb-4">
                How It Works
              </h2>
              <ol className="space-y-4">
                {[
                  { icon: SparklesIcon, text: 'Upload your existing security policy documents (PDF or DOCX).' },
                  { icon: ShieldCheckIcon, text: 'Our AI performs a preliminary review against the four DESC ISR domains above.' },
                  { icon: UserGroupIcon, text: 'A certified CyberGOAT security professional reviews the AI findings before anything is sent to you.' },
                  { icon: LockClosedIcon, text: 'You receive your readiness score and findings by email, along with next-step recommendations.' },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-0.5 w-8 h-8 shrink-0 rounded-full bg-[#2F57EF]/20 flex items-center justify-center text-[#2F57EF]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed pt-1.5">{step.text}</p>
                    </li>
                  );
                })}
              </ol>
            </RevealOnScroll>

            {/* Honest disclosure - do not soften this */}
            <RevealOnScroll delay={0.15}>
              <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  <span>Please Read Before Submitting</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  This is an <strong className="text-white">AI-assisted preliminary assessment</strong>, reviewed by
                  a certified CyberGOAT security professional before you receive it. It&rsquo;s a starting point for
                  understanding your posture against DESC ISR &mdash; <strong className="text-white">not a
                  certified audit</strong>, and it does not substitute for a formal compliance certification or
                  regulatory assessment.
                </p>
              </div>
            </RevealOnScroll>

            {/* Privacy reassurance - kept general, not overpromised */}
            <RevealOnScroll delay={0.2}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 space-y-2">
                <div className="flex items-center gap-2 text-gray-200 font-bold text-sm">
                  <LockClosedIcon className="w-5 h-5 text-[#0DCAF0]" />
                  <span>About Your Documents</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  The documents you upload are used only to generate this readiness report and for our security
                  professional&rsquo;s review. We don&rsquo;t retain them indefinitely, and they aren&rsquo;t shared
                  outside of that review process. See our{' '}
                  <a href="/privacy" className="text-[#0DCAF0] hover:underline">
                    Privacy Policy
                  </a>{' '}
                  for how we handle personal data generally.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right column: form */}
          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <RevealOnScroll delay={0.1}>
              <DescIsrForm />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
