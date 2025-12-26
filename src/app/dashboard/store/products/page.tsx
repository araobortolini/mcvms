import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NewProductForm from "./new-product-form";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { userId: session?.user?.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany({
      where: { userId: session?.user?.id }
    })
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <NewProductForm categories={categories} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">SKU</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Estoque</th>
              <th className="p-3">Preço</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">{p.sku}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category?.name || "-"}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">R$ {p.salePrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
