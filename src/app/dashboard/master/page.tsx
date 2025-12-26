import { prisma } from "@/lib/prisma";
import DashboardView from "./dashboard-view";

export const dynamic = "force-dynamic";

export default async function MasterPage() {
  // 1. Contagens Totais
  const resellersCount = await prisma.user.count({
    where: { role: "RESELLER" }
  });

  const storesCount = await prisma.user.count({
    where: { role: "STORE" }
  });

  const totalCredits = await prisma.user.aggregate({
    where: { role: "RESELLER" },
    _sum: { credits: true }
  });

  // 2. Dados Históricos para o Gráfico (Agrupado por Mês)
  const userHistory = await prisma.user.findMany({
    where: { role: "RESELLER" },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' }
  });

  const historyMap = userHistory.reduce((acc, curr) => {
    const month = curr.createdAt.toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(historyMap).map(([key, value]) => ({
    name: key,
    total: value
  }));

  // 3. Monta objeto final
  const stats = {
    resellers: resellersCount,
    stores: storesCount,
    revenue: totalCredits._sum.credits || 0,
    chartData: chartData
  };

  return <DashboardView stats={stats} />;
}
