import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <span className="text-4xl">🚧</span>
      </div>
      
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">IA & Inteligência de Dados</h1>
        <p className="text-zinc-500 mt-2 max-w-md mx-auto">
          Este módulo do Projeto Mestre já está mapeado no banco de dados e será implementado na próxima etapa de desenvolvimento.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/dashboard" className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-all flex items-center gap-2">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <button className="px-6 py-3 bg-zinc-950 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-zinc-800 transition-all">
          Iniciar Desenvolvimento
        </button>
      </div>
    </div>
  );
}
