import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      permissions?: string;
      impersonatedBy?: {
        id: string;
        name: string;
        role: string;
      } | null;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    role: string;
    permissions?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    permissions?: string;
    impersonatedBy?: {
      id: string;
      name: string;
      role: string;
    } | null;
  }
}