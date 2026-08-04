'use client';

import { fullLogout } from '@/app/lib/logout';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function LogoutButton() {
  return (
    <button
      onClick={() => fullLogout('/')}
      className="flex items-center gap-2 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs rounded-full transition-all cursor-pointer"
    >
      <ArrowRightOnRectangleIcon className="w-4 h-4" /> Sign Out
    </button>
  );
}
