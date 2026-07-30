import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'CyberGOAT Student Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'student@cybergoat.ae' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize() {
        // Credentials login is intentionally disabled: there is no real student
        // account store to verify against yet (LMS integration is not wired up).
        // Real sign-in happens on lms.cybergoat.ae until that integration exists.
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    error: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'student';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
};
