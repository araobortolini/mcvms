import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav"; // Novo Import
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      
      {/* A. NAV MOBILE: Aparece só no celular (lógica interna md:hidden) */}
      <MobileNav />

      {/* B. SIDEBAR DESKTOP: Escondida no mobile (hidden), Flex no Desktop (md:flex) */}
      <div className="hidden md:flex fixed h-full">
        <Sidebar className="border-r" />
      </div>

      {/* C. CONTEÚDO PRINCIPAL */}
      <main className="md:ml-64 min-h-screen transition-all">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}