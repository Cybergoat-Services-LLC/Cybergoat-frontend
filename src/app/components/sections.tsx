import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircleIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  CpuChipIcon,
  SparklesIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import RevealOnScroll from './RevealOnScroll';
import { ContactTrigger, SignInTrigger, AssessmentTrigger, TrackTrigger } from './interactive-buttons';
import { SOCIAL_LINKS } from '@/config/socials';

export const HeroSection = () => (
  <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-24 overflow-hidden bg-[#0A0F1A]">
    {/* Cyber Grid & Scanline Background Isolated (Zero Mask Interference) */}
    <div className="absolute inset-0 cyber-grid cyber-scanline pointer-events-none" />

    {/* Subtle High-Tech Ambient Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-35 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2F57EF] via-[#00F0FF] to-[#C664FF] blur-[120px] rounded-full mix-blend-screen opacity-40" />
    </div>

    <div className="container mx-auto px-6 relative z-10 text-center">
      <div>
        {/* Sleek Cyber Security Partner Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-semibold mb-6 backdrop-blur-md shadow-sm">
          <span className="font-mono text-[11px] text-[#00F0FF]/80 uppercase tracking-wider">[AUTH_PARTNER]</span>
          <span className="w-1 h-1 rounded-full bg-[#00F0FF] animate-pulse"></span>
          <span>EC-Council Authorized Reseller &amp; Training Partner</span>
        </div>

        {/* Refined High-Contrast Crisp Headline (Un-bloated) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.06] mb-6 max-w-4xl mx-auto">
          Dubai&rsquo;s EC-Council{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#38BDF8] to-[#00F0FF] font-extrabold">
            Training
          </span>{' '}
          &amp; Cybersecurity{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C664FF] via-[#E066FF] to-[#F472B6] font-extrabold">
            Consulting
          </span>{' '}
          Authority.
        </h1>

        {/* High-Contrast Executive Sales Sub-Headline */}
        <p className="text-xl sm:text-2xl text-white font-bold mb-8 max-w-3xl mx-auto leading-relaxed">
          Official EC-Council certification pathways, GRC &amp; security architecture consulting, Virtual CISO retainers, AI/GenAI governance advisory, and a free AI-powered compliance readiness score.
        </p>

        {/* 3 High-Impact Cyber Sales Value Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10 text-left">
          <div className="bg-[#05080F] border border-[#00F0FF]/40 rounded-3xl p-6 glass-card hover:border-[#00F0FF] transition-all">
            <div className="flex items-center gap-2 mb-2 text-[#00F0FF] font-extrabold text-sm uppercase tracking-wider">
              <ShieldCheckIcon className="w-5 h-5 text-[#00F0FF]" />
              <span>Official EC-Council Vouchers</span>
            </div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              Direct official exam vouchers, courseware &amp; global certification pathways for CHFI, C|CISO &amp; CEH.
            </p>
          </div>

          <div className="bg-[#05080F] border border-[#C664FF]/40 rounded-3xl p-6 glass-card hover:border-[#C664FF] transition-all">
            <div className="flex items-center gap-2 mb-2 text-[#E066FF] font-extrabold text-sm uppercase tracking-wider">
              <CpuChipIcon className="w-5 h-5 text-[#E066FF]" />
              <span>Official EC-Council iLabs</span>
            </div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              220+ hands-on lab exercises bundled with official vouchers &mdash; real attack &amp; defense scenarios, not simulations.
            </p>
          </div>

          <div className="bg-[#05080F] border border-[#38BDF8]/40 rounded-3xl p-6 glass-card hover:border-[#38BDF8] transition-all">
            <div className="flex items-center gap-2 mb-2 text-[#38BDF8] font-extrabold text-sm uppercase tracking-wider">
              <BriefcaseIcon className="w-5 h-5 text-[#38BDF8]" />
              <span>GRC, Security &amp; AI Governance Advisory</span>
            </div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              Security architecture design, GRC/compliance advisory, Virtual CISO retainers, and AI/GenAI governance consulting &mdash; led by CISA/CISM-certified practitioners.
            </p>
          </div>
        </div>

        {/* Sleek Cybersecurity Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center max-w-2xl mx-auto">
          <AssessmentTrigger className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg">
            <SparklesIcon className="w-4 h-4 text-black" /> Evaluate Skill Gap (2-Min Free)
          </AssessmentTrigger>
          <a
            href="#courses"
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white font-bold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_25px_rgba(198,100,255,0.4)] hover:scale-[1.02] transition-all cursor-pointer shadow-lg"
          >
            Explore Courses
          </a>
          <Link
            href="/desc-isr-readiness"
            className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-[#C664FF]/40 text-[#C664FF] font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#C664FF]/10 transition-all cursor-pointer"
          >
            Assess DESC ISR, PDPL &amp; AI Compliance
          </Link>
          <ContactTrigger className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-[#00F0FF]/40 text-[#00F0FF] font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#00F0FF]/10 transition-all cursor-pointer">
            Contact Advisor
          </ContactTrigger>
        </div>

        {/* Reseller Accreditation Trust Banner */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-center items-center gap-6 opacity-85">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Official Reseller:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Image src="/ec-council-logo.jpeg" alt="EC-Council Authorized Reseller" width={100} height={40} className="rounded brightness-110 contrast-125 object-contain" />
          </div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-2">
            Independent Exam Prep:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-200">ISACA (CISA / CISM / CRISC)</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-200">ISC2 (CISSP)</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-gray-200">IAPP (CIPP/E, CIPM)</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const StatsBar = () => (
  <section className="py-12 bg-[#05080F] border-y border-white/10 relative z-20">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="space-y-1">
          <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0DCAF0] to-[#2F57EF]">
            10+ Years
          </div>
          <p className="text-xs md:text-sm text-gray-400 font-medium">Certified Instructor Experience</p>
        </div>
        <div className="space-y-1">
          <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#C664FF] to-[#2F57EF]">
            100%
          </div>
          <p className="text-xs md:text-sm text-gray-400 font-medium">Official Exam Voucher Included</p>
        </div>
        <div className="space-y-1">
          <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0DCAF0] to-[#C664FF]">
            GDPR &amp; ISR
          </div>
          <p className="text-xs md:text-sm text-gray-400 font-medium">Regulatory Framework Aligned</p>
        </div>
        <div className="space-y-1">
          <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2F57EF] to-[#0DCAF0]">
            Free AI Tool
          </div>
          <p className="text-xs md:text-sm text-gray-400 font-medium">Automated Compliance Readiness Scoring</p>
        </div>
      </div>
    </div>
  </section>
);

export const CareerRoadmapSection = () => (
  <section className="py-24 bg-[#0A0F1A] relative border-b border-white/5">
    <div className="container mx-auto px-6">
      <RevealOnScroll className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-sm font-bold tracking-widest text-[#0DCAF0] uppercase mb-4">
          Structured Career Pathways
        </h2>
        <h3 className="text-4xl font-bold text-white mb-6">
          Your Guided Journey from Practitioner to CISO
        </h3>
        <p className="text-xl text-gray-400">
          We don&rsquo;t just teach isolated classes. We guide your career step-by-step with accredited certifications.
        </p>
      </RevealOnScroll>

      <div className="grid md:grid-cols-4 gap-6 relative">
        {[
          {
            stage: 'Stage 1',
            title: 'Fundamentals',
            icon: ShieldCheckIcon,
            desc: 'Build essential security, privacy, and ethical hacking foundations.',
            certs: ['Cybersecurity Fundamentals', 'Ethical Hacking Intro', 'Privacy Basics'],
            color: 'border-emerald-500/30 text-emerald-400',
          },
          {
            stage: 'Stage 2',
            title: 'Technical Defense',
            icon: CpuChipIcon,
            desc: 'Master hands-on penetration testing, forensics, and vulnerability assessment.',
            certs: ['CEH v13 AI', 'CHFI v11', 'VAPT Advanced', 'AppSec'],
            color: 'border-[#0DCAF0]/30 text-[#0DCAF0]',
          },
          {
            stage: 'Stage 3',
            title: 'GRC & Audit',
            icon: BuildingOffice2Icon,
            desc: 'Lead enterprise risk governance, audit, privacy management, and compliance.',
            certs: ['CISA', 'CISM', 'CRISC', 'CISSP', 'CIPP/E'],
            color: 'border-[#2F57EF]/30 text-[#2F57EF]',
          },
          {
            stage: 'Stage 4',
            title: 'Executive CISO',
            icon: AcademicCapIcon,
            desc: 'Command executive security governance, enterprise architecture, and board leadership.',
            certs: ['C|CISO', 'Applied ESA', 'TOGAF 10'],
            color: 'border-[#C664FF]/30 text-[#C664FF]',
          },
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <RevealOnScroll key={item.stage} delay={idx * 0.1} className="relative">
              <div className={`h-full bg-[#05080F] border rounded-3xl p-6 glass-card flex flex-col justify-between ${item.color}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      {item.stage}
                    </span>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">{item.desc}</p>
                  
                  <div className="space-y-2 mb-6">
                    {item.certs.map((c) => (
                      <div key={c} className="flex items-center gap-2 text-xs text-gray-300">
                        <ChevronRightIcon className="w-3.5 h-3.5 text-[#0DCAF0]" /> {c}
                      </div>
                    ))}
                  </div>
                </div>

                <TrackTrigger stageKey={item.stage} className="w-full py-2.5 text-center bg-[#2F57EF]/20 hover:bg-[#2F57EF] text-xs font-bold text-white rounded-full transition-all border border-[#2F57EF]/40 shadow-lg cursor-pointer">
                  Explore Syllabus &amp; Enroll
                </TrackTrigger>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </div>
  </section>
);

export const ApproachSection = () => (
  <section className="py-24 bg-[#05080F] relative border-y border-white/5">
    <div className="container mx-auto px-6 space-y-24">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <RevealOnScroll className="space-y-8">
          <h2 className="text-sm font-bold tracking-widest text-[#0DCAF0] uppercase">Who We Are</h2>
          <h3 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Empowering individuals and businesses.
          </h3>
          <p className="text-xl text-gray-400">
            CyberGOAT empowers individuals and businesses to navigate the ever-shifting
            landscape of security and privacy. In a world where regulations scramble to
            keep pace with emerging technologies like AI, our training and consulting
            solutions provide a critical edge.
          </p>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-[#2F57EF]/20 flex items-center justify-center text-[#2F57EF]">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">Expert-Led Training</h4>
                <p className="text-gray-400">
                  Delivered by certified instructors with an average of 10+ years of
                  practical and pedagogical experience.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-[#2F57EF]/20 flex items-center justify-center text-[#2F57EF]">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">Customizable Training</h4>
                <p className="text-gray-400">
                  Designed to scale and future-proof the security posture of businesses
                  across all industries.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-[#2F57EF]/20 flex items-center justify-center text-[#2F57EF]">
                <CheckCircleIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">GRC &amp; Security Advisory</h4>
                <p className="text-gray-400">
                  Direct consulting engagements for compliance advisory, security
                  architecture, Virtual CISO retainers, and AI/GenAI governance &mdash;
                  beyond the classroom.
                </p>
              </div>
            </li>
          </ul>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#C664FF]/20 to-transparent blur-3xl" />
          <div className="bg-[#0A0F1A] border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl overflow-hidden glass-card">
            <h4 className="text-2xl font-bold text-white mb-6">Our Strategy</h4>
            <p className="text-gray-300 text-lg mb-8">
              &ldquo;Our strategy involves pre-consultation and understanding your training
              needs. We customise the courses as best suitable for the individual&rsquo;s or
              entity&rsquo;s objectives and ensure best-in-class training solutions provided
              with assessments and certifications.&rdquo;
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Market Analysis',
                'Course Development',
                'Pre-Consultation',
                'Customisation',
                'Pre-Assessment',
                'Training',
                'Post-Assessment',
                'Exam Voucher',
                'Certified',
              ].map((step, i) => (
                <span
                  key={step}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2F57EF]/10 text-[#0DCAF0] border border-[#2F57EF]/20"
                >
                  {i + 1}. {step}
                </span>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <RevealOnScroll className="rounded-3xl overflow-hidden border border-white/10 glass-card">
          <div className="relative h-56 w-full">
            <Image src="/cg-assets/vision.jpg" alt="Vision" fill className="object-cover" />
          </div>
          <div className="p-8">
            <h4 className="text-2xl font-bold text-white mb-3">Vision</h4>
            <p className="text-gray-400">
              To empower success to individuals and businesses by providing strategically
              aligned, career-focused growth in the field of Cybersecurity &amp; Privacy.
              With quality as paramount concern, we aim to be leading with innovative
              solutions in a sustainable manner by staying ahead of the growing threat and
              regulatory landscape.
            </p>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="rounded-3xl overflow-hidden border border-white/10 glass-card">
          <div className="relative h-56 w-full">
            <Image src="/cg-assets/mission.jpg" alt="Mission" fill className="object-cover" />
          </div>
          <div className="p-8">
            <h4 className="text-2xl font-bold text-white mb-3">Mission</h4>
            <p className="text-gray-400">
              To deliver quality-based exceptional training and advisory experiences,
              transforming the career and business journey with best-in-class training
              resources, expert coaches, and trusted GRC and security consulting.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  </section>
);

const REGULATIONS = [
  'GDPR (EU)',
  'UAE PDPL',
  'DPDP (India)',
  'DESC ISR',
  'NIS2 Framework',
  'DORA Compliance',
  'GenAI & Privacy Rules',
  'AI Governance Requirements',
];

export const GRCSection = () => (
  <section className="py-24 bg-[#0A0F1A] relative">
    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
      <RevealOnScroll className="relative rounded-3xl overflow-hidden border border-white/10 glass-card order-2 lg:order-1">
        <div className="relative h-72 w-full">
          <Image
            src="/cg-assets/grc_cyber_shield.png"
            alt="GRC Interpretation & Regulatory Compliance"
            fill
            className="object-cover"
          />
        </div>
      </RevealOnScroll>
      <RevealOnScroll delay={0.1} className="order-1 lg:order-2 space-y-6">
        <h2 className="text-sm font-bold tracking-widest text-[#0DCAF0] uppercase">
          GRC Interpretation
        </h2>
        <h3 className="text-4xl font-bold text-white leading-tight">
          Simplifying the regulatory landscape.
        </h3>
        <p className="text-xl text-gray-400">
          With rising trends in technologies and threats, regulations are increasing
          world-wide. We help you interpret these regulations and compliance requirements
          &mdash; sector-specific and organization-specific &mdash; and simplify their
          relationship to other compliance laws.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {REGULATIONS.map((reg) => (
            <span
              key={reg}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-[#C664FF]/10 text-[#C664FF] border border-[#C664FF]/20"
            >
              {reg}
            </span>
          ))}
        </div>
        <ContactTrigger className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(47,87,239,0.4)] transition-all cursor-pointer">
          Contact Us to Know More
        </ContactTrigger>
      </RevealOnScroll>
    </div>
  </section>
);

export const DescIsrCtaSection = () => (
  <section className="py-16 bg-[#0A0F1A] border-b border-white/5 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] opacity-25 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2F57EF] via-[#00F0FF] to-[#C664FF] blur-[110px] rounded-full mix-blend-screen" />
    </div>
    <div className="container mx-auto px-6 relative z-10">
      <RevealOnScroll className="max-w-4xl mx-auto rounded-3xl border border-[#00F0FF]/30 bg-[#0A0F1A] glass-card p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center">
          <ShieldCheckIcon className="w-7 h-7 text-[#00F0FF]" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-extrabold text-white mb-1.5">
            Free UAE Compliance Readiness Score
          </h3>
          <p className="text-sm md:text-base text-gray-400">
            Upload your policies and get a free preliminary readiness score against DESC ISR, UAE PDPL, and/or
            DESC&rsquo;s AI Security Policy &mdash; AI-assisted, reviewed by a certified CyberGOAT professional.
          </p>
        </div>
        <Link
          href="/desc-isr-readiness"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.02] transition-all cursor-pointer whitespace-nowrap"
        >
          Get My Score <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </RevealOnScroll>
    </div>
  </section>
);

const TESTIMONIALS = [
  {
    quote:
      'CyberGOAT provided exceptional structured cybersecurity workshops for our students. Their practical approach and expert mentorship made complex topics accessible and engaging.',
    name: 'eKutub Education Society',
    role: 'Educational Partner',
  },
  {
    quote:
      'Partnering with CyberGOAT for enterprise security awareness upgraded our operational posture significantly. Top-tier training delivered with true professionalism.',
    name: 'Vision Era',
    role: 'Enterprise Client',
  },
  {
    quote:
      'The C|CISO executive training program at CyberGOAT was outstanding. The strategic insights, governance frameworks, and board-level risk guidance prepared me to lead at the highest level.',
    name: 'Pradeep Nagula',
    role: 'Certified Chief Information Security Officer (C|CISO)',
  },
  {
    quote:
      'The corporate training tailored for our legal and compliance teams was invaluable. CyberGOAT bridged technical defense with data privacy laws seamlessly.',
    name: 'Collegium De Legalpreneur',
    role: 'Corporate Training Partner',
  },
  {
    quote:
      'The Ethical Hacking Bootcamp at CyberGOAT was a game-changer. The hands-on demonstrations were incredibly realistic, and the instructor brought deep, real-world experience.',
    name: 'Anonymous',
    role: 'Cyber Security Consultant, Big4',
  },
  {
    quote:
      'The CEH v12 preparation track exceeded my expectations. The hands-on labs and official EC-Council exam guidance made achieving my certification seamless.',
    name: 'Anonymous',
    role: 'Senior Security Analyst',
  },
  {
    quote:
      'CyberGOAT’s GRC and Data Privacy training provided clear, actionable insights for navigating complex regulatory frameworks like GDPR and UAE ISR.',
    name: 'Anonymous',
    role: 'GRC & Privacy Specialist',
  },
];

export const TestimonialsSection = () => (
  <section className="py-24 bg-[#05080F] border-y border-white/5">
    <div className="container mx-auto px-6">
      <RevealOnScroll className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-sm font-bold tracking-widest text-[#0DCAF0] uppercase mb-4">
          Testimonials
        </h2>
        <h3 className="text-4xl font-bold text-white">What our clients say about us</h3>
      </RevealOnScroll>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <RevealOnScroll
            key={`${t.name}-${i}`}
            delay={i * 0.05}
            className="rounded-3xl border border-white/10 p-6 glass-card flex flex-col justify-between"
          >
            <p className="text-gray-300 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-white font-bold text-sm">{t.name}</p>
              <p className="text-[#0DCAF0] text-xs font-medium">{t.role}</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="bg-[#020408] border-t border-white/5 pt-20 pb-10">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center gap-6 mb-10">
        <Image 
          src="/CG White logo_.PNG" 
          alt="CyberGOAT" 
          width={360} 
          height={120} 
          className="h-20 md:h-24 w-auto object-contain logo-bright-blue" 
        />
        <div className="flex items-center gap-6">
          <Image
            src="/ec-council-logo.jpeg"
            alt="EC-Council Partner"
            width={100}
            height={40}
            className="opacity-60 hover:opacity-100 transition-opacity rounded"
          />
        </div>
        {/* Verified Omnichannel Social Media Hub */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-gray-300 py-3 border-y border-white/5 w-full max-w-3xl mx-auto">
          <span className="text-gray-400 uppercase tracking-widest text-[10px]">Follow CyberGOAT:</span>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#00F0FF] hover:text-[#00F0FF] transition-all flex items-center gap-1.5 font-bold"
          >
            <span>LinkedIn</span>
          </a>
          <a
            href={SOCIAL_LINKS.x}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#00F0FF] hover:text-[#00F0FF] transition-all flex items-center gap-1.5 font-bold"
          >
            <span>Twitter / X</span>
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[#00F0FF] hover:text-[#00F0FF] transition-all flex items-center gap-1.5 font-bold"
          >
            <span>Facebook</span>
          </a>
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-[#00F0FF]/20 transition-all flex items-center gap-1.5 font-bold"
          >
            <span>WhatsApp</span>
          </a>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 flex items-center gap-1 cursor-not-allowed">
            <span>Instagram</span> <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">Soon</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 flex items-center gap-1 cursor-not-allowed">
            <span>TikTok</span> <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">Soon</span>
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-400">
          <a href="#courses" className="hover:text-white transition-colors cursor-pointer">
            Courses
          </a>
          <ContactTrigger className="hover:text-white transition-colors cursor-pointer">Contact</ContactTrigger>
          <SignInTrigger className="hover:text-white transition-colors cursor-pointer">Sign In</SignInTrigger>
          <a href="/privacy" className="hover:text-white transition-colors cursor-pointer">
            Privacy Policy
          </a>
          <a href="/refund-policy" className="hover:text-[#00F0FF] transition-colors cursor-pointer font-semibold text-gray-300">
            Refund &amp; Cancellation Policy
          </a>
          <a
            href="https://wa.me/971551846786"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors cursor-pointer"
          >
            WhatsApp
          </a>
        </div>
        <div className="text-sm text-gray-500 flex flex-wrap justify-center gap-6">
          <span>+971 55 184 6786</span>
          <span>admin@cybergoat.ae</span>
          <span>Dubai, UAE</span>
        </div>
      </div>
      <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-xs space-y-3">
        <p className="text-[11px] text-gray-400 max-w-4xl mx-auto leading-relaxed opacity-75">
          <strong>Trademark &amp; Accreditation Disclaimer:</strong> CyberGOAT Services LLC is an official <strong>EC-Council Authorized Reseller &amp; Training Partner</strong>. EC-Council®, CEH®, C|CISO®, CHFI®, CND®, CPENT®, CSA®, CTIA®, CCSE® are registered trademarks of EC-Council. CIPP/E®, CIPM®, and IAPP® are registered trademarks of the International Association of Privacy Professionals. CISA®, CISM®, CRISC® are registered trademarks of ISACA. CISSP® is a registered trademark of ISC2. Third-party privacy and certification training tracks delivered by CyberGOAT are independent exam preparation masterclasses and regulatory compliance framework alignment programs.
        </p>
        <p>© 2026 CyberGOAT Services LLC. All rights reserved. Dubai Silicon Oasis, Dubai, UAE.</p>
      </div>
    </div>
  </footer>
);
