import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "RESELLER") {
      return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
    }

    const resellerId = session.user.id;
    const { storeId, amount } = await req.json();

    if (!storeId || amount <= 0) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // 1. Validar se o revendedor tem saldo e se a loja pertence a ele
    const [reseller, store] = await Promise.all([
      prisma.user.findUnique({ where: { id: resellerId } }),
      prisma.user.findFirst({ where: { id: storeId, resellerId: resellerId } })
    ]);

    if (!reseller || reseller.credits < amount) {
      return NextResponse.json({ error: "Saldo insuficiente na revenda." }, { status: 400 });
    }

    if (!store) {
      return NextResponse.json({ error: "Loja não encontrada ou não pertence a esta revenda." }, { status: 404 });
    }

    // 2. Transação: Tira da revenda e coloca na loja
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resellerId },
        data: { credits: { decrement: amount } }
      }),
      prisma.user.update({
        where: { id: storeId },
        data: { credits: { increment: amount } }
      }),
      (prisma as any).auditLog.create({
        data: {
          action: "CREDIT_TRANSFER",
          userId: resellerId,
          targetId: storeId,
          details: `Transferência de ${amount} créditos para a loja ${store.name}`
        }
      })
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("ERRO TRANSFERENCIA:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}