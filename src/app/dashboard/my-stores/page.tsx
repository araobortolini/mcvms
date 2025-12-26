"use client";

import { useEffect, useState } from "react";
import { 
  Store, 
  Plus, 
  Search, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Filter, 
  Zap, 
  X, 
  Check, 
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function MyStoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- ESTADOS DO MODAL DE RECARGA ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [rechargeAmount, setRechargeAmount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para carregar as lojas da API
  const loadStores = async () => {
    try {
      const res = await fetch("/api/reseller/stores");
      const data = await res.json();
      setStores(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erro ao carregar lojas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  // --- LÓGICA DE TRANSFERÊNCIA DE CRÉDITOS ---
  const handleTransfer = async () => {
    if (!selectedStore || rechargeAmount <= 0) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reseller/transfer-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          storeId: selectedStore.id, 
          amount: rechargeAmount 
        }),
      });

      if (res.ok) {
        alert(`Sucesso: ${rechargeAmount} créditos transferidos para ${selectedStore.name}`);
        setIsModalOpen(false);
        setRechargeAmount(1);
        loadStores(); // Atualiza a lista para refletir o novo saldo
      } else {
        const data = await res.json();
        alert(`Erro: ${data.error}`);
      }
    } catch (e) {
      alert("Erro crítico na comunicação com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtro de busca em tempo real
  const filteredStores = stores.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos para os Cards de Resumo
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.credits > 0).length;
  const suspendedStores = stores.filter(s => s.credits <= 0).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-black text-zinc-400 uppercase tracking-widest text-[10px]">Sincronizando Rede de Lojas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER PRINCIPAL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-3">
            <Store className="text-blue-600" size={32} />
            Minhas Lojas
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Gerencie o licenciamento e a saúde financeira das suas unidades.</p>
        </div>
        <Link 
          href="/dashboard/my-stores/new"
          className="bg-zinc-950 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-zinc-800 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Cadastrar Nova Loja
        </Link>
      </header>

      {/* CARDS DE RESUMO RÁPIDO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 p-6 rounded-[2.5rem] flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.2rem] flex items-center justify-center border border-blue-100"><Store size={28}/></div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total de Unidades</p>
            <p className="text-2xl font-black text-zinc-900">{totalStores}</p>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 p-6 rounded-[2.5rem] flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[1.2rem] flex items-center justify-center border border-emerald-100"><CheckCircle2 size={28}/></div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Lojas Ativas</p>
            <p className="text-2xl font-black text-zinc-900">{activeStores}</p>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 p-6 rounded-[2.5rem] flex items-center gap-5 shadow-sm">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-[1.2rem] flex items-center justify-center border border-red-100"><AlertCircle size={28}/></div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Suspensas (Sem Saldo)</p>
            <p className="text-2xl font-black text-zinc-900">{suspendedStores}</p>
          </div>
        </div>
      </div>

      {/* CONTAINER DA LISTAGEM */}
      <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-3 text-zinc-300" size={18} />
            <input 
              type="text"
              placeholder="Buscar unidade por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase hover:text-zinc-950 px-4 transition-colors">
            <Filter size={16} /> Filtros Avançados
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nome da Unidade</th>
                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Saldo</th>
                <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredStores.map((store) => (
                <tr key={store.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {store.name?.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-900">{store.name}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{store.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full">
                      <CreditCard size={12} className="text-zinc-400" />
                      <span className={`text-xs font-black ${store.credits > 0 ? 'text-zinc-900' : 'text-red-500'}`}>
                        {store.credits} créditos
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border ${
                      store.credits > 0 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {store.credits > 0 ? 'Operacional' : 'Suspenso'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => { setSelectedStore(store); setIsModalOpen(true); }}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                    >
                      <Zap size={14} /> Recarregar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStores.length === 0 && (
          <div className="p-20 text-center">
            <Store className="mx-auto text-zinc-200 mb-4" size={48} />
            <p className="text-zinc-400 font-bold text-sm">Nenhuma loja encontrada na sua rede.</p>
          </div>
        )}
      </div>

      {/* --- MODAL DE RECARGA (TRANSFERÊNCIA) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div>
                <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
                  <Zap className="text-blue-600" size={20} /> Recarregar Unidade
                </h3>
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">
                  Loja: {selectedStore?.name}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-200 text-zinc-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Quantidade de Créditos</label>
                <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 shadow-inner">
                  <button 
                    onClick={() => setRechargeAmount(Math.max(1, rechargeAmount - 1))}
                    className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center font-black text-xl hover:bg-zinc-100 transition-colors"
                  > - </button>
                  <span className="text-4xl font-black text-zinc-900">{rechargeAmount}</span>
                  <button 
                    onClick={() => setRechargeAmount(rechargeAmount + 1)}
                    className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center font-black text-xl hover:bg-zinc-100 transition-colors"
                  > + </button>
                </div>
                <p className="text-[10px] text-zinc-400 font-bold text-center uppercase italic">Cada crédito equivale a 30 dias de uso.</p>
              </div>

              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 flex gap-4">
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                  Os créditos serão descontados do seu saldo de <strong>Revendedor</strong> e ficarão disponíveis na loja imediatamente após a confirmação.
                </p>
              </div>

              <button 
                onClick={handleTransfer}
                disabled={isSubmitting}
                className="w-full bg-zinc-950 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-950/20 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                {isSubmitting ? "Processando..." : "Confirmar Transferência"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}