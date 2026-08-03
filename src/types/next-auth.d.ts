import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    // Server-side only - the raw provider token used by the social login
    // bridge. Never copied into Session, see authOptions.ts.
    socialProvider?: 'google' | 'linkedin';
    socialToken?: string;
  }
}
