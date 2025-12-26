"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";
import { updateResellerStatus } from "./block-actions";
import { useToast } from "@/components/toast-context";
import { Lock, Unlock, AlertTriangle } from "lucide-react";

export default function BlockModal({ reseller }: { reseller: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [status, setStatus] = useState({
    isBlocked: reseller.isBlocked || false,
    restrictActions: reseller.restrictActions || false,
    blockTree: reseller.blockTree || false
  });

  const hasActiveBlock = reseller.isBlocked || reseller.restrictActions || reseller.blockTree;

  async function handleSave() {
    setLoading(true);
    try {
      await updateResellerStatus(reseller.id, status);
      showToast("Status atualizado com sucesso!");
      setIsOpen(false);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`ml-3 transition-colors duration-200 ${hasActiveBlock ? 'text-red-600' : 'text-gray-400'}`}
      >
        {hasActiveBlock ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Segurança e Bloqueio">
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer">
            <span className="font-bold">Bloquear Login</span>
            <input type="checkbox" checked={status.isBlocked} onChange={e => setStatus({...status, isBlocked: e.target.checked})} className="w-5 h-5" />
          </label>
          <label className="flex items-center justify-between p-3 border rounded-xl cursor-pointer">
            <span className="font-bold">Apenas Leitura</span>
            <input type="checkbox" checked={status.restrictActions} onChange={e => setStatus({...status, restrictActions: e.target.checked})} className="w-5 h-5" />
          </label>
          <div className="flex gap-2 pt-4">
            <button onClick={() => setIsOpen(false)} className="flex-1 py-2 border rounded-xl">Cancelar</button>
            <button onClick={handleSave} disabled={loading} className="flex-1 py-2 bg-black text-white rounded-xl font-bold">
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}