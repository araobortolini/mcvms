"use client"

import { useState } from "react";
import { Modal } from "@/components/modal";
import { createReseller } from "./actions";
import { useToast } from "@/components/toast-context";

export default function AddResellerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createReseller(formData);
      showToast("Revendedor criado com sucesso!");
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
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all"
      >
        + Novo Parceiro
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cadastrar Novo Revendedor">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nome Completo</label>
            <input name="name" required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">E-mail de Acesso</label>
            <input type="email" name="email" required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Senha Inicial</label>
            <input type="password" name="password" required className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Créditos Iniciais</label>
            <input type="number" name="credits" defaultValue="0" className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors disabled:bg-gray-400"
          >
            {loading ? "Salvando..." : "Finalizar Cadastro"}
          </button>
        </form>
      </Modal>
    </>
  );
}
