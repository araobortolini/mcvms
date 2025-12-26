import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "RESELLER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    // Busca os dados do Revendedor Logado ignorando erros de tipagem do count
    const data = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        credits: true,
      }
    }) as any;

    // Conta manualmente as lojas vinculadas a este revendedor
    const storesCount = await prisma.user.count({
      where: { resellerId: session.user.id }
    });

    if (!data) return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 404 });

    // Cálculo Estimado de Lucro
    const estimatedProfit = storesCount * 50; 

    return NextResponse.json({
      credits: data.credits,
      stores: storesCount,
      profit: estimatedProfit
    });

  } catch (error) {
    console.error("ERRO STATS:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}