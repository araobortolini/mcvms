"use client";

import { useState } from "react";
import { 
  LifeBuoy, 
  MessageSquare, 
  Store, 
  UserCog, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";

export default function TicketsPage() {
  const [activeTab, setActiveTab] = useState<"RESELLERS" | "ESCALATED">("RESELLERS");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Central de Chamados</h1>
          <p className="text-zinc-500 text-sm">Gerencie o suporte direto aos parceiros e casos críticos escalonados.</p>
        </div>
        <button className="bg-zinc-950 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-zinc-800 transition-all flex items-center gap-2">
          <LifeBuoy size={18} />
          Abrir Chamado Interno
        </button>
      </div>

      {/* ABAS DE NAVEGAÇÃO */}
      <div className="flex gap-2 p-1 bg-white border border-zinc-200 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab("RESELLERS")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "RESELLERS" 
              ? "bg-zinc-100 text-zinc-900 border border-zinc-200 shadow-sm" 
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <UserCog size={16} />
          Direto da Revenda
        </button>
        <button 
          onClick={() => setActiveTab("ESCALATED")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "ESCALATED" 
              ? "bg-red-50 text-red-700 border border-red-100 shadow-sm" 
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Store size={16} />
          Escalonados (Lojas)
        </button>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className="grid gap-4">
        {activeTab === "RESELLERS" ? (
          // LISTA DE CHAMADOS DAS REVENDAS
          <>
            <TicketCard 
              id="#R-9021"
              title="Solicitação de aumento de limite de crédito (Antecipação)"
              requester="Revenda Capital (Tier Ouro)"
              status="open"
              priority="high"
              time="2h atrás"
              type="RESELLER"
            />
            <TicketCard 
              id="#R-8832"
              title="Dúvida sobre integração da API de Notas Fiscais"
              requester="Parceiro Tech Soluções"
              status="pending"
              priority="medium"
              time="1 dia atrás"
              type="RESELLER"
            />
          </>
        ) : (
          // LISTA DE CHAMADOS ESCALONADOS (LOJAS -> REVENDA -> MASTER)
          <>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 mb-4">
              <AlertCircle className="text-amber-600" size={20} />
              <p className="text-amber-800 text-xs font-bold">
                Atenção: Estes chamados vieram de lojas porque o Revendedor marcou como "Insolúvel Nível 1".
              </p>
            </div>

            <TicketCard 
              id="#L-4402"
              title="Erro Crítico: Driver de Impressão Elgin travando PDV"
              requester="Padaria do João (via Revenda Capital)"
              status="open"
              priority="critical"
              time="4h atrás"
              type="ESCALATED"
            />
          </>
        )}
      </div>
    </div>
  );
}

// COMPONENTE DE CARD DE CHAMADO (REUTILIZÁVEL)
function TicketCard({ id, title, requester, status, priority, time, type }: any) {
  const isCritical = priority === "critical";
  const isOpen = status === "open";

  return (
    <div className={`bg-white p-6 rounded-[1.5rem] border transition-all hover:shadow-lg flex flex-col md:flex-row justify-between gap-4
      ${isCritical ? "border-red-100 shadow-red-50" : "border-zinc-200 shadow-sm"}
    `}>
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
          ${type === "ESCALATED" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}
        `}>
          {type === "ESCALATED" ? <AlertCircle size={24} /> : <MessageSquare size={24} />}
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-zinc-400">{id}</span>
            {isCritical && (
              <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Crítico
              </span>
            )}
            {!isOpen && (
              <span className="bg-zinc-100 text-zinc-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Em Análise
              </span>
            )}
          </div>
          <h3 className="font-bold text-zinc-900 text-lg leading-tight">{title}</h3>
          <p className="text-zinc-500 text-sm mt-1 flex items-center gap-1">
            {type === "ESCALATED" ? <Store size={12} /> : <UserCog size={12} />}
            {requester}
          </p>
        </div>
      </div>

      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-zinc-100 pt-4 md:pt-0">
        <div className="flex items-center gap-1 text-zinc-400 text-xs font-medium">
          <Clock size={12} /> {time}
        </div>
        <button className="px-5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs font-bold hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors flex items-center gap-2 group">
          Ver Detalhes
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}