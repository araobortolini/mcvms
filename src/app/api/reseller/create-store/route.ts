import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Segurança: Apenas Revendedores cadastram lojas
    if (!session || (session.user as any).role !== "RESELLER") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const resellerId = session.user.id;
    const { name, email, password } = await req.json();

    // 2. Validações
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    // 3. Verifica se o e-mail já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Este e-mail já está em uso." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Criação da Loja (Inicia com 0 créditos)
    const newStore = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STORE" as any,
        resellerId: resellerId,
        credits: 0, // Inicia zerada conforme solicitado
        tier: "BRONZE"
      }
    });

    // 5. Log de Auditoria
    await (prisma as any).auditLog.create({
      data: {
        action: "STORE_REGISTERED",
        userId: resellerId,
        targetId: newStore.id,
        details: `Revendedor registrou a loja ${name}. Aguardando ativação por créditos.`
      }
    });

    return NextResponse.json({ success: true, storeId: newStore.id });

  } catch (error) {
    console.error("ERRO AO REGISTRAR LOJA:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}