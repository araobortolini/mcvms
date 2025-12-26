import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { ImpersonationBanner } from "@/components/impersonation-banner";

export const metadata: Metadata = {
  title: "Dashboard - PlusPDV",
  description: "Sistema de Gestão",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col md:pl-64">
        
        {/* Banner de Supervisão (Topo Global) */}
        <ImpersonationBanner />

        {/* Header Mobile */}
        <div className="md:hidden flex items-center h-16 px-4 border-b bg-white">
          <MobileNav />
        </div>

        {/* Conteúdo da Página */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}