"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Wallet, 
  BrainCircuit, 
  Settings, 
  LogOut, 
  Package, 
  ShoppingCart, 
  ShieldAlert, 
  Radio, 
  Layers, 
  LifeBuoy, 
  Megaphone, 
  BookOpen, 
  Sliders, 
  LucideIcon, 
  X,
  BadgeDollarSign,
  PlusCircle,
  History,
  FileText,
  ClipboardList,
  Tags,
  Truck,
  ArrowRightLeft,
  PieChart,
  UserCheck,
  Printer
} from "lucide-react";

interface MenuItem {
  name?: string;
  href?: string;
  icon?: LucideIcon;
  category?: string;
  perm?: string; 
}

interface SidebarProps {
  className?: string;
  closeMobileMenu?: () => void;
}

export function Sidebar({ className, closeMobileMenu }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const user = session?.user as any;
  const role = user?.role;
  
  let permissions: string[] = [];
  try {
    permissions = user?.permissions ? JSON.parse(user.permissions) : [];
  } catch (e) {
    permissions = [];
  }

  // --- 1. MENU MASTER / STAFF ---
  const adminLinks: MenuItem[] = [
    { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
    { category: "GESTÃO DE REDE" },
    { name: "Revendedores", href: "/dashboard/resellers", icon: Users, perm: "manage_resellers" },
    { name: "Lojas & Licenças", href: "/dashboard/stores", icon: Store, perm: "view_stores" },
    { category: "MOTOR FINANCEIRO" },
    { name: "Créditos & Tiers", href: "/dashboard/financial", icon: Wallet, perm: "view_finance" },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: Layers, perm: "view_finance" },
    { category: "INTELIGÊNCIA & OPS" },
    { name: "IA & Churn", href: "/dashboard/intelligence", icon: BrainCircuit },
    { name: "Monitoramento (IoT)", href: "/dashboard/operations", icon: Radio },
    { category: "SUPORTE & AUDITORIA" },
    { name: "Central de Chamados", href: "/dashboard/tickets", icon: LifeBuoy, perm: "manage_tickets" },
    { name: "Logs de Segurança", href: "/dashboard/logs", icon: ShieldAlert, perm: "view_logs" },
    { category: "PLATAFORMA" },
    { name: "Configurações Globais", href: "/dashboard/settings", icon: Sliders },
  ];

  // --- 2. MENU REVENDEDOR ---
  const resellerLinks: MenuItem[] = [
    { name: "Painel da Revenda", href: "/dashboard", icon: LayoutDashboard },
    { category: "MINHA OPERAÇÃO" },
    { name: "Minhas Lojas", href: "/dashboard/my-stores", icon: Store },
    { name: "Cadastrar Loja", href: "/dashboard/my-stores/new", icon: PlusCircle },
    { category: "FINANCEIRO" },
    { name: "Comprar Créditos", href: "/dashboard/buy-credits", icon: BadgeDollarSign },
    { name: "Extrato de Uso", href: "/dashboard/usage-history", icon: History },
    { category: "SUPORTE" },
    { name: "Base de Conhecimento", href: "/dashboard/docs", icon: BookOpen },
    { name: "Meus Chamados", href: "/dashboard/tickets", icon: LifeBuoy },
    { name: "Configurações", href: "/dashboard/store-settings", icon: Settings },
  ];

  // --- 3. MENU DA LOJA (ESTRUTURA COMPLETA) ---
  const storeLinks: MenuItem[] = [
    { name: "Painel da Loja", href: "/dashboard", icon: LayoutDashboard },
    
    { category: "OPERACIONAL & VENDAS" },
    { name: "Frente de Caixa (PDV)", href: "/dashboard/pos", icon: ShoppingCart },
    { name: "Vendas Realizadas", href: "/dashboard/sales", icon: ClipboardList },
    { name: "Orçamentos", href: "/dashboard/quotes", icon: FileText },
    { name: "Caixa", href: "/dashboard/cashier", icon: BadgeDollarSign },

    { category: "ESTOQUE & CATÁLOGO" },
    { name: "Produtos & Serviços", href: "/dashboard/inventory", icon: Package },
    { name: "Categorias & Grade", href: "/dashboard/categories", icon: Tags },
    { name: "Entrada (XML)", href: "/dashboard/stock-entry", icon: Truck },
    { name: "Ajuste de Estoque", href: "/dashboard/stock-adjust", icon: ArrowRightLeft },

    { category: "FINANCEIRO & RELATÓRIOS" },
    { name: "Fluxo de Caixa", href: "/dashboard/finance", icon: Wallet },
    { name: "Contas Pagar/Receber", href: "/dashboard/accounts", icon: History },
    { name: "Lucratividade", href: "/dashboard/reports", icon: PieChart },

    { category: "CLIENTES & AJUDA" },
    { name: "Cadastro de Clientes", href: "/dashboard/customers", icon: UserCheck },
    { name: "Configurações Loja", href: "/dashboard/settings", icon: Settings },
    { name: "Impressão & Cupom", href: "/dashboard/print-settings", icon: Printer },
    { name: "Assinatura & Licença", href: "/dashboard/subscription", icon: ShieldAlert },
  ];

  let activeLinks: MenuItem[] = [];

  if (role === "MASTER" || role === "STAFF") {
    activeLinks = adminLinks.filter(link => {
      if (role === "MASTER") return true;
      if (link.category) return true;
      if (!link.perm) return true;
      return permissions.includes(link.perm);
    });
  } else if (role === "RESELLER") {
    activeLinks = resellerLinks;
  } else {
    activeLinks = storeLinks;
  }

  return (
    <aside className={`w-64 bg-white border-r border-zinc-200 flex flex-col h-full z-50 ${className || ""}`}>
      <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-zinc-950 tracking-tighter italic">
            PLUS<span className="text-blue-600">PDV</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              role === 'MASTER' ? 'bg-red-500' : 
              role === 'RESELLER' ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
            <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">
              {role === 'STAFF' ? 'Equipe Master' : role}
            </p>
          </div>
        </div>
        {closeMobileMenu && (
          <button onClick={closeMobileMenu} className="md:hidden text-zinc-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {activeLinks.map((link, index) => {
          if (link.category) {
            return (
              <p key={index} className="px-4 pt-6 pb-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {link.category}
              </p>
            );
          }
          
          if (!link.href || !link.icon) return null;
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/20"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon size={18} className={isActive ? "text-blue-400" : "text-zinc-400"} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 text-red-500 text-sm font-bold hover:bg-red-50 rounded-xl w-full transition-colors group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}