'use client';

import React, { useState, useEffect } from 'react';
import {
  KeyIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

type TrackLead = {
  id: string;
  type?: 'track' | 'b2b';
  trackStage: string;
  trackTitle: string;
  companyName?: string;
  details?: string;
  name: string;
  email: string;
  phone: string;
  format: string;
  submittedAt: string;
};

export default function AdminLeadsPage() {
  const [adminKey, setAdminKey] = useState(() => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('cybergoat_admin_key') || '';
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [leads, setLeads] = useState<TrackLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLeads = async (keyToUse: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/leads', {
        headers: { 'x-admin-key': keyToUse }
      });
      if (res.status === 401) {
        setIsUnlocked(false);
        setErrorMsg('Invalid Admin API Key. Access denied.');
        return;
      }
      if (!res.ok) {
        setErrorMsg('Failed to load enrollment inquiries. Please try again.');
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setIsUnlocked(true);
      sessionStorage.setItem('cybergoat_admin_key', keyToUse);
    } catch {
      setErrorMsg('Failed to load enrollment inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // One-time check: auto-unlock if a key from a previous session is still
    // valid. The setState this triggers happens inside fetchLeads's own
    // async callback, not synchronously in the effect body.
    if (adminKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchLeads(adminKey);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    fetchLeads(adminKey.trim());
  };

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.trackTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05080F] text-white p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2F57EF] to-[#0DCAF0] flex items-center justify-center text-white shadow-lg">
              <UserGroupIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CyberGOAT Enrollment Inquiries</h1>
              <p className="text-sm text-gray-400">Track enrollment inquiries submitted via the website</p>
            </div>
          </div>
        </div>

        {/* Lock Screen */}
        {!isUnlocked ? (
          <div className="max-w-md mx-auto my-16 p-8 bg-[#0A0F1A] border border-white/10 rounded-3xl glass-card text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2F57EF]/20 text-[#0DCAF0] flex items-center justify-center">
              <KeyIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Authentication Required</h2>
              <p className="text-xs text-gray-400 mt-1">Enter your master ADMIN_API_KEY to view enrollment inquiries</p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter ADMIN_API_KEY..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
              />
              {errorMsg && <p className="text-xs text-red-400 font-medium">{errorMsg}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#2F57EF] to-[#C664FF] text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
              >
                {loading ? 'Authenticating...' : 'Unlock Admin Portal'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            {errorMsg && (
              <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-[#0DCAF0]" /> {filteredLeads.length} Inquiries
              </h2>
              <div className="relative w-64">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, track..."
                  className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredLeads.length === 0 ? (
                <div className="p-8 text-center bg-[#0A0F1A] border border-white/5 rounded-2xl text-gray-400 text-sm">
                  No enrollment inquiries yet.
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 bg-[#0A0F1A] border border-white/10 rounded-2xl hover:border-white/20 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#2F57EF]/20 border border-[#2F57EF]/40 text-[#0DCAF0] text-xs font-semibold flex items-center gap-1.5">
                        <AcademicCapIcon className="w-3.5 h-3.5" /> {lead.trackStage} - {lead.trackTitle}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(lead.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-semibold text-white text-sm">{lead.name}</p>
                    {lead.companyName && (
                      <p className="text-xs text-gray-400">
                        Company: <span className="text-white font-semibold">{lead.companyName}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <EnvelopeIcon className="w-3.5 h-3.5 text-gray-500" /> {lead.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <PhoneIcon className="w-3.5 h-3.5 text-gray-500" /> {lead.phone}
                      </span>
                      <span className="text-gray-500">{lead.format}</span>
                    </div>
                    {lead.details && (
                      <p className="text-xs text-gray-400 italic">{lead.details}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
