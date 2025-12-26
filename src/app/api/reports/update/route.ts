import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "MASTER") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { id, status } = await req.json();

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    return new NextResponse("Erro ao atualizar", { status: 500 });
  }
}
