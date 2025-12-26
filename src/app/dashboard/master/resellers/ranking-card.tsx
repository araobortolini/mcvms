"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";

interface RankingCardProps {
  title: string;
  topName: string;
  metricLabel: string;
  metricValue: string | number;
  colorClass: string;
  allData: any[];
  type: 'credits' | 'stores';
}

export default function RankingCard({ title, topName, metricLabel, metricValue, colorClass, allData, type }: RankingCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`bg-white p-5 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all border-t-4 ${colorClass}`}
      >
        <p className="text-[10px] font-bold text-gray-400 uppercase">{title}</p>
        <p className="text-lg font-black truncate text-gray-800">{topName}</p>
        <p className="text-xs text-gray-500">{metricValue} {metricLabel}</p>
        <p className="text-[9px] mt-2 text-blue-500 font-bold uppercase tracking-tighter">Ver Ranking Completo →</p>
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={`Ranking: ${title}`}
      >
        <div className="space-y-3">
          {allData.slice(0, 5).map((item, idx) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`font-black ${idx === 0 ? 'text-yellow-500' : 'text-gray-300'}`}>#{idx + 1}</span>
                <div>
                  <p className="text-sm font-bold text-gray-800">{item.name}</p>
                  <p className="text-[10px] text-gray-400">{item.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-700">
                  {type === 'credits' ? `${item.credits} CR` : `${item.activeStores} Lojas`}
                </p>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-center text-gray-400 italic mt-4">Exibindo os 5 melhores revendedores</p>
        </div>
      </Modal>
    </>
  );
}
