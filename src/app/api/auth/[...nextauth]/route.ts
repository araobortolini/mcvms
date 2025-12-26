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
        
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email },
          include: { reseller: true }
        });

        if (!user || !user.password) throw new Error("Não encontrado");
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Senha incorreta");
        
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          permissions: (user as any).permissions || "[]",
          isBlocked: user.isBlocked,
          blockTree: user.blockTree,
          resellerBlockTree: user.reseller?.blockTree || false
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isBlocked = user.isBlocked;
        token.blockTree = user.blockTree;
        token.resellerBlockTree = (user as any).resellerBlockTree;
      }

      // Verificação em Tempo Real no Banco
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { isBlocked: true, blockTree: true, reseller: { select: { blockTree: true } } }
        });
        if (dbUser) {
          token.isBlocked = dbUser.isBlocked;
          token.blockTree = dbUser.blockTree;
          token.resellerBlockTree = dbUser.reseller?.blockTree || false;
        }
      }

      // Lógica de Impersonate
      if (trigger === "update" && session?.action === "impersonate") {
        const target = await prisma.user.findUnique({ where: { id: session.targetId } });
        if (target) {
          token.impersonatedBy = token.impersonatedBy || { id: token.id, name: token.name, role: token.role };
          token.id = target.id;
          token.name = target.name;
          token.role = target.role;
        }
      }

      if (trigger === "update" && session?.action === "stop-impersonating" && token.impersonatedBy) {
        const original = token.impersonatedBy as any;
        token.id = original.id;
        token.name = original.name;
        token.role = original.role;
        token.impersonatedBy = null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
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