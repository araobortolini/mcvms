import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: {
        select: { name: true, email: true, role: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Logs de Auditoria</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-xs uppercase">
              <th className="p-3 font-semibold">Data/Hora</th>
              <th className="p-3 font-semibold">Usuário</th>
              <th className="p-3 font-semibold">Ação</th>
              <th className="p-3 font-semibold">Detalhes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-3 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString('pt-BR')}
                </td>
                <td className="p-3">
                  <p className="font-medium">{log.user?.name || "Sistema"}</p>
                  <p className="text-xs text-gray-500">{log.user?.email}</p>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    log.action.includes('ADD') ? 'bg-green-100 text-green-700' : 
                    log.action.includes('REMOVE') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-3 text-gray-600 italic text-xs">
                  {log.details}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  Nenhum registro de auditoria encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
