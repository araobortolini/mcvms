"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Store, 
  Camera, 
  Save, 
  MapPin, 
  Clock, 
  Palette, 
  Globe, 
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function StoreSettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Estados para simular a edição (no futuro virá do banco)
  const [storeData, setStoreData] = useState({
    name: session?.user?.name || "Minha Loja",
    email: session?.user?.email || "",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123 - Centro",
    primaryColor: "#2563eb",
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulação de delay de salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert("Configurações da loja atualizadas com sucesso!");
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Configurações da Loja</h1>
          <p className="text-zinc-500 text-sm">Gerencie a identidade e as informações operacionais da sua unidade.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Salvar Alterações
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: PERFIL E VISUAL (4 Colunas) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full bg-zinc-100 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                <Store size={48} className="text-zinc-300" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-zinc-100 hover:text-blue-600 transition-colors">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="font-black text-xl text-zinc-900">{storeData.name}</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">ID: #882910</p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black text-zinc-900 mb-6 flex items-center gap-2">
              <Palette size={18} className="text-blue-600" /> Identidade Visual
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Cor Principal do Sistema</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={storeData.primaryColor}
                    onChange={(e) => setStoreData({...storeData, primaryColor: e.target.value})}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none p-0" 
                  />
                  <span className="text-sm font-mono font-bold text-zinc-600 uppercase">{storeData.primaryColor}</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                Esta cor será aplicada aos botões, ícones e destaques do seu painel administrativo.
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: DADOS E ENDEREÇO (8 Colunas) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black text-zinc-900 mb-8 flex items-center gap-2">
              <Globe size={18} className="text-blue-600" /> Informações do Negócio
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nome de Exibição</label>
                <input 
                  type="text" 
                  value={storeData.name}
                  onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Telefone de Contato</label>
                <input 
                  type="text" 
                  value={storeData.phone}
                  onChange={(e) => setStoreData({...storeData, phone: e.target.value})}
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Endereço Completo</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-zinc-400" size={18} />
                  <input 
                    type="text" 
                    value={storeData.address}
                    onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                    className="w-full p-4 pl-12 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black text-zinc-900 mb-8 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" /> Horário de Funcionamento
            </h3>
            
            <div className="space-y-4">
              {['Segunda a Sexta', 'Sábado', 'Domingo'].map((day) => (
                <div key={day} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-sm font-bold text-zinc-700">{day}</span>
                  <div className="flex items-center gap-4">
                    <input type="time" defaultValue="08:00" className="bg-white border border-zinc-200 p-2 rounded-xl text-xs font-bold outline-none" />
                    <span className="text-zinc-400 font-bold">até</span>
                    <input type="time" defaultValue="18:00" className="bg-white border border-zinc-200 p-2 rounded-xl text-xs font-bold outline-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ÁREA DE PERMISSÕES (VISUAL PARA A LOJA) */}
          <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-600 rounded-2xl">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg">Seu Plano está Ativo</h3>
                <p className="text-zinc-400 text-sm">Você tem acesso a todas as funções do Plano Ouro.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}