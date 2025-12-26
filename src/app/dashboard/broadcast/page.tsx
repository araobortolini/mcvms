import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <span className="text-4xl">🛠️</span>
      </div>
      
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Central de Avisos & Push</h1>
        <p className="text-zinc-500 mt-2 max-w-md mx-auto">
          Módulo estratégico do Projeto Mestre. Será implementado para garantir a escalabilidade da plataforma.
        </p>
      </div>

      <Link href="/dashboard" className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-all flex items-center gap-2">
        <ArrowLeft size={16} /> Voltar
      </Link>
    </div>
  );
}
