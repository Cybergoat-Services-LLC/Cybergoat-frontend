'use client';

import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  KeyIcon, 
  PlusIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

type QAPair = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export default function AdminTrainingPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [newCategory, setNewCategory] = useState('EC-Council');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const savedKey = sessionStorage.getItem('cybergoat_admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchQAs(savedKey);
    }
  }, []);

  const fetchQAs = async (keyToUse: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/knowledge', {
        headers: { 'x-admin-key': keyToUse }
      });
      if (res.status === 401) {
        setIsUnlocked(false);
        setErrorMsg('Invalid Admin API Key. Access denied.');
        return;
      }
      const data = await res.json();
      setQaPairs(data.qaPairs || []);
      setIsUnlocked(true);
      sessionStorage.setItem('cybergoat_admin_key', keyToUse);
    } catch (err) {
      setErrorMsg('Failed to load training data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    fetchQAs(adminKey.trim());
  };

  const handleAddQA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          category: newCategory,
          question: newQuestion.trim(),
          answer: newAnswer.trim()
        })
      });

      if (!res.ok) {
        setErrorMsg('Failed to save Q&A pair.');
        return;
      }

      setSuccessMsg('✅ Q&A Training Pair added successfully!');
      setNewQuestion('');
      setNewAnswer('');
      fetchQAs(adminKey);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Q&A training pair?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/knowledge?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      if (res.ok) {
        fetchQAs(adminKey);
      } else {
        setErrorMsg('Failed to delete Q&A pair.');
      }
    } catch (err) {
      setErrorMsg('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPairs = qaPairs.filter(p => 
    p.question.toLowerCase().includes(search.toLowerCase()) ||
    p.answer.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#05080F] text-white p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2F57EF] to-[#0DCAF0] flex items-center justify-center text-white shadow-lg">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                CyberGOAT AI Admin Training Portal <SparklesIcon className="w-5 h-5 text-[#0DCAF0]" />
              </h1>
              <p className="text-sm text-gray-400">Manage custom trained Q&As and Knowledge Base for CyberGOAT AI Assistant</p>
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
              <p className="text-xs text-gray-400 mt-1">Enter your master ADMIN_API_KEY to access training data</p>
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
          /* Main Training Dashboard */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Success / Error Alerts */}
            {successMsg && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-sm font-medium">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-4 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Add New Training Pair Form */}
            <div className="p-6 bg-[#0A0F1A] border border-white/10 rounded-3xl glass-card space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-white">
                <PlusIcon className="w-5 h-5 text-[#0DCAF0]" /> Add New Trained Q&A Pair
              </h2>
              <form onSubmit={handleAddQA} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-[#05080F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2F57EF]"
                    >
                      <option value="EC-Council">EC-Council (CEH, C|CISO, CHFI)</option>
                      <option value="ISACA">ISACA (CISA, CISM, CRISC)</option>
                      <option value="Privacy">Data Privacy (CIPP/E, CIPM)</option>
                      <option value="Pricing">Pricing & Discounts</option>
                      <option value="General">General Inquiries</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-1">User Question / Trigger</label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="e.g. Is CEH v12 exam voucher included?"
                      className="w-full bg-[#05080F] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">AI Answer Response</label>
                  <textarea
                    rows={3}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Enter official response text for the AI..."
                    className="w-full bg-[#05080F] border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !newQuestion.trim() || !newAnswer.trim()}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#2F57EF] to-[#0DCAF0] text-white font-bold text-sm rounded-xl disabled:opacity-50 hover:scale-105 transition-all"
                  >
                    Save Training Pair
                  </button>
                </div>
              </form>
            </div>

            {/* Q&A List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Trained Q&A Database ({filteredPairs.length})
                </h2>
                <div className="relative w-64">
                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Q&As..."
                    className="w-full bg-[#0A0F1A] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredPairs.length === 0 ? (
                  <div className="p-8 text-center bg-[#0A0F1A] border border-white/5 rounded-2xl text-gray-400 text-sm">
                    No trained Q&A pairs found matching your search.
                  </div>
                ) : (
                  filteredPairs.map((pair) => (
                    <div
                      key={pair.id}
                      className="p-5 bg-[#0A0F1A] border border-white/10 rounded-2xl hover:border-white/20 transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-[#2F57EF]/20 border border-[#2F57EF]/40 text-[#0DCAF0] text-xs font-semibold">
                          {pair.category}
                        </span>
                        <button
                          onClick={() => handleDelete(pair.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                          title="Delete Q&A"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-semibold text-white text-sm">Q: {pair.question}</p>
                      <p className="text-xs text-gray-300 leading-relaxed bg-[#05080F] p-3 rounded-xl border border-white/5">
                        A: {pair.answer}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
