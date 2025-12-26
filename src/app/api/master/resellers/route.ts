import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 1. Bloqueio de Segurança
    if (!session || (session.user as any).role !== "MASTER") {
      return NextResponse.json({ error: "Acesso negado. Rota exclusiva para Master." }, { status: 403 });
    }

    // 2. Busca de Revendedores com Bypass de Tipo para o _count
    // Usamos 'as any' para evitar que o TS reclame de propriedades que ele ainda não indexou
    const resellers = await (prisma.user as any).findMany({
      where: { role: "RESELLER" },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        tier: true,
        createdAt: true,
        _count: {
          select: { stores: true } 
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(resellers);
  } catch (error) {
    console.error("ERRO AO BUSCAR REVENDEDORES:", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar a lista de parceiros." }, 
      { status: 500 }
    );
  }
}