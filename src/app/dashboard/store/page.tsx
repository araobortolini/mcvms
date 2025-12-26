import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function StoreDashboard() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const [sales, products, stockAlert] = await Promise.all([
    prisma.sale.findMany({
      where: { userId },
      select: { total: true }
    }),
    prisma.product.count({
      where: { userId }
    }),
    prisma.product.count({
      where: { 
        userId,
        stock: { lte: prisma.product.fields.minStock }
      }
    })
  ]);

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resumo da Loja</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Faturamento Total</p>
          <p className="text-2xl font-black text-blue-600 mt-1">R$ {totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de Vendas</p>
          <p className="text-2xl font-black text-gray-800 mt-1">{sales.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produtos Cadastrados</p>
          <p className="text-2xl font-black text-gray-800 mt-1">{products}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100">
          <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Alertas de Estoque</p>
          <p className="text-2xl font-black text-red-600 mt-1">{stockAlert}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/dashboard/store/pdv" className="p-4 bg-blue-600 text-white rounded-lg text-center font-bold hover:bg-blue-700">Abrir PDV</a>
            <a href="/dashboard/store/products" className="p-4 bg-gray-800 text-white rounded-lg text-center font-bold hover:bg-gray-900">Novo Produto</a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4">Status da Assinatura</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Sua conta está ativa e operando normalmente.</p>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Ativa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
