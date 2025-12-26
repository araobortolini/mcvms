import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SalesHistoryPage() {
  const session = await getServerSession(authOptions);
  
  const sales = await prisma.sale.findMany({
    where: { userId: session?.user?.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Histórico de Vendas</h1>

      <div className="space-y-4">
        {sales.map((sale) => (
          <div key={sale.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">
                  ID: {sale.id.substring(0, 8)}... | {new Date(sale.createdAt).toLocaleString('pt-BR')}
                </p>
                <p className="font-bold text-lg">Total: R$ {sale.total.toFixed(2)}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                {sale.paymentMethod}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded p-3 text-sm">
              <p className="font-semibold mb-2 border-b pb-1 text-gray-600 uppercase text-[10px]">Itens da Venda</p>
              {sale.items.map((item: any) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span>{item.quantity}x {item.product?.name || "Produto Removido"}</span>
                  <span className="text-gray-600">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {sales.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhuma venda registrada até o momento.
          </div>
        )}
      </div>
    </div>
  );
}
