import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import DBConnection from './utils/config/db';
import UserModel from './utils/models/User';

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  providers: [
    CredentialProvider({
      name: 'credentials',
      async authorize(credentials) {
        await DBConnection();

        const user = await UserModel.findOne({
          email: credentials?.email,
          password: credentials?.password, // Ensure password is hashed and compared correctly in production!
        });

        if (!user) {
          return null;
        } else {
          return {
            id: user._id.toString(), // Include the user's ID here
            name: user.username,
            email: user.email,
          };
        }
      },
    }),
  ],
  secret: process.env.SECRET_KEY,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add the user ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the user ID from the token to the session
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
