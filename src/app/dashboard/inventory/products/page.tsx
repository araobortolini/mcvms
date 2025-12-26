"use client";

import { useEffect, useState } from "react";
import { 
  Package, Plus, Search, Loader2, AlertCircle, MoreVertical, 
  X, Check, Zap, Tag, BarChart3, Trash2, Edit3 
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    name: "", description: "", sku: "", 
    priceCost: "", priceSell: "", stock: "0", 
    minStock: "5", categoryId: ""
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/store/products"),
        fetch("/api/store/categories")
      ]);
      const prods = await prodRes.json();
      const cats = await catRes.json();
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/store/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", description: "", sku: "", priceCost: "", priceSell: "", stock: "0", minStock: "5", categoryId: "" });
        loadInitialData();
      }
    } catch (e) { alert("Erro ao salvar produto"); }
    finally { setIsSubmitting(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <p className="font-black text-zinc-400 uppercase text-[10px] tracking-widest italic">Sincronizando Inventário...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* HEADER BENTO */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-3">
            <Package className="text-blue-600" size={32} /> Inventário
          </h1>
          <p className="text-zinc-500 text-sm font-medium">Gestão centralizada de estoque e precificação.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-zinc-950 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase shadow-xl hover:bg-zinc-800 transition-all flex items-center gap-2 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Adicionar Produto
        </button>
      </header>

      {/* STATS BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total de Itens" value={products.length} icon={Package} color="blue" />
        <StatCard title="Estoque Baixo" value={products.filter(p => p.stock <= p.minStock).length} icon={AlertCircle} color="red" />
        <StatCard title="Custo em Estoque" value={`R$ ${products.reduce((acc, p) => acc + (p.priceCost * p.stock), 0).toFixed(2)}`} icon={Tag} color="emerald" />
        <StatCard title="Margem Média" value="38%" icon={BarChart3} color="indigo" />
      </div>

      {/* TABELA DE PRODUTOS */}
      <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 bg-zinc-50/30 flex items-center justify-between">
           <div className="relative max-w-sm w-full">
              <Search className="absolute left-4 top-3.5 text-zinc-300" size={18} />
              <input type="text" placeholder="Buscar produto..." className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Produto / SKU</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Status Estoque</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Preço Venda</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {products.map((p) => (
                <tr key={p.id} className="group hover:bg-zinc-50/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-950">{p.name}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{p.category?.name || 'Geral'} • {p.sku || 'SEM SKU'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase border ${
                      p.stock <= p.minStock ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {p.stock <= p.minStock ? 'Crítico' : 'Normal'} • {p.stock} un
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-black text-zinc-950 text-sm">
                    R$ {p.priceSell.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"><Edit3 size={18} /></button>
                      <button className="p-2 text-zinc-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="p-20 text-center text-zinc-300 font-bold">Nenhum produto em estoque.</div>
          )}
        </div>
      </div>

      {/* MODAL DE CADASTRO (SLIDE-OVER) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="w-full max-w-xl bg-white h-full shadow-2xl relative animate-in slide-in-from-right duration-500 overflow-y-auto">
            <div className="p-10 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 sticky top-0 z-10">
               <div>
                 <h2 className="text-2xl font-black text-zinc-950 italic">Novo Produto</h2>
                 <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Abasteça seu inventário agora</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl hover:bg-zinc-200 flex items-center justify-center text-zinc-400 transition-all">
                 <X size={24} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 pb-32">
               <div className="space-y-6">
                 <FormField label="Nome do Produto" icon={Package}>
                   <input required type="text" placeholder="Ex: Coca-Cola Lata 350ml" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input-premium" />
                 </FormField>
                 
                 <div className="grid grid-cols-2 gap-6">
                   <FormField label="SKU / Cód. Barras" icon={Tag}>
                     <input type="text" placeholder="789..." value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="form-input-premium" />
                   </FormField>
                   <FormField label="Categoria" icon={Zap}>
                     <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="form-input-premium appearance-none">
                       <option value="">Selecione...</option>
                       {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                   </FormField>
                 </div>

                 <div className="grid grid-cols-2 gap-6 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                   <FormField label="Preço Custo (R$)" icon={BarChart3}>
                     <input required type="number" step="0.01" value={formData.priceCost} onChange={e => setFormData({...formData, priceCost: e.target.value})} className="form-input-premium bg-white" />
                   </FormField>
                   <FormField label="Preço Venda (R$)" icon={Zap}>
                     <input required type="number" step="0.01" value={formData.priceSell} onChange={e => setFormData({...formData, priceSell: e.target.value})} className="form-input-premium bg-white" />
                   </FormField>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                   <FormField label="Estoque Inicial" icon={Package}>
                     <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="form-input-premium" />
                   </FormField>
                   <FormField label="Estoque Mínimo" icon={AlertCircle}>
                     <input required type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: e.target.value})} className="form-input-premium" />
                   </FormField>
                 </div>
               </div>

               <div className="fixed bottom-0 right-0 w-full max-w-xl p-10 bg-white/80 backdrop-blur-md border-t border-zinc-100 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-xs uppercase text-zinc-400 hover:text-zinc-950 transition-all">Cancelar</button>
                  <button disabled={isSubmitting} type="submit" className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    Salvar Produto
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
  const colors: any = { 
    blue: "text-blue-600 bg-blue-50 border-blue-100", 
    red: "text-red-600 bg-red-50 border-red-100", 
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100", 
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100" 
  };
  return (
    <div className="bg-white border border-zinc-200 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${colors[color]}`}><Icon size={24} /></div>
      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-zinc-900 mt-1">{value}</p>
    </div>
  );
}

function FormField({ label, icon: Icon, children }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
        <Icon size={12} /> {label}
      </label>
      {children}
    </div>
  );
}