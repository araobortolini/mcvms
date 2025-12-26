import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updatePassword } from "./actions";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black">
          {session?.user?.name?.[0] || "U"}
        </div>
        <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
        <p className="text-gray-500 text-sm">{session?.user?.email}</p>
        <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">
          Nível: {session?.user?.role}
        </span>
      </div>

      <form action={updatePassword} className="space-y-4">
        <h2 className="font-bold border-b pb-2 text-gray-700">Alterar Senha</h2>
        
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Senha Atual</label>
          <input 
            type="password" 
            name="currentPassword" 
            required 
            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nova Senha</label>
          <input 
            type="password" 
            name="newPassword" 
            required 
            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-gray-800 text-white py-2 rounded-lg font-bold hover:bg-black transition-colors"
        >
          Atualizar Senha
        </button>
      </form>
    </div>
  );
}
