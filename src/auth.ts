import axios from "axios";
import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AdapterUser } from "next-auth/adapters";

export interface CustomUser {
  id: string;
  email: string;
  name: string;
  userType: string;
  token: string;
}

interface CustomSessionUser {
  id: string;
  email: string;
  name: string;
  userType: string;
  token: string;
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },
  callbacks: {
    signIn() {
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    authorized() {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.email = customUser.email;
        token.token = customUser.token;
        token.name = customUser.name;
        token.userType = customUser.userType;      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        token: token.token as string,
        email: token.email as string,
        name: token.name as string,
        userType: token.userType as string,
      } as CustomSessionUser & AdapterUser;
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          console.log("Login payload:", {
            email: credentials?.email,
            password: credentials?.password,
          });

          console.log("API Response:", response.data);

          const data = response.data;

          if (response.status === 200) {
          
            return {
              id: data.user._id,
              email: data.user.email,
              name:data.user.name,
              userType:data.user.userType,
              token: data.token,
            } as CustomUser;
          } else {
            throw new Error(data.message || "Login failed.");
          }
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            console.error("Login error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Login failed.");
          } else {
            console.error("Unexpected error:", error);
            throw new Error("An unexpected error occurred.");
          }
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth(authConfig);
