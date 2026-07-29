'use client';

import React, { useState } from 'react';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CheckBadgeIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export type TrackDetail = {
  stage: string;
  title: string;
  subtitle: string;
  duration: string;
  level: string;
  includesVoucher: boolean;
  certs: string[];
  modules: string[];
  careerPaths: string[];
  color: string;
};

export const TRACK_DETAILS: Record<string, TrackDetail> = {
  'Stage 1': {
    stage: 'Stage 1',
    title: 'Fundamentals Track',
    subtitle: 'Build essential security, privacy, and ethical hacking foundations.',
    duration: '40 Hours (4 Weeks)',
    level: 'Beginner',
    includesVoucher: false,
    certs: ['Cybersecurity Fundamentals', 'Ethical Hacking Intro', 'Privacy Basics'],
    modules: [
      'Module 1: Cyber Threat Landscape & Attack Vectors',
      'Module 2: Network Security & Encryption Principles',
      'Module 3: Identity & Access Management (IAM)',
      'Module 4: OWASP Top 10 Web Application Vulnerabilities',
      'Module 5: Fundamental Data Privacy Laws & Frameworks',
      'Module 6: Hands-On Security Lab Environments'
    ],
    careerPaths: ['Junior Security Analyst', 'IT Administrator', 'Compliance Coordinator', 'AppSec Trainee'],
    color: 'from-emerald-500 to-teal-500'
  },
  'Stage 2': {
    stage: 'Stage 2',
    title: 'Technical Defense Track',
    subtitle: 'Master hands-on penetration testing, digital forensics, and vulnerability exploitation.',
    duration: '80 Hours (8 Weeks)',
    level: 'Intermediate / Advanced',
    includesVoucher: true,
    certs: ['EC-Council CEH v12', 'EC-Council CHFI v11', 'VAPT Advanced Labs', 'AppSec Specialist'],
    modules: [
      'Module 1: Reconnaissance, Scanning & Footprinting',
      'Module 2: System Exploitation, Privilege Escalation & Pivoting',
      'Module 3: Web Application & Wireless Penetration Testing',
      'Module 4: Computer Hacking Forensic Investigation (CHFI Methodology)',
      'Module 5: Memory Analysis & Digital Evidence Collection',
      'Module 6: Official EC-Council iLabs & Live Range Exercises'
    ],
    careerPaths: ['Penetration Tester', 'Ethical Hacker', 'SOC Analyst L2/L3', 'Incident Responder'],
    color: 'from-[#0DCAF0] to-[#2F57EF]'
  },
  'Stage 3': {
    stage: 'Stage 3',
    title: 'GRC & Audit Track',
    subtitle: 'Lead enterprise risk governance, IT auditing, data privacy, and regulatory compliance.',
    duration: '60 Hours (6 Weeks)',
    level: 'Advanced',
    includesVoucher: false,
    certs: ['CISA (ISACA)', 'CISM (ISACA)', 'CRISC (ISACA)', 'CISSP (ISC2)', 'CIPP/E (Data Privacy)'],
    modules: [
      'Module 1: Information Systems Auditing & Internal Controls',
      'Module 2: Enterprise Risk Management (ERM) & ISO 27001 Alignment',
      'Module 3: Global Regulatory Frameworks (EU GDPR, DESC ISR, UAE PDPL, DORA)',
      'Module 4: Business Continuity & Disaster Recovery Planning (BCP/DRP)',
      'Module 5: Security Architecture & Vendor Risk Management',
      'Module 6: Audit Preparation & Board Risk Reporting'
    ],
    careerPaths: ['IT Auditor', 'GRC Manager', 'Data Protection Officer (DPO)', 'Risk & Compliance Director'],
    color: 'from-[#2F57EF] to-[#C664FF]'
  },
  'Stage 4': {
    stage: 'Stage 4',
    title: 'Executive CISO Track',
    subtitle: 'Command executive security governance, enterprise architecture, and board-level leadership.',
    duration: '50 Hours (5 Weeks)',
    level: 'Executive',
    includesVoucher: true,
    certs: ['EC-Council C|CISO', 'Applied Enterprise Security Architecture (ESA)', 'TOGAF 10'],
    modules: [
      'Module 1: Governance & Risk Management Domain (C|CISO Domain 1)',
      'Module 2: Information Security Controls, Compliance & Audit',
      'Module 3: Security Program Management & Strategic Planning',
      'Module 4: Information Security Core Competencies & Financial Management',
      'Module 5: Enterprise Architecture (SABSA / TOGAF Integration)',
      'Module 6: Executive Board Communications & C-Suite Risk Strategy'
    ],
    careerPaths: ['Chief Information Security Officer (CISO)', 'VP of Cybersecurity', 'Head of Security Governance'],
    color: 'from-[#C664FF] to-pink-500'
  }
};

export default function TrackDetailModal({
  stageKey,
  onClose
}: {
  stageKey: string | null;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    format: 'Online Live Interactive'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!stageKey || !TRACK_DETAILS[stageKey]) return null;

  const track = TRACK_DETAILS[stageKey];

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi CyberGOAT, I would like to inquire/enroll in the ${track.title} (${track.stage}). Please provide the upcoming schedule and fee details.\nName: ${formData.name || 'Student'}\nEmail: ${formData.email || 'N/A'}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl glass-card overflow-y-auto my-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest text-white bg-gradient-to-r ${track.color}`}>
                {track.stage}
              </span>
              {track.includesVoucher && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <CheckBadgeIcon className="w-4 h-4" /> Official EC-Council Voucher Included
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-white">{track.title}</h2>
            <p className="text-sm text-gray-400 max-w-2xl">{track.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-semibold">
              <ClockIcon className="w-4 h-4 text-[#0DCAF0]" /> Program Duration
            </span>
            <p className="text-sm font-bold text-white">{track.duration}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-semibold">
              <AcademicCapIcon className="w-4 h-4 text-[#C664FF]" /> Difficulty Level
            </span>
            <p className="text-sm font-bold text-white">{track.level}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 col-span-2 md:col-span-1">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-semibold">
              <BriefcaseIcon className="w-4 h-4 text-emerald-400" /> Target Career Roles
            </span>
            <p className="text-xs font-bold text-gray-300 truncate">{track.careerPaths.join(', ')}</p>
          </div>
        </div>

        {/* Curriculum & Included Certifications */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#05080F] border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-[#0DCAF0]" /> Track Syllabus &amp; Curriculum
            </h3>
            <div className="space-y-2.5">
              {track.modules.map((mod) => (
                <div key={mod} className="flex items-start gap-2.5 text-xs text-gray-300">
                  <CheckCircleIcon className="w-4 h-4 text-[#0DCAF0] shrink-0 mt-0.5" />
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#05080F] border border-white/10 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <AcademicCapIcon className="w-5 h-5 text-[#C664FF]" /> Included Certifications
              </h3>
              <div className="space-y-2 mb-6">
                {track.certs.map((c) => (
                  <div key={c} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center justify-between">
                    <span>{c}</span>
                    <CheckBadgeIcon className="w-4 h-4 text-[#0DCAF0]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#2F57EF]/10 border border-[#2F57EF]/30 text-xs text-gray-300 space-y-1">
              <p className="font-bold text-[#0DCAF0]">🎓 Guaranteed Exam Readiness</p>
              <p>Includes official courseware, practice exams, hands-on lab access, and instructor mentorship.</p>
            </div>
          </div>
        </div>

        {/* Dual Submission Form: Direct Form Submission OR WhatsApp */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#05080F] to-[#0A0F1A] border border-white/10 space-y-6">
          <h3 className="text-xl font-bold text-white">Enrollment &amp; Schedule Inquiry</h3>

          {!submitted ? (
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Preferred Training Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2F57EF]"
                  >
                    <option value="Online Live Interactive">Online Live Interactive</option>
                    <option value="In-Person Dubai Bootcamp">In-Person Dubai Bootcamp</option>
                    <option value="Corporate Enterprise Team">Corporate Enterprise Team</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {/* Option 1: Direct Form Submission to Admin */}
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white font-bold text-xs rounded-full hover:shadow-[0_0_25px_rgba(47,87,239,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PaperAirplaneIcon className="w-4 h-4" /> Submit Application Online
                </button>

                {/* Option 2: Pre-filled WhatsApp Connect */}
                <a
                  href={`https://wa.me/971551846786?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" /> Connect via WhatsApp (Pre-Filled)
                </a>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircleIcon className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">Enrollment Inquiry Submitted!</h4>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Thank you {formData.name}! Our admissions advisor will contact you at <strong className="text-white">{formData.email}</strong> within 2 hours with the full schedule and syllabus brochure.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#0DCAF0] underline cursor-pointer pt-2"
              >
                Submit another request
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
