"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Settings, 
  LogOut, 
  BarChart3, 
  Wallet 
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Verifica se é um Master real ou se está supervisionando um Revendedor
  const isImpersonating = !!session?.user?.impersonatedBy;
  const userRole = session?.user?.role;

  // LINKS PARA O MASTER (Original)
  const masterLinks = [
    { name: "Resumo", href: "/dashboard/master", icon: LayoutDashboard },
    { name: "Revendedores", href: "/dashboard/master/resellers", icon: Users },
    { name: "Logs de Sistema", href: "/dashboard/master/logs", icon: BarChart3 },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
  ];

  // LINKS PARA O REVENDEDOR (O que deve aparecer na supervisão)
  const resellerLinks = [
    { name: "Painel Revenda", href: "/dashboard/reseller", icon: LayoutDashboard },
    { name: "Minhas Lojas", href: "/dashboard/reseller/stores", icon: Store },
    { name: "Financeiro", href: "/dashboard/reseller/finance", icon: Wallet },
    { name: "Perfil", href: "/dashboard/profile", icon: Settings },
  ];

  // Define quais links exibir
  const activeLinks = (isImpersonating || userRole === "RESELLER") ? resellerLinks : masterLinks;

  return (
    <div className="flex h-full flex-col bg-white border-r px-4 py-6">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-indigo-600">Plus-PDV</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {isImpersonating ? "Modo Supervisão" : `Acesso ${userRole}`}
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {activeLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {!isImpersonating && (
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Sair do Sistema
        </button>
      )}
    </div>
  );
}