"use client"

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BlockedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const messages = {
    account_suspended: {
      title: "Conta Suspensa",
      desc: "O seu acesso ao painel foi desativado pelo administrador do sistema.",
      icon: "🚫"
    },
    provider_suspended: {
      title: "Serviço Interrompido",
      desc: "O acesso da sua loja foi temporariamente suspenso devido a restrições no seu revendedor.",
      icon: "⚠️"
    },
    license_expired: {
      title: "Licença Expirada",
      desc: "O seu período de utilização terminou. Por favor, renove a sua subscrição para continuar.",
      icon: "⏳"
    }
  };

  const content = messages[reason as keyof typeof messages] || {
    title: "Acesso Restrito",
    desc: "Não tem permissão para aceder a esta área no momento.",
    icon: "🔒"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="text-6xl mb-4">{content.icon}</div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">{content.title}</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {content.desc}
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/api/auth/signout" 
            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Tentar outro login
          </Link>
          <a 
            href="https://wa.me/seunumerodesuporte" 
            target="_blank"
            className="block w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
          >
            Contactar Suporte Técnico
          </a>
        </div>
        
        <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          Plus PDV • Sistema de Gestão
        </p>
      </div>
    </div>
  );
}
