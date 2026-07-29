'use client';

import React, { useState } from 'react';
import { 
  XMarkIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ChartBarIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ChevronRightIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { ContactTrigger } from './interactive-buttons';

type StepData = {
  experience: string;
  role: string;
  education: string;
  location: string;
  certifications: string[];
  goal: string;
};

const INITIAL_DATA: StepData = {
  experience: 'Beginner (0-2 yrs)',
  role: 'IT / Tech Practitioner',
  education: 'Computer Science / Engineering',
  location: 'UAE & Gulf Region',
  certifications: [],
  goal: 'Ethical Hacking, Pen Testing & Cyber Defense (Technical)',
};

const EXPERIENCE_OPTIONS = [
  'Beginner in Cybersecurity (0-2 yrs)',
  'Mid-Level Practitioner (2-5 yrs)',
  'Senior Security Pro / Lead (5+ yrs)',
  'Non-Technical Transitioner',
];

const ROLE_OPTIONS = [
  'Student / Recent Graduate',
  'IT Administrator / Systems Admin',
  'Software Developer / DevOps',
  'Security Analyst / SOC Analyst',
  'IT Manager / Compliance Officer',
];

const LOCATION_OPTIONS = [
  'UAE & Gulf Region (GCC)',
  'Europe (EU)',
  'Americas & Global',
  'Asia Pacific (APAC)',
];

const EDUCATION_OPTIONS = [
  'Computer Science / IT Degree',
  'Engineering / STEM',
  'Business / Management',
  'Law / Compliance',
  'Other / Self-Taught',
];

const CERT_OPTIONS = [
  'CompTIA Security+',
  'CEH (Certified Ethical Hacker)',
  'CISA (Auditor)',
  'CISM / CRISC',
  'CISSP',
  'CIPP/E or CIPM Privacy',
  'No Formal Certifications Yet',
];

const GOAL_OPTIONS = [
  'Ethical Hacking, Pen Testing & Cyber Defense (Technical)',
  'Digital Forensics & Incident Response (Technical)',
  'Executive CISO & Strategic Leadership (Technical / Executive)',
  'GRC, Audit & Compliance Management',
  'Data Privacy & Regulatory Frameworks (Privacy)',
];

export default function SkillAssessmentModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<StepData>(INITIAL_DATA);
  const [isCalculated, setIsCalculated] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsCalculated(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleCert = (cert: string) => {
    setData((prev) => {
      const exists = prev.certifications.includes(cert);
      if (exists) {
        return { ...prev, certifications: prev.certifications.filter((c) => c !== cert) };
      } else {
        return { ...prev, certifications: [...prev.certifications, cert] };
      }
    });
  };

  // Generate personalized market assessment with EC-Council advisory routing
  const getRecommendations = () => {
    const isGCC = data.location.includes('UAE');
    const isEU = data.location.includes('Europe');
    const isPrivacy = data.goal.includes('Privacy');
    const isExecutive = data.goal.includes('CISO') || data.experience.includes('Senior');
    const isForensics = data.goal.includes('Forensics');
    const isTechnical = data.goal.includes('Technical') || data.goal.includes('Hacking') || isForensics;

    let recommendedTrack = 'EC-Council CEH v12 (Certified Ethical Hacker)';
    let isEcCouncil = false;
    let ecCouncilCourses: string[] = [];
    let geoFramework = isGCC ? 'DESC ISR & UAE PDPL Privacy Laws' : isEU ? 'EU GDPR & DORA Compliance' : 'NIST 800-53 & ISO 27001';
    let peerPercentile = isExecutive ? '88th Percentile' : '74th Percentile';

    if (isPrivacy) {
      // Privacy stream remains standard IAPP / GDPR / PDPL
      recommendedTrack = 'CIPP/E & CIPM Privacy Manager Program';
      isEcCouncil = false;
    } else if (isExecutive) {
      // Executive Technical stream points to C|CISO & CCSE
      recommendedTrack = 'EC-Council C|CISO (Certified Chief Information Security Officer)';
      isEcCouncil = true;
      ecCouncilCourses = [
        'C|CISO (Certified Chief Info Security Officer)',
        'CCSE (Certified Cloud Security Engineer)',
        'CEH v12 (Certified Ethical Hacker)'
      ];
    } else if (isForensics) {
      // Technical Forensics stream points to CHFI, CTIA, CSA
      recommendedTrack = 'EC-Council CHFI + CTIA Incident Response Track';
      isEcCouncil = true;
      ecCouncilCourses = [
        'CHFI v11 (Computer Hacking Forensic Investigator)',
        'CTIA (Certified Threat Intelligence Analyst)',
        'CSA (Certified SOC Analyst)'
      ];
    } else if (isTechnical) {
      // All Technical goals route to EC-Council Certification suite (CEH, CND, CPENT)
      recommendedTrack = 'EC-Council Technical Certification Suite (CEH, CND, CPENT)';
      isEcCouncil = true;
      ecCouncilCourses = [
        'CEH v12 (Certified Ethical Hacker)',
        'CND v2 (Certified Network Defender)',
        'CPENT / LPT (Licensed Pen Tester Master)'
      ];
    } else {
      // GRC stream
      recommendedTrack = 'CISA / CISM + GRC Regulatory Frameworks';
      isEcCouncil = false;
    }

    return { recommendedTrack, isEcCouncil, ecCouncilCourses, geoFramework, peerPercentile, isPrivacy };
  };

  const results = getRecommendations();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl glass-card overflow-y-auto my-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2F57EF] to-[#0DCAF0] flex items-center justify-center text-white shrink-0">
              <ChartBarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                CyberGOAT Skill Gap Assessment <SparklesIcon className="w-4 h-4 text-[#0DCAF0] shrink-0" />
              </h3>
              <p className="text-xs text-gray-400">Benchmark your skills against industry standards &amp; geo-market demand</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {!isCalculated ? (
          <div>
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-1.5">
              <span>Step {step} of 4</span>
              <span>{step * 25}% Completed</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2F57EF] to-[#0DCAF0] h-full transition-all duration-300"
                style={{ width: `${step * 25}%` }}
              />
            </div>

            {/* Step 1: Experience & Role */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white">1. Current Experience &amp; Role</h4>
                
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Cybersecurity Experience Level
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setData({ ...data, experience: opt })}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                          data.experience === opt
                            ? 'bg-[#2F57EF]/20 border-[#2F57EF] text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Current Job Role
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {ROLE_OPTIONS.map((role) => (
                      <button
                        key={role}
                        onClick={() => setData({ ...data, role: role })}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                          data.role === role
                            ? 'bg-[#2F57EF]/20 border-[#2F57EF] text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Education */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white">2. Geo Location &amp; Education</h4>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Target Geo Market / Location
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {LOCATION_OPTIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setData({ ...data, location: loc })}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                          data.location === loc
                            ? 'bg-[#0DCAF0]/20 border-[#0DCAF0] text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <GlobeAltIcon className="w-4 h-4 text-[#0DCAF0]" />
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Educational Background
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {EDUCATION_OPTIONS.map((edu) => (
                      <button
                        key={edu}
                        onClick={() => setData({ ...data, education: edu })}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                          data.education === edu
                            ? 'bg-[#0DCAF0]/20 border-[#0DCAF0] text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {edu}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Current Certifications */}
            {step === 3 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white">3. Current Certifications &amp; Credentials</h4>
                <p className="text-xs text-gray-400">Select all certifications you currently hold:</p>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {CERT_OPTIONS.map((cert) => {
                    const isChecked = data.certifications.includes(cert);
                    return (
                      <button
                        key={cert}
                        onClick={() => toggleCert(cert)}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#C664FF]/20 border-[#C664FF] text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        <span>{cert}</span>
                        {isChecked && <CheckCircleIcon className="w-4 h-4 text-[#C664FF]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Target Career Goals */}
            {step === 4 && (
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white">4. Aspiring Career Track &amp; Goals</h4>
                <p className="text-xs text-gray-400">Select your primary career aspiration:</p>

                <div className="grid gap-2.5">
                  {GOAL_OPTIONS.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setData({ ...data, goal: goal })}
                      className={`p-3.5 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                        data.goal === goal
                          ? 'bg-gradient-to-r from-[#2F57EF]/30 to-[#C664FF]/30 border-[#C664FF] text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <span>{goal}</span>
                      <ChevronRightIcon className="w-4 h-4 text-[#0DCAF0]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white text-xs font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(47,87,239,0.4)] cursor-pointer flex items-center gap-1.5"
              >
                {step === 4 ? 'Generate Advisory Assessment' : 'Next Step'} <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Assessment Results Screen with EC-Council Advisory Focus */
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#05080F] to-[#0A0F1A] border border-[#0DCAF0]/30 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0DCAF0]/20 text-[#0DCAF0] border border-[#0DCAF0]/30">
                  Peer Benchmark: {results.peerPercentile}
                </span>
                {results.isEcCouncil && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <CheckBadgeIcon className="w-4 h-4" /> EC-Council Authorized Pathway
                  </span>
                )}
                <span className="text-xs text-gray-400">Target Region: {data.location}</span>
              </div>

              <h4 className="text-2xl font-bold text-white">Your Skill Gap Advisory Analysis</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Based on your technical profile ({data.experience}) and target track ({data.goal}), here is your advisory recommendation evaluated by CyberGOAT:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Primary Recommended Track */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <LightBulbIcon className="w-4 h-4 text-amber-400" /> Recommended Training Track
                </h5>
                <p className="text-sm font-semibold text-[#0DCAF0]">{results.recommendedTrack}</p>
                
                {results.isEcCouncil && results.ecCouncilCourses.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Included EC-Council Certifications:
                    </p>
                    {results.ecCouncilCourses.map((c) => (
                      <div key={c} className="flex items-center gap-1.5 text-xs text-gray-300">
                        <CheckBadgeIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {c}
                      </div>
                    ))}
                    <p className="text-[11px] text-gray-400 pt-1 italic">
                      *Includes official EC-Council exam vouchers, official courseware, and hands-on iLabs.
                    </p>
                  </div>
                )}

                {results.isPrivacy && (
                  <p className="text-xs text-gray-400 pt-1">
                    Aligned with CIPP/E, CIPM, EU GDPR, and UAE PDPL compliance standards.
                  </p>
                )}
              </div>

              {/* Geo-Market Regulatory Focus */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <GlobeAltIcon className="w-4 h-4 text-[#C664FF]" /> Geo-Market Regulatory Focus
                </h5>
                <p className="text-sm font-semibold text-[#C664FF]">{results.geoFramework}</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Specifically tailored to legal frameworks, ISR audit requirements, and enterprise compliance mandates in your target market ({data.location}).
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/10">
              <button
                onClick={() => {
                  setIsCalculated(false);
                  setStep(1);
                }}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
              >
                Retake Advisory Assessment
              </button>

              <ContactTrigger className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white font-bold text-xs rounded-full hover:shadow-[0_0_25px_rgba(47,87,239,0.5)] transition-all cursor-pointer">
                Book EC-Council Advisor Consultation
              </ContactTrigger>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
