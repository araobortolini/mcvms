import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateProfile } from "./actions";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  });

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Configurações da Loja</h1>
      
      <form action={updateProfile} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome da Loja</label>
          <input 
            name="name" 
            defaultValue={user?.name || ""} 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cor Primária do Sistema</label>
          <div className="flex items-center gap-4 mt-1">
            <input 
              type="color" 
              name="primaryColor" 
              defaultValue={user?.primaryColor || "#2563eb"} 
              className="h-10 w-20 border border-gray-300 rounded"
            />
            <span className="text-sm text-gray-500">{user?.primaryColor}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL da Logomarca</label>
          <input 
            name="logoUrl" 
            defaultValue={user?.logoUrl || ""} 
            placeholder="https://exemplo.com/logo.png"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="pt-4 border-t">
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
