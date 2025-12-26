"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";

interface PerformanceCardProps {
  topCreditsName: string;
  topStoresName: string;
  sortedByCredits: any[];
  sortedByStores: any[];
}

export default function PerformanceCard({ 
  topCreditsName, 
  topStoresName, 
  sortedByCredits, 
  sortedByStores 
}: PerformanceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white p-5 rounded-xl border-l-4 border-l-amber-500 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
      >
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">🏆 Ranking de Performance</p>
          <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold">TOP 5</span>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <p className="text-sm text-gray-700 truncate"><span className="font-bold">Saldo:</span> {topCreditsName}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-sm text-gray-700 truncate"><span className="font-bold">Rede:</span> {topStoresName}</p>
          </div>
        </div>
        
        <p className="text-[9px] mt-4 text-amber-600 font-bold uppercase group-hover:translate-x-1 transition-transform">Ver todos os rankings →</p>
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Líderes da Rede"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna de Créditos */}
          <div>
            <h4 className="text-xs font-black text-amber-600 uppercase mb-4 flex items-center gap-2">
              💰 Maiores Saldos
            </h4>
            <div className="space-y-3">
              {sortedByCredits.slice(0, 5).map((r, idx) => (
                <div key={r.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-300">#{idx + 1}</span>
                    <p className="text-xs font-bold text-gray-700 truncate w-24">{r.name}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-green-600">{r.credits} CR</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coluna de Ativações */}
          <div>
            <h4 className="text-xs font-black text-blue-600 uppercase mb-4 flex items-center gap-2">
              🚀 Lojas Ativas
            </h4>
            <div className="space-y-3">
              {sortedByStores.slice(0, 5).map((r, idx) => (
                <div key={r.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-300">#{idx + 1}</span>
                    <p className="text-xs font-bold text-gray-700 truncate w-24">{r.name}</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600">{r.activeStores} Un.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 text-[10px] text-center text-gray-400 italic">Métricas atualizadas em tempo real com base no banco de dados.</p>
      </Modal>
    </>
  );
}
