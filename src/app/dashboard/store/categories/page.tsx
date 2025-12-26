import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createCategory, deleteCategory } from "./actions";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  const categories = await prisma.category.findMany({
    where: { userId: session?.user?.id },
    include: { _count: { select: { products: true } } }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-4">Categorias</h1>
        <form action={createCategory} className="flex gap-2">
          <input 
            name="name" 
            placeholder="Nome da nova categoria" 
            required 
            className="flex-1 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
            Adicionar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase">Nome</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Produtos</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-center">{cat._count.products}</td>
                <td className="p-4 text-right">
                  <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                    <button className="text-red-600 hover:text-red-800 text-sm font-bold">Excluir</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
