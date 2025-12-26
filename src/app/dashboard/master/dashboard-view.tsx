"use client";

import { Users, Store, TrendingUp, Wallet } from "lucide-react";
import GrowthChart from "./resellers/growth-chart";

export default function DashboardView({ stats }: { stats: any }) {
  
  const cards = [
    { 
        title: "Rede Total", 
        value: stats.resellers, 
        label: "Revendedores Ativos", 
        icon: Users, 
        color: "text-blue-600", 
        bg: "bg-blue-50" 
    },
    { 
        title: "Lojas Totais", 
        value: stats.stores, 
        label: "Pontos de Venda", 
        icon: Store, 
        color: "text-green-600", 
        bg: "bg-green-50" 
    },
    { 
        title: "Faturamento", 
        value: "R$ " + stats.revenue, 
        label: "Créditos em Circulação", 
        icon: Wallet, 
        color: "text-indigo-600", 
        bg: "bg-indigo-50" 
    },
    { 
        title: "Crescimento", 
        value: "+5%", 
        label: "Novas ativações", 
        icon: TrendingUp, 
        color: "text-amber-600", 
        bg: "bg-amber-50" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Monitoramento em tempo real de revendas e lojas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{card.title}</p>
              <h2 className="text-3xl font-black text-gray-900 my-1">{card.value}</h2>
              <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-6">Evolução da Rede</h2>
        <GrowthChart data={stats.chartData || []} />
      </div>
    </div>
  );
}
