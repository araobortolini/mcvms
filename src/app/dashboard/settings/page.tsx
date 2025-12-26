"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Save, 
  Eye, 
  DollarSign, 
  Settings as SettingsIcon, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Lock, 
  UserPlus, 
  EyeOff, 
  Check, 
  Loader2, 
  Users, 
  Layout
} from "lucide-react";

// --- TIPAGEM ---
interface Plan {
  id: string;
  name: string;
  price: string;
  recommended: boolean;
  features: string[];
  color: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  // --- ESTADOS DE NAVEGAÇÃO ---
  const [activeTab, setActiveTab] = useState<"plans" | "payments" | "team" | "general">("plans");
  const [loading, setLoading] = useState(false);

  // --- ESTADO: EDITOR DE PLANOS (TIERS) ---
  const [plans, setPlans] = useState<Plan[]>([
    { 
      id: "1", name: "Bronze", price: "0", recommended: false, 
      features: ["Até 5 Lojas", "Suporte Básico"], 
      color: "border-orange-200 bg-orange-50/50" 
    },
    { 
      id: "2", name: "Prata", price: "99", recommended: true, 
      features: ["Até 50 Lojas", "Suporte Prioritário", "Marca Branca Parcial"], 
      color: "border-zinc-300 bg-white" 
    },
    { 
      id: "3", name: "Ouro", price: "199", recommended: false, 
      features: ["Lojas Ilimitadas", "Suporte VIP", "Shadow Mode", "API Full"], 
      color: "border-amber-200 bg-amber-50/50" 
    }
  ]);

  // --- ESTADO: CADASTRO DE STAFF ---
  const [staffData, setStaffData] = useState({ name: "", email: "", password: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const availablePermissions = [
    { id: "manage_resellers", label: "Gerenciar Revendedores", category: "Rede" },
    { id: "view_stores", label: "Shadow Mode (Acessar Lojas)", category: "Operacional" },
    { id: "view_finance", label: "Ver Relatórios Financeiros", category: "Financeiro" },
    { id: "edit_plans", label: "Alterar Preços e Planos", category: "Financeiro" },
    { id: "manage_tickets", label: "Responder Chamados", category: "Suporte" },
    { id: "view_logs", label: "Ver Logs de Segurança", category: "Auditoria" },
  ];

  // --- PROTEÇÃO DE ACESSO MASTER ---
  if (status === "loading") return <div className="p-10 font-bold text-zinc-400 animate-pulse">Autenticando Master...</div>;
  
  if (role !== "MASTER") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <Lock size={40} />
        </div>
        <h1 className="text-2xl font-black text-zinc-900">Acesso Restrito</h1>
        <p className="text-zinc-500 max-w-sm mt-2">Apenas administradores de nível MASTER podem acessar o motor da plataforma.</p>
      </div>
    );
  }

  // --- LÓGICA DO EDITOR DE PLANOS ---
  const addFeature = (planId: string) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, features: [...p.features, "Novo benefício"] } : p));
  };

  const removeFeature = (planId: string, index: number) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, features: p.features.filter((_, i) => i !== index) } : p));
  };

  const updateFeature = (planId: string, index: number, value: string) => {
    setPlans(plans.map(p => {
      if (p.id === planId) {
        const newFeatures = [...p.features];
        newFeatures[index] = value;
        return { ...p, features: newFeatures };
      }
      return p;
    }));
  };

  // --- LÓGICA DO CADASTRO DE STAFF ---
  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...staffData, permissions: selectedPermissions }),
      });
      if (res.ok) {
        alert("Sucesso: Funcionário cadastrado!");
        setStaffData({ name: "", email: "", password: "" });
        setSelectedPermissions([]);
      } else {
        const data = await res.json();
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert("Erro na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Configurações Globais</h1>
        <p className="text-zinc-500 text-sm">Controle as engrenagens e a equipe do seu SaaS.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SIDEBAR DE ABAS INTERNAS */}
        <aside className="lg:col-span-3 space-y-2">
          <TabBtn id="plans" label="Planos & Tiers" icon={Zap} active={activeTab === "plans"} onClick={() => setActiveTab("plans")} />
          <TabBtn id="payments" label="Pagamentos & API" icon={CreditCard} active={activeTab === "payments"} onClick={() => setActiveTab("payments")} />
          <TabBtn id="team" label="Equipe Staff" icon={Users} active={activeTab === "team"} onClick={() => setActiveTab("team")} />
          <TabBtn id="general" label="Geral" icon={SettingsIcon} active={activeTab === "general"} onClick={() => setActiveTab("general")} />
        </aside>

        {/* CONTEÚDO PRINCIPAL (DINÂMICO) */}
        <main className="lg:col-span-9 bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm min-h-[700px] relative">
          
          {/* ABA: EDITOR DE PLANOS (A LÓGICA COMPLEXA) */}
          {activeTab === "plans" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Layout className="text-blue-600" size={22}/> Editor de Tiers Financeiros
                </h2>
                <button className="text-xs bg-zinc-100 font-bold px-4 py-2 rounded-xl hover:bg-zinc-200 transition-colors">+ Adicionar Nível</button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* LADO ESQUERDO: CAMPOS DE EDIÇÃO */}
                <div className="space-y-6">
                  {plans.map(plan => (
                    <div key={plan.id} className="p-5 border border-zinc-100 bg-zinc-50/50 rounded-3xl space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome</label>
                          <input 
                            className="w-full bg-white border p-2.5 rounded-xl text-sm font-black focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            value={plan.name} 
                            onChange={e => setPlans(plans.map(p => p.id === plan.id ? {...p, name: e.target.value} : p))} 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Preço Mensal</label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-sm">R$</span>
                            <input 
                              className="w-full bg-white border p-2.5 pl-9 rounded-xl text-sm font-black focus:ring-2 focus:ring-blue-500 outline-none" 
                              value={plan.price} 
                              onChange={e => setPlans(plans.map(p => p.id === plan.id ? {...p, price: e.target.value} : p))} 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Benefícios Inclusos</label>
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              value={feat} 
                              onChange={e => updateFeature(plan.id, idx, e.target.value)} 
                              className="flex-1 bg-white border border-zinc-100 rounded-lg p-2 text-xs font-medium outline-none focus:border-blue-400" 
                            />
                            <button onClick={() => removeFeature(plan.id, idx)} className="text-zinc-300 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => addFeature(plan.id)} 
                          className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline pt-1"
                        >
                          <Plus size={12} /> Adicionar Função
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* LADO DIREITO: LIVE PREVIEW NA LANDING */}
                <div className="bg-zinc-900 rounded-[3rem] p-8 text-white sticky top-4 h-fit border-4 border-zinc-800 shadow-2xl">
                  <div className="flex items-center gap-2 mb-8 justify-center">
                    <Eye size={18} className="text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Visualização em Tempo Real</span>
                  </div>
                  <div className="grid gap-4">
                    {plans.map(plan => (
                      <div key={plan.id} className={`p-6 rounded-[2rem] border transition-all duration-500 ${plan.recommended ? 'bg-white text-zinc-900 border-white scale-105 shadow-xl shadow-white/5' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-black text-sm uppercase tracking-tighter">{plan.name}</h3>
                          {plan.recommended && <span className="bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse">RECOMENDADO</span>}
                        </div>
                        <p className="text-2xl font-black">{plan.price === "0" ? "Grátis" : `R$ ${plan.price},00`}</p>
                        <ul className="mt-4 space-y-2">
                          {plan.features.slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-[10px] font-bold opacity-80">
                              <CheckCircle2 size={12} className={plan.recommended ? "text-blue-600" : "text-blue-400"} /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA: PAGAMENTOS */}
          {activeTab === "payments" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="text-emerald-600" size={24}/> Configuração de Checkout</h2>
              <div className="max-w-md space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Gateway Provedor</label>
                   <select className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-emerald-500">
                     <option>Mercado Pago (Oficial)</option>
                     <option>Stripe (Global)</option>
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Access Token (Produção)</label>
                   <input type="password" placeholder="APP_USR-..." className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                 </div>
                 <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex gap-3 shadow-inner">
                    <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                      <strong>Criptografia Ativa:</strong> Suas chaves de API são armazenadas em um cofre digital (Vault) e nunca são exibidas em texto claro após o salvamento.
                    </p>
                 </div>
              </div>
            </div>
          )}

          {/* ABA: EQUIPE STAFF */}
          {activeTab === "team" && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="text-indigo-600" size={24} /> 
                  Gestão de Acessos Staff
                </h2>
                <p className="text-zinc-500 text-sm mt-1">Delegue tarefas para sua equipe com níveis de permissão controlados.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* FORMULÁRIO STAFF */}
                <form onSubmit={handleCreateStaff} className="space-y-4">
                  <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 space-y-4 shadow-inner">
                    <input required type="text" value={staffData.name} onChange={e => setStaffData({...staffData, name: e.target.value})} placeholder="Nome do Funcionário" className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input required type="email" value={staffData.email} onChange={e => setStaffData({...staffData, email: e.target.value})} placeholder="email@pluspdv.com" className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input required type="password" value={staffData.password} onChange={e => setStaffData({...staffData, password: e.target.value})} placeholder="Senha Provisória" className="w-full p-3.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-zinc-950 text-white font-bold py-4 rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                    {loading ? "Processando..." : "Confirmar Cadastro Staff"}
                  </button>
                </form>

                {/* SELETOR DE PERMISSÕES */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Atribuir Nível de Acesso
                  </h3>
                  <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {availablePermissions.map(perm => (
                      <div 
                        key={perm.id} 
                        onClick={() => togglePermission(perm.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedPermissions.includes(perm.id) 
                          ? "bg-indigo-50 border-indigo-200 shadow-sm" 
                          : "bg-white border-zinc-100 hover:border-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            selectedPermissions.includes(perm.id) ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-400"
                          }`}>
                            {selectedPermissions.includes(perm.id) ? <Check size={20} /> : <EyeOff size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">{perm.label}</p>
                            <p className="text-[10px] font-black text-zinc-400 uppercase">{perm.category}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedPermissions.includes(perm.id) ? "border-indigo-600 bg-indigo-600" : "border-zinc-200"
                        }`}>
                          {selectedPermissions.includes(perm.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTÃO SALVAR GLOBAL (RODAPÉ) */}
          <div className="absolute bottom-8 right-8">
            <button className="bg-zinc-950 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-zinc-800 transition-all flex items-center gap-3 hover:-translate-y-1 active:translate-y-0">
              <Save size={18} /> Salvar Alterações Globais
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// --- SUBCOMPONENTE: BOTÃO DE TAB DA SIDEBAR INTERNA ---
function TabBtn({ id, label, icon: Icon, active, onClick }: { id: string, label: string, icon: any, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
        active 
        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30 -translate-r-1" 
        : "bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 border border-transparent hover:border-zinc-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </div>
      {active && <ChevronRight size={16} className="animate-in slide-in-from-left-2" />}
    </button>
  );
}