import { NextRequest, NextResponse } from 'next/server';

// lms.cybergoat.ae used to be a separate full LMS site. It's now retired -
// the student portal lives on the main site at /login, /register, /dashboard -
// so anyone landing on the old subdomain gets sent to the real thing instead
// of a bare API with no page to show.
export function proxy(request: NextRequest) {
  const host = request.headers.get('host');

  if (host === 'lms.cybergoat.ae') {
    return NextResponse.redirect(new URL('/login', 'https://www.cybergoat.ae'), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
