'use client';

import { useState, FormEvent } from 'react';
import Modal from './Modal';

const WHATSAPP_NUMBER = '971551846786';
const CONTACT_EMAIL = 'admin@cybergoat.ae';

export default function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = `Hi CyberGOAT, my name is ${fullName} (${email}).\n\n${message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSent(false);
      setFullName('');
      setEmail('');
      setMessage('');
    }, 300);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Let's Get in Touch">
      {sent ? (
        <div className="py-4 text-center">
          <p className="text-lg font-semibold text-white">Almost done!</p>
          <p className="mt-2 text-sm text-gray-400">
            We opened WhatsApp with your message ready to send. If it didn&apos;t open,
            message us directly at{' '}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0DCAF0] hover:underline"
            >
              +971 55 184 6786
            </a>{' '}
            or email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0DCAF0] hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <button
            onClick={handleClose}
            className="mt-6 rounded-full bg-gradient-to-r from-[#2F57EF] to-[#C664FF] px-6 py-2.5 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(47,87,239,0.4)]"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-gray-400">
            Utilize our free consultation service and choose the right learning path.
            Reach out to us.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-gray-400">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#2F57EF]"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#2F57EF]"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-gray-400">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you're looking for..."
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-[#2F57EF]"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#2F57EF] to-[#C664FF] px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(47,87,239,0.4)]"
            >
              Submit via WhatsApp
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
