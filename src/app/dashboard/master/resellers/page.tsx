import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import GrowthChart from "./growth-chart";
import GlobalCreditsCard from "./global-credits-card";
import PerformanceCard from "./performance-card";
import AddResellerModal from "./add-reseller-modal";
import ManageResellerModal from "./manage-reseller-modal";
import BlockModal from "./block-modal";
import ResellerDetailsModal from "./reseller-details-modal";

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

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();
  
  const storesGrowth = await prisma.user.findMany({
    where: { role: "STORE", createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
    select: { createdAt: true }
  });

  const chartData = last7Days.map(date => ({
    date: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
    vendas: storesGrowth.filter(s => s.createdAt.toISOString().split('T')[0] === date).length
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlobalCreditsCard total={totalCredits} logs={masterLogs} />
        <PerformanceCard 
          topCreditsName={sortedByCredits[0]?.name || "---"}
          topStoresName={sortedByStores[0]?.name || "---"}
          sortedByCredits={sortedByCredits}
          sortedByStores={sortedByStores}
        />
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rede Total</p>
            <p className="text-2xl font-black text-gray-800">{resellers.reduce((acc, curr) => acc + curr._count.stores, 0)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Gestão de Revendedores</h2>
          <AddResellerModal />
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-4">Revendedor</th>
              <th className="p-4">Saldo</th>
              <th className="p-4 text-center">Ativas</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {processedRanking.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  {/* AQUI ESTÁ A MUDANÇA: O nome agora é clicável */}
                  <ResellerDetailsModal reseller={r} />
                  <p className="text-xs text-gray-400">{r.email}</p>
                </td>
                <td className="p-4 font-mono font-bold text-green-600">{r.credits || 0} CR</td>
                <td className="p-4 text-center font-bold text-blue-600">{r.activeStores}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <ManageResellerModal reseller={r} />
                    <BlockModal reseller={r} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Evolução da Rede</h3>
        <GrowthChart data={chartData} />
      </div>
    </div>
  );
}
