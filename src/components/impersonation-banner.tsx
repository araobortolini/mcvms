"use client";

import { useSession } from "next-auth/react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function ImpersonationBanner() {
  const { data: session, update } = useSession();
  const router = useRouter();

  if (!session?.user?.impersonatedBy) return null;

  async function stopImpersonating() {
    await update({ action: "stop-impersonating" });
    // Redireciona explicitamente para a lista de revendedores do Master
    router.push("/dashboard/master/resellers");
    setTimeout(() => {
        router.refresh();
    }, 100);
  }

  return (
    <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-between shadow-lg relative z-[60]">
      <div className="flex items-center gap-4">
        <ShieldCheck className="w-5 h-5" />
        <p className="text-sm font-medium">
          Navegação Supervisionada: <span className="font-bold underline">{session.user.name}</span>
        </p>
      </div>

      <button
        onClick={stopImpersonating}
        className="bg-white text-amber-600 px-4 py-1.5 rounded-full text-xs font-black uppercase hover:bg-amber-50 transition-all flex items-center gap-2 shadow-sm"
      >
        <LogOut className="w-3.5 h-3.5" />
        Encerrar e Voltar ao Master
      </button>
    </div>
  );
}