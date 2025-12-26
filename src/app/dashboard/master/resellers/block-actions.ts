"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateResellerStatus(resellerId: string, status: {
  isBlocked: boolean;
  restrictActions: boolean;
  blockTree: boolean;
}) {
  const session = await getServerSession(authOptions);
  
  // Verificação de segurança
  if (!session || session.user.role !== "MASTER") {
    throw new Error("Permissão negada: Apenas MASTER pode realizar bloqueios.");
  }

  try {
    console.log("Tentando atualizar revendedor:", resellerId, status); // Log para debug no terminal

    const updatedUser = await prisma.user.update({
      where: { id: resellerId },
      data: {
        isBlocked: status.isBlocked,
        restrictActions: status.restrictActions,
        blockTree: status.blockTree,
      }
    });

    console.log("Sucesso:", updatedUser); // Log de sucesso
    revalidatePath("/dashboard/master/resellers");
    return { success: true };
    
  } catch (error: any) {
    console.error("ERRO CRÍTICO PRISMA:", error); // Mostra o erro real no terminal do VS Code
    // Retorna a mensagem técnica para o Toast aparecer na tela
    throw new Error(`Erro no Banco de Dados: ${error.message}`);
  }
}
