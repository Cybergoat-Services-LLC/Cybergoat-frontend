import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_google_client_secret',
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || 'dummy_linkedin_client_id',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'dummy_linkedin_client_secret',
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
