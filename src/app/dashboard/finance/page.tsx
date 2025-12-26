"use client";

import { useState } from "react";
import { 
  Wallet, 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight, 
  History, 
  Download,
  AlertTriangle
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function FinancePage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  
  // Simulação de Estado (No futuro, virá do Banco de Dados)
  const [currentTier, setCurrentTier] = useState(user?.tier || "BRONZE");
  const [credits, setCredits] = useState(user?.credits || 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Carteira & Assinatura</h1>
          <p className="text-zinc-500 text-sm">Gerencie seu plano, compre créditos e veja seu histórico.</p>
        </div>
        
        {/* CARD DE SALDO ATUAL */}
        <div className="bg-zinc-900 text-white p-4 rounded-2xl flex items-center gap-6 shadow-xl shadow-zinc-900/20">
          <div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Saldo Atual</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black">{credits}</span>
              <span className="text-sm font-medium text-zinc-400">créditos</span>
            </div>
          </div>
          <div className="h-10 w-px bg-zinc-700"></div>
          <div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Plano Ativo</p>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${
                currentTier === 'OURO' ? 'text-amber-400' : 
                currentTier === 'PRATA' ? 'text-zinc-300' : 'text-orange-400'
              }`}>
                {currentTier}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE UPGRADE DE PLANO (TIERS) */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
          <Zap className="text-blue-600" size={20} />
          Escolha seu Nível de Parceiro
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BRONZE */}
          <PlanCard 
            title="Bronze" 
            price="Grátis" 
            features={["Até 5 Lojas", "Suporte Básico", "Sem acesso à API"]} 
            active={currentTier === "BRONZE"}
            color="border-orange-200 bg-orange-50/50"
            btnColor="text-orange-700 bg-orange-100 hover:bg-orange-200"
          />
          
          {/* PRATA */}
          <PlanCard 
            title="Prata" 
            price="R$ 99,00/mês" 
            features={["Até 50 Lojas", "Suporte Prioritário", "Acesso à API (Leitura)", "Marca Branca Parcial"]} 
            active={currentTier === "PRATA"}
            recommended
            color="border-zinc-300 bg-white"
            btnColor="text-white bg-zinc-900 hover:bg-zinc-800"
          />
          
          {/* OURO */}
          <PlanCard 
            title="Ouro" 
            price="R$ 199,00/mês" 
            features={["Lojas Ilimitadas", "Gerente de Conta", "API Completa", "White Label Total", "Modo Shadow"]} 
            active={currentTier === "OURO"}
            color="border-amber-200 bg-amber-50/50"
            btnColor="text-amber-800 bg-amber-200 hover:bg-amber-300"
          />
        </div>
      </div>

      {/* ÁREA DE RECARGA DE CRÉDITOS */}
      <div className="bg-white border border-zinc-200 rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Wallet className="text-emerald-600" size={20} />
            Recarga de Créditos Avulsa
          </h2>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Pagamento via Pix (Liberação Imediata)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <CreditPack amount={10} price={50} />
          <CreditPack amount={50} price={200} popular />
          <CreditPack amount={100} price={350} />
          <CreditPack amount={500} price={1500} />
        </div>
      </div>

      {/* HISTÓRICO DE TRANSAÇÕES */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <History size={18} className="text-zinc-400" />
          Histórico de Pagamentos
        </h2>
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold uppercase text-xs">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Descrição</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {/* Exemplo Estático */}
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="p-4 text-zinc-500">22/12/2025</td>
                <td className="p-4 font-medium text-zinc-900">Pacote de 50 Créditos</td>
                <td className="p-4 text-zinc-900">R$ 200,00</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={10} /> Pago
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:underline flex items-center justify-end gap-1 w-full">
                    <Download size={14} /> PDF
                  </button>
                </td>
              </tr>
              {/* Adicione mais linhas conforme necessário */}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// --- SUBCOMPONENTES ---

function PlanCard({ title, price, features, active, recommended, color, btnColor }: any) {
  return (
    <div className={`relative p-8 rounded-[2rem] border-2 flex flex-col h-full transition-all hover:shadow-xl ${color} ${active ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`}>
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg">
          Recomendado
        </span>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-black text-zinc-900 uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-black text-zinc-900 mt-2">{price}</p>
        <p className="text-xs text-zinc-500 font-bold mt-1">cobrado mensalmente</p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-3 text-sm font-medium text-zinc-600">
            <CheckCircle2 className="shrink-0 text-blue-600" size={16} />
            {feature}
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 rounded-xl font-bold transition-transform active:scale-95 ${btnColor}`}>
        {active ? "Plano Atual" : "Assinar Agora"}
      </button>
    </div>
  );
}

function CreditPack({ amount, price, popular }: any) {
  return (
    <div className={`border rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:border-emerald-400 hover:shadow-lg bg-white relative group cursor-pointer ${popular ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/10' : 'border-zinc-200'}`}>
      {popular && (
        <span className="absolute top-2 right-2 text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
          POPULAR
        </span>
      )}
      <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
        <CreditCard className="text-zinc-400 group-hover:text-emerald-600" size={20} />
      </div>
      <p className="text-2xl font-black text-zinc-900">{amount}</p>
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Créditos</p>
      <p className="text-lg font-bold text-emerald-700 mb-4">R$ {price}</p>
      <button className="w-full py-2 rounded-lg bg-zinc-900 text-white text-xs font-bold group-hover:bg-emerald-600 transition-colors">
        Comprar
      </button>
    </div>
  );
}