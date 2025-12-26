import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ResellerFinancePage() {
  const session = await getServerSession(authOptions);
  const resellerId = session?.user?.id;

  // Busca logs onde o revendedor foi o executor ou o destino da ação
  const logs = await prisma.auditLog.findMany({
    where: {
      OR: [
        { userId: resellerId },
        { details: { contains: resellerId } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalSpent = logs
    .filter(l => l.action === "RESELLER_TRANSFER")
    .length; // Cada transferência representa o uso de créditos

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatório Financeiro</h1>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">
          Total de Ativações: {totalSpent}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-xs font-bold text-gray-400 uppercase">
              <th className="p-4">Data</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 text-sm text-gray-600">
                  {new Date(log.createdAt).toLocaleString('pt-BR')}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    log.action === "CREDIT_ADD" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-700 italic">
                  {log.details}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">
                  Nenhuma movimentação financeira registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
