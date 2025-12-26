"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    storeName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      router.push("/login?success=account-created");
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-6">Criar Conta</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Seu Nome" required
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text" placeholder="Nome da Loja" required
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
          />
          <input
            type="email" placeholder="E-mail" required
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password" placeholder="Senha" required
            className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? "Processando..." : "Cadastrar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
           <Link href="/login" className="text-blue-600">Já tenho conta</Link>
        </p>
      </div>
    </div>
  );
}