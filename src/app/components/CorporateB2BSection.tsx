'use client';

import React, { useState } from 'react';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

export default function CorporateB2BSection() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    workEmail: '',
    phone: '',
    tierSelection: 'Enterprise Suite (Platform + 15 Annual Seats)',
    invoicingPreference: 'Unified Commercial Invoice (Single Master Agreement)',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'b2b',
          companyName: formData.companyName,
          name: formData.contactName,
          email: formData.workEmail,
          phone: formData.phone,
          details: `Tier: ${formData.tierSelection} | Invoicing: ${formData.invoicingPreference}`,
        }),
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        "We couldn't submit your request right now. Please try again, or reach us directly on WhatsApp."
      );
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
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              Enterprise Procurement &amp; Licensing
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Sovereign GRC + Enterprise Competency Licensing
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Bundle autonomous compliance software with annual transferable workforce certification seats &mdash; satisfying both technical GRC requirements and DESC ISR v3.1 Domain 9 human audit mandates under one agreement.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#05080F] border border-white/10">
                <ShieldCheckIcon className="w-6 h-6 text-[#00F0FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Tiered Enterprise Seat Pools</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Allocate 5, 15, or 30+ transferable EC-Council seats annually across your SOC, Cloud, and IR teams with automated Evidence Vault ingestion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#05080F] border border-white/10">
                <DocumentDuplicateIcon className="w-6 h-6 text-[#C664FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Procurement-Friendly Split Invoicing</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Charge IT and HR separately without procurement friction: we can issue split-line invoices routing software to IT/CISO OpEx and workforce enablement to your L&amp;D training budget.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#05080F] border border-white/10">
                <BuildingOfficeIcon className="w-6 h-6 text-[#22D3A8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Dedicated Sovereign Deployment Tiers</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Options for isolated GCC tenant residency (me-central1), In-Country UAE dedicated clusters, or on-prem air-gapped vLLM environments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-6 bg-[#05080F] border border-white/10 rounded-3xl p-6 sm:p-10 glass-card shadow-2xl">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 text-left border-b border-white/10 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-white">Request Enterprise Licensing Proposal</h3>
                  <p className="text-xs text-gray-400">Receive a tailored GRC platform and workforce seat proposal within 24 hours.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Organization / Entity</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Dubai Bank / Government Authority"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Contact Name &amp; Title</label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g. Tariq Mansoor (CISO)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Corporate Email</label>
                    <input
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="ciso@organization.ae"
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

                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Licensing &amp; Seat Pool Tier</label>
                  <select
                    value={formData.tierSelection}
                    onChange={(e) => setFormData({ ...formData, tierSelection: e.target.value })}
                    className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option>Core Sovereign Suite (Platform + 5 Transferable Seats)</option>
                    <option>Enterprise Suite (Platform + 15 Transferable Seats)</option>
                    <option>Regulated Entity Tier (Dedicated UAE Zone / vLLM + 30+ Seats)</option>
                    <option>Custom CISO Retainer &amp; Advisory Architecture</option>
                  </select>
                </div>

                <div className="text-left">
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Invoicing Preference</label>
                  <select
                    value={formData.invoicingPreference}
                    onChange={(e) => setFormData({ ...formData, invoicingPreference: e.target.value })}
                    className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option>Unified Commercial Invoice (Single Master Agreement)</option>
                    <option>Split Invoicing (Platform to IT OpEx, Seats to HR/L&amp;D Budget)</option>
                  </select>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#00F0FF] via-[#2F57EF] to-[#C664FF] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Request Enterprise Proposal'}
                </button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#22D3A8]/20 border border-[#22D3A8]/40 text-[#22D3A8] mx-auto flex items-center justify-center">
                  <ClipboardDocumentCheckIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Proposal Request Received</h3>
                <p className="text-gray-400 text-xs max-w-md mx-auto">
                  Our enterprise advisory team will deliver your tailored Sovereign GRC and Competency Seat proposal within 24 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
