'use client';

import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  SparklesIcon,
  BookOpenIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import { QAPair } from '@/app/lib/knowledge';

const ADMIN_KEY_STORAGE = 'cg_admin_key';

export default function ChatbotTrainingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [adminKey, setAdminKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('EC-Council');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchKnowledge = async (key: string) => {
    try {
      const res = await fetch('/api/knowledge', { headers: { 'x-admin-key': key } });
      if (res.status === 401) {
        setAuthError('Invalid admin key.');
        setAdminKey('');
        sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        return;
      }
      const data = await res.json();
      if (data.qaPairs) {
        setQaPairs(data.qaPairs);
      }
    } catch (err) {
      console.error('Failed to load knowledge base:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
      if (stored) {
        setAdminKey(stored);
        fetchKnowledge(stored);
      }
    }
  }, [isOpen]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAuthError('');
    sessionStorage.setItem(ADMIN_KEY_STORAGE, keyInput);
    setAdminKey(keyInput);
    fetchKnowledge(keyInput);
  };

  const handleAddTrainingItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ question, answer, category }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestion('');
        setAnswer('');
        setSuccessMsg('Q&A Training Item Added Successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchKnowledge(adminKey);
      }
    } catch (err) {
      console.error('Error adding Q&A training item:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey },
      });
      if (res.ok) {
        fetchKnowledge(adminKey);
      }
    } catch (err) {
      console.error('Error deleting Q&A pair:', err);
    }
  };

  if (!isOpen) return null;

  if (!adminKey) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-sm bg-[#0A0F1A] border border-white/10 rounded-3xl p-8 shadow-2xl glass-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-extrabold">
              <LockClosedIcon className="w-5 h-5 text-[#00F0FF]" /> Admin Access Required
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Enter the admin key to manage the AI chatbot&apos;s knowledge base.
          </p>
          {authError && (
            <p className="text-xs font-bold text-red-400">{authError}</p>
          )}
          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              autoFocus
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Admin key"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs rounded-full hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredPairs = qaPairs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0A0F1A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl glass-card overflow-y-auto my-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF]">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                CyberGOAT AI Training Manager
              </h2>
              <p className="text-xs text-gray-400">
                Add, edit, and train custom FAQ pairs &amp; answer knowledge for your website chatbot.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 shrink-0" /> {successMsg}
          </div>
        )}

        {/* Add New Q&A Form */}
        <form onSubmit={handleAddTrainingItem} className="p-6 rounded-2xl bg-[#05080F] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PlusIcon className="w-4 h-4 text-[#00F0FF]" /> Add New Q&amp;A Training Data
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 mb-1">User Question / Topic</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. What is the fee for CEH v12 or do you offer weekend classes?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00F0FF]"
              >
                <option value="EC-Council">EC-Council</option>
                <option value="ISACA & ISC2">ISACA &amp; ISC2</option>
                <option value="Privacy">Data Privacy &amp; GDPR</option>
                <option value="Pricing & Vouchers">Pricing &amp; Vouchers</option>
                <option value="Location & Formats">Location &amp; Formats</option>
                <option value="General">General FAQ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Exact Bot Answer / Knowledge Response</label>
            <textarea
              required
              rows={3}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the precise answer you want the chatbot to deliver to users..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs rounded-full hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4 text-black" /> {loading ? 'Saving to AI Knowledge Base...' : 'Train Chatbot with this Q&A'}
          </button>
        </form>

        {/* Existing Training Data Table / List */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpenIcon className="w-4 h-4 text-[#C664FF]" /> Active Training Q&amp;A Pairs ({qaPairs.length})
            </h3>
            <div className="relative w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search training items..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#00F0FF]"
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
            </div>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {filteredPairs.length > 0 ? (
              filteredPairs.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative group hover:border-[#00F0FF]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete Training Item"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-white">Q: {item.question}</p>
                  <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                    A: {item.answer}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">No matching training Q&amp;A pairs found.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
