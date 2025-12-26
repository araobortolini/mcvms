import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function MasterStaffPage() {
  const staffMembers = await prisma.user.findMany({
    where: { role: "STAFF" },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Equipe Administrativa (Staff)</h1>
          <p className="text-sm text-gray-500 text-balance">Usuários com acesso de suporte e gestão master.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Novo Membro
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-sm">
              <th className="p-3 font-semibold uppercase">Nome</th>
              <th className="p-3 font-semibold uppercase">E-mail</th>
              <th className="p-3 font-semibold uppercase">Criado em</th>
              <th className="p-3 font-semibold uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium">{staff.name || "Sem Nome"}</td>
                <td className="p-3 text-gray-600">{staff.email}</td>
                <td className="p-3 text-sm">
                  {new Date(staff.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="p-3">
                  <button className="text-red-600 hover:text-red-800 font-semibold text-sm">Remover</button>
                </td>
              </tr>
            ))}
            {staffMembers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                  Nenhum membro de equipe cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
