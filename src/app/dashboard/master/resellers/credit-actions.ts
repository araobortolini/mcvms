"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function adjustCredits(resellerId: string, amount: number, action: 'ADD' | 'REMOVE') {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MASTER") throw new Error("Não autorizado");

  try {
    const reseller = await prisma.user.findUnique({ where: { id: resellerId } });
    if (!reseller) throw new Error("Revendedor não encontrado");

    if (action === 'REMOVE' && (reseller.credits || 0) < amount) {
      throw new Error("Saldo insuficiente para remover esta quantia");
    }

    const updatedUser = await prisma.user.update({
      where: { id: resellerId },
      data: { 
        credits: {
          increment: action === 'ADD' ? amount : -amount
        } 
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: action === 'ADD' ? "CREDIT_ADD" : "CREDIT_REMOVE",
        details: `${action === 'ADD' ? 'Adicionado' : 'Removido'} ${amount} créditos do revendedor ${updatedUser.email}`,
      }
    });

    revalidatePath("/dashboard/master/resellers");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Erro ao processar créditos");
  }
}
