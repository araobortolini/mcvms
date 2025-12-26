import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // Bloqueio de Segurança: Apenas REVENDA acessa esta listagem
    if (!session || (session.user as any).role !== "RESELLER") {
      return NextResponse.json(
        { error: "Não autorizado. Apenas revendedores podem ver suas lojas." }, 
        { status: 403 }
      );
    }

    const resellerId = session.user.id;

    const stores = await prisma.user.findMany({
      where: {
        resellerId: resellerId,
        role: "STORE" as any
      },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        tier: true,
        createdAt: true,
        expiresAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error("Erro na API de Lojas da Revenda:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}