import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'CyberGOAT Student Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'student@cybergoat.ae' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo Student Authentication / Backend API validation hook
        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        if (password.length >= 6) {
          return {
            id: 'usr_' + Math.random().toString(36).substring(2, 9),
            name: email.split('@')[0].toUpperCase(),
            email: email,
            image: '/cg-assets/default-avatar.png',
            role: 'student'
          };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  secret: process.env.NEXTAUTH_SECRET || 'cybergoat_default_secret_key_2026',
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
