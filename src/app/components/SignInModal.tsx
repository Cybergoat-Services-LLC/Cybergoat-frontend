'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { useSession, signIn, signOut } from 'next-auth/react';
import { KeyIcon, UserIcon, ArrowRightOnRectangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const LMS_LOGIN_URL = 'https://lms.cybergoat.ae/login';

export default function SignInModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (res?.error) {
        setErrorMsg('Invalid student email or password.');
      } else {
        onClose();
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setErrorMsg('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={session?.user ? "CyberGOAT Student Profile" : "Access CyberGOAT Platform"}>
      {session?.user ? (
        <div className="space-y-6 text-center">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-xs text-emerald-400 font-bold">Authenticated Student Session Active</p>
              <p className="text-sm font-extrabold text-white">{session.user.name || session.user.email}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-left">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#00F0FF]" /> <strong>Role:</strong> {(session.user as any).role || 'Student'}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <KeyIcon className="w-4 h-4 text-[#C664FF]" /> <strong>Email:</strong> {session.user.email}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={LMS_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs rounded-full hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer text-center"
            >
              Open LMS Dashboard ➔
            </a>

            <button
              onClick={() => signOut()}
              className="py-3 px-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-xs text-gray-400">
            Sign in to access your EC-Council, ISACA &amp; Privacy courseware kits, hands-on iLabs, and certification progress.
          </p>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Student Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@cybergoat.ae"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all cursor-pointer shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Sign In with Credentials'}
            </button>
          </form>

          <div className="relative border-t border-white/10 pt-4 text-center">
            <span className="text-[11px] text-gray-500 uppercase tracking-widest bg-[#0A0F1A] px-2 -top-2.5 relative">
              Or Enterprise OAuth SSO
            </span>
          </div>

          <div className="space-y-2">
            <a
              href={LMS_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-6 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.46H12v4.66h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.89c2.28-2.1 3.56-5.19 3.56-8.83z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.89-3.01c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1C3.26 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.29 14.3A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.3v-3.1H1.28A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.28 5.4z" />
                <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
              </svg>
              Continue with Google Workspace SSO
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
