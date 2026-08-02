'use client';

import React, { useState } from 'react';
import { BuildingOfficeIcon, UserGroupIcon, ShieldCheckIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function CorporateB2BSection() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    workEmail: '',
    phone: '',
    employeeCount: '5 - 10 Employees',
    targetTrack: 'EC-Council Corporate Track (CEH / C|CISO)',
    customTrack: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const chosenTrack = formData.targetTrack === 'Other' && formData.customTrack 
      ? `Custom: ${formData.customTrack}` 
      : formData.targetTrack;

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'B2B Corporate Training Inquiry',
          companyName: formData.companyName,
          name: formData.contactName,
          email: formData.workEmail,
          phone: formData.phone,
          details: `Group size: ${formData.employeeCount} | Target Track: ${chosenTrack}`,
        }),
      });
      setSubmitted(true);
    } catch {
      // Fallback submission success display
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="corporate" className="py-24 bg-[#0A0F1A] relative border-t border-white/5">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Information Side */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#2F57EF]/10 text-[#00F0FF] border border-[#2F57EF]/30">
              Enterprise B2B Training Solutions
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Upskill Your Corporate Cyber Defense Team
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Empower your enterprise IT security, SOC, and compliance teams with tailored group bootcamps at our Dubai Silicon Oasis campus or live on-site at your corporate headquarters.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <ShieldCheckIcon className="w-6 h-6 text-[#00F0FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Official EC-Council Accredited Partner</h4>
                  <p className="text-xs text-gray-400">Includes official courseware, iLabs access, and exam vouchers for your entire engineering team.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <BuildingOfficeIcon className="w-6 h-6 text-[#C664FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Dubai Campus &amp; On-Site Delivery</h4>
                  <p className="text-xs text-gray-400">Flexible delivery formats tailored to government entities, banks, and enterprise corporations across the GCC.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <UserGroupIcon className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Volume Corporate Discounts</h4>
                  <p className="text-xs text-gray-400">Special enterprise tier pricing and dedicated account manager support for groups of 5+ employees.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-6 bg-[#05080F] border border-white/10 rounded-3xl p-6 sm:p-10 glass-card shadow-2xl">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 text-left border-b border-white/10 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-white">Request Corporate Training Quote</h3>
                  <p className="text-xs text-gray-400">Receive a custom proposal and volume discount schedule within 24 hours.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Emirates Telecom / Bank"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g. Sarah Al-Maktoum (CISO)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="name@company.ae"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971 50 000 0000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Group Size</label>
                    <select
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                      className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                    >
                      <option>5 - 10 Employees</option>
                      <option>11 - 25 Employees</option>
                      <option>26 - 50 Employees</option>
                      <option>50+ Enterprise Team</option>
                    </select>
                  </div>
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Primary Training Track</label>
                    <select
                      value={formData.targetTrack}
                      onChange={(e) => setFormData({ ...formData, targetTrack: e.target.value })}
                      className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                    >
                      <option>EC-Council Corporate Track (CEH / C|CISO)</option>
                      <option>Digital Forensics &amp; DFIR (CHFI v11)</option>
                      <option>GRC &amp; ISO 27001 / UAE PDPL Compliance</option>
                      <option>Custom Enterprise Security Architecture</option>
                      <option value="Other">Other / Type Custom Course Title...</option>
                    </select>
                  </div>
                </div>

                {formData.targetTrack === 'Other' && (
                  <div className="text-left animate-in fade-in duration-200">
                    <label className="block text-xs font-semibold text-[#00F0FF] mb-1">Specify Your Custom Course / Topic</label>
                    <input
                      type="text"
                      required
                      onChange={(e) => setFormData({ ...formData, customTrack: e.target.value })}
                      placeholder="Type the specific course name or training topic (e.g. Cloud Security, SCADA, Threat Hunting)..."
                      className="w-full bg-white/5 border border-[#00F0FF]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <PaperAirplaneIcon className="w-4 h-4 text-black" />
                  {submitting ? 'Submitting Proposal...' : 'Request Custom Proposal & Quote'}
                </button>
              </form>
            ) : (
              <div className="py-12 space-y-4 text-center">
                <ShieldCheckIcon className="w-16 h-16 text-[#00F0FF] mx-auto animate-bounce" />
                <h3 className="text-2xl font-extrabold text-white">Proposal Request Received!</h3>
                <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.contactName}</strong>. Our enterprise training director will contact you at <strong>{formData.workEmail}</strong> within 24 hours with custom group pricing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
