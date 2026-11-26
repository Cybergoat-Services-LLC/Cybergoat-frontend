'use client';

import { useState, FormEvent } from 'react';
import Modal from './Modal';
import { ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const WHATSAPP_NUMBER = '971551846786';

export default function BookDemoModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [framework, setFramework] = useState('DESC ISR v3.1');
  const [sovereigntyTier, setSovereigntyTier] = useState('GCC Cloud (me-central1)');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = `Hi CyberGOAT, I would like to schedule a CISO Platform Walkthrough.\n\nName: ${fullName}\nCompany: ${company}\nWork Email: ${workEmail}\nPhone: ${phone}\nTarget Framework: ${framework}\nHosting Preference: ${sovereigntyTier}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'ciso_demo_request',
        name: fullName,
        email: workEmail,
        company,
        phone,
        details: `Framework: ${framework} | Sovereignty: ${sovereigntyTier}`,
      }),
    }).catch(() => {
      // Best-effort lead storage; WhatsApp window already open
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSent(false);
      setFullName('');
      setWorkEmail('');
      setCompany('');
      setPhone('');
    }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Schedule a Tailored CISO Walkthrough">
      {sent ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#22D3A8]/20 text-[#22D3A8] flex items-center justify-center mx-auto">
            <CheckCircleIcon className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-white">Walkthrough Request Dispatched</h4>
          <p className="text-sm text-gray-300 max-w-sm mx-auto">
            Our principal GRC architect is connecting via WhatsApp. You will receive an invitation for an executive platform walkthrough.
          </p>
          <button
            onClick={handleClose}
            className="mt-4 px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-xs uppercase hover:bg-white/20 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-gray-400">
            Discuss your organization&apos;s compliance requirements directly with a certified GRC practitioner (CISA/C|CISO).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Amira Al Farsi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/10 text-sm text-white focus:border-[#00F0FF] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Organization / Entity *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Dubai Health Authority"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/10 text-sm text-white focus:border-[#00F0FF] outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Corporate Work Email *</label>
              <input
                type="email"
                required
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                placeholder="ciso@entity.ae"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/10 text-sm text-white focus:border-[#00F0FF] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/10 text-sm text-white focus:border-[#00F0FF] outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Primary Framework Target</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/10 text-sm text-white focus:border-[#00F0FF] outline-none transition-colors"
              >
                <option value="DESC ISR v3.1">DESC ISR v3.1 (Dubai Government)</option>
                <option value="UAE Federal PDPL">UAE Federal PDPL (Law 45/2021)</option>
                <option value="CBUAE Cybersecurity Standard">CBUAE Banking Standard</option>
                <option value="UAE IA / NESA">UAE IA / NESA</option>
                <option value="ISO 27001 / SOC 2">ISO 27001 / SOC 2</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Data Sovereignty Preference</label>
              <select
                value={sovereigntyTier}
                onChange={(e) => setSovereigntyTier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05080F] border border-white/10 text-sm text-white focus:border-[#00F0FF] outline-none transition-colors"
              >
                <option value="GCC Cloud (me-central1)">Tier 1: Standard GCC Cloud (me-central1)</option>
                <option value="In-Country UAE Zone">Tier 2: In-Country UAE Zone (Azure/AWS)</option>
                <option value="On-Premises vLLM">Tier 3: On-Premises Air-Gapped vLLM</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheckIcon className="w-5 h-5 text-black" />
              Schedule CISO Walkthrough
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
