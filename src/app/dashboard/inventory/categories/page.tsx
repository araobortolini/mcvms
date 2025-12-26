"use client";

import { useEffect, useState } from "react";
import { 
  Layers, Plus, Search, Loader2, Trash2, Edit3, 
  Check, X, FolderPlus, AlertCircle 
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch("/api/store/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/store/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (res.ok) {
        setNewCategoryName("");
        loadCategories();
      }
    } catch (e) { alert("Erro ao criar categoria"); }
    finally { setIsSubmitting(false); }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={32} />
      <p className="font-black text-zinc-400 uppercase text-[10px] tracking-widest italic">Organizando gavetas...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <header>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-3">
          <Layers className="text-blue-600" size={32} /> Categorias
        </h1>
        <p className="text-zinc-500 text-sm font-medium">Organize seus produtos por grupos para facilitar as vendas.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LADO ESQUERDO: FORMULÁRIO DE ADIÇÃO RÁPIDA (4 Colunas) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-zinc-950 text-white rounded-2xl shadow-lg shadow-zinc-950/20">
                <FolderPlus size={20} />
              </div>
              <h3 className="font-black text-zinc-900 italic">Nova Categoria</h3>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome da Categoria</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Bebidas, Doces, Eletrônicos"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="form-input-premium"
                />
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                Criar Categoria
              </button>
            </form>

            <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl flex gap-3">
              <AlertCircle className="text-blue-600 shrink-0" size={18} />
              <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                Categorias bem definidas ajudam na navegação do PDV e em relatórios futuros.
              </p>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: LISTAGEM (8 Colunas) */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
            <h3 className="font-black text-zinc-900 uppercase text-xs tracking-widest">Suas Categorias ({categories.length})</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-zinc-300" size={16} />
              <input type="text" placeholder="Filtrar..." className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="divide-y divide-zinc-50">
            {categories.map((category) => (
              <div key={category.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {category.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-black text-zinc-900">{category.name}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">ID: {category.id.substring(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-zinc-300 hover:text-blue-600 transition-colors"><Edit3 size={18} /></button>
                  <button className="p-2 text-zinc-300 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-20 text-center text-zinc-300 font-bold flex flex-col items-center gap-4">
                <Layers size={48} className="opacity-20" />
                <p>Nenhuma categoria cadastrada ainda.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}