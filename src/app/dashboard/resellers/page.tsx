"use client";

import { useEffect, useState } from "react";
import { 
  Users, Plus, Search, Wallet, BadgeDollarSign, 
  TrendingUp, Loader2, X, Check, Zap, Trash2, Lock, Mail, User, 
  ArrowUpCircle, ArrowDownCircle
} from "lucide-react";

export default function ResellersPage() {
  const [resellers, setResellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados do Modal de CRÉDITOS
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState<any>(null);
  const [amountToAdd, setAmountToAdd] = useState(100);
  const [creditType, setCreditType] = useState<"ADD" | "REMOVE">("ADD"); // Novo Estado
  
  // Estados do Modal de NOVO REVENDEDOR
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newReseller, setNewReseller] = useState({ name: "", email: "", password: "" });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FUNÇÕES DE CARREGAMENTO ---
  const loadData = async () => {
    try {
      const res = await fetch("/api/master/resellers");
      const data = await res.json();
      setResellers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // --- FUNÇÃO: CRIAR REVENDEDOR ---
  const handleCreateReseller = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/master/resellers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReseller),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Revendedor cadastrado com sucesso!");
        setIsCreateModalOpen(false);
        setNewReseller({ name: "", email: "", password: "" });
        loadData();
      } else {
        alert(data.error || "Erro ao criar.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FUNÇÃO: GERENCIAR CRÉDITOS (ADD/REMOVE) ---
  const handleManageCredits = async () => {
    if (!selectedReseller) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/master/add-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resellerId: selectedReseller.id, 
          amount: amountToAdd,
          type: creditType // Envia o tipo (ADD ou REMOVE)
        }),
      });

      if (res.ok) {
        alert(creditType === "ADD" ? "Créditos injetados!" : "Créditos removidos!");
        setIsCreditModalOpen(false);
        setAmountToAdd(100);
        setCreditType("ADD"); // Resetar para segurança
        loadData();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (e) { alert("Erro na comunicação."); } 
    finally { setIsSubmitting(false); }
  };

  // --- FUNÇÃO: DELETAR ---
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja remover ${name}?`)) return;
    try {
      const res = await fetch(`/api/master/resellers/delete?id=${id}`, { method: "DELETE" });
      if (res.ok) { loadData(); } else { const err = await res.json(); alert(err.error); }
    } catch (error) { alert("Erro ao processar."); }
  };

  const filteredResellers = resellers.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <p className="font-black text-zinc-400 uppercase text-[10px] tracking-widest">Carregando Rede...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" size={32} /> Gestão de Revendas
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Controle total sobre parceiros e distribuição de saldo.</p>
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-zinc-950 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-zinc-800 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Novo Revendedor
        </button>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Parceiros" value={resellers.length} icon={Users} color="blue" />
        <StatCard title="Saldo em Circulação" value={resellers.reduce((acc, r) => acc + r.credits, 0)} icon={Wallet} color="emerald" />
        <StatCard title="Lojas na Rede" value={resellers.reduce((acc, r) => acc + (r._count?.stores || 0), 0)} icon={TrendingUp} color="indigo" />
      </div>

      {/* TABELA */}
      <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-4 top-3 text-zinc-300" size={18} />
            <input 
              type="text" placeholder="Buscar..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nome / E-mail</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Unidades</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Saldo</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredResellers.map((reseller) => (
                <tr key={reseller.id} className="group hover:bg-zinc-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 font-black uppercase">
                        {reseller.name.substring(0,2)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-950">{reseller.name}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase">{reseller.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-black text-xs text-zinc-600">{reseller._count?.stores || 0} lojas</td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full font-black text-[10px] text-zinc-950">
                      <Zap size={12} className="text-blue-600" /> {reseller.credits}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right flex justify-end gap-2">
                    <button onClick={() => { setSelectedReseller(reseller); setIsCreditModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-blue-700">Saldo</button>
                    <button onClick={() => handleDelete(reseller.id, reseller.name)} className="p-2 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: GERENCIAR CRÉDITOS (ADD / REMOVE) --- */}
      {isCreditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="text-xl font-black text-zinc-900 italic">Gerenciar Saldo</h3>
              <button onClick={() => setIsCreditModalOpen(false)}><X className="text-zinc-400 hover:text-zinc-900" /></button>
            </div>
            
            <div className="p-10 space-y-8">
              {/* TOGGLE ADD/REMOVE */}
              <div className="grid grid-cols-2 bg-zinc-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setCreditType("ADD")}
                  className={`py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${creditType === "ADD" ? "bg-white text-emerald-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                  <ArrowUpCircle size={16} /> Injetar
                </button>
                <button 
                  onClick={() => setCreditType("REMOVE")}
                  className={`py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${creditType === "REMOVE" ? "bg-white text-red-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"}`}
                >
                  <ArrowDownCircle size={16} /> Remover
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                <button onClick={() => setAmountToAdd(Math.max(0, amountToAdd - 50))} className="btn-counter">-</button>
                <span className={`text-4xl font-black ${creditType === "ADD" ? "text-emerald-600" : "text-red-600"}`}>
                  {amountToAdd}
                </span>
                <button onClick={() => setAmountToAdd(amountToAdd + 50)} className="btn-counter">+</button>
              </div>

              <div className="bg-zinc-50 p-4 rounded-xl text-[10px] text-zinc-500 font-medium text-center border border-zinc-100">
                Saldo Atual do Revendedor: <strong className="text-zinc-900">{selectedReseller?.credits}</strong>
              </div>

              <button 
                onClick={handleManageCredits} 
                disabled={isSubmitting} 
                className={`w-full text-white font-black py-5 rounded-[1.5rem] flex justify-center gap-2 shadow-xl transition-all ${creditType === "ADD" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-red-600 hover:bg-red-700 shadow-red-600/20"}`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Check />} 
                {creditType === "ADD" ? "Confirmar Injeção" : "Confirmar Remoção"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: NOVO REVENDEDOR --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div>
                <h3 className="text-xl font-black text-zinc-900 italic">Novo Parceiro</h3>
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">Cadastre uma nova revenda</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)}><X className="text-zinc-400 hover:text-zinc-900" /></button>
            </div>
            
            <form onSubmit={handleCreateReseller} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex gap-1"><User size={12}/> Nome da Revenda</label>
                <input required type="text" placeholder="Ex: Tech Solutions" className="form-input-premium"
                  value={newReseller.name} onChange={e => setNewReseller({...newReseller, name: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex gap-1"><Mail size={12}/> E-mail de Acesso</label>
                <input required type="email" placeholder="contato@techsolutions.com" className="form-input-premium"
                  value={newReseller.email} onChange={e => setNewReseller({...newReseller, email: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex gap-1"><Lock size={12}/> Senha Inicial</label>
                <input required type="password" placeholder="******" className="form-input-premium"
                  value={newReseller.password} onChange={e => setNewReseller({...newReseller, password: e.target.value})} />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] flex justify-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Check />} 
                  Cadastrar Revenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const themes: any = { blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", indigo: "bg-indigo-50 text-indigo-600" };
  return (
    <div className="bg-white border border-zinc-200 p-8 rounded-[2.5rem] shadow-sm">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${themes[color]}`}><Icon size={24} /></div>
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black text-zinc-950 mt-1">{value}</p>
    </div>
  );
}