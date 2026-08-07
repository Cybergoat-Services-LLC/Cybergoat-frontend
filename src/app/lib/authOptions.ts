import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';

// A silently-accepted dummy client id/secret would let OAuth "work" against
// nothing - broken sign-in with no error until a real user hits it. Same
// fail-loudly reasoning as NEXTAUTH_SECRET below: missing config in
// production should crash on boot, not fall back. Local dev without OAuth
// creds configured still gets a harmless placeholder.
function requiredOAuthEnv(name: string, devFallback: string): string {
  const value = process.env[name];
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} is not set`);
  }
  return devFallback;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: requiredOAuthEnv('GOOGLE_CLIENT_ID', 'dummy_google_client_id'),
      clientSecret: requiredOAuthEnv('GOOGLE_CLIENT_SECRET', 'dummy_google_client_secret'),
    }),
    LinkedInProvider({
      clientId: requiredOAuthEnv('LINKEDIN_CLIENT_ID', 'dummy_linkedin_client_id'),
      clientSecret: requiredOAuthEnv('LINKEDIN_CLIENT_SECRET', 'dummy_linkedin_client_secret'),
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  // No hardcoded fallback - a missing NEXTAUTH_SECRET should fail loudly in
  // production rather than silently sign sessions with a secret that's
  // sitting in source control for anyone with repo access to read.
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'student';
      }
      // Only present on the initial sign-in callback, never on subsequent
      // token refreshes - stash the REAL provider token here so the social
      // login bridge (src/app/api/portal/social-callback) can hand it to
      // the backend for independent verification. This deliberately never
      // gets copied into the `session` callback below - it must stay
      // server-side only, since anything in `session` is readable by
      // client-side JS via useSession()/getSession().
      if (account?.provider === 'google' && account.id_token) {
        token.socialProvider = 'google';
        token.socialToken = account.id_token;
      }
      if (account?.provider === 'linkedin' && account.access_token) {
        token.socialProvider = 'linkedin';
        token.socialToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
