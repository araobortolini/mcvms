"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageReportModal({ report }: { report: any }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/update", {
        method: "PATCH",
        body: JSON.stringify({ id: report.id, status: newStatus }),
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      alert("Erro ao atualizar status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-gray-100 border rounded-xl text-indigo-600 font-bold text-xs uppercase">
          Ver Detalhes
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-900 leading-tight mb-4">
            {report.subject}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm text-gray-700">
            <p className="font-bold text-gray-400 text-[10px] uppercase mb-2">Descrição:</p>
            {report.description}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t">
            <button onClick={() => updateStatus('EM_ANALISE')} disabled={loading} className="p-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-xs hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" /> Em Análise
            </button>
            <button onClick={() => updateStatus('RESOLVIDO')} disabled={loading} className="p-3 bg-green-50 text-green-600 rounded-2xl font-bold text-xs hover:bg-green-100 disabled:opacity-50 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Resolver
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
