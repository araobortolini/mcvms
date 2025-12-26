"use client";
import { useEffect, useState } from "react";

export function DebugStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setData({ error: err.toString() });
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-white">Carregando dados da API...</div>;

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-blue-400">🕵️ Diagnóstico do Gráfico</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Painel Visual */}
        <div className="border border-slate-800 rounded p-4 bg-slate-900">
          <h2 className="font-bold border-b border-slate-700 pb-2 mb-4">Resumo</h2>
          <ul className="space-y-2">
            <li>
              📊 <strong>Campo chartData:</strong>{" "}
              {data?.chartData ? (
                <span className="text-green-400">EXISTE (Array com {data.chartData.length} itens)</span>
              ) : (
                <span className="text-red-500 font-bold">NÃO ENCONTRADO (Erro na API)</span>
              )}
            </li>
            <li>
              💰 <strong>Receita:</strong> {data?.revenue}
            </li>
            <li>
              🏪 <strong>Revendedores:</strong> {data?.resellers}
            </li>
          </ul>
        </div>

        {/* JSON Bruto */}
        <div className="border border-slate-800 rounded p-4 bg-slate-900 overflow-auto max-h-[500px]">
          <h2 className="font-bold border-b border-slate-700 pb-2 mb-4">JSON Recebido da API</h2>
          <pre className="text-xs text-green-300 font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
