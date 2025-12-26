"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";
import { adjustCredits } from "./credit-actions";
import { useToast } from "@/components/toast-context";

export default function ManageResellerModal({ reseller }: { reseller: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(10);
  const [mode, setMode] = useState<'ADD' | 'REMOVE'>('ADD');
  const { showToast } = useToast();

  async function handleConfirm() {
    setLoading(true);
    try {
      await adjustCredits(reseller.id, amount, mode);
      showToast(`${amount} Créditos ${mode === 'ADD' ? 'adicionados' : 'removidos'} com sucesso`);
      setIsOpen(false);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-blue-600 font-bold hover:underline text-xs">
        Gerenciar
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Ajustar Saldo: ${reseller.name}`}>
        <div className="space-y-6">
          {/* Seletor de Modo */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setMode('ADD')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'ADD' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
            >
              Adicionar
            </button>
            <button 
              onClick={() => setMode('REMOVE')}
              className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${mode === 'REMOVE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
            >
              Remover
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Saldo Atual</p>
              <p className="text-xl font-black text-gray-800">{reseller.credits} CR</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-500 uppercase">Quantidade</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={`w-full border-2 p-3 rounded-xl outline-none font-bold text-center text-lg ${mode === 'ADD' ? 'focus:border-green-500' : 'focus:border-red-500'}`}
            />
          </div>

          <button 
            onClick={handleConfirm}
            disabled={loading || amount <= 0}
            className={`w-full text-white py-4 rounded-xl font-black transition-all shadow-lg disabled:bg-gray-300 ${
              mode === 'ADD' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'
            }`}
          >
            {loading ? "Processando..." : `Confirmar ${mode === 'ADD' ? 'Injeção' : 'Estorno'} de ${amount} CR`}
          </button>
        </div>
      </Modal>
    </>
  );
}
