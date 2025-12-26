import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  // Check de segurança (Resolve Erro 18048)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Busca o usuário usando Type Casting para evitar erro 2339 enquanto o Prisma processa
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  }) as any;

  if (user?.gracePeriodUsed) {
    return NextResponse.json({ error: "Alerta já utilizado" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isGraceActive: true,
      gracePeriodUsed: true,
      graceStartedAt: new Date(),
    } as any, // Resolve Erro 2353
  });

  return NextResponse.json({ message: "Modo Alerta Ativado" });
}