import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SupportPage() {
  const session = await getServerSession(authOptions);
  
  // Busca a loja e inclui os dados do revendedor vinculado
  const storeData = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      reseller: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

  const reseller = storeData?.reseller;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Central de Suporte</h1>
        <p className="text-gray-500 mb-8">Precisa de ajuda com sua licença ou configuração? Entre em contato com seu revendedor autorizado.</p>

        {reseller ? (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left">
            <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Seu Revendedor</p>
            <h2 className="text-xl font-bold text-gray-800">{reseller.name}</h2>
            <p className="text-blue-600 font-medium mb-4">{reseller.email}</p>
            
            <a 
              href={`mailto:${reseller.email}`}
              className="inline-block w-full text-center bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors"
            >
              Enviar E-mail
            </a>
          </div>
        ) : (
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-amber-800">
            Sua conta não possui um revendedor vinculado. Entre em contato com o suporte master.
          </div>
        )}

        <div className="mt-8 text-xs text-gray-400">
          Horário de atendimento padrão: Segunda a Sexta, das 09h às 18h.
        </div>
      </div>
    </div>
  );
}
