import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Plus-PDV</h1>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Entrar
        </Link>
        <Link 
          href="/register" 
          className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        >
          Criar Conta
        </Link>
      </div>
    </main>
  );
}