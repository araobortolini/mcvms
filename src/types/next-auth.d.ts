import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      permissions: string;
      impersonatedBy?: any;
    } & DefaultSession["user"]
  }
}
