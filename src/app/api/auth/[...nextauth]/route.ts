import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Incompleto");
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) throw new Error("Não encontrado");
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Senha incorreta");
        
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          permissions: (user as any).permissions || "[]"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = (user as any).permissions;
      }

      if (trigger === "update" && session?.action === "impersonate") {
        const target = await prisma.user.findUnique({ where: { id: session.targetId } });
        if (target && (token.role === "MASTER" || (token.role === "RESELLER" && target.resellerId === token.id))) {
          token.impersonatedBy = token.impersonatedBy || { id: token.id, name: token.name as string, role: token.role };
          token.id = target.id;
          token.name = target.name;
          token.email = target.email;
          token.role = target.role;
        }
      }

      if (trigger === "update" && session?.action === "stop-impersonating" && token.impersonatedBy) {
        const original = token.impersonatedBy;
        token.id = original.id;
        token.name = original.name;
        token.role = original.role;
        token.impersonatedBy = null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        (session.user as any).permissions = token.permissions;
        session.user.impersonatedBy = token.impersonatedBy;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };