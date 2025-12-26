"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Check, 
  Loader2,
  Info
} from "lucide-react";
import Link from "next/link";

export default function NewStorePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reseller/create-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Loja registrada com sucesso! Agora você pode ativá-la enviando créditos.");
        router.push("/dashboard/my-stores");
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      alert("Erro na conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <header className="mb-10 flex items-center gap-4">
        <Link href="/dashboard/my-stores" className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-colors">
          <ArrowLeft size={20} className="text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Registrar Cliente</h1>
          <p className="text-zinc-500 text-sm font-medium">Cadastre os dados de acesso da nova unidade.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
            
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome da Loja</label>
                <div className="relative">
                  <Store className="absolute left-4 top-4 text-zinc-300" size={18} />
                  <input required type="text" placeholder="Ex: Boutique Fashion"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">E-mail de Acesso</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-zinc-300" size={18} />
                  <input required type="email" placeholder="contato@loja.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Senha Provisória</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-zinc-300" size={18} />
                  <input required type="password" placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-zinc-950 text-white font-black py-5 rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
              Confirmar Registro Gratuito
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8">
            <Info className="text-blue-600 mb-4" size={24} />
            <h4 className="font-black text-blue-900 text-sm uppercase">Ativação Posterior</h4>
            <p className="text-blue-700 text-[11px] font-medium leading-relaxed mt-2">
              O registro da loja não consome créditos. Após cadastrar, a loja ficará com status <strong>Pendente</strong>. 
              <br/><br/>
              Para que o cliente consiga acessar o PDV, você deverá usar o botão "Recarregar" na lista de lojas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}