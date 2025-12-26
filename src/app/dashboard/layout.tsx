import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role;
  const menus = {
    MASTER: [
      { label: "Revendedores", href: "/dashboard/master/resellers" },
      { label: "Equipe Staff", href: "/dashboard/master/staff" },
      { label: "Logs de Auditoria", href: "/dashboard/master/logs" },
    ],
    RESELLER: [
      { label: "Visão Geral", href: "/dashboard/reseller" }, // Link corrigido
      { label: "Financeiro", href: "/dashboard/reseller/finance" },
    ],
    STORE: [
      { label: "PDV", href: "/dashboard/store/pdv" },
      { label: "Produtos", href: "/dashboard/store/products" },
      { label: "Categorias", href: "/dashboard/store/categories" },
      { label: "Suporte", href: "/dashboard/store/support" },
    ],
    STAFF: [{ label: "Revendedores", href: "/dashboard/master/resellers" }]
  };

  const currentMenu = menus[role as keyof typeof menus] || [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-black text-blue-600">PLUS PDV</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{role}</p>
        </div>
        <nav className="flex-1 mt-4">
          {currentMenu.map((item) => (
            <Link key={item.href} href={item.href} className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors border-l-4 border-transparent hover:border-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-1">
          <Link href="/dashboard/profile" className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg font-medium">Meu Perfil</Link>
          <Link href="/api/auth/signout" className="block px-6 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-bold">Sair</Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {session?.user?.restrictActions && (
          <div className="bg-amber-600 text-white p-2 text-center text-xs font-bold mb-4 rounded-lg animate-pulse">
            MODO APENAS LEITURA: Algumas funções de escrita estão desabilitadas.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
