'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ClockIcon,
  CpuChipIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

type Status = 'pending' | 'processing' | 'ai_complete' | 'sme_reviewing' | 'sent' | 'rejected';

const STATUS_META: Record<Status, { label: string; icon: typeof ClockIcon; color: string }> = {
  pending: { label: 'Queued for analysis', icon: ClockIcon, color: 'text-gray-300' },
  processing: { label: 'AI analysis in progress', icon: CpuChipIcon, color: 'text-[#0DCAF0]' },
  ai_complete: { label: 'AI analysis complete - awaiting expert review', icon: CpuChipIcon, color: 'text-[#0DCAF0]' },
  sme_reviewing: { label: 'Being reviewed by a CyberGOAT security expert', icon: UserGroupIcon, color: 'text-[#C664FF]' },
  sent: { label: 'Report sent - check your email', icon: CheckCircleIcon, color: 'text-emerald-400' },
  rejected: { label: "We couldn't complete this assessment", icon: ExclamationTriangleIcon, color: 'text-amber-400' },
};

const POLL_INTERVAL_MS = 20_000;
const MAX_POLLS = 15; // ~5 minutes - real turnaround is 1-2 business days, so we stop polling a long-idle tab

export default function SubmissionStatus({ submissionId }: { submissionId: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [stopped, setStopped] = useState(false);
  const pollCount = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const res = await fetch(`/api/compliance-assessor/submissions/${submissionId}/status`);
        const data = await res.json().catch(() => null);
        if (cancelled) return;

        if (res.ok && data?.success && data?.data?.status) {
          setStatus(data.data.status as Status);
          if (data.data.status === 'sent' || data.data.status === 'rejected') return; // terminal, stop polling
        }
      } catch {
        // Network hiccup - just try again on the next tick, no need to surface an error here.
      }

      pollCount.current += 1;
      if (pollCount.current >= MAX_POLLS) {
        setStopped(true);
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [submissionId]);

  if (!status && !stopped) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-center gap-3 text-sm text-gray-400">
        <ClockIcon className="w-4 h-4 animate-pulse shrink-0" />
        <span>Checking submission status…</span>
      </div>
    );
  }

  if (status) {
    const meta = STATUS_META[status];
    const Icon = meta.icon;
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
        <div className={`flex items-center gap-2 font-bold text-sm ${meta.color}`}>
          <Icon className="w-4 h-4" />
          <span>{meta.label}</span>
        </div>
        {stopped && status !== 'sent' && status !== 'rejected' && (
          <p className="text-xs text-gray-500">
            We&rsquo;ll keep working on it and email you as soon as it&rsquo;s ready - no need to keep this tab open.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-gray-500">
      We&rsquo;ll email you as soon as your report is ready - no need to keep this tab open.
    </div>
  );
}
