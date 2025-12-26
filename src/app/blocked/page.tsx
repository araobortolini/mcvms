"use client";

import { useState } from "react";
import { Lock, Clock, CreditCard, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BlockedPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  async function handleActivateGrace() {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/activate-grace", { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        alert("Modo Alerta ativado! Você tem 7 dias de acesso.");
        await update(); // Atualiza a sessão para o middleware liberar o acesso
        router.push("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Erro ao ativar modo alerta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <Lock className="text-red-500" size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-white tracking-tight">Sistema Bloqueado</h1>
        <p className="text-zinc-400 mt-3 text-sm leading-relaxed">
          Sua licença expirou às 00:00.
        </p>

        <div className="mt-10 space-y-3">
          <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
            <CreditCard size={20} /> Renovar Agora
          </button>
          
          <button 
            onClick={handleActivateGrace}
            disabled={loading}
            className="w-full py-4 bg-zinc-800 text-zinc-300 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all border border-zinc-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Clock size={20} />}
            Ativar 7 dias de Alerta
          </button>
        </div>

        <button onClick={() => signOut()} className="mt-8 text-zinc-500 text-sm hover:text-zinc-300">
          Sair do Sistema
        </button>
      </div>
    </div>
  );
}