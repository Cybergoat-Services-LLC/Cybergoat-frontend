import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  AcademicCapIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { CERTIFICATIONS } from '../components/courses-data';
import RoiCalculator from '../components/RoiCalculator';
import ChatbotWidget from '../components/ChatbotWidget';
import { ContactTrigger } from '../components/interactive-buttons';

export const metadata: Metadata = {
  title: 'CyberGOAT Academy — Official EC-Council Certification & Workforce Pathways (Dubai, UAE)',
  description: 'Official EC-Council Authorized Reseller (ID: ECRS21832). Hands-on cybersecurity training, cloud iLabs, and official certification exam vouchers for CEH v13 AI, C|CISO, CHFI, CCSE, CSA, and CND.',
  alternates: {
    canonical: 'https://www.cybergoat.ae/academy',
  },
  openGraph: {
    title: 'CyberGOAT Academy — EC-Council Authorized Training Partner',
    description: 'Master accredited cybersecurity certifications in the UAE. Official courseware, cloud iLabs, and exam vouchers with direct evidence mapping to sovereign GRC frameworks.',
    url: 'https://www.cybergoat.ae/academy',
    siteName: 'CyberGOAT Sovereign GRC & Academy',
    locale: 'en_US',
    type: 'website',
  },
};

const WHATSAPP_CHAT_URL = 'https://wa.me/971551846786?text=Hi%20CyberGOAT%20Academy,%20I%20want%20to%20inquire%20about%20EC-Council%20courses';

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[#0A0F1A] text-white selection:bg-[#C664FF]/30 font-sans">
      {/* Top Banner & Navigation */}
      <nav className="fixed w-full z-50 top-0 bg-[#0A0F1A]/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#00F0FF] transition-colors">
              <ArrowLeftIcon className="w-4 h-4" /> Return to Sovereign GRC Platform
            </Link>
            <span className="hidden md:inline-block h-4 w-px bg-white/10" />
            <Link href="/academy" className="hidden md:flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#C664FF]">
                CYBERGOAT ACADEMY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C664FF]/10 text-[#C664FF] border border-[#C664FF]/20">
                PRACTITIONER PORTAL
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-[#00F0FF] transition-colors px-3 py-2"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              WhatsApp Advisor
            </a>
            <ContactTrigger className="px-5 py-2 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white text-xs font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(47,87,239,0.4)] cursor-pointer">
              Enroll Now
            </ContactTrigger>
          </div>
        </div>
      </nav>

      {/* Academy Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0A0F1A]">
        <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C664FF] via-[#2F57EF] to-[#00F0FF] blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C664FF]/30 bg-[#C664FF]/10 text-[#C664FF] text-xs font-semibold mb-6">
            <AcademicCapIcon className="w-4 h-4 text-[#C664FF]" />
            <span>Official EC-Council Authorized Reseller (Partner ID: ECRS21832)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Accredited Cybersecurity Certification &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C664FF] to-[#00F0FF]">
              Hands-On Practical Enablement
            </span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Direct access to official EC-Council certification courseware, dedicated cloud iLabs, and accredited exam vouchers. Prepare for industry-recognized credentials with authentic study materials and expert advisory.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-[#00F0FF]" /> Official Courseware Included</span>
            <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-[#00F0FF]" /> Cloud iLabs Access (6 Months)</span>
            <span className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-[#C664FF]" /> Official Exam Voucher Included</span>
          </div>
        </div>
      </section>

      {/* Practitioner Catalog Grid */}
      <section className="py-20 bg-[#05080F] border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Official Certification Catalog</h2>
            <p className="text-gray-400 text-sm">
              Select an accredited certification program to view duration, syllabus highlights, and kit inclusions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.title}
                className="bg-[#0A0F1A] border border-white/10 rounded-2xl p-6 glass-card hover:border-[#C664FF]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#C664FF]/10 text-[#C664FF] border border-[#C664FF]/20">
                      {cert.level ?? 'Professional'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{cert.duration ?? '40 Hours'}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">{cert.description}</p>

                  <div className="space-y-2 mb-6 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-[#22D3A8]" />
                      <span>Official e-Courseware &amp; Video Modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-[#22D3A8]" />
                      <span>Hands-On CyberQ Cloud iLabs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-[#22D3A8]" />
                      <span>1x Official Exam Voucher Included</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  <a
                    href={`${WHATSAPP_CHAT_URL}%20about%20${encodeURIComponent(cert.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2.5 bg-[#C664FF]/10 hover:bg-[#C664FF]/20 text-[#C664FF] border border-[#C664FF]/30 text-xs font-bold rounded-xl transition-all"
                  >
                    Inquire Syllabus &amp; Enrollment
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GCC Career & Compensation Benchmarks (Moved from main page) */}
      <RoiCalculator />

      {/* Academy FAQ & Footer */}
      <footer className="py-16 bg-[#0A0F1A] border-t border-white/10 text-xs text-gray-400">
        <div className="container mx-auto px-6 text-center space-y-4 max-w-4xl">
          <p>
            CyberGOAT Services LLC is an Authorized Reseller of EC-Council programs (Partner ID: ECRS21832).
            All certifications, examinations, and official credentials are administered and awarded directly by EC-Council.
          </p>
          <div className="flex justify-center gap-6 pt-4 text-gray-300">
            <Link href="/" className="hover:text-[#00F0FF] transition-colors">
              Sovereign GRC Platform
            </Link>
            <Link href="/privacy" className="hover:text-[#00F0FF] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-[#00F0FF] transition-colors">
              Refund Policy
            </Link>
          </div>
          <p className="text-gray-500 pt-4">&copy; {new Date().getFullYear()} CyberGOAT Services LLC. All rights reserved.</p>
        </div>
      </footer>

      <ChatbotWidget />
    </main>
  );
}
