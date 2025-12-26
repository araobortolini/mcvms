"use client";

import { useState } from "react";
import ManageResellerModal from "./manage-reseller-modal";
import BlockModal from "./block-modal";
import ResellerDetailsModal from "./reseller-details-modal";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";

export default function ResellerTableClient({ resellers }: { resellers: any[] }) {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filtro de busca
  const filtered = resellers.filter(r => 
    r.name?.toLowerCase().includes(search.toLowerCase()) || 
    r.email?.toLowerCase().includes(search.toLowerCase())
  );

  // 2. Lógica de Paginação
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* CABEÇALHO COM BUSCA */}
      <div className="p-6 border-b border-gray-50 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <h2 className="text-lg font-bold text-gray-800">Parceiros Registrados</h2>
           <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">
             Total: {filtered.length}
           </span>
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Buscar revendedor..." 
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Volta para pag 1 ao buscar
            }}
            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <tr>
              <th className="p-4">Revendedor / Status</th>
              <th className="p-4">Saldo Atual</th>
              <th className="p-4 text-center">Lojas Ativas</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-gray-400 italic">
                  Nenhum revendedor encontrado.
                </td>
              </tr>
            ) : (
              paginatedItems.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-4">
                    <div>
                      <ResellerDetailsModal reseller={r} />
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-gray-400">{r.email}</p>
                        {r.isBlocked ? (
                          <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold uppercase">Bloqueado</span>
                        ) : (
                          <span className="text-[8px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-bold uppercase">Ativo</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-gray-700">{r.credits || 0}</span>
                    <span className="text-[10px] font-bold text-gray-400 ml-1">CR</span>
                  </td>
                  <td className="p-4 text-center text-blue-600 font-bold">
                    {r.activeStores}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ManageResellerModal reseller={r} />
                      <BlockModal reseller={r} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RODAPÉ COM PAGINAÇÃO E CONTROLE DE QUANTIDADE */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Exibir:</label>
          <select 
            value={itemsPerPage}
            onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 rounded-lg text-xs font-bold p-1 px-2 outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value={10}>10 revendas</option>
            <option value={24}>24 revendas</option>
            <option value={36}>36 revendas</option>
            <option value={50}>50 revendas</option>
            <option value={100}>100 revendas</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-xs font-bold text-gray-600 px-4">
            Página {currentPage} de {totalPages || 1}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
