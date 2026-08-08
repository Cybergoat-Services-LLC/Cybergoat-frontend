'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ExclamationTriangleIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB per file
const MAX_FILES = 10;
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FrameworkId = 'desc_isr' | 'pdpl' | 'ai_security_policy';

const FRAMEWORKS: { id: FrameworkId; label: string; desc: string }[] = [
  {
    id: 'desc_isr',
    label: 'DESC ISR',
    desc: "Dubai's information security regulation — general security governance, risk management, and incident response.",
  },
  {
    id: 'pdpl',
    label: 'UAE PDPL',
    desc: "The UAE's federal Personal Data Protection Law — how personal data is collected, used, and safeguarded.",
  },
  {
    id: 'ai_security_policy',
    label: 'AI Security Policy',
    desc: "Dubai's security requirements for organizations that build, deploy, or use AI systems.",
  },
];

type FreeZoneStatus = 'onshore' | 'free_zone';

type AiStakeholderRole = 'provider' | 'consumer' | 'end_user';

const AI_ROLES: { id: AiStakeholderRole; label: string; desc: string }[] = [
  { id: 'provider', label: 'AI Provider', desc: 'We build or train AI systems / models.' },
  { id: 'consumer', label: 'AI Consumer', desc: 'We deploy third-party AI systems in our business.' },
  { id: 'end_user', label: 'AI End-User', desc: 'We just use AI tools day to day (chatbots, copilots, etc.).' },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export default function DescIsrForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [selectedFrameworks, setSelectedFrameworks] = useState<Record<FrameworkId, boolean>>({
    desc_isr: false,
    pdpl: false,
    ai_security_policy: false,
  });
  const [freeZoneStatus, setFreeZoneStatus] = useState<FreeZoneStatus | ''>('');
  const [aiRole, setAiRole] = useState<AiStakeholderRole | ''>('');

  const anyFrameworkSelected = Object.values(selectedFrameworks).some(Boolean);

  function toggleFramework(id: FrameworkId) {
    setFormError('');
    setSelectedFrameworks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      // Reset the conditional answer when its triggering framework is unchecked,
      // so a stale answer never gets submitted for a framework that's no longer selected.
      if (id === 'pdpl' && !next.pdpl) setFreeZoneStatus('');
      if (id === 'ai_security_policy' && !next.ai_security_policy) setAiRole('');
      return next;
    });
  }

  function addFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    setFileError('');

    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (!hasAllowedExtension(file.name)) {
        setFileError(`"${file.name}" isn't a PDF or DOCX file. Only .pdf and .docx are accepted.`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setFileError(`"${file.name}" is ${formatBytes(file.size)}, which is over the 20MB limit per file. Please upload a smaller file.`);
        continue;
      }
      if (next.some((f) => f.name === file.name && f.size === file.size)) continue;
      next.push(file);
    }

    if (next.length > MAX_FILES) {
      setFileError(`Please attach no more than ${MAX_FILES} files.`);
      setFiles(next.slice(0, MAX_FILES));
    } else {
      setFiles(next);
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!anyFrameworkSelected) {
      setFormError('Please select at least one framework to be assessed against.');
      return;
    }
    if (selectedFrameworks.pdpl && !freeZoneStatus) {
      setFormError('Please tell us whether your business is registered onshore or in a free zone, so we can assess PDPL correctly.');
      return;
    }
    if (selectedFrameworks.ai_security_policy && !aiRole) {
      setFormError('Please select the option that best describes your organization’s relationship to AI.');
      return;
    }
    if (!name.trim() || !company.trim()) {
      setFormError('Please fill in your name and company.');
      return;
    }
    if (!EMAIL_PATTERN.test(workEmail)) {
      setFormError('Please enter a valid work email address.');
      return;
    }
    if (files.length === 0) {
      setFormError('Please attach at least one policy document (PDF or DOCX).');
      return;
    }
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        setFormError(`"${file.name}" is over the 20MB limit. Please remove it and try again.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      body.set('name', name.trim());
      body.set('company', company.trim());
      body.set('work_email', workEmail.trim());
      for (const id of Object.keys(selectedFrameworks) as FrameworkId[]) {
        if (selectedFrameworks[id]) body.append('frameworks[]', id);
      }
      if (selectedFrameworks.pdpl) {
        body.set('is_free_zone_entity', freeZoneStatus === 'free_zone' ? 'true' : 'false');
      }
      if (selectedFrameworks.ai_security_policy) {
        body.set('ai_stakeholder_role', aiRole);
      }
      for (const file of files) {
        body.append('documents[]', file, file.name);
      }

      const res = await fetch('/api/compliance-assessor/submit', { method: 'POST', body });
      const data = await res.json().catch(() => null);

      if (res.status === 429) {
        setFormError(data?.message || "You've hit the submission limit. Please try again in a few minutes.");
        return;
      }
      if (!res.ok || !data?.success) {
        setFormError(data?.message || 'Something went wrong submitting your documents. Please try again.');
        return;
      }

      const params = new URLSearchParams({ email: workEmail.trim() });
      if (data.submission_id) params.set('id', String(data.submission_id));
      router.push(`/desc-isr-readiness/submitted?${params.toString()}`);
    } catch {
      setFormError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-[#05080F] border border-white/10 glass-card space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-white">Get Your Free Readiness Score</h2>
        <p className="text-sm text-gray-400">Takes 2 minutes to submit. Your report follows by email.</p>
      </div>

      {formError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
          <ExclamationTriangleIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Which framework(s) do you want assessed?
          </label>
          <div className="space-y-2.5">
            {FRAMEWORKS.map((fw) => (
              <div
                key={fw.id}
                className={`rounded-2xl border p-3.5 transition-colors ${
                  selectedFrameworks[fw.id]
                    ? 'border-[#2F57EF]/50 bg-[#2F57EF]/[0.06]'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFrameworks[fw.id]}
                    onChange={() => toggleFramework(fw.id)}
                    className="mt-0.5 w-4 h-4 shrink-0 rounded border-white/20 bg-white/5 accent-[#2F57EF] cursor-pointer"
                  />
                  <span>
                    <span className="block text-sm font-bold text-white">{fw.label}</span>
                    <span className="block text-xs text-gray-400 leading-relaxed mt-0.5">{fw.desc}</span>
                  </span>
                </label>

                {fw.id === 'pdpl' && selectedFrameworks.pdpl && (
                  <div className="mt-3 pl-7 space-y-2">
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      PDPL doesn&rsquo;t apply to entities registered in certain UAE free zones (e.g. DIFC, ADGM)
                      &mdash; they follow their own separate data protection law instead. Is your business
                      registered onshore in the UAE, or in a free zone?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(['onshore', 'free_zone'] as const).map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors ${
                            freeZoneStatus === opt
                              ? 'border-[#00F0FF]/50 bg-[#00F0FF]/10 text-[#00F0FF]'
                              : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="free_zone_status"
                            value={opt}
                            checked={freeZoneStatus === opt}
                            onChange={() => setFreeZoneStatus(opt)}
                            className="sr-only"
                          />
                          {opt === 'onshore' ? 'Onshore (mainland UAE)' : 'Free zone (e.g. DIFC, ADGM)'}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {fw.id === 'ai_security_policy' && selectedFrameworks.ai_security_policy && (
                  <div className="mt-3 pl-7 space-y-2">
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Which best describes your organization&rsquo;s relationship to AI?
                    </p>
                    <div className="space-y-1.5">
                      {AI_ROLES.map((role) => (
                        <label
                          key={role.id}
                          className={`flex items-start gap-2 px-3 py-2 rounded-xl text-xs cursor-pointer border transition-colors ${
                            aiRole === role.id
                              ? 'border-[#C664FF]/50 bg-[#C664FF]/[0.08]'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="ai_stakeholder_role"
                            value={role.id}
                            checked={aiRole === role.id}
                            onChange={() => setAiRole(role.id)}
                            className="mt-0.5 w-3.5 h-3.5 shrink-0 accent-[#C664FF] cursor-pointer"
                          />
                          <span>
                            <span className="font-semibold text-white">{role.label}</span>{' '}
                            <span className="text-gray-400">&mdash; {role.desc}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!anyFrameworkSelected && (
            <p className="mt-2 text-[11px] text-amber-400 flex items-start gap-1.5">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Select at least one framework to
              continue.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Company</label>
          <input
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme FZ-LLC"
            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Work Email</label>
          <input
            type="email"
            required
            value={workEmail}
            onChange={(e) => setWorkEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2F57EF] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Security Policy Documents</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-2xl border border-dashed border-white/20 hover:border-[#2F57EF]/60 bg-white/[0.02] hover:bg-white/5 transition-all px-4 py-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer"
          >
            <DocumentArrowUpIcon className="w-6 h-6 text-[#0DCAF0]" />
            <span className="text-sm text-gray-300 font-medium">Click to upload PDF or DOCX files</span>
            <span className="text-[11px] text-gray-500">Multiple files allowed &middot; up to 20MB each</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
            className="hidden"
          />

          {fileError && (
            <p className="mt-2 text-[11px] text-red-400 flex items-start gap-1.5">
              <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {fileError}
            </p>
          )}

          {files.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${file.size}-${i}`}
                  className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <DocumentTextIcon className="w-4 h-4 text-[#0DCAF0] shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-gray-500 shrink-0">({formatBytes(file.size)})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                    aria-label={`Remove ${file.name}`}
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !anyFrameworkSelected}
          className="w-full py-3.5 bg-gradient-to-r from-[#00F0FF] to-[#2F57EF] text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Uploading…' : 'Get My Free Readiness Score'}
        </button>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          By submitting, you agree to be contacted by CyberGOAT about your assessment results and relevant training
          programs. See our{' '}
          <a href="/privacy" className="text-[#0DCAF0] hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
