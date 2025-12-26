"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";
import { resetPassword } from "./details-actions";
import { useToast } from "@/components/toast-context";

export default function ResellerDetailsModal({ reseller }: { reseller: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copiado para a área de transferência!");
  };

  const handleReset = async () => {
    if (!newPass) return;
    setLoading(true);
    try {
      await resetPassword(reseller.id, newPass);
      showToast("Senha atualizada com sucesso!");
      setNewPass(""); // Limpa o campo
    } catch (err) {
      showToast("Erro ao atualizar senha.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="font-bold text-gray-800 hover:text-blue-600 hover:underline text-left"
      >
        {reseller.name}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Credenciais de Acesso">
        <div className="space-y-6">
          
          {/* Seção de E-mail */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">E-mail de Login</p>
            <div className="flex justify-between items-center">
              <span className="font-mono text-lg font-bold text-gray-800">{reseller.email}</span>
              <button 
                onClick={() => handleCopy(reseller.email)}
                className="text-xs bg-white border px-2 py-1 rounded hover:bg-gray-100 font-bold text-blue-600"
              >
                Copiar
              </button>
            </div>
          </div>

          {/* Seção de Senha */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Gerenciar Senha</p>
            <div className="p-4 border rounded-xl bg-yellow-50/50 border-yellow-100 mb-4">
              <p className="text-xs text-yellow-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                A senha atual é criptografada e oculta.
              </p>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Digite uma nova senha..." 
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="flex-1 border-2 border-gray-200 p-3 rounded-xl outline-none focus:border-blue-500 font-bold"
              />
              <button 
                onClick={handleReset}
                disabled={!newPass || loading}
                className="bg-blue-600 text-white px-4 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-all"
              >
                {loading ? "Salvando..." : "Redefinir"}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 ml-1">
              * Ao clicar em Redefinir, a senha antiga deixará de funcionar imediatamente.
            </p>
          </div>

        </div>
      </Modal>
    </>
  );
}
