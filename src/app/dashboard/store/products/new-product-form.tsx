"use client"

import { createProduct } from "./actions";
import { useState } from "react";

export default function NewProductForm({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false);

  if (!open) return (
    <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
      Novo Produto
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form action={async (fd) => { await createProduct(fd); setOpen(false); }} className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
        <h2 className="text-xl font-bold">Cadastrar Produto</h2>
        <input name="name" placeholder="Nome do Produto" required className="w-full border p-2 rounded" />
        <input name="sku" placeholder="SKU/Código" className="w-full border p-2 rounded" />
        <select name="categoryId" className="w-full border p-2 rounded">
          <option value="">Sem Categoria</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input name="stock" type="number" placeholder="Estoque Inicial" className="border p-2 rounded" />
          <input name="minStock" type="number" placeholder="Estoque Mínimo" className="border p-2 rounded" />
          <input name="costPrice" type="number" step="0.01" placeholder="Preço Custo" className="border p-2 rounded" />
          <input name="salePrice" type="number" step="0.01" placeholder="Preço Venda" className="border p-2 rounded" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-gray-600">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
        </div>
      </form>
    </div>
  );
}
