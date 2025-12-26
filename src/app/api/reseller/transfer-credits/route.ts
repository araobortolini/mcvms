import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "RESELLER") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { storeId, creditsToTransfer } = await req.json();

  try {
    await prisma.$transaction(async (tx) => {
      const reseller = await tx.user.findUnique({ where: { id: session.user.id } });
      if (!reseller || reseller.credits < creditsToTransfer) {
        throw new Error("Saldo insuficiente");
      }

      // Remove créditos do revendedor
      await tx.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: creditsToTransfer } }
      });

      // Adiciona créditos (ou dias de expiração) à loja
      // Exemplo: 1 crédito = 30 dias
      const daysToAdd = creditsToTransfer * 30;
      const store = await tx.user.findUnique({ where: { id: storeId } });
      const currentExpire = store?.expiresAt && store.expiresAt > new Date() 
        ? new Date(store.expiresAt) 
        : new Date();
      
      currentExpire.setDate(currentExpire.getDate() + daysToAdd);

      await tx.user.update({
        where: { id: storeId },
        data: { expiresAt: currentExpire, isGraceActive: false }
      });

      await tx.auditLog.create({
        data: {
          action: "RESELLER_TRANSFER",
          details: `Revendedor ${session.user.id} transferiu ${creditsToTransfer} créditos para loja ${storeId}`,
          userId: session.user.id
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
