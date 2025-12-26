"use client";

import { useState } from "react";
import { Send, AlertCircle, CheckCircle2, LifeBuoy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      subject: formData.get("subject"),
      category: formData.get("category"),
      description: formData.get("description"),
      priority: formData.get("priority"),
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSent(true);
      } else {
        alert("Erro ao enviar report. Tente novamente.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6 bg-white m-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Report Enviado com Sucesso!</h2>
        <p className="text-gray-500 max-w-sm mt-2 font-medium">
          Sua solicitação foi registrada. Nossa equipe analisará e responderá o mais breve possível.
        </p>
        <button 
          onClick={() => setSent(false)} 
          className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all"
        >
          Enviar novo ticket
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Central de Ajuda</h1>
          <p className="text-sm text-gray-500 font-medium">Relate problemas técnicos, financeiros ou envie sugestões.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Assunto do Report</label>
            <input 
              name="subject"
              required
              placeholder="Ex: Erro ao carregar saldo"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
            <select 
              name="category"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
            >
              <option value="TECNICO">Problema Técnico</option>
              <option value="FINANCEIRO">Financeiro / Créditos</option>
              <option value="SUGESTAO">Sugestão de Melhoria</option>
              <option value="OUTROS">Outros</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição do Problema</label>
          <textarea 
            name="description"
            required
            rows={5}
            placeholder="Descreva detalhadamente o que está acontecendo..."
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
          ></textarea>
        </div>

        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl text-blue-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-[11px] font-bold leading-relaxed">
            Seu report será enviado diretamente para a administração master. 
            Você receberá uma notificação assim que houver uma atualização no status.
          </p>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
        >
          {loading ? "Processando..." : <><Send className="w-5 h-5" /> Enviar Report</>}
        </button>
      </form>
    </div>
  );
}
