import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 1. Verificação de Sessão
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const role = (session.user as any).role;
    const userId = session.user.id;

    // 2. Lógica para MASTER ou STAFF (Visão Global)
    if (role === "MASTER" || role === "STAFF") {
      
      // Cálculo do Faturamento Total
      // Usamos (prisma as any).transaction para evitar o erro de compilação do TS
      const totalRevenue = await (prisma as any).transaction.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" }
      });

      // Contagem de Revendedores
      const resellerCount = await prisma.user.count({ 
        where: { role: "RESELLER" as any } 
      });

      // Contagem de Lojas
      const storeCount = await prisma.user.count({ 
        where: { role: "STORE" as any } 
      });
      
      return NextResponse.json({
        revenue: totalRevenue._sum.amount || 0,
        resellers: resellerCount,
        stores: storeCount,
        growth: "+15.2%" // Valor simulado de crescimento
      });

    } else {
      // 3. Lógica para LOJA (Visão Local)
      // No futuro, aqui buscaremos as vendas específicas desta loja no PDV
      return NextResponse.json({
        revenue: 0,
        resellers: 0,
        stores: 0,
        growth: "0%",
        sales: 0,
        tickets: 0,
        stockAlerts: 0
      });
    }

  } catch (error) {
    console.error("ERRO DASHBOARD STATS:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar estatísticas." }, 
      { status: 500 }
    );
  }
}