import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Segurança: Apenas MASTER
    if (!session || (session.user as any).role !== "MASTER") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const resellerId = searchParams.get("id");

    if (!resellerId) {
      return NextResponse.json({ error: "ID não fornecido." }, { status: 400 });
    }

    // 2. Verificação Lógica: Não apagar se tiver Lojas
    const storeCount = await prisma.user.count({
      where: { resellerId: resellerId }
    });

    if (storeCount > 0) {
      return NextResponse.json({ 
        error: "Revendedor possui lojas ativas. Impossível excluir." 
      }, { status: 400 });
    }

    // 3. LIMPEZA TOTAL (Database Transaction)
    await prisma.$transaction(async (tx) => {
      
      // A. Remove Logs de Auditoria (Bypass de tipo com 'as any')
      // Se a tabela não existir, o try/catch geral vai capturar, mas aqui forçamos o TS a aceitar
      try {
        await (tx as any).auditLog.deleteMany({ where: { targetId: resellerId } });
        await (tx as any).auditLog.deleteMany({ where: { userId: resellerId } });
      } catch (e) {
        console.log("Aviso: Tabela AuditLog não encontrada ou erro ao limpar logs.");
      }

      // B. Remove Sessões de Login ativas (NextAuth)
      try {
        await (tx as any).session.deleteMany({ where: { userId: resellerId } });
        await (tx as any).account.deleteMany({ where: { userId: resellerId } });
      } catch (e) {
        // Ignora silenciosamente se não usar essas tabelas
      }

      // C. Remove Transações Financeiras (se houver)
      try {
         await (tx as any).transaction.deleteMany({ where: { userId: resellerId } });
      } catch (e) {}

      // D. Finalmente, apaga o Usuário
      await tx.user.delete({
        where: { id: resellerId }
      });
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("ERRO FINAL DE EXCLUSÃO:", error);
    return NextResponse.json({ 
      error: `Bloqueio no Banco de Dados: ${error.meta?.field_name || error.message}` 
    }, { status: 500 });
  }
}