"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";
import { updateResellerStatus } from "./block-actions";
import { useToast } from "@/components/toast-context";

export default function BlockModal({ reseller }: { reseller: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [status, setStatus] = useState({
    isBlocked: reseller.isBlocked || false,
    restrictActions: reseller.restrictActions || false,
    blockTree: reseller.blockTree || false
  });

  async function handleSave() {
    setLoading(true);
    try {
      await updateResellerStatus(reseller.id, status);
      showToast("Status de bloqueio atualizado!");
      setIsOpen(false);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-red-500 hover:text-red-700 ml-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Segurança: ${reseller.name}`}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">Selecione o nível de restrição para esta revenda:</p>
          
          <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
            <div className="pr-4">
              <p className="font-bold text-gray-800">Bloquear Acesso ao Painel</p>
              <p className="text-xs text-gray-400">O revendedor não conseguirá fazer login.</p>
            </div>
            <input type="checkbox" checked={status.isBlocked} onChange={e => setStatus({...status, isBlocked: e.target.checked})} className="w-5 h-5 accent-red-600" />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
            <div className="pr-4">
              <p className="font-bold text-gray-800">Impedir Funções (Apenas Leitura)</p>
              <p className="text-xs text-gray-400">Acessa o painel, mas não pode renovar lojas ou mover créditos.</p>
            </div>
            <input type="checkbox" checked={status.restrictActions} onChange={e => setStatus({...status, restrictActions: e.target.checked})} className="w-5 h-5 accent-orange-600" />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:bg-gray-50 bg-red-50/30 border-red-100">
            <div className="pr-4">
              <p className="font-bold text-red-700">Bloquear Toda a Árvore</p>
              <p className="text-xs text-red-400">Suspende o revendedor e todas as lojas (ativas e inativas) ligadas a ele.</p>
            </div>
            <input type="checkbox" checked={status.blockTree} onChange={e => setStatus({...status, blockTree: e.target.checked})} className="w-5 h-5 accent-red-700" />
          </label>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold mt-4 hover:bg-black transition-all"
          >
            {loading ? "Processando..." : "Salvar Configurações"}
          </button>
        </div>
      </Modal>
    </>
  );
}
