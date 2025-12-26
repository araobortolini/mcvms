import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "MASTER") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { resellerId, amount, type } = await req.json(); // type: "ADD" | "REMOVE"

    if (!resellerId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // Busca o usuário atual para verificações
    const currentReseller = await prisma.user.findUnique({
      where: { id: resellerId }
    });

    if (!currentReseller) {
      return NextResponse.json({ error: "Revendedor não encontrado." }, { status: 404 });
    }

    // Se for REMOÇÃO, verifica se tem saldo suficiente
    if (type === "REMOVE") {
      if (currentReseller.credits < amount) {
        return NextResponse.json({ 
          error: `Saldo insuficiente. O revendedor tem apenas ${currentReseller.credits} créditos.` 
        }, { status: 400 });
      }
    }

    // Executa a operação
    const updatedUser = await prisma.user.update({
      where: { id: resellerId },
      data: { 
        credits: type === "REMOVE" ? { decrement: amount } : { increment: amount }
      }
    });

    // Registra Auditoria (Bypass de tipo com 'as any')
    await (prisma as any).auditLog.create({
      data: {
        action: type === "REMOVE" ? "MASTER_REMOVE_CREDITS" : "MASTER_ADD_CREDITS",
        userId: session.user.id,
        targetId: resellerId,
        details: type === "REMOVE" 
          ? `Master removeu ${amount} créditos de ${currentReseller.name}`
          : `Master injetou ${amount} créditos para ${currentReseller.name}`
      }
    });

    return NextResponse.json({ 
      success: true, 
      newBalance: updatedUser.credits 
    });

  } catch (error) {
    console.error("ERRO CRÉDITOS:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}