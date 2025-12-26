import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "MASTER") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { resellerId, amount, type } = await req.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: resellerId },
        data: {
          credits: type === "ADD" 
            ? { increment: amount } 
            : { decrement: amount }
        }
      });

      await tx.auditLog.create({
        data: {
          action: type === "ADD" ? "CREDIT_ADD" : "CREDIT_REMOVE",
          details: `Admin ${session.user.id} alterou ${amount} créditos de ${resellerId}`,
          userId: session.user.id
        }
      });

      return user;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar créditos" }, { status: 500 });
  }
}
