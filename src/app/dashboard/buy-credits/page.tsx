"use client";

import { useState } from "react";
import { 
  BadgeDollarSign, 
  Zap, 
  Check, 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  ArrowRight,
  Wallet,
  Loader2,
  Info
} from "lucide-react";

// Definição dos Pacotes de Créditos
const CREDIT_PACKAGES = [
  { id: "p1", amount: 50, price: 250, label: "Start", detail: "R$ 5,00 por crédito" },
  { id: "p2", amount: 200, price: 800, label: "Business", detail: "R$ 4,00 por crédito", recommended: true },
  { id: "p3", amount: 500, price: 1500, label: "Pro", detail: "R$ 3,00 por crédito" },
  { id: "p4", amount: 1000, price: 2500, label: "Enterprise", detail: "R$ 2,50 por crédito" },
];

export default function BuyCreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    // Simulação de integração com Mercado Pago / Stripe
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    alert(`Pedido de ${selectedPackage.amount} créditos gerado! Redirecionando para o pagamento...`);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-3">
          <BadgeDollarSign className="text-blue-600" size={32} />
          Adquirir Créditos
        </h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">
          Escolha um pacote para recarregar sua conta e manter suas lojas ativas.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA: SELEÇÃO DE PACOTES (8 Colunas) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CREDIT_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className={`p-6 rounded-[2.5rem] border-2 text-left transition-all relative overflow-hidden group ${
                  selectedPackage.id === pkg.id 
                  ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-600/10" 
                  : "border-zinc-100 bg-white hover:border-zinc-200"
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-widest">
                    Melhor Custo
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-2xl ${selectedPackage.id === pkg.id ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-zinc-900">{pkg.amount} Créditos</h3>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{pkg.label}</p>
                  </div>
                </div>

                <p className="text-3xl font-black text-zinc-950">
                  R$ {pkg.price.toLocaleString('pt-BR')},00
                </p>
                <p className="text-xs font-bold text-zinc-500 mt-1">{pkg.detail}</p>

                {selectedPackage.id === pkg.id && (
                  <div className="absolute bottom-4 right-6 text-blue-600 animate-in zoom-in">
                    <Check size={24} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* MÉTODOS DE PAGAMENTO */}
          <div className="bg-white border border-zinc-200 rounded-[2.5rem] p-8">
            <h3 className="text-sm font-black text-zinc-900 mb-6 uppercase tracking-widest">Forma de Pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod("pix")}
                className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                  paymentMethod === "pix" ? "border-emerald-500 bg-emerald-50/50" : "border-zinc-100"
                }`}
              >
                <div className={`p-2 rounded-lg ${paymentMethod === "pix" ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                  <QrCode size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-zinc-900">PIX (Instantâneo)</p>
                  <p className="text-[10px] font-bold text-zinc-400">Liberação imediata dos créditos</p>
                </div>
              </button>

              <button 
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                  paymentMethod === "card" ? "border-blue-500 bg-blue-50/50" : "border-zinc-100"
                }`}
              >
                <div className={`p-2 rounded-lg ${paymentMethod === "card" ? "bg-blue-500 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                  <CreditCard size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-zinc-900">Cartão de Crédito</p>
                  <p className="text-[10px] font-bold text-zinc-400">Até 12x no checkout</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: RESUMO (4 Colunas) */}
        <aside className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-zinc-950 text-white rounded-[2.5rem] p-8 shadow-2xl">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-8">Resumo do Pedido</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm font-medium">Pacote Selecionado</span>
                <span className="font-bold text-sm">{selectedPackage.amount} Créditos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm font-medium">Preço Unitário</span>
                <span className="font-bold text-sm">R$ {(selectedPackage.price / selectedPackage.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm font-medium">Método</span>
                <span className="font-bold text-sm uppercase">{paymentMethod}</span>
              </div>
              <div className="h-px bg-zinc-800 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-zinc-400 text-sm font-medium">Total a pagar</span>
                <span className="text-3xl font-black text-blue-400">R$ {selectedPackage.price},00</span>
              </div>
            </div>

            <button 
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
              {loading ? "Processando..." : "Confirmar Compra"}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Pagamento Seguro 256-bit</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
            <div className="flex gap-3">
              <Info className="text-blue-600 shrink-0" size={20} />
              <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
                <strong>Nota:</strong> Os créditos não expiram e ficam vinculados à sua conta de revendedor até que sejam atribuídos a uma loja.
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}