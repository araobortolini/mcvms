import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function ResellerDashboard() {
  const session = await getServerSession(authOptions);
  
  const data = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      stores: true,
      _count: { select: { stores: true } }
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Painel do Revendedor</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase">Seu Saldo</p>
          <p className="text-3xl font-black text-green-600">{data?.credits || 0} CR</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase">Lojas Ativas</p>
          <p className="text-3xl font-black text-blue-600">{data?._count.stores || 0}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 mb-4">Minhas Lojas</h2>
        {data?.stores.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma loja cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {data?.stores.map(store => (
              <li key={store.id} className="p-3 bg-gray-50 rounded-lg flex justify-between">
                <span className="font-bold text-gray-700">{store.name}</span>
                <span className="text-sm text-gray-400">{store.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
