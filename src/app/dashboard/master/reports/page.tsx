import { prisma } from "@/lib/prisma";
import { Clock, CheckCircle2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ManageReportModal from "./manage-report-modal";

export const dynamic = "force-dynamic";

export default async function MasterReportsPage() {
  const reports = await prisma.report.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Central de Chamados</h1>
        <p className="text-gray-500 font-medium">Gerencie e responda às solicitações da sua rede.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pendentes</p>
          <h3 className="text-2xl font-black text-gray-800">{reports.filter(r => r.status === 'ABERTO').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Em Análise</p>
          <h3 className="text-2xl font-black text-gray-800">{reports.filter(r => r.status === 'EM_ANALISE').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resolvidos</p>
          <h3 className="text-2xl font-black text-gray-800">{reports.filter(r => r.status === 'RESOLVIDO').length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Usuário</th>
              <th className="p-4">Assunto</th>
              <th className="p-4">Data</th>
              <th className="p-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                    report.status === 'ABERTO' ? 'bg-amber-100 text-amber-600' : 
                    report.status === 'RESOLVIDO' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="p-4">
                  <p className="font-bold text-gray-800">{report.user.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{report.user.role}</p>
                </td>
                <td className="p-4 font-medium text-gray-900">{report.subject}</td>
                <td className="p-4 text-gray-500 text-xs">
                  {format(new Date(report.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                </td>
                <td className="p-4 text-right">
                  <ManageReportModal report={report} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
