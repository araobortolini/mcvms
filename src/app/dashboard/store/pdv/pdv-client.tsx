"use client"

import { useState } from "react";
import { processSale } from "./actions";`nimport { useToast } from "@/components/toast-context";

export default function PdvClient({ products }: { products: any[] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [loading, setLoading] = useState(false);`n  const { showToast } = useToast();

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleFinishSale = async () => {
    try {
      setLoading(true);
      await processSale(cart, paymentMethod);
      showToast("Venda realizada com sucesso!");
      setCart([]);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-8 bg-white p-4 rounded-lg shadow-sm overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Produtos Disponíveis</h2>
        <div className="grid grid-cols-3 gap-3">
          {products.map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              className="p-4 border rounded-lg hover:border-blue-500 text-left transition-all"
            >
              <p className="font-bold">{p.name}</p>
              <p className="text-sm text-gray-500">R$ {p.salePrice.toFixed(2)}</p>
              <p className="text-xs text-blue-600">Estoque: {p.stock}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-4 bg-gray-50 p-4 rounded-lg shadow-inner flex flex-col">
        <h2 className="text-lg font-bold mb-4">Resumo da Venda</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm border-b pb-2">
              <span>{item.quantity}x {item.name}</span>
              <span>R$ {(item.salePrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t space-y-4">
          <div className="flex justify-between text-xl font-black">
            <span>TOTAL</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          
          <select 
            className="w-full p-2 border rounded"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="CASH">Dinheiro</option>
            <option value="CARD">Cartão</option>
            <option value="PIX">PIX</option>
          </select>

          <button 
            disabled={cart.length === 0 || loading}
            onClick={handleFinishSale}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "PROCESSANDO..." : "FINALIZAR VENDA"}
          </button>
        </div>
      </div>
    </div>
  );
}
