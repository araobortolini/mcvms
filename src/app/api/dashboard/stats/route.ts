import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "MASTER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // 1. Totais (Mantive o que você já tinha)
    const resellers = await prisma.user.count({ where: { role: "RESELLER" } });
    const stores = await prisma.user.count({ where: { role: "STORE" } });
    
    const revenueData = await prisma.user.aggregate({
      where: { role: "RESELLER" },
      _sum: { credits: true }
    });

    // ==========================================================
    // NOVA PARTE: Dados Históricos para o Gráfico
    // ==========================================================
    
    // Busca usuários criados (ex: últimos 6 meses ou todos)
    const userHistory = await prisma.user.findMany({
      where: { role: "RESELLER" }, // Ou remova o filtro para ver crescimento total
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Processamento: Agrupar por Mês (Javascript puro)
    // Transforma: [Data1, Data1, Data2] -> { "JAN": 2, "FEV": 1 }
    const historyMap = userHistory.reduce((acc, curr) => {
      // Formata a data para pegar o nome do mês (ex: "jan", "fev")
      // Se quiser por dia, mude para: curr.createdAt.toLocaleDateString('pt-BR')
      const month = curr.createdAt.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
      
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Transforma no formato que o Recharts/Chart.js entende:
    // [{ name: "JAN", total: 10 }, { name: "FEV", total: 15 }]
    const chartData = Object.entries(historyMap).map(([key, value]) => ({
      name: key,
      total: value
    }));
    // ==========================================================

    return NextResponse.json({
      resellers,
      stores,
      revenue: revenueData._sum.credits || 0,
      growth: "+5%", // Você pode calcular isso dinamicamente depois se quiser
      chartData // <--- O FRONTEND VAI USAR ISSO AQUI
    });

  } catch (error) {
    console.error("Erro na API Stats:", error);
    return NextResponse.json({ 
        resellers: 0, 
        stores: 0, 
        revenue: 0, 
        chartData: [], // Retorna array vazio em caso de erro
        error: "Erro interno" 
    });
  }
}