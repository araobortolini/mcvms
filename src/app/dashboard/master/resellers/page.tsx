import { prisma } from "@/lib/prisma";
import GlobalCreditsCard from "./global-credits-card";
import PerformanceCard from "./performance-card";
import AddResellerModal from "./add-reseller-modal";
import ResellerTableClient from "./reseller-table-client";

export const dynamic = "force-dynamic";

export default async function MasterResellersPage() {
  const resellers = await prisma.user.findMany({
    where: { role: "RESELLER" },
    include: {
      stores: { select: { id: true, expiresAt: true } },
      _count: { select: { stores: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const masterLogs = await prisma.auditLog.findMany({
    where: { action: { in: ['CREDIT_ADD', 'CREDIT_REMOVE'] } },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const processedRanking = resellers.map(r => ({
    ...r,
    activeStores: r.stores.filter(s => s.expiresAt && new Date(s.expiresAt) > new Date()).length
  }));

  const sortedByCredits = [...processedRanking].sort((a, b) => (b.credits || 0) - (a.credits || 0));
  const sortedByStores = [...processedRanking].sort((a, b) => b.activeStores - a.activeStores);
  const totalCredits = resellers.reduce((acc, curr) => acc + (curr.credits || 0), 0);

  return (
    <div className="space-y-6 p-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestão de Revendedores</h1>
          <p className="text-sm text-gray-500 font-medium">Controle financeiro e monitoramento da rede de parceiros.</p>
        </div>
        <AddResellerModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlobalCreditsCard total={totalCredits} logs={masterLogs} />
        <PerformanceCard 
          topCreditsName={sortedByCredits[0]?.name || "---"}
          topStoresName={sortedByStores[0]?.name || "---"}
          sortedByCredits={sortedByCredits}
          sortedByStores={sortedByStores}
        />
      </div>

      <ResellerTableClient resellers={processedRanking} />
    </div>
  );
}
