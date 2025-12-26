"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";
import { adjustCredits } from "./credit-actions";
import { useToast } from "@/components/toast-context";
import { ExternalLink, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ManageResellerModal({ reseller }: { reseller: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);
  const [amount, setAmount] = useState(10);
  const [mode, setMode] = useState<'ADD' | 'REMOVE'>('ADD');
  
  const { showToast } = useToast();
  const { update } = useSession();
  const router = useRouter();

  async function handleConfirmCredits() {
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

  async function handleAccess() {
    setIsAccessing(true);
    try {
      await update({ 
        action: "impersonate", 
        targetId: reseller.id 
      });
      showToast(`Acessando conta de ${reseller.name}...`, "success");
      router.push("/dashboard/reseller");
      router.refresh();
    } catch (error) {
      showToast("Erro ao trocar de conta", "error");
    } finally {
      setIsAccessing(false);
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-blue-600 font-bold hover:underline text-xs flex items-center gap-1">
        <CreditCard className="w-3 h-3" /> Gerenciar
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Gerenciar Revendedor: ${reseller.name}`}>
        <div className="space-y-6">
          
          {/* BOTÃO DE ACESSO DIRETO */}
          <button
            onClick={handleAccess}
            disabled={isAccessing}
            className="w-full flex items-center justify-center gap-3 p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group"
          >
            <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-black leading-none">Acessar Painel</p>
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-tighter">Entrar na conta sem senha</p>
            </div>
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase">Ou ajustar saldo</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Seletor de Modo de Créditos */}
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
            onClick={handleConfirmCredits}
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