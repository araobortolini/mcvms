"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. HEADER MOBILE (Aparece só em telas pequenas 'md:hidden') */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-zinc-950 tracking-tighter">
            PLUS<span className="text-blue-600">PDV</span>
          </h1>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 2. OVERLAY E SIDEBAR (Lógica de Gaveta) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Fundo Escuro (Clica fora para fechar) */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* A Sidebar deslizando da esquerda */}
          <div className="relative animate-in slide-in-from-left duration-300 shadow-2xl">
            <Sidebar 
              className="h-full w-[80vw] max-w-xs border-none" // Ajuste de largura para mobile
              closeMobileMenu={() => setIsOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
}