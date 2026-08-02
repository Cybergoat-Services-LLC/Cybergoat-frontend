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
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { TRACK_DETAILS } from '@/app/lib/trackDetails';

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!stageKey || !TRACK_DETAILS[stageKey]) return null;

  const track = TRACK_DETAILS[stageKey];

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageKey,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          format: formData.format,
        }),
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        "We couldn't submit your inquiry right now. Please use the WhatsApp option below instead, or try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
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
                <AcademicCapIcon className="w-5 h-5 text-[#C664FF]" /> {track.certHeader}
              </h3>
              <div className="space-y-2 mb-6">
                {track.certs.map((c) => (
                  <div key={c} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center justify-between gap-2">
                    <span>{c}</span>
                    <CheckBadgeIcon className={`w-4 h-4 shrink-0 ${c.includes('Voucher Included') ? 'text-amber-400' : 'text-[#0DCAF0]'}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-2xl border text-xs text-gray-300 space-y-1 ${
              track.isOfficialPartner 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-[#2F57EF]/10 border-[#2F57EF]/30'
            }`}>
              <p className={`font-bold ${track.isOfficialPartner ? 'text-amber-300' : 'text-[#0DCAF0]'}`}>
                {track.readinessTitle}
              </p>
              <p className="leading-relaxed">{track.readinessDesc}</p>
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

              {submitError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                  <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {/* Option 1: Direct Form Submission to Admin */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white font-bold text-xs rounded-full hover:shadow-[0_0_25px_rgba(47,87,239,0.5)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <PaperAirplaneIcon className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Application Online'}
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
