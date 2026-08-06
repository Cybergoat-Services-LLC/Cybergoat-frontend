'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function VideoDownloadButton({ lessonId }: { lessonId: number }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  async function handleClick() {
    setState('loading');
    try {
      const res = await fetch(`/api/portal/lessons/${lessonId}/download-url`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.download_url) throw new Error(data.message || 'Failed to get video link');
      window.open(data.download_url, '_blank', 'noopener,noreferrer');
      setState('idle');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F57EF] text-white text-xs font-bold hover:bg-[#2F57EF]/80 transition disabled:opacity-50"
      >
        <ArrowDownTrayIcon className="w-4 h-4" />
        {state === 'loading' ? 'Getting link…' : 'Watch / Download Video'}
      </button>
      {state === 'error' && <span className="text-xs text-red-400">Couldn&apos;t get the video link. Try again.</span>}
    </div>
  );
}
