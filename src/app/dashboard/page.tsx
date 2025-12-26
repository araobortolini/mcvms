"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  Wallet, Store, TrendingUp, Loader2, CheckCircle, AlertCircle 
} from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ credits: 0, stores: 0, profit: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any).role === "RESELLER") {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [status, session]);

  async function fetchStats() {
    try {
      const res = await fetch("/api/reseller/stats");
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (error) {
      console.error("Erro ao buscar stats");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  const userRole = (session?.user as any)?.role;

  // --- VISÃO DO MASTER ---
  if (userRole === "MASTER") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-black text-zinc-950">Painel Master</h1>
        <p className="text-zinc-500 mt-2">Use o menu lateral para gerenciar Revendedores e Lojas.</p>
      </div>
    );
  }

  // --- VISÃO DA LOJA ---
  if (userRole === "STORE") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-black text-zinc-950">Bem-vindo à Loja</h1>
        <p className="text-zinc-500 mt-2">Acesse "Inventário" ou "PDV" para começar a vender.</p>
      </div>
    );
  }

  // --- VISÃO DO REVENDEDOR (O que você precisa agora) ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
            Olá, {session?.user?.name || "Parceiro"} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Gestão da sua Rede de Revenda</p>
          <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 inline-block px-2 py-1 rounded-md">
            {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </header>

      {/* CARDS DINÂMICOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Créditos */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">
              Ativo
            </span>
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Meus Créditos</p>
          <p className="text-4xl font-black text-zinc-950 mt-1">{stats.credits}</p>
          <p className="text-xs text-zinc-500 font-medium mt-2">Válidos p/ licenciamento</p>
        </div>

        {/* Card Lojas */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">
              Base
            </span>
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Minhas Lojas</p>
          <p className="text-4xl font-black text-zinc-950 mt-1">{stats.stores}</p>
          <p className="text-xs text-zinc-500 font-medium mt-2">Ativas sob sua gestão</p>
        </div>

        {/* Card Lucro Estimado */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase">
              Mensal
            </span>
          </div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Lucro Estimado</p>
          <p className="text-4xl font-black text-zinc-950 mt-1">
            R$ {stats.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-zinc-500 font-medium mt-2">Baseado em recorrência</p>
        </div>
      </div>

      {/* BLOCO DE REGRAS E SAÚDE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-950 text-white p-10 rounded-[2.5rem] relative overflow-hidden">
          <h3 className="text-xl font-black mb-4">Regras da Revenda</h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> Cada loja consome créditos mensalmente.</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> Mantenha saldo positivo para evitar bloqueios.</li>
          </ul>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-zinc-200 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-lg font-black text-zinc-900">Saúde da Rede</h3>
          <p className="text-sm text-zinc-500 mt-1">
            {stats.stores === 0 
              ? "Você ainda não possui lojas cadastradas." 
              : "Todas as suas lojas estão operando normalmente."}
          </p>
        </div>
      </div>
    </div>
  );
}