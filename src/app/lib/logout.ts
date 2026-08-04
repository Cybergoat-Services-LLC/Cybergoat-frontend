'use client';

import { signOut } from 'next-auth/react';

// There are two independent session systems: NextAuth's own session cookie
// (from the Google/LinkedIn OAuth handshake) and the portal_token cookie
// (the Laravel Sanctum session issued by the bridge). Clearing only one
// leaves the other alive, so a following sign-in can silently reuse the
// leftover NextAuth session and skip real re-authentication.
export async function fullLogout(callbackUrl: string = '/'): Promise<void> {
  await fetch('/api/portal/logout', { method: 'POST' }).catch(() => {
    // Best-effort - signOut() below still runs, so the user isn't left
    // looking signed-in even if this call fails.
  });
  await signOut({ callbackUrl });
}
