import { prisma } from "@/lib/prisma";
import DashboardView from "./dashboard-view";

export const dynamic = "force-dynamic";

export default async function MasterPage() {
  // Contagem direta no banco de dados (Garante que o número 1 apareça)
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

  const stats = {
    resellers: resellersCount,
    stores: storesCount,
    revenue: totalCredits._sum.credits || 0
  };

  return <DashboardView stats={stats} />;
}