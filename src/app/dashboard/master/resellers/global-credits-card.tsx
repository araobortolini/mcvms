"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";

interface GlobalCreditsCardProps {
  total: number;
  logs: any[];
}

export default function GlobalCreditsCard({ total, logs }: GlobalCreditsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg text-white cursor-pointer hover:scale-[1.02] transition-transform active:scale-100"
      >
        <p className="text-xs font-bold opacity-80 uppercase">Créditos Globais</p>
        <div className="flex justify-between items-end">
          <p className="text-3xl font-black">{total}</p>
          <span className="text-[10px] bg-white/20 px-2 py-1 rounded">VER DETALHES</span>
        </div>
      </div>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Detalhes dos Créditos Globais"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-[10px] font-bold text-blue-400 uppercase">Em Circulação</p>
              <p className="text-xl font-black text-blue-700">{total}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total de Logs</p>
              <p className="text-xl font-black text-gray-700">{logs.length}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-2">Últimas Movimentações (Master)</h4>
            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              {logs.length > 0 ? logs.map((log) => (
                <div key={log.id} className="p-3 text-xs flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <p className="font-bold text-gray-800">{log.action}</p>
                    <p className="text-gray-500 italic truncate w-48">{log.details}</p>
                  </div>
                  <span className="text-gray-400 text-[10px]">
                    {new Date(log.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )) : (
                <p className="p-4 text-center text-gray-400 text-xs italic">Nenhum log registrado.</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
