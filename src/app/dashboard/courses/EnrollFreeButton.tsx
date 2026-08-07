'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function EnrollFreeButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleClick() {
    setState('loading');
    setError('');
    try {
      const res = await fetch(`/api/portal/courses/${slug}/enroll`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to enroll in this course.');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll in this course.');
      setState('error');
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-[#05080F] text-xs font-bold hover:bg-emerald-400 transition disabled:opacity-50 cursor-pointer"
      >
        <CheckCircleIcon className="w-4 h-4" />
        {state === 'loading' ? 'Enrolling…' : 'Enroll Free'}
      </button>
      {state === 'error' && (
        <p className="text-[11px] text-red-400 flex items-start gap-1.5">
          <ExclamationTriangleIcon className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {error}
        </p>
      )}
    </div>
  );
}
