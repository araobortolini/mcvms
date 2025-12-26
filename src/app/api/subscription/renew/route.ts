import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "STORE") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ 
        where: { id: session.user.id } 
      });

      if (!user || user.credits < 1) {
        throw new Error("Você não possui créditos suficientes para renovar.");
      }

      // Consome 1 crédito e adiciona 30 dias
      const currentExpire = user.expiresAt && user.expiresAt > new Date() 
        ? new Date(user.expiresAt) 
        : new Date();
      
      currentExpire.setDate(currentExpire.getDate() + 30);

      const updatedUser = await tx.user.update({
        where: { id: session.user.id },
        data: { 
          credits: { decrement: 1 },
          expiresAt: currentExpire,
          isGraceActive: false // Desativa modo alerta se estiver ativo
        }
      });

      await tx.auditLog.create({
        data: {
          action: "STORE_RENEWAL",
          details: `Loja ${user.id} renovou por 30 dias usando 1 crédito.`,
          userId: user.id
        }
      });

      return updatedUser;
    });

    return NextResponse.json({ success: true, expiresAt: result.expiresAt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
